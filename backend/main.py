import uvicorn
from fastapi import FastAPI
from controllers.fruit_controller import router as fruit_router
from controllers.aruco_controller import router as aruco_router
from middleware.cors import setup_cors

app = FastAPI()

# Setup middleware
setup_cors(app)

# Include routes
app.include_router(fruit_router)
app.include_router(aruco_router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
