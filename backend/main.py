from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import json

app = FastAPI(title="Flex Living Backend", description="API for Flex Living app")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.get("/properties")
async def get_properties():
    file_path = os.path.join("data", "properties.json")
    if os.path.exists(file_path):
        with open(file_path, 'r') as f:
            data = json.load(f)
        return data
    return {"error": "Properties not found"}
