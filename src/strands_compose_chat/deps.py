"""FastAPI dependencies for database sessions, application settings, and agent clients."""

import functools
from collections.abc import AsyncGenerator
from typing import Annotated

from fastapi import Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from .agents.client import AgentClientCache
from .auth.oidc import OIDCProvider, build_oidc_registry
from .config import Settings, get_settings
from .db.base import AsyncSessionLocal


async def get_db() -> AsyncGenerator[AsyncSession]:
    """Per-request async database session.

    Commits on success, rolls back on any exception.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


@functools.lru_cache(maxsize=1)
def get_oidc_registry() -> dict[str, OIDCProvider]:
    """Return the cached OIDC provider registry (built once, no network I/O)."""
    return build_oidc_registry(get_settings())


def get_agent_clients(request: Request) -> AgentClientCache:
    """Return the app's shared agent-client cache (created in ``create_app``)."""
    return request.app.state.agent_clients


DbSession = Annotated[AsyncSession, Depends(get_db)]
AgentClients = Annotated[AgentClientCache, Depends(get_agent_clients)]
AppSettings = Annotated[Settings, Depends(get_settings)]
OidcRegistry = Annotated[dict[str, OIDCProvider], Depends(get_oidc_registry)]
