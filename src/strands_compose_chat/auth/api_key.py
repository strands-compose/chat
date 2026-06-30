"""API-key generation and request resolution"""

import hashlib
import secrets
from datetime import UTC, datetime

import structlog
from fastapi import Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from ..db.models import ApiKey, User
from ..errors import ProblemDetailsException

logger: structlog.stdlib.BoundLogger = structlog.get_logger(__name__)

KEY_PREFIX: str = "sck_"
"""Literal self-identifying prefix on every raw key and key_prefix."""

_TOKEN_NBYTES: int = 32
"""Entropy bytes for ``secrets.token_urlsafe``; 32 bytes = 256 bits."""

_PREFIX_FRAGMENT_LEN: int = 8
"""Number of secret characters retained after ``sck_`` in ``key_prefix``."""


def hash_api_key(raw_key: str) -> str:
    """Return the SHA-256 hex digest used to store and look up an API key.

    API keys carry >= 256 bits of entropy, so an unsalted SHA-256 is sufficient
    and — unlike a salted KDF such as Argon2 — keeps resolution an O(1) indexed
    lookup (the same input always maps to the same digest).

    Args:
        raw_key: The full credential beginning with ``sck_``.

    Returns:
        The 64-character lowercase hex SHA-256 digest of *raw_key*.
    """
    return hashlib.sha256(raw_key.encode("utf-8")).hexdigest()


def generate_api_key() -> tuple[str, str]:
    """Generate a fresh raw API key and its key prefix.

    Uses ``secrets.token_urlsafe(32)`` (>= 256 bits of entropy, ~43 url-safe
    characters). The raw key is ``sck_`` + token (total ~47 chars, within
    the 32-128 bound). The key prefix is ``sck_`` + the first 8 characters of
    the token, so the secret portion cannot be reconstructed from it.

    The raw key itself is never persisted — only ``hash_api_key(raw_key)`` is
    stored. The caller is responsible for showing the raw key to the user once.

    Returns:
        A ``(raw_key, key_prefix)`` tuple. ``raw_key`` is the full credential
        the caller presents; ``key_prefix`` is the non-secret display/lookup
        fragment.
    """
    token = secrets.token_urlsafe(_TOKEN_NBYTES)
    raw_key = f"{KEY_PREFIX}{token}"
    key_prefix = f"{KEY_PREFIX}{token[:_PREFIX_FRAGMENT_LEN]}"
    return raw_key, key_prefix


def _auth_failed() -> ProblemDetailsException:
    """Build the single, indistinguishable 401 used for every failure mode."""
    return ProblemDetailsException(status_code=401, detail="Authentication required")


def _is_in_past(moment: datetime | None) -> bool:
    """Return True when *moment* is non-null and at or before the current UTC time.

    Normalizes naive datetimes (as SQLite may return) to UTC before comparison.

    Args:
        moment: A timezone-aware or naive timestamp, or None.

    Returns:
        True if *moment* is set and <= now (UTC); False when None or in the future.
    """
    if moment is None:
        return False
    if moment.tzinfo is None:
        moment = moment.replace(tzinfo=UTC)
    return moment <= datetime.now(UTC)


async def resolve_api_key(raw_key: str, request: Request, db: AsyncSession) -> User:
    """Resolve a presented ``sck_`` credential to its owning User.

    Validation order (all failures raise an identical 401):
    1. Look up the API key record by the SHA-256 hash of the presented key.
    2. Reject if ``revoked_at`` is set and at/before now.
    3. Reject if ``expires_at`` is set and at/before now.
    4. Reject if the owning user is missing or ``is_active`` is False.

    On success: set ``request.state.user_id``, best-effort update ``last_used_at``,
    emit a redacted success log, and return the owning ``User``.

    Args:
        raw_key: The full credential beginning with ``sck_``.
        request: The incoming request (for ``state.user_id``).
        db: Async database session.

    Returns:
        The active owning ``User`` ORM instance.

    Raises:
        ProblemDetailsException: HTTP 401 on any failure, identical across causes.
    """
    result = await db.execute(
        select(ApiKey)
        .options(selectinload(ApiKey.user))
        .where(ApiKey.secret_hash == hash_api_key(raw_key))
    )
    record = result.scalar_one_or_none()

    if record is None:
        logger.warning("api-key auth failed: no match")
        raise _auth_failed()

    if _is_in_past(record.revoked_at) or _is_in_past(record.expires_at):
        logger.warning(
            "api-key auth failed: revoked or expired",
            key_prefix=record.key_prefix,
            api_key_id=record.id,
        )
        raise _auth_failed()

    user = record.user
    if user is None or not user.is_active:
        logger.warning(
            "api-key auth failed: inactive or missing owner",
            key_prefix=record.key_prefix,
            api_key_id=record.id,
        )
        raise _auth_failed()

    request.state.user_id = user.id
    await _touch_last_used(record, db)

    logger.info(
        "api-key auth succeeded",
        api_key_id=record.id,
        user_id=user.id,
    )
    return user


async def _touch_last_used(record: ApiKey, db: AsyncSession) -> None:
    """Best-effort update of ``last_used_at``; never fails the authenticated request.

    Args:
        record: The matched API key record.
        db: Async database session.
    """
    try:
        record.last_used_at = datetime.now(UTC)
        await db.flush()
    except Exception:
        logger.warning(
            "api-key last_used_at update failed",
            api_key_id=record.id,
            key_prefix=record.key_prefix,
            exc_info=True,
        )
