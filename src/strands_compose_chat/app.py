"""FastAPI application factory for the Chat Backend API."""

from contextlib import asynccontextmanager
from pathlib import Path
from typing import AsyncGenerator

import structlog
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from sqladmin import Admin
from sqlalchemy import select
from starlette.middleware.sessions import SessionMiddleware

from .admin.auth import AdminAuthBackend
from .admin.views import (
    AgentAdmin,
    ApiKeyAdmin,
    ChatMessageAdmin,
    ChatSessionAdmin,
    DashboardView,
    GroupAdmin,
    ModelPricingAdmin,
    TokenUsageAdmin,
    UserAdmin,
)
from .agents.invocation import router as invocation_router
from .agents.routes import router as agents_router
from .analytics.routes_admin import router as analytics_admin_router
from .analytics.routes_me import router as analytics_me_router
from .auth.routes import router as auth_router
from .bootstrap import bootstrap_superuser
from .config import Settings
from .db.base import AsyncSessionLocal, engine
from .deps import DbSession, get_oidc_registry, get_settings
from .errors import register_exception_handlers
from .frontend import mount_frontend
from .logging import configure_logging
from .media.routes import router as media_router
from .middleware import HealthExemptTrustedHostMiddleware, SecurityHeadersMiddleware
from .sessions.routes import router as sessions_router

logger: structlog.stdlib.BoundLogger = structlog.get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan: startup and shutdown."""
    settings = get_settings()

    configure_logging(settings)

    get_oidc_registry()  # validate provider config early; raises OidcConfigurationError on bad settings
    if settings.OIDC_REDIRECT_URI:
        logger.info("OIDC callback redirect_uri (configured): %s", settings.OIDC_REDIRECT_URI)

    async with AsyncSessionLocal() as db:
        await bootstrap_superuser(db, settings)
        await db.commit()

    yield


def create_app(settings: Settings | None = None) -> FastAPI:
    """Create and configure the FastAPI application."""
    if settings is None:
        settings = get_settings()

    prefix = settings.URL_PREFIX  # e.g. "" or "/ai/chat"
    api_prefix = f"{prefix}/api/v1"

    app = FastAPI(
        title="Strands Compose Chat",
        lifespan=lifespan,
        docs_url=None,
        redoc_url=None,
        openapi_url=None,
    )

    register_exception_handlers(app)

    # Middleware registered in reverse application order (last added = outermost).
    # session_cookie and path are namespaced to this app (matching the auth
    # cookie) so multiple services on the same domain do not collide.
    app.add_middleware(
        SessionMiddleware,
        secret_key=settings.SESSION_SECRET_KEY,
        session_cookie=settings.SESSION_COOKIE_NAME,
        path=settings.URL_PREFIX or "/",
        https_only=settings.APP_ENV != "dev",
        max_age=settings.SESSION_TTL_SECONDS,
        same_site="lax",
    )
    app.add_middleware(SecurityHeadersMiddleware)
    app.add_middleware(
        HealthExemptTrustedHostMiddleware,
        allowed_hosts=settings.TRUSTED_HOSTS,
        exempt_paths=frozenset(
            {
                f"{prefix}/health",
                f"{prefix}/ready",  # routes mounted under the URL prefix
                "/health",
                "/ready",  # fallback when ASGI root_path is used
            }
        ),
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"],
    )
    # Starlette's GZipMiddleware skips ``text/event-stream`` natively
    app.add_middleware(GZipMiddleware, minimum_size=1000)

    app.include_router(auth_router, prefix=prefix)
    app.include_router(agents_router, prefix=api_prefix)
    app.include_router(sessions_router, prefix=api_prefix)
    app.include_router(invocation_router, prefix=api_prefix)
    app.include_router(media_router, prefix=api_prefix)
    app.include_router(analytics_admin_router, prefix=api_prefix)
    app.include_router(analytics_me_router, prefix=api_prefix)

    admin = Admin(
        app,
        engine,
        authentication_backend=AdminAuthBackend(settings),
        base_url=f"{prefix}/admin",
        templates_dir=str(Path(__file__).parent / "admin" / "templates"),
        title="Admin",
        favicon_url=f"{prefix}/static/favicon.svg",
    )
    admin.add_view(UserAdmin)
    admin.add_view(GroupAdmin)
    admin.add_view(AgentAdmin)
    admin.add_view(ChatSessionAdmin)
    admin.add_view(ChatMessageAdmin)
    admin.add_view(TokenUsageAdmin)
    admin.add_view(ModelPricingAdmin)
    admin.add_view(ApiKeyAdmin)
    admin.add_base_view(DashboardView)

    @app.get(f"{prefix}/health", tags=["health"], operation_id="health_check")
    @app.get("/health", tags=["health"], operation_id="health_check")
    async def health() -> dict:
        """Return HTTP 200 when the process is running."""
        return {"status": "ok"}

    @app.get(f"{prefix}/ready", tags=["health"], operation_id="health_ready")
    @app.get("/ready", tags=["health"], operation_id="health_ready")
    async def ready(db: DbSession) -> JSONResponse:
        """Return HTTP 200 when the database is reachable.

        Readiness reflects infrastructure health only (DB reachable), not
        whether content such as agents has been configured — gating on agent
        count would wall off the admin panel on a fresh deploy.
        """
        try:
            await db.execute(select(1))
            return JSONResponse({"status": "ready"}, status_code=200)
        except Exception:  # noqa: BLE001
            return JSONResponse({"status": "db unavailable"}, status_code=503)

    # Serve the compiled frontend
    mount_frontend(app, prefix, settings.CUSTOM_HEADER_TITLE)

    return app


app = create_app()
