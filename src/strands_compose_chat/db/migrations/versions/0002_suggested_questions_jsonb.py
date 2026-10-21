"""suggested_questions_jsonb

Store agents.suggested_questions as jsonb on PostgreSQL. Plain json has no
equality operator, so SELECT DISTINCT over agents (issued by sqladmin when
editing a Group) fails. SQLite has no json/jsonb distinction, so it is skipped.

Revision ID: 0002
Revises: 0001
Create Date: 2026-10-20 12:00:00.000000

"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "0002"
down_revision: str | None = "0001"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    if op.get_bind().dialect.name != "postgresql":
        return
    op.alter_column(
        "agents",
        "suggested_questions",
        type_=postgresql.JSONB(),
        existing_type=sa.JSON(),
        existing_nullable=True,
        postgresql_using="suggested_questions::jsonb",
    )


def downgrade() -> None:
    if op.get_bind().dialect.name != "postgresql":
        return
    op.alter_column(
        "agents",
        "suggested_questions",
        type_=sa.JSON(),
        existing_type=postgresql.JSONB(),
        existing_nullable=True,
        postgresql_using="suggested_questions::json",
    )
