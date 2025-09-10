from fastapi import Query
import logging
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import json
from datetime import datetime
from collections import defaultdict

app = FastAPI(title="Flex Living Backend", description="API for Flex Living app")

# Configure logging
logging.basicConfig(level=logging.INFO)
# Add CORS middleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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

# Export for Vercel
def handler(request):
    return app(request)

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
async def get_reviews(propertyId: int = Query(None), propertyIds: list[int] = Query(None)):
    file_path = os.path.join("data", "reviews.json")
    if not os.path.exists(file_path):
        return JSONResponse(status_code=404, content={"error": "Reviews not found"})
    with open(file_path, 'r') as f:
        data = json.load(f)
    if propertyIds:
        filtered = [r for r in data if r.get("propertyId") in propertyIds]
    elif propertyId is not None:
        filtered = [r for r in data if r.get("propertyId") == propertyId]
    else:
        filtered = data
    result = [
        {
            "id": r.get("id"),
            "guestName": r.get("guestName"),
            "publicReview": r.get("publicReview"),
            "rating": r.get("rating", 0),
            "reviewCategory": r.get("reviewCategory", [])
        }
        for r in filtered if r.get("publicReview") and r.get("guestName")
    ]
    return result

@app.post("/addreviews")
async def post_review(review: dict):
    # Validate required fields
    required_fields = ["propertyId", "guestName", "publicReview", "rating", "reviewCategory"]
    for field in required_fields:
        if field not in review or review[field] is None:
            return JSONResponse(status_code=400, content={"error": f"Missing required field: {field}"})
    
    # Validate reviewCategory is a list
    if not isinstance(review.get("reviewCategory"), list):
        return JSONResponse(status_code=400, content={"error": "reviewCategory must be a list"})
    
    # Validate rating is between 1 and 10
    rating = review.get("rating")
    if not isinstance(rating, int) or rating < 1 or rating > 10:
        return JSONResponse(status_code=400, content={"error": "Rating must be an integer between 1 and 10"})
    
    # Validate guestName and publicReview are not empty
    if not review.get("guestName", "").strip():
        return JSONResponse(status_code=400, content={"error": "Guest name cannot be empty"})
    if not review.get("publicReview", "").strip():
        return JSONResponse(status_code=400, content={"error": "Review text cannot be empty"})
    
    file_path = os.path.join("data", "reviews.json")
    if not os.path.exists(file_path):
        return JSONResponse(status_code=404, content={"error": "Reviews not found"})
    with open(file_path, 'r') as f:
        data = json.load(f)
    new_id = max([r.get("id", 0) for r in data], default=0) + 1
    review["id"] = new_id
    
    # Set default values for optional fields
    review.setdefault("accountId", 1)
    review.setdefault("listingMapId", 1)
    review.setdefault("channelId", 2005)
    review.setdefault("type", "guest-to-host")
    review.setdefault("status", "completed")
    review.setdefault("isCancelled", 0)
    review.setdefault("externalReviewId", f"EXT-{new_id}")
    review.setdefault("externalReservationId", f"RES-{new_id}")
    
    data.append(review)
    with open(file_path, 'w') as f:
        json.dump(data, f, indent=4)
    return {"message": "Review added", "id": new_id}

@app.get("/review-categories")
async def get_review_categories():
    file_path = os.path.join("data", "reviews.json")
    if not os.path.exists(file_path):
        return JSONResponse(status_code=404, content={"error": "Reviews not found"})
    with open(file_path, 'r') as f:
        data = json.load(f)
    all_categories = ['amenities', 'check-in', 'cleanliness', 'communication', 'environment', 'living', 'location', 'service', 'value']
    category_count = {cat: 0 for cat in all_categories}
    for review in data:
        if review.get("reviewCategory") and isinstance(review["reviewCategory"], list):
            for cat in review["reviewCategory"]:
                if cat in category_count:
                    category_count[cat] += 1
    result = [{"category": cat, "count": count} for cat, count in category_count.items()]
    result.sort(key=lambda x: x["count"], reverse=True)
    return result

@app.get("/total-properties")
async def get_total_properties():
    file_path = os.path.join("data", "properties.json")
    if not os.path.exists(file_path):
        return JSONResponse(status_code=404, content={"error": "Properties not found"})
    with open(file_path, 'r') as f:
        data = json.load(f)
    return {"totalProperties": len(data['properties'])}

@app.get("/total-reviewed-properties")
async def get_total_reviewed_properties(start_date: str = Query(None), end_date: str = Query(None)):
    file_path = os.path.join("data", "reviews.json")
    if not os.path.exists(file_path):
        return JSONResponse(status_code=404, content={"error": "Reviews not found"})
    with open(file_path, 'r') as f:
        data = json.load(f)
    
    # Filter reviews by date range if provided
    if start_date or end_date:
        filtered_reviews = []
        for review in data:
            review_date = review.get("departureDate", "").split(" ")[0]  # Get date part only
            if start_date and review_date < start_date:
                continue
            if end_date and review_date > end_date:
                continue
            filtered_reviews.append(review)
        data = filtered_reviews
    
    # Get unique property IDs from filtered reviews
    property_ids = set()
    for review in data:
        if review.get("propertyId"):
            property_ids.add(review["propertyId"])
    
    return {"totalReviewedProperties": len(property_ids)}

@app.get("/total-reviews")
async def get_total_reviews():
    file_path = os.path.join("data", "reviews.json")
    if not os.path.exists(file_path):
        return JSONResponse(status_code=404, content={"error": "Reviews not found"})
    with open(file_path, 'r') as f:
        data = json.load(f)
    return {"totalReviews": len(data)}

@app.put("/reviews/{review_id}")
async def approve_review(review_id: int, review_update: dict):
    # Validate that approved field is provided
    if "approved" not in review_update:
        return JSONResponse(status_code=400, content={"error": "Missing 'approved' field"})
    
    approved = review_update["approved"]
    if not isinstance(approved, bool):
        return JSONResponse(status_code=400, content={"error": "'approved' must be a boolean"})
    
    file_path = os.path.join("data", "reviews.json")
    if not os.path.exists(file_path):
        return JSONResponse(status_code=404, content={"error": "Reviews not found"})
    
    with open(file_path, 'r') as f:
        data = json.load(f)
    
    # Find and update the review
    review_found = False
    for review in data:
        if review.get("id") == review_id:
            review["approved"] = approved
            review_found = True
            break
    
    if not review_found:
        return JSONResponse(status_code=404, content={"error": "Review not found"})
    
    # Save the updated data
    with open(file_path, 'w') as f:
        json.dump(data, f, indent=4)
    
    return {"message": "Review approval status updated", "id": review_id, "approved": approved}

@app.get("/average-rating")
async def get_average_rating(start_date: str = Query(None), end_date: str = Query(None)):
    file_path = os.path.join("data", "reviews.json")
    if not os.path.exists(file_path):
        return JSONResponse(status_code=404, content={"error": "Reviews not found"})
    with open(file_path, 'r') as f:
        data = json.load(f)
    
    # Filter reviews by date range if provided
    if start_date or end_date:
        filtered_reviews = []
        for review in data:
            review_date = review.get("departureDate", "").split(" ")[0]  # Get date part only
            if start_date and review_date < start_date:
                continue
            if end_date and review_date > end_date:
                continue
            filtered_reviews.append(review)
        data = filtered_reviews
    
    ratings = [r.get("rating", 0) for r in data if r.get("rating") is not None]
    if not ratings:
        return {"averageRating": 0}
    average = sum(ratings) / len(ratings)
    return {"averageRating": round(average, 2)}

@app.get("/total-reviews-filtered")
async def get_total_reviews_filtered(start_date: str = Query(None), end_date: str = Query(None)):
    file_path = os.path.join("data", "reviews.json")
    if not os.path.exists(file_path):
        return JSONResponse(status_code=404, content={"error": "Reviews not found"})
    with open(file_path, 'r') as f:
        data = json.load(f)
    
    # Filter reviews by date range if provided
    if start_date or end_date:
        filtered_reviews = []
        for review in data:
            review_date = review.get("departureDate", "").split(" ")[0]  # Get date part only
            if start_date and review_date < start_date:
                continue
            if end_date and review_date > end_date:
                continue
            filtered_reviews.append(review)
        data = filtered_reviews
    
    return {"totalReviews": len(data)}

@app.get("/reviews-date-range")
async def get_reviews_date_range():
    file_path = os.path.join("data", "reviews.json")
    if not os.path.exists(file_path):
        return JSONResponse(status_code=404, content={"error": "Reviews not found"})
    with open(file_path, 'r') as f:
        data = json.load(f)
    
    departure_dates = []
    for review in data:
        if review.get("departureDate"):
            date_str = review["departureDate"].split(" ")[0]  # Get date part only
            departure_dates.append(date_str)
    
    if not departure_dates:
        return {"minDate": None, "maxDate": None}
    
    min_date = min(departure_dates)
    max_date = max(departure_dates)
    return {"minDate": min_date, "maxDate": max_date}

@app.get("/monthly-average-rating")
async def get_monthly_average_rating():
    file_path = os.path.join("data", "reviews.json")
    if not os.path.exists(file_path):
        return JSONResponse(status_code=404, content={"error": "Reviews not found"})
    with open(file_path, 'r') as f:
        data = json.load(f)
    
    monthly_data = defaultdict(list)
    for review in data:
        if review.get("departureDate") and review.get("rating") is not None:
            try:
                date_obj = datetime.strptime(review["departureDate"].split(" ")[0], "%Y-%m-%d")
                month_key = date_obj.strftime("%Y-%m")
                monthly_data[month_key].append(review["rating"])
            except ValueError:
                continue
    
    result = []
    for month, ratings in sorted(monthly_data.items()):
        avg = sum(ratings) / len(ratings)
        result.append({"month": month, "averageRating": round(avg, 2)})
    
    return {"monthlyAverageRating": result}

@app.get("/monthly-total-reviewed-properties")
async def get_monthly_total_reviewed_properties():
    file_path = os.path.join("data", "reviews.json")
    if not os.path.exists(file_path):
        return JSONResponse(status_code=404, content={"error": "Reviews not found"})
    with open(file_path, 'r') as f:
        data = json.load(f)
    
    monthly_data = defaultdict(set)
    for review in data:
        if review.get("departureDate") and review.get("propertyId"):
            try:
                date_obj = datetime.strptime(review["departureDate"].split(" ")[0], "%Y-%m-%d")
                month_key = date_obj.strftime("%Y-%m")
                monthly_data[month_key].add(review["propertyId"])
            except ValueError:
                continue
    
    result = []
    for month, properties in sorted(monthly_data.items()):
        result.append({"month": month, "totalReviewedProperties": len(properties)})
    
    return {"monthlyTotalReviewedProperties": result}

@app.get("/monthly-total-reviews")
async def get_monthly_total_reviews():
    file_path = os.path.join("data", "reviews.json")
    if not os.path.exists(file_path):
        return JSONResponse(status_code=404, content={"error": "Reviews not found"})
    with open(file_path, 'r') as f:
        data = json.load(f)
    
    monthly_data = defaultdict(int)
    for review in data:
        if review.get("departureDate"):
            try:
                date_obj = datetime.strptime(review["departureDate"].split(" ")[0], "%Y-%m-%d")
                month_key = date_obj.strftime("%Y-%m")
                monthly_data[month_key] += 1
            except ValueError:
                continue
    
    result = []
    for month, count in sorted(monthly_data.items()):
        result.append({"month": month, "totalReviews": count})
    
    return {"monthlyTotalReviews": result}

@app.get("/property-performance")
async def get_property_performance():
    # Load properties
    properties_file = os.path.join("data", "properties.json")
    if not os.path.exists(properties_file):
        return JSONResponse(status_code=404, content={"error": "Properties not found"})
    
    with open(properties_file, 'r') as f:
        properties_data = json.load(f)
    properties = properties_data.get("properties", [])
    
    # Load reviews
    reviews_file = os.path.join("data", "reviews.json")
    if not os.path.exists(reviews_file):
        return JSONResponse(status_code=404, content={"error": "Reviews not found"})
    
    with open(reviews_file, 'r') as f:
        reviews = json.load(f)
    
    # Calculate average ratings for each property
    property_ratings = {}
    for review in reviews:
        property_id = review.get("propertyId")
        rating = review.get("rating")
        if property_id and rating is not None:
            if property_id not in property_ratings:
                property_ratings[property_id] = {"total": 0, "count": 0}
            property_ratings[property_id]["total"] += rating
            property_ratings[property_id]["count"] += 1
    
    # Process properties and calculate averages
    high_value_properties = []
    need_attention_properties = []
    
    for prop in properties:
        prop_id = prop.get("id")
        rating_data = property_ratings.get(prop_id)
        
        if rating_data and rating_data["count"] > 0:
            average_rating = rating_data["total"] / rating_data["count"]
            prop_with_rating = {**prop, "averageRating": round(average_rating, 2)}
            
            if average_rating > 5:
                high_value_properties.append(prop_with_rating)
            else:
                need_attention_properties.append(prop_with_rating)
        else:
            # Properties with no reviews go to need-attention with rating 0
            prop_with_rating = {**prop, "averageRating": 0}
            need_attention_properties.append(prop_with_rating)
    
    # Sort high-value properties by average rating descending
    high_value_properties.sort(key=lambda x: x["averageRating"], reverse=True)
    
    # Sort need-attention properties by average rating ascending
    need_attention_properties.sort(key=lambda x: x["averageRating"])
    
    return {
        "highValue": high_value_properties,
        "needAttention": need_attention_properties
    }

@app.get("/property-monthly-rating/{property_id}")
async def get_property_monthly_rating(property_id: int):
    file_path = os.path.join("data", "reviews.json")
    if not os.path.exists(file_path):
        return JSONResponse(status_code=404, content={"error": "Reviews not found"})
    with open(file_path, 'r') as f:
        data = json.load(f)
    
    # Filter reviews for the specific property
    property_reviews = [r for r in data if r.get("propertyId") == property_id]
    
    monthly_data = defaultdict(list)
    for review in property_reviews:
        if review.get("departureDate") and review.get("rating") is not None:
            try:
                date_obj = datetime.strptime(review["departureDate"].split(" ")[0], "%Y-%m-%d")
                month_key = date_obj.strftime("%Y-%m")
                monthly_data[month_key].append(review["rating"])
            except ValueError:
                continue
    
    result = []
    for month, ratings in sorted(monthly_data.items()):
        avg = sum(ratings) / len(ratings)
        result.append({"month": month, "averageRating": round(avg, 2)})
    
    return {"monthlyRating": result}

