# Import FastAPI server and Uvicorn for running the app
import uvicorn
from fastapi import FastAPI

# Import route handlers (routers) from controller modules
from controllers.fruit_controller import router as fruit_router
from controllers.aruco_controller import router as aruco_router

# Import and apply CORS middleware setup
from middleware.cors import setup_cors

# Initialize FastAPI application instance
app = FastAPI()

# Apply CORS middleware to allow cross-origin requests
setup_cors(app)

# Register the fruit-related API routes
app.include_router(fruit_router)
# Register the ArUco marker detection API routes
app.include_router(aruco_router)

# Run the app using Uvicorn when this file is executed directly
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)     # Listen on all interfaces at port 8000
