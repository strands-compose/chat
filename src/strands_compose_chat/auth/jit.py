"""JIT (Just-In-Time) provisioning of users from verified external provider claims.

This module owns the full "find-or-create a User from OIDC claims" concern:
``jit_provision`` is the orchestration; ``derive_unique_username`` and
``username_suffix`` are its deterministic username-derivation mechanism.
"""

import hashlib
from datetime import UTC, datetime

import structlog
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..db.models import User
from .oidc import ExternalAuthError

logger: structlog.stdlib.BoundLogger = structlog.get_logger(__name__)

_BASE62_CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"


def username_suffix(sub: str) -> str:
    """Derive a deterministic 6-character base62 suffix from a provider sub.

    Computed from the first 4 bytes of the SHA-256 digest of *sub*, encoded
    in base62 and left-padded to exactly 6 characters.

    Args:
        sub: The provider-issued sub claim value.

    Returns:
        A 6-character base62 string.
    """
    digest = hashlib.sha256(sub.encode()).digest()[:4]
    value = int.from_bytes(digest, byteorder="big")

    if value == 0:
        return "000000"

    chars: list[str] = []
    n = value
    while n:
        chars.append(_BASE62_CHARS[n % 62])
        n //= 62
    encoded = "".join(reversed(chars))
    return encoded.zfill(6)


def derive_unique_username(
    base_username: str,
    sub: str,
    *,
    existing_usernames: set[str],
) -> str:
    """Return a unique username for JIT provisioning, appending a suffix on collision.

    Algorithm:
    1. Try base_username — return it if not in existing_usernames.
    2. On collision, append ``-<username_suffix(sub)>`` and try again.
    3. On further collisions, vary the seed until a unique name is found.

    Logs at INFO when a suffix is appended (without PII).

    Args:
        base_username: The username derived from the configured username claim.
        sub: The provider-issued sub claim, used to derive the suffix.
        existing_usernames: The set of usernames already taken.

    Returns:
        A username that is not in existing_usernames.
    """
    if base_username not in existing_usernames:
        return base_username

    suffix = username_suffix(sub)
    candidate = f"{base_username}-{suffix}"
    if candidate not in existing_usernames:
        logger.info("Username collision resolved", base_username=base_username, attempt=1)
        return candidate

    i = 1
    while True:
        suffix = username_suffix(f"{sub}{i}")
        candidate = f"{base_username}-{suffix}"
        if candidate not in existing_usernames:
            logger.info("Username collision resolved", base_username=base_username, attempt=i + 1)
            return candidate
        i += 1


async def jit_provision(
    db: AsyncSession,
    claims: dict,
    auth_provider_value: str,
    username_claim: str,
) -> User:
    """Find or create a user from external provider claims (JIT provisioning).

    The username is derived from the configured ``username_claim``. When the
    claim is absent or empty, the provider's ``sub`` claim is used as a
    fallback. Newly provisioned users are always created without superuser
    status; elevation is performed manually through the admin panel. Existing
    users are not modified except to sync a changed email address.

    Args:
        db: An open async database session. The caller is responsible for commit.
        claims: Verified claims returned by the OIDC provider.
        auth_provider_value: The provider identifier stored in User.auth_provider.
        username_claim: The claim key used to derive the username.

    Returns:
        The existing or newly-created User ORM instance.

    Raises:
        ExternalAuthError: If the required ``sub`` claim is absent or empty.
    """
    sub: str = str(claims.get("sub", ""))
    if not sub:
        raise ExternalAuthError("Provider did not return a subject (sub) claim")

    email: str = str(claims.get("email", ""))
    raw_username = claims.get(username_claim)

    if not raw_username:
        logger.warning("username claim %s absent; falling back to sub", username_claim)
        raw_username = sub

    result = await db.execute(
        select(User).where(
            User.auth_provider == auth_provider_value,
            User.external_subject == sub,
        ),
    )
    user = result.scalar_one_or_none()

    if user is None:
        existing = await db.execute(select(User.username))
        existing_usernames: set[str] = {row[0] for row in existing.all()}
        username = derive_unique_username(
            str(raw_username),
            sub,
            existing_usernames=existing_usernames,
        )
        now = datetime.now(UTC)
        user = User(
            username=username,
            email=email,
            auth_provider=auth_provider_value,
            external_subject=sub,
            password_hash=None,
            is_active=True,
            is_superuser=False,
            created_at=now,
            updated_at=now,
        )
        db.add(user)
        await db.flush()
        logger.info("JIT-provisioned new user", username=username)
    elif email and user.email != email:
        user.email = email
        user.updated_at = datetime.now(UTC)
        await db.flush()

    return user
