"""Auth service layer: shared business logic used by route handlers.

This module contains operations that sit above pure utilities (passwords,
cookies) but below HTTP concerns (request parsing, response construction).
Route handlers delegate here; nothing in this module imports from FastAPI.

Browser identity is established via the Starlette signed session cookie
(request.session["user_id"]). The app does not mint its own tokens; external
identity comes from OIDC providers whose verified claims are consumed once
during JIT provisioning.
"""

from sqlalchemy import func, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from ..db.models import ChatMessage, ChatSession, Group, User, UserGroup
from ..schemas.auth import MeOut, MePatchIn

# Tombstone text written over a user's conversation content on anonymisation.
# Markdown italic so the UI renders it as visibly redacted, not as real content.
_CONTENT_TOMBSTONE = "_Content removed for data protection._"
_TITLE_TOMBSTONE = "Anonymized conversation"


def safe_next_url(next_url: str | None, prefix: str) -> str:
    """Return a safe same-origin relative path for post-login redirect.

    Rejects absolute URLs, protocol-relative URLs, and anything not starting
    with a single ``/`` to prevent open-redirect attacks. Falls back to the
    app root (``{prefix}/``) when the input is missing or unsafe.

    Args:
        next_url: The candidate redirect target from the request.
        prefix: The application URL prefix (e.g. ``""`` or ``"/ai/chat"``).

    Returns:
        A validated relative URL safe to redirect to.
    """
    default = f"{prefix}/"
    if not next_url:
        return default
    # Must be a relative path: starts with exactly one "/", not "//" (protocol-relative)
    # and not containing a scheme like "http:" or a backslash.
    if not next_url.startswith("/") or next_url.startswith("//"):
        return default
    if "\\" in next_url or ":" in next_url:
        return default
    return next_url


async def load_group_names(db: AsyncSession, user_id: str) -> list[str]:
    """Return the list of group names the user belongs to.

    Args:
        db: An open async database session.
        user_id: The user's primary key.

    Returns:
        List of group name strings; empty list if the user has no groups.
    """
    result = await db.execute(
        select(Group.name)
        .join(UserGroup, UserGroup.group_id == Group.id)
        .where(UserGroup.user_id == user_id),
    )
    return [row[0] for row in result.all()]


def user_to_me_out(user: User, groups: list[str], usage: float) -> MeOut:
    """Map a User ORM object and group list to the MeOut response schema.

    Args:
        user: The authenticated User ORM instance.
        groups: List of group names the user belongs to.
        usage: The dynamically calculated token usage cost.

    Returns:
        A populated MeOut schema instance.
    """
    return MeOut(
        id=user.id,
        username=user.username,
        email=user.email,
        auth_provider=user.auth_provider,
        groups=groups,
        is_active=user.is_active,
        is_superuser=user.is_superuser,
        budget=user.budget,
        usage=usage,
        created_at=user.created_at,
        updated_at=user.updated_at,
        first_name=user.first_name,
        last_name=user.last_name,
        location=user.location,
        company=user.company,
        department=user.department,
    )


async def update_user_profile(db: AsyncSession, user: User, patch: MePatchIn) -> User:
    """Apply non-None profile fields from a patch payload to a User ORM object.

    Only fields explicitly set (non-``None``) in ``patch`` are written; ``None``
    values are left untouched so that a partial PATCH does not clear existing data.

    Args:
        db: An open async database session.
        user: The User ORM instance to mutate.
        patch: Validated patch payload containing the fields to update.

    Returns:
        The same ``User`` instance after the changes have been flushed to the
        database session (but not yet committed).
    """
    if patch.first_name is not None:
        user.first_name = patch.first_name
    if patch.last_name is not None:
        user.last_name = patch.last_name
    if patch.location is not None:
        user.location = patch.location
    if patch.company is not None:
        user.company = patch.company
    if patch.department is not None:
        user.department = patch.department
    await db.flush()
    await db.refresh(user)
    return user


async def anonymize_user(db: AsyncSession, user_id: str) -> User:
    """Irreversibly remove a user's personal data while preserving audit records.

    Scrubs personally identifying fields on the user row, deactivates the
    account, and overwrites the text of the user's chat messages and session
    titles/manifests with a tombstone. The stable ``id``, ``budget``,
    ``auth_provider``, ``created_at``, and all ``token_usage`` rows are kept so
    financial and audit history stays intact. The operation cannot be undone.

    Args:
        db: An open async database session. The caller owns the commit.
        user_id: Primary key of the user to anonymise.

    Returns:
        The scrubbed ``User`` instance (changes flushed, not committed).

    Raises:
        ValueError: If the user does not exist, or is the last active superuser
            (which must never be locked out).
    """
    user = await db.get(User, user_id)
    if user is None:
        raise ValueError(f"User {user_id!r} not found.")

    if user.is_superuser:
        result = await db.execute(
            select(func.count())
            .select_from(User)
            .where(User.is_superuser.is_(True), User.is_active.is_(True))
        )
        if result.scalar_one() <= 1:
            raise ValueError("Cannot anonymise the last active superuser.")

    # Scrub identifying fields. username/email are NOT NULL and unique, so they
    # are replaced with deterministic, non-personal values derived from the id.
    user.username = f"anon-{user.id}"
    user.email = f"{user.id}@anonymized.invalid"
    user.first_name = None
    user.last_name = None
    user.location = None
    user.company = None
    user.department = None
    user.external_subject = None  # breaks the OIDC identity link
    user.password_hash = None
    user.is_active = False

    # Overwrite conversation content the user authored. Row shape (role, seq) is
    # preserved; only personal content is replaced. Token usage is untouched.
    session_ids = list(
        (await db.execute(select(ChatSession.id).where(ChatSession.user_id == user_id))).scalars()
    )
    if session_ids:
        await db.execute(
            update(ChatMessage)
            .where(ChatMessage.chat_session_id.in_(session_ids))
            .values(content=_CONTENT_TOMBSTONE, attachments=None)
        )
        await db.execute(
            update(ChatSession)
            .where(ChatSession.id.in_(session_ids))
            .values(title=_TITLE_TOMBSTONE, manifest=None, manifest_captured_at=None)
        )

    await db.flush()
    return user
