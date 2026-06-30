"""FastAPI frontend serving: Jinja2 shell template, static assets, and cache headers."""

from pathlib import Path
from typing import Any, MutableMapping

import structlog
from fastapi import FastAPI, Request
from fastapi.responses import RedirectResponse, Response
from fastapi.staticfiles import StaticFiles
from starlette.templating import Jinja2Templates
from starlette.types import Receive, Scope, Send

from .auth.current_user import get_optional_session_user
from .auth.service import safe_next_url
from .deps import AppSettings, DbSession

# Built frontend lives here after ``npm run build:backend`` or a Docker build.
STATIC_DIR = Path(__file__).parent / "static"

# Jinja2 templates directory (not served as static; rendered server-side).
TEMPLATES_DIR = Path(__file__).parent / "templates"

# MIME types that should be cached by the browser for 1 hour.
_CACHEABLE_MIME_TYPES: frozenset[str] = frozenset(
    {
        "application/javascript",
        "text/javascript",
        "text/css",
        "image/png",
        "image/jpeg",
        "image/gif",
        "image/webp",
        "image/avif",
        "image/svg+xml",
        "image/x-icon",
        "font/woff",
        "font/woff2",
        "font/ttf",
        "font/otf",
        "application/font-woff",
        "application/font-woff2",
        "application/json",
        "application/wasm",
    }
)

# Cache-Control values.
_CC_CACHE_1H = "public, max-age=3600"
_CC_NO_CACHE = "no-cache"

logger: structlog.stdlib.BoundLogger = structlog.get_logger(__name__)


class CachingStaticFiles:
    """ASGI wrapper around StaticFiles that injects Cache-Control headers.

    Assets whose Content-Type matches a known cacheable MIME type (JS, CSS,
    fonts, images, SVG, JSON, WASM) are served with
    ``Cache-Control: public, max-age=3600``.  Everything else receives
    ``Cache-Control: no-cache``.

    Args:
        directory: Path to the directory served by StaticFiles.
    """

    def __init__(self, directory: str) -> None:
        self._static = StaticFiles(directory=directory, html=False)

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        """Serve the request via StaticFiles and inject the cache header."""

        async def send_with_cache(message: MutableMapping[str, Any]) -> None:
            if message["type"] == "http.response.start":
                headers: list[tuple[bytes, bytes]] = list(message.get("headers", []))
                content_type = next(
                    (v.decode() for k, v in headers if k.lower() == b"content-type"),
                    "",
                )
                # Strip parameters like "; charset=utf-8" before lookup.
                mime = content_type.split(";", 1)[0].strip()
                cache_control = _CC_CACHE_1H if mime in _CACHEABLE_MIME_TYPES else _CC_NO_CACHE
                headers.append((b"cache-control", cache_control.encode()))
                message = {**message, "headers": headers}
            await send(message)

        await self._static(scope, receive, send_with_cache)


def mount_frontend(app: FastAPI, prefix: str, title: str | None = None) -> None:
    """Mount static-file routes and auth-gated page routes on *app*.

    Does nothing and logs a warning when the static directory is absent,
    allowing the backend to run in API-only mode.

    Route layout (all paths are relative to *prefix*):
    - ``{prefix}/static/``  — hashed assets with long-lived cache headers
    - ``{prefix}/``         — chat shell (requires auth; redirects to /login otherwise)
    - ``{prefix}/login``    — auth shell (redirects to / when already authenticated)

    Template context injected into ``app.html``:
    - ``url_prefix``  — value of *prefix* (e.g. ``""`` or ``"/ai/chat"``)
    - ``app_title``   — browser tab / ``<title>`` content

    Template context injected into ``login.html``:
    - ``url_prefix``  — value of *prefix*
    - ``app_title``   — browser tab / ``<title>`` content

    Args:
        app: The FastAPI application instance to mount routes onto.
        prefix: Normalised URL prefix (e.g. ``""`` or ``"/ai/chat"``).
            Must not have a trailing slash.
        title: Optional custom title from ``CUSTOM_HEADER_TITLE``. When None
            the built-in default is kept.
    """
    if not STATIC_DIR.is_dir():
        logger.warning(
            "Frontend static directory not found — running in API-only mode. "
            "Run `just build-ui` to populate it.",
            static_dir=str(STATIC_DIR),
        )
        return

    templates = Jinja2Templates(directory=str(TEMPLATES_DIR))
    page_title = title or ""

    app.mount(
        f"{prefix}/static",
        CachingStaticFiles(directory=str(STATIC_DIR)),
        name="spa-static",
    )

    @app.get(f"{prefix}/login", include_in_schema=False)
    async def login_page(request: Request, db: DbSession, settings: AppSettings) -> Response:
        """Serve the auth shell; redirect already-authenticated users to their destination."""
        user = await get_optional_session_user(request, db)
        if user is not None:
            destination = safe_next_url(request.session.pop("auth_next", None), prefix)
            return RedirectResponse(destination, status_code=302)
        return templates.TemplateResponse(
            request,
            "login.html",
            {
                "url_prefix": prefix,
                "app_title": page_title,
            },
            headers={"Cache-Control": _CC_NO_CACHE},
        )

    @app.get(f"{prefix}/", include_in_schema=False)
    async def chat_page(request: Request, db: DbSession, settings: AppSettings) -> Response:
        """Serve the chat shell to authenticated users; redirect others to /login."""
        user = await get_optional_session_user(request, db)
        if user is not None:
            return templates.TemplateResponse(
                request,
                "app.html",
                {
                    "url_prefix": prefix,
                    "app_title": page_title,
                },
                headers={"Cache-Control": _CC_NO_CACHE},
            )
        next_path = request.url.path
        if request.url.query:
            next_path = f"{next_path}?{request.url.query}"
        request.session["auth_next"] = safe_next_url(next_path, prefix)
        return RedirectResponse(f"{prefix}/login", status_code=302)

    logger.info("Frontend static files mounted", prefix=prefix or "/", static_dir=str(STATIC_DIR))
