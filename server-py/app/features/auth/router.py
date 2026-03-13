"""Authentication feature routes for demo FastAPI backend."""

from datetime import datetime
import re

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr, field_validator

router = APIRouter(prefix="/api/auth", tags=["auth"])

# Temporary storage for demo (in real app, use database)
registered_users = {}  # Store user data with timestamps

class RegisterRequest(BaseModel):
    """Payload for user registration."""

    firstName: str
    lastName: str
    email: EmailStr
    password: str

    @field_validator("password")
    @classmethod
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")

        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter")

        if not re.search(r"[a-z]", v):
            raise ValueError("Password must contain at least one lowercase letter")

        if not re.search(r"\d", v):
            raise ValueError("Password must contain at least one number")

        if not re.search(r"[@$!%*?&]", v):
            raise ValueError(
                "Password must contain at least one special character (@$!%*?&)"
            )

        return v


@router.post("/register")
async def register(request: RegisterRequest):
    """Register a user and return auth tokens."""

    # Basic validation
    if not request.firstName or len(request.firstName) < 2:
        raise HTTPException(status_code=400, detail="First name must be at least 2 characters")

    if not request.lastName or len(request.lastName) < 2:
        raise HTTPException(
            status_code=400, detail="Last name must be at least 2 characters"
        )

    # Check if email already exists
    if request.email in registered_users:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Get current timestamp for registration
    current_time = datetime.utcnow()

    # Store user data with actual timestamp
    registered_users[request.email] = {
        "firstName": request.firstName,
        "lastName": request.lastName,
        "email": request.email,
        "createdAt": current_time,
        "updatedAt": current_time
    }

    return {
        "success": True,
        "message": "Registration successful",
        "data": {
            "user": {
                "firstName": request.firstName,
                "lastName": request.lastName,
                "email": request.email,
                "_id": f"user_{len(registered_users)}",
                "isVerified": False,
                "createdAt": current_time.isoformat(),
                "updatedAt": current_time.isoformat()
            },
            "tokens": {
                "accessToken": f"access_token_{len(registered_users)}",
                "refreshToken": f"refresh_token_{len(registered_users)}"
            }
        }
    }


class LoginRequest(BaseModel):
    """Payload for user login."""

    email: EmailStr
    password: str


@router.post("/login")
async def login(request: LoginRequest):
    """Authenticate a user with stored credentials."""

    # Basic validation
    if not request.email:
        raise HTTPException(status_code=400, detail="Email is required")

    if not request.password:
        raise HTTPException(status_code=400, detail="Password is required")

    # Check if email exists (in real app, verify password hash)
    if request.email not in registered_users:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Get user data from storage
    user_data = registered_users[request.email]

    # For demo, accept any password if email exists
    # In real app, you'd verify the password hash

    return {
        "success": True,
        "message": "Login successful",
        "data": {
            "user": {
                "firstName": user_data["firstName"],
                "lastName": user_data["lastName"],
                "email": request.email,
                "_id": (
                    f"user_"
                    f"{list(registered_users.keys()).index(request.email) + 1}"
                ),
                "isVerified": True,
                "createdAt": user_data["createdAt"].isoformat(),
                "updatedAt": user_data["updatedAt"].isoformat()
            },
            "tokens": {
                "accessToken": f"access_token_{request.email}",
                "refreshToken": f"refresh_token_{request.email}"
            }
        }
    }


@router.post("/logout")
async def logout():
    """Stub logout endpoint for demo."""

    return {"success": True, "message": "Logout endpoint working"}


@router.post("/refresh-token")
async def refresh_token():
    """Return placeholder refreshed tokens."""

    # For demo, return a new token
    # In real app, you'd validate the refresh token and issue new access token
    return {
        "success": True,
        "message": "Token refreshed successfully",
        "data": {
            "accessToken": "new_access_token_demo",
            "refreshToken": "new_refresh_token_demo"
        }
    }

@router.get("/profile")
async def profile():
    """Return a static profile for demonstration."""

    # For demo, return a sample user profile
    # In real app, you'd get this from the authenticated user's session/token
    return {
        "success": True,
        "message": "Profile retrieved successfully",
        "data": {
            "_id": "user_1",
            "firstName": "Demo",
            "lastName": "User",
            "email": "demo@example.com",
            "isVerified": True,
            "createdAt": "2024-01-01T00:00:00.000Z",
            "updatedAt": "2024-01-01T00:00:00.000Z"
        }
    }
