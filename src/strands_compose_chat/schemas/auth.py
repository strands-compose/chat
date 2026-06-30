"""Pydantic v2 request/response schemas for authentication endpoints."""

from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class RegisterIn(BaseModel):
    """Request body for POST /auth/register."""

    username: str = Field(min_length=3, max_length=64, pattern=r"^[a-zA-Z0-9_.-]+$")
    email: EmailStr
    password: str


class LoginIn(BaseModel):
    """Request body for POST /auth/login."""

    username: str
    password: str


class AuthProviderInfo(BaseModel):
    """One configured OIDC provider as exposed to the SPA."""

    id: str
    display_name: str


class AuthProvidersOut(BaseModel):
    """Response body for GET /auth/providers."""

    registration_enabled: bool
    providers: list[AuthProviderInfo]


class MeOut(BaseModel):
    """Response body for GET /auth/me and POST /auth/register."""

    id: str
    username: str
    email: str
    auth_provider: str
    groups: list[str]
    is_active: bool
    is_superuser: bool
    budget: float
    usage: float
    created_at: datetime
    updated_at: datetime
    first_name: str | None = Field(None, max_length=128)
    last_name: str | None = Field(None, max_length=128)
    location: str | None = Field(None, max_length=256)
    company: str | None = Field(None, max_length=256)
    department: str | None = Field(None, max_length=256)


class LoginOut(MeOut):
    """Response body for POST /auth/login."""

    next: str = Field(..., description="Validated path to redirect to after login.")


class MePatchIn(BaseModel):
    """Request body for PATCH /auth/me."""

    first_name: str | None = Field(None, max_length=128)
    last_name: str | None = Field(None, max_length=128)
    location: str | None = Field(None, max_length=256)
    company: str | None = Field(None, max_length=256)
    department: str | None = Field(None, max_length=256)
