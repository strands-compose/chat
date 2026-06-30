"""FastAPI dependencies for database sessions and application settings."""

import functools
from collections.abc import AsyncGenerator
from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from .auth.oidc import OIDCProvider, build_oidc_registry
from .config import Settings, get_settings
from .db.base import AsyncSessionLocal


async def get_db() -> AsyncGenerator[AsyncSession, None]:
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


DbSession = Annotated[AsyncSession, Depends(get_db)]
AppSettings = Annotated[Settings, Depends(get_settings)]
OidcRegistry = Annotated[dict[str, OIDCProvider], Depends(get_oidc_registry)]
