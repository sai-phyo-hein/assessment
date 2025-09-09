from fastapi import FastAPI
from fastapi.responses import FileResponse
import os

app = FastAPI(title="Flex Living Backend", description="API for Flex Living app")

@app.get("/")
async def root():
    return {"message": "Welcome to Flex Living API"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.get("/logos/{filename}")
async def get_logo(filename: str):
    file_path = os.path.join("data", "images", "logos", filename)
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type='image/png')
    return {"error": "Logo not found"}
