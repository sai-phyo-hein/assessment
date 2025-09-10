from fastapi import Query
import logging
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import json

app = FastAPI(title="Flex Living Backend", description="API for Flex Living app")

# Configure logging
logging.basicConfig(level=logging.INFO)
# Add CORS middleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

IMAGES_BASE_PATH = os.path.join("data", "images", "images")

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

@app.get("/images/{folder_id}")
async def list_images(folder_id: str):
    folder_path = os.path.join(IMAGES_BASE_PATH, folder_id)
    if not os.path.exists(folder_path):
        return JSONResponse(status_code=404, content={"error": "Folder not found"})
    files = [f for f in os.listdir(folder_path) if os.path.isfile(os.path.join(folder_path, f))]
    return {"images": files}

@app.get("/images/{folder_id}/{filename}")
async def get_image(folder_id: str, filename: str):
    file_path = os.path.join(IMAGES_BASE_PATH, folder_id, filename)
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="image/jpeg")
    return JSONResponse(status_code=404, content={"error": "Image not found"})

@app.get("/reviews")
async def get_reviews(propertyId: int = Query(None)):
    logging.info(f"Received propertyId: {propertyId}")
    file_path = os.path.join("data", "reviews.json")
    if not os.path.exists(file_path):
        return JSONResponse(status_code=404, content={"error": "Reviews not found"})
    with open(file_path, 'r') as f:
        data = json.load(f)
    if propertyId is not None:
        filtered = [r for r in data if r.get("propertyId") == propertyId]
        result = [
            {
                "id": r.get("id"),
                "guestName": r.get("guestName"),
                "publicReview": r.get("publicReview"),
                "rating": r.get("rating", 0)
            }
            for r in filtered if r.get("publicReview") and r.get("guestName")
        ]
        return result
    return data