"""Startup bootstrap: create a superuser on first run if credentials are configured."""

from datetime import UTC, datetime

import structlog
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from .auth.passwords import hash_password
from .config import Settings
from .db.models import User

logger: structlog.stdlib.BoundLogger = structlog.get_logger(__name__)


async def bootstrap_superuser(db: AsyncSession, settings: Settings) -> None:
    """Create a bootstrap superuser if none exists and credentials are configured.

    No-op when either ``ADMIN_BOOTSTRAP_USERNAME`` or ``ADMIN_BOOTSTRAP_PASSWORD``
    is not set, or when at least one superuser already exists.

    Args:
        db:       An open async database session.  The caller commits.
        settings: Application settings supplying bootstrap credentials and
                  Argon2id hashing parameters.
    """
    if not settings.ADMIN_BOOTSTRAP_USERNAME or not settings.ADMIN_BOOTSTRAP_PASSWORD:
        return

    result = await db.execute(
        select(func.count()).select_from(User).where(User.is_superuser.is_(True))
    )
    if result.scalar_one() > 0:
        return

    username = settings.ADMIN_BOOTSTRAP_USERNAME
    password_hash = hash_password(settings.ADMIN_BOOTSTRAP_PASSWORD, settings)

    now = datetime.now(UTC)
    superuser = User(
        username=username,
        email="-",
        auth_provider="local",
        external_subject=None,
        password_hash=password_hash,
        is_active=True,
        is_superuser=True,
        created_at=now,
        updated_at=now,
    )

    db.add(superuser)
    await db.flush()

    logger.info("Bootstrap superuser created", username=username)
