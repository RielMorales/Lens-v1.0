# Import FastAPI's built-in CORS middleware
from fastapi.middleware.cors import CORSMiddleware

# Function to configure and apply CORS settings to the FastAPI app
def setup_cors(app):
    # List of allowed origins for cross-origin requests (frontend URLs)
    origins = [
        "https://lensv1.netlify.app",
        "https://lensv2.netlify.app",
        "http://localhost:3000"
    ]

    # Add the CORS middleware with specified settings
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,      # Only allow requests from these origins
        allow_credentials=True,     # Allow sending cookies and auth headers
        allow_methods=["*"],        # Allow all HTTP methods (GET, POST, etc.)
        allow_headers=["*"],        # Allow all headers in requests
    )
