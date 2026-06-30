"""Security headers middleware."""

from typing import Any

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp

# Headers applied to every response.
_BASE_HEADERS: dict[str, str] = {
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "X-Content-Type-Options": "nosniff",
    "Content-Security-Policy": "default-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; frame-src 'self' blob:; frame-ancestors 'none'",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "no-referrer",
}

# Admin dashboard page is embedded in the iframe (same origin)
_ADMIN_FRAME_OVERRIDES: dict[str, str] = {
    "Content-Security-Policy": "default-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; frame-src 'self' blob:; frame-ancestors 'self'",
    "X-Frame-Options": "SAMEORIGIN",
}


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Injects security headers on every response.

    Admin paths (containing ``/admin/``) receive relaxed framing headers so the
    dashboard page can be embedded in the sqladmin iframe. All other paths keep
    ``frame-ancestors 'none'`` / ``X-Frame-Options: DENY``.
    """

    def __init__(self, app: ASGIApp) -> None:
        super().__init__(app)

    async def dispatch(self, request: Request, call_next: Any) -> Response:
        response: Response = await call_next(request)
        is_admin_path = "/admin/" in request.url.path or request.url.path.endswith("/admin")
        headers = {**_BASE_HEADERS, **_ADMIN_FRAME_OVERRIDES} if is_admin_path else _BASE_HEADERS
        for header_name, header_value in headers.items():
            response.headers[header_name] = header_value
        # Remove the Server header to avoid leaking the server implementation.
        response.headers["Server"] = ""
        return response
