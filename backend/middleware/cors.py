from fastapi.middleware.cors import CORSMiddleware

def setup_cors(app):
    origins = [
        "https://lensv1.netlify.app",
        "http://localhost:3000"
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
