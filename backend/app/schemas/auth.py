from pydantic import BaseModel, EmailStr
from typing import Optional


class GoogleLoginRequest(BaseModel):
    token: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    name: str


class UpdateProfileRequest(BaseModel):
    name: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    picture: Optional[str] = None

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse