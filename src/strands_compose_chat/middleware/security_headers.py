"""Security headers middleware."""

from typing import Any

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp

from ..config import Settings

# Headers applied to every response, independent of the framing policy.
_BASE_HEADERS: dict[str, str] = {
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "X-Content-Type-Options": "nosniff",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "no-referrer",
}

# ``blob:`` in frame-src covers the in-app PDF attachment viewer.
_CSP_TEMPLATE = (
    "default-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; "
    "frame-src 'self' blob:; frame-ancestors {ancestors}"
)


def _framing_headers(*, allow_same_origin: bool) -> dict[str, str]:
    """Return a mutually consistent CSP / ``X-Frame-Options`` pair."""
    return {
        "Content-Security-Policy": _CSP_TEMPLATE.format(
            ancestors="'self'" if allow_same_origin else "'none'"
        ),
        "X-Frame-Options": "SAMEORIGIN" if allow_same_origin else "DENY",
    }


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Injects security headers on every response.

    Framing follows ``FRAME_ANCESTORS``, except on admin paths (containing
    ``/admin/``), which always allow same-origin framing because the dashboard
    page is embedded in the sqladmin iframe.

    Args:
        app: The wrapped ASGI application.
        settings: Application settings supplying the framing policy.
    """

    def __init__(self, app: ASGIApp, settings: Settings) -> None:
        super().__init__(app)
        self._headers = {
            **_BASE_HEADERS,
            **_framing_headers(allow_same_origin=bool(settings.FRAME_ANCESTORS)),
        }
        self._admin_headers = {**_BASE_HEADERS, **_framing_headers(allow_same_origin=True)}

    async def dispatch(self, request: Request, call_next: Any) -> Response:
        """Apply the header set matching the request path to the response."""
        response: Response = await call_next(request)
        is_admin_path = "/admin/" in request.url.path or request.url.path.endswith("/admin")
        headers = self._admin_headers if is_admin_path else self._headers
        for header_name, header_value in headers.items():
            response.headers[header_name] = header_value
        # Remove the Server header to avoid leaking the server implementation.
        response.headers["Server"] = ""
        return response
