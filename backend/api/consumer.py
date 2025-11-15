import asyncio
import json
from uuid import uuid4
from os import remove, path, makedirs
import re
import subprocess
from asyncio.subprocess import Process
from channels.generic.websocket import AsyncWebsocketConsumer

from api.exceptions import CompilationError
from codeware.settings import BASE_DIR

# Allowed languages and file extensions
ALLOWED_LANGS = {
    "py": "py",
    "js": "js",
    "c": "c",
    "cpp": "cpp",
    "go": "go",
    "dart": "dart",
    "java": "java",
}

CACHE_DIR = path.join(BASE_DIR, "media", "cache")
makedirs(CACHE_DIR, exist_ok=True)


async def run_blocking(cmd, timeout=None):
    """Run a blocking subprocess.run in a thread to avoid blocking the event loop."""
    return await asyncio.to_thread(subprocess.run, cmd, timeout, True)


async def compile_blocking(cmd, timeout=None):
    """Wrapper to call subprocess.run with kwargs we need (capture_output=True)."""
    return await asyncio.to_thread(subprocess.run, cmd, timeout=timeout, capture_output=True)


async def create_process(code: str, lang: str) -> tuple[list[str], Process] | None:
    """Create source file, compile if needed, and return list of cached files + an asyncio Process.

    Raises CompilationError when compilation fails.
    """
    if lang not in ALLOWED_LANGS:
        raise ValueError("Unsupported language")

    ext = ALLOWED_LANGS[lang]

    # Special handling for Java: we may need to detect a public class name or wrap the code
    if lang == "java":
        # Try to find a public class name in user's code
        m = re.search(r"public\s+class\s+([A-Za-z_][A-Za-z0-9_]*)", code)
        if m:
            class_name = m.group(1)
            filename = f"{class_name}.java"
            _fileloc = path.join(CACHE_DIR, filename)
            with open(_fileloc, "w", encoding="utf-8") as fp:
                fp.write(code)
        else:
            raise CompilationError([], message="No public class found in Java code")
        try:
            proc = await compile_blocking(["javac", _fileloc], timeout=8)
        except Exception as e:
            # compilation invocation error
            raise CompilationError([_fileloc], message=str(e))

        if proc.returncode != 0:
            raise CompilationError([_fileloc], message=proc.stderr.decode(errors="replace"))

        # run the class from CACHE_DIR
        process = await asyncio.create_subprocess_exec(
            "java",
            "-cp",
            CACHE_DIR,
            class_name,
            stdin=asyncio.subprocess.PIPE,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
        return ([_fileloc, path.join(CACHE_DIR, class_name + ".class")], process)

    # Non-java: create a unique filename for source
    _filename = f"test_{uuid4().hex}.{ext}"
    _fileloc = path.join(CACHE_DIR, _filename)

    # write code to disk
    with open(_fileloc, "w", encoding="utf-8") as fp:
        fp.write(code)

    try:
        if lang == "py":
            process = await asyncio.create_subprocess_exec(
                "python3",
                "-u",
                _fileloc,
                stdin=asyncio.subprocess.PIPE,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
            )
            return ([_fileloc], process)

        if lang == "js":
            process = await asyncio.create_subprocess_exec(
                "node",
                _fileloc,
                stdin=asyncio.subprocess.PIPE,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
            )
            return ([_fileloc], process)

        if lang in ("cpp", "c"):
            _byteFile = f"{uuid4().hex}.out"
            _bytefileloc = path.join(CACHE_DIR, _byteFile)
            compiler = ["g++" if lang == "cpp" else "gcc", _fileloc, "-o", _bytefileloc]
            # run the compiler in a thread to avoid blocking
            proc = await compile_blocking(compiler, timeout=5)
            if proc.returncode != 0:
                # raise CompilationError and include the source file in cache so caller can cleanup
                raise CompilationError([_fileloc], message=proc.stderr.decode(errors="replace"))

            process = await asyncio.create_subprocess_exec(
                _bytefileloc,
                stdin=asyncio.subprocess.PIPE,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
            )
            return ([_fileloc, _bytefileloc], process)

        if lang == "go":
            process = await asyncio.create_subprocess_exec(
                "go",
                "run",
                _fileloc,
                stdin=asyncio.subprocess.PIPE,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
            )
            return ([_fileloc], process)

        if lang == "dart":
            process = await asyncio.create_subprocess_exec(
                "dart",
                _fileloc,
                stdin=asyncio.subprocess.PIPE,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
            )
            return ([_fileloc], process)

        return None

    except Exception as e:
        # ensure the created file is cleaned by caller if needed
        raise


class CompilerConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.process: Process | None = None
        self.cache: list[str] = []
        self.out_task: asyncio.Task | None = None
        self.err_task: asyncio.Task | None = None
        await self.accept()

    async def disconnect(self, close_code):
        # cancel running tasks
        for t in (self.out_task, self.err_task):
            if t:
                t.cancel()
                try:
                    await t
                except asyncio.CancelledError:
                    pass
                except Exception:
                    pass

        # terminate the process if it's still running
        if self.process:
            try:
                # process.kill() can raise if already terminated
                self.process.kill()
            except Exception:
                pass
            try:
                await self.process.wait()
            except Exception:
                pass

        # cleanup cache files safely
        for fileloc in list(self.cache):
            try:
                remove(fileloc)
            except OSError:
                pass

    async def receive(self, text_data):
        if text_data == "":
            await self.send(text_data=json.dumps({
                "output": "Error: Expected non empty input",
                "status": 400,
            }))
            await self.close()
            return

        try:
            data = json.loads(text_data)
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({"output": "Invalid JSON", "status": 400}))
            return

        if "code" in data:
            lang = data.get("lang")
            code = data.get("code", "")
            if not lang or lang not in ALLOWED_LANGS:
                await self.send(text_data=json.dumps({"output": "Unsupported or missing language", "status": 400}))
                return

            try:
                self.cache, self.process = await create_process(code=code, lang=lang)
                # store tasks so we can cancel/await them later
                self.out_task = asyncio.create_task(self.stream_output())
                self.err_task = asyncio.create_task(self.stream_error())

            except CompilationError as e:
                # cleanup files created during compilation
                for fileloc in getattr(e, "cache", []):
                    try:
                        remove(fileloc)
                    except OSError:
                        pass
                await self.send(text_data=json.dumps({
                    "output": str(e.message),
                    "status": 400,
                }))
                await self.close()

            except Exception as e:
                # generic error
                await self.send(text_data=json.dumps({"output": str(e), "status": 400}))
                await self.close()

        else:
            input_text = data.get("input", "")
            if not self.process or not getattr(self.process, "stdin", None):
                await self.send(text_data=json.dumps({"output": "No running process to send input to", "status": 400}))
                return

            try:
                # ensure input ends with a newline if user expects line-based input
                if not input_text.endswith("\n"):
                    input_text = input_text + "\n"
                self.process.stdin.write(input_text.encode())
                await self.process.stdin.drain()
            except (BrokenPipeError, ConnectionResetError):
                await self.send(text_data=json.dumps({"output": "Process stdin closed", "status": 400}))

    async def stream_output(self):
        try:
            # keep reading in chunks; using a per-read timeout to detect stall but not
            # to prematurely kill processes that are waiting for input.
            while True:
                try:
                    chunk = await asyncio.wait_for(self.process.stdout.read(1024), timeout=20)
                except asyncio.TimeoutError:
                    # On read timeout, we treat this as idle; do not kill immediately here.
                    # Instead, notify the client and continue waiting. Policy can be changed.
                    await self.send(text_data=json.dumps({"output": "(idle)", "status": 204}))
                    continue

                if not chunk:
                    # EOF reached
                    break

                await self.send(text_data=json.dumps({"output": chunk.decode(errors="replace"), "status": 200}))

            # wait for the process to finish and then close connection
            try:
                await self.process.wait()
            except Exception:
                pass
            await self.close()

        except asyncio.CancelledError:
            return
        except Exception as e:
            # ensure we kill the process on unexpected errors
            try:
                if self.process:
                    self.process.kill()
                    await self.process.wait()
            except Exception:
                pass
            await self.send(text_data=json.dumps({"output": str(e), "status": 400}))
            await self.close()

    async def stream_error(self):
        try:
            while True:
                try:
                    chunk = await asyncio.wait_for(self.process.stderr.read(1024), timeout=60)
                except asyncio.TimeoutError:
                    # error stream idle; continue waiting
                    continue

                if not chunk:
                    break

                await self.send(text_data=json.dumps({"output": chunk.decode(errors="replace"), "status": 400}))

        except asyncio.CancelledError:
            return
        except Exception as e:
            try:
                if self.process:
                    self.process.kill()
                    await self.process.wait()
            except Exception:
                pass
            await self.send(text_data=json.dumps({"output": str(e), "status": 400}))
            await self.close()
