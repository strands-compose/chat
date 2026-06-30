"""Async database engine, sessionmaker, and declarative Base."""

import uuid

from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase

from ..config import get_settings


def _new_uuid() -> str:
    """Return a new random UUID4 as a string for use as a primary-key default."""
    return str(uuid.uuid4())


def create_engine_from_url(url: str, *, echo: bool = False) -> AsyncEngine:
    """Create an AsyncEngine from *url*.

    Supports ``sqlite+aiosqlite://`` and ``postgresql+psycopg://`` URLs.

    Raises:
        ImportError: If *url* uses postgresql+psycopg but psycopg is not installed.
        ValueError: If *url* uses an unsupported scheme.
    """
    if url.startswith("postgresql+psycopg"):
        try:
            import psycopg  # noqa: F401
        except ImportError as exc:
            raise ImportError(
                "DATABASE_URL uses the 'postgresql+psycopg://' scheme but the "
                "'psycopg' package is not installed.  Install the '[postgres]' "
                "optional extra:  pip install 'strands-compose-chat[postgres]'"
            ) from exc
        return create_async_engine(url, echo=echo, pool_pre_ping=True)

    if url.startswith("sqlite+aiosqlite"):
        return create_async_engine(
            url,
            echo=echo,
            connect_args={"check_same_thread": False},
        )

    raise ValueError(
        f"Unsupported DATABASE_URL scheme: {url!r}.  "
        "Use 'sqlite+aiosqlite://' or 'postgresql+psycopg://'."
    )


engine: AsyncEngine = create_engine_from_url(get_settings().DATABASE_URL)

AsyncSessionLocal: async_sessionmaker[AsyncSession] = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)


class Base(DeclarativeBase):
    """Shared declarative base for all ORM models."""
