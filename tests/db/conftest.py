"""Postgres-tier conftest.

The root conftest replaces ``get_settings`` with a SQLite override so all fast-
tier tests share one in-memory database. Migration tests need Postgres, so this
conftest re-installs ``get_settings`` to return a Settings object built from the
real ``DATABASE_URL`` environment variable. It runs after the root conftest but
before any fixture in this directory, so Alembic env.py sees the Postgres URL.
"""

import os

from strands_compose_chat import config


def _postgres_url() -> str | None:
    url = os.environ.get("DATABASE_URL", "")
    return url if url.startswith("postgresql") else None


# Re-override get_settings at import time of this conftest.
# This is safe because the db/ directory is only collected by the Postgres tier
# (-m postgres), so the SQLite-backed fast-tier tests are never affected.
_pg_url = _postgres_url()
if _pg_url is not None:
    _PG_SETTINGS = config.Settings(
        APP_ENV="test",
        SESSION_SECRET_KEY="t" * 43,
        DATABASE_URL=_pg_url,
    )
    config.get_settings = lambda: _PG_SETTINGS  # type: ignore
