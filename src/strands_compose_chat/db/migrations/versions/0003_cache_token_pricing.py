"""cache_token_pricing

Add prompt-cache token counts to token_usage and cache token prices to
model_pricing. Existing rows get 0, so their cost is unchanged. Batch mode
keeps the ALTER TABLE statements valid on SQLite as well as PostgreSQL.

Revision ID: 0003
Revises: 0002
Create Date: 2026-10-31 14:30:00.000000

"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "0003"
down_revision: str | None = "0002"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    with op.batch_alter_table("token_usage", schema=None) as batch_op:
        batch_op.add_column(
            sa.Column(
                "cache_read_input_tokens",
                sa.Integer(),
                nullable=False,
                server_default="0",
            )
        )
        batch_op.add_column(
            sa.Column(
                "cache_write_input_tokens",
                sa.Integer(),
                nullable=False,
                server_default="0",
            )
        )

    with op.batch_alter_table("model_pricing", schema=None) as batch_op:
        batch_op.add_column(
            sa.Column(
                "cache_read_token_price",
                sa.Float(),
                nullable=False,
                server_default="0",
            )
        )
        batch_op.add_column(
            sa.Column(
                "cache_write_token_price",
                sa.Float(),
                nullable=False,
                server_default="0",
            )
        )


def downgrade() -> None:
    with op.batch_alter_table("model_pricing", schema=None) as batch_op:
        batch_op.drop_column("cache_write_token_price")
        batch_op.drop_column("cache_read_token_price")

    with op.batch_alter_table("token_usage", schema=None) as batch_op:
        batch_op.drop_column("cache_write_input_tokens")
        batch_op.drop_column("cache_read_input_tokens")
