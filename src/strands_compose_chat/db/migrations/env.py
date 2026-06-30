"""Alembic environment configuration.

Wired to the async SQLAlchemy engine from ``strands_compose_chat.db.base``
and to ``Base.metadata`` so that ``alembic revision --autogenerate`` picks up
all 10 ORM tables automatically.
"""

import asyncio
from logging.config import fileConfig

from alembic import context
from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config

import strands_compose_chat.db.models  # noqa: F401 — register ORM models with Base.metadata
from strands_compose_chat.config import get_settings
from strands_compose_chat.db.base import Base

# Alembic Config object — gives access to the values within alembic.ini.
config = context.config

# Override the sqlalchemy.url with the value from Settings so that the
# alembic.ini placeholder is never used at runtime.
config.set_main_option("sqlalchemy.url", get_settings().DATABASE_URL)

# Interpret the config file for Python logging if present.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Tells autogenerate which tables to track.
target_metadata = Base.metadata


def do_run_migrations(connection: Connection) -> None:
    """Run migrations synchronously against an already-open connection."""
    url = config.get_main_option("sqlalchemy.url", "")
    context.configure(
        connection=connection,
        target_metadata=target_metadata,
        # SQLite requires batch mode for ALTER TABLE operations.
        render_as_batch=url.startswith("sqlite"),
    )

    with context.begin_transaction():
        context.run_migrations()


async def run_async_migrations() -> None:
    """Create an async engine and run migrations through a sync connection."""
    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode using the async engine."""
    asyncio.run(run_async_migrations())


run_migrations_online()
