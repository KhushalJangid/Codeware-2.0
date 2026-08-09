from pathlib import Path
import uvicorn

BASE_DIR = Path(__file__).resolve().parent
MEDIA_DIR = str(BASE_DIR / "media")

if __name__ == "__main__":
    uvicorn.run(
        app="codeware.asgi:application", 
        host="0.0.0.0",
        port=8000,
        reload=True,
        loop="uvloop",
        reload_excludes=[MEDIA_DIR, "*/media/*", "*/media/**", "media/**"],
    )

