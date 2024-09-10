import asyncio
import json
from uuid import uuid4

from os import kill, path, remove
from api.exceptions import CompilationError
from channels.generic.websocket import AsyncWebsocketConsumer
import subprocess
# from subprocess import PIPE
from asyncio.subprocess import Process

from codeware.settings import BASE_DIR

class CompilerConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.process = None
        self.cache = []
        await self.accept()

    async def disconnect(self, close_code):
        print("Disconnecting")
        if self.process and check_pid(self.process.pid):
            self.process.kill()
            await self.process.wait()
        if self.cache:
            for fileloc in self.cache:
                remove(fileloc)

    async def receive(self, text_data):
        if text_data == '':
            await self.send(text_data=json.dumps({
                    'output': "Error: Expected non empty input",
                    "status":400,
                }))
            await self.close()
        data = json.loads(text_data)
        if "code" in data:
            try:
                lang = data.get('lang')
                code = data.get('code')
                (self.cache,self.process) = await create_process(code=code,lang=lang)
                print(f'Starting process with pid:{self.process.pid}')
                asyncio.create_task(self.stream_output())
                asyncio.create_task(self.stream_error())
            except CompilationError as e:
                for fileloc in e.cache:
                    remove(fileloc)
                await self.send(text_data=json.dumps({
                    'output': str(e.message),
                    "status":400,
                }))
                await self.close()
            except Exception as e:
                await self.send(text_data=json.dumps({
                    'output': str(e),
                    "status":400,
                }))
                await self.close()
        else:
            input_text = data.get('input', '')
            self.process.stdin.write(input_text.encode())
            await self.process.stdin.drain()

    async def stream_output(self):
        try:
            while True:
                output = await asyncio.wait_for(self.process.stdout.read(1024),timeout=20)
                if output:
                    print(output)
                    await self.send(text_data=json.dumps({
                        'output': output.decode(),
                        "status":200
                    }))
                # Break the loop if the subprocess is done and there's no more output
                if self.process.returncode is not None:
                    break
                
            await self.close()
        except asyncio.TimeoutError:
            print("Timeout occurred while reading from subprocess")
            await self.send(text_data=json.dumps({
                    'output': "Timelimit Exceeded",
                    "status":400,
                }))
            await self.close()
            
    async def stream_error(self):
        try:
            while True:
                error_output = await asyncio.wait_for(self.process.stderr.read(),timeout=60)
                if error_output:
                        # Send the error output to the client
                    await self.send(text_data=json.dumps({
                        'output': error_output.decode(),
                        "status":400,
                    }))
                    await self.close()
        except asyncio.TimeoutError:
            print("Timeout occurred while reading Error from subprocess")
            await self.send(text_data=json.dumps({
                    'output': "Timelimit Exceeded",
                    "status":400,
                }))
            await self.close()
        
            
async def create_process(code:str,lang:str)->tuple[list[str],Process]:
    _filename = f'test_{uuid4()}.{lang}'
    _fileloc = path.join(BASE_DIR,"media","cache",_filename)
    with open(_fileloc, 'w') as fp:
        fp.write(r'{}'.format(code))
        fp.close()
    try :
        if lang == "py": 
            process = await asyncio.create_subprocess_exec(
                'python3',
                '-u',
                _fileloc,
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                bufsize=0,
            )
            return ([_fileloc],process)
        elif lang == "js": 
            process = await asyncio.create_subprocess_exec(
                'node',
                _fileloc,
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
            )
            return ([_fileloc],process)
        # elif lang == "java": 
        #     try:
        #         proc = subprocess.run(
        #             ["javac",_fileloc],
        #             timeout=5,
        #             capture_output=True
        #         )
        #         if proc.returncode != 0:
        #             return ([_fileloc],"Compilation Error")
        #         process = await asyncio.create_subprocess_exec(
        #             'java',
        #             _fileloc[:-5],
        #             stdin=subprocess.PIPE,
        #             stdout=subprocess.PIPE,
        #             stderr=subprocess.PIPE,
        #             bufsize=0,
        #         )
        #         return ([_fileloc,_fileloc.replace('.java','.class')],process)
        #     except Exception as e:
        #         print(e)
        #         return
        elif lang == "cpp": 
            # try:
            _byteFile = f'{uuid4()}.out'
            _bytefileloc = path.join(BASE_DIR,"media","cache",_byteFile)
            proc = subprocess.run(
                ["g++",_fileloc,'-o',_bytefileloc],
                timeout=5,
                capture_output=True
            )
            if proc.returncode != 0:
                # return ([_fileloc],"Compilation Error")
                raise CompilationError([_fileloc],message=proc.stderr.decode())
            process = await asyncio.create_subprocess_exec(
                _bytefileloc,
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                bufsize=0,
            )
            return ([_fileloc,_bytefileloc],process)
            # except Exception as e:
            #     print(e)
            #     raise e
        elif lang == "c": 
            # try:
            _byteFile = f'{uuid4()}.out'
            _bytefileloc = path.join(BASE_DIR,"media","cache",_byteFile)
            proc = subprocess.run(
                ["gcc",_fileloc,'-o',_bytefileloc],
                timeout=5,
                capture_output=True
            )
            if proc.returncode != 0:
                raise CompilationError([_fileloc],message=proc.stderr.decode())
            process = await asyncio.create_subprocess_exec(
                _bytefileloc,
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
            )
            return ([_fileloc,_bytefileloc],process)
            # except Exception as e:
            #     print(e)
            #     raise e
        elif lang == "dart": 
            process = await asyncio.create_subprocess_exec(
                'dart',
                _fileloc,
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
            )
            return ([_fileloc],process)

        elif lang == "go": 
            process = await asyncio.create_subprocess_exec(
                'go',
                'run',
                _fileloc,
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
            )
            return ([_fileloc],process)
        else:
            return None
    except Exception as e:
        print("Error : ",e.__str__())
        raise e
    
def check_pid(pid):        
    """ Check For the existence of a unix pid. """
    try:
        kill(pid, 0)
    except OSError:
        return False
    else:
        return True
    
    