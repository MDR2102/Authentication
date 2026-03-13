"""FastAPI application entry point."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .core.config.settings import settings
from .features.auth.router import router as auth_router

app = FastAPI(
    title="Authentication API",
    description="FastAPI backend for authentication",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.client_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include auth routes
app.include_router(auth_router)

@app.get("/")
async def health_check():
    """Basic endpoint to signal backend availability."""

    return {"status": "healthy", "message": "FastAPI backend is running"}
