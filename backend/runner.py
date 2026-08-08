import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        app="codeware.asgi:application", 
        host="0.0.0.0",
        port=8000,
        reload=True,
        loop="uvloop",
        reload_excludes=["*/media/*"],
    )
