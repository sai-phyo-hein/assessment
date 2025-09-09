from fastapi import FastAPI

app = FastAPI(title="Flex Living Backend", description="API for Flex Living app")

@app.get("/")
async def root():
    return {"message": "Welcome to Flex Living API"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
