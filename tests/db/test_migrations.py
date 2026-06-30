"""Migration guard — Postgres tier only.

Verifies that Alembic migrations apply cleanly to an empty PostgreSQL database
and that the ORM metadata has no drift against the migrated schema.

Schema is built exclusively by running migrations to head — never via
``Base.metadata.create_all`` — so a broken migration fails the suite. The
tests/db/conftest.py installs a Postgres-aware ``get_settings`` before these
tests run, so Alembic env.py routes to the correct database.
"""

import os
from pathlib import Path

import pytest

_ALEMBIC_INI = Path(__file__).parents[2] / "src" / "strands_compose_chat" / "alembic.ini"


def _require_postgres() -> str:
    url = os.environ.get("DATABASE_URL", "")
    if not url.startswith("postgresql"):
        pytest.skip("DATABASE_URL is not a PostgreSQL URL; skipping Postgres-tier test.")
    return url


@pytest.fixture(scope="session")
def _migrated_postgres_url() -> str:
    """Run Alembic upgrade head once for the session and return the Postgres URL."""
    from alembic import command
    from alembic.config import Config

    pg_url = _require_postgres()

    alembic_cfg = Config(str(_ALEMBIC_INI))
    alembic_cfg.set_main_option("sqlalchemy.url", pg_url)
    command.upgrade(alembic_cfg, "head")
    return pg_url


@pytest.mark.postgres
def test_migrations_apply_clean_on_empty_database(_migrated_postgres_url: str) -> None:
    """All Alembic migrations upgrade to head without error."""
    assert _migrated_postgres_url.startswith("postgresql")


@pytest.mark.postgres
def test_orm_metadata_has_no_drift_against_migrations(_migrated_postgres_url: str) -> None:
    """ORM metadata exactly matches the migrated schema — autogenerate diff is empty.

    Two indexes use postgresql_ops to specify a DESC sort (ix_chat_sessions_user_last_used,
    ix_token_usage_user_created). Alembic cannot round-trip operator-class expression
    indexes accurately and always flags them as a spurious remove+add. They are excluded
    so the test only catches real drift.
    """
    from alembic.autogenerate import compare_metadata
    from alembic.migration import MigrationContext
    from sqlalchemy import create_engine

    import strands_compose_chat.db.models  # noqa: F401
    from strands_compose_chat.db.base import Base

    _EXPRESSION_INDEXES = {
        "ix_chat_sessions_user_last_used",
        "ix_token_usage_user_created",
    }

    sync_url = _migrated_postgres_url.replace(
        "postgresql+psycopg+async://", "postgresql+psycopg://"
    )

    engine = create_engine(sync_url)
    try:
        with engine.connect() as conn:
            ctx = MigrationContext.configure(conn)
            raw_diff = compare_metadata(ctx, Base.metadata)
    finally:
        engine.dispose()

    diff = [
        op
        for op in raw_diff
        if not (op[0] in ("add_index", "remove_index") and op[1].name in _EXPRESSION_INDEXES)
    ]

    assert diff == [], (
        f"ORM metadata has drifted from the migration scripts. "
        f"Pending operations ({len(diff)}):\n" + "\n".join(f"  {op}" for op in diff)
    )
