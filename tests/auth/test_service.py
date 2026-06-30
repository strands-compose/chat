"""Service-layer tests for the auth slice: profile updates, anonymisation,
JIT provisioning, and the OIDC login-callback path.
"""

import pytest
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from strands_compose_chat.auth.jit import jit_provision
from strands_compose_chat.auth.service import anonymize_user, update_user_profile
from strands_compose_chat.db.models import ChatMessage, ChatSession, User
from strands_compose_chat.schemas.auth import MePatchIn
from tests.factories import make_chat_message, make_chat_session, make_user, persist
from tests.fakes.oidc import FakeOIDCProvider


async def test_profile_update_persists_all_supplied_fields(db: AsyncSession) -> None:
    """update_user_profile writes every non-None field and flushes to the session."""
    (user,) = await persist(db, make_user())

    patch = MePatchIn(
        first_name="Alice",
        last_name="Wonderland",
        location="London",
        company="Acme",
        department="Engineering",
    )
    returned = await update_user_profile(db, user, patch)

    assert returned.first_name == "Alice"
    assert returned.last_name == "Wonderland"
    assert returned.location == "London"
    assert returned.company == "Acme"
    assert returned.department == "Engineering"

    await db.refresh(user)
    assert user.first_name == "Alice"
    assert user.last_name == "Wonderland"
    assert user.location == "London"
    assert user.company == "Acme"
    assert user.department == "Engineering"


async def test_profile_update_partial_patch_leaves_unset_fields_unchanged(
    db: AsyncSession,
) -> None:
    """A partial patch only touches the supplied fields; other fields stay intact."""
    (user,) = await persist(
        db,
        make_user(first_name="Original", last_name="Name", company="OldCo"),
    )

    patch = MePatchIn(company="NewCo")
    await update_user_profile(db, user, patch)

    await db.refresh(user)
    assert user.company == "NewCo"
    assert user.first_name == "Original"
    assert user.last_name == "Name"


async def test_profile_update_none_fields_do_not_overwrite_existing_values(
    db: AsyncSession,
) -> None:
    """Fields explicitly set to None in the patch are treated as absent, not cleared."""
    (user,) = await persist(db, make_user(location="Paris"))

    patch = MePatchIn()
    await update_user_profile(db, user, patch)

    await db.refresh(user)
    assert user.location == "Paris"


async def test_anonymize_user_scrubs_pii_and_deactivates(db: AsyncSession) -> None:
    """anonymize_user replaces PII with tombstones and sets is_active=False."""
    (user,) = await persist(
        db,
        make_user(
            first_name="Bob",
            last_name="Smith",
            location="NYC",
            company="Corp",
            department="Sales",
        ),
    )
    user_id = user.id

    returned = await anonymize_user(db, user_id)

    assert returned.is_active is False
    assert returned.first_name is None
    assert returned.last_name is None
    assert returned.location is None
    assert returned.company is None
    assert returned.department is None
    assert returned.username == f"anon-{user_id}"
    assert returned.email == f"{user_id}@anonymized.invalid"
    assert returned.password_hash is None
    assert returned.external_subject is None

    fresh = await db.get(User, user_id)
    assert fresh is not None
    assert fresh.is_active is False
    assert fresh.username == f"anon-{user_id}"
    assert fresh.email == f"{user_id}@anonymized.invalid"
    assert fresh.first_name is None
    assert fresh.last_name is None


async def test_anonymize_user_overwrites_chat_message_content(db: AsyncSession) -> None:
    """anonymize_user tombstones the content of all chat messages authored by the user."""
    (user,) = await persist(db, make_user())
    (session,) = await persist(db, make_chat_session(user_id=user.id))
    (msg,) = await persist(
        db,
        make_chat_message(chat_session_id=session.id, content="My secret message", seq=1),
    )

    await anonymize_user(db, user.id)

    result = await db.execute(select(ChatMessage).where(ChatMessage.id == msg.id))
    fresh_msg = result.scalar_one()
    assert fresh_msg.content == "_Content removed for data protection._"
    assert fresh_msg.attachments is None


async def test_anonymize_user_tombstones_session_titles(db: AsyncSession) -> None:
    """anonymize_user replaces session titles and clears manifests."""
    (user,) = await persist(db, make_user())
    (chat_session,) = await persist(db, make_chat_session(user_id=user.id))

    await anonymize_user(db, user.id)

    result = await db.execute(select(ChatSession).where(ChatSession.id == chat_session.id))
    fresh_session = result.scalar_one()
    assert fresh_session.title == "Anonymized conversation"
    assert fresh_session.manifest is None
    assert fresh_session.manifest_captured_at is None


async def test_anonymize_user_raises_value_error_for_unknown_user(
    db: AsyncSession,
) -> None:
    """anonymize_user raises ValueError when the user does not exist."""
    with pytest.raises(ValueError):
        await anonymize_user(db, "nonexistent-id")


async def test_anonymize_user_raises_value_error_for_last_superuser(
    db: AsyncSession,
) -> None:
    """anonymize_user raises ValueError for the last active superuser."""
    (superuser,) = await persist(db, make_user(is_superuser=True))

    with pytest.raises(ValueError):
        await anonymize_user(db, superuser.id)


async def test_anonymize_user_allows_when_other_superuser_exists(
    db: AsyncSession,
) -> None:
    """anonymize_user succeeds when at least one other active superuser remains."""
    (su1,) = await persist(db, make_user(is_superuser=True))
    (su2,) = await persist(db, make_user(is_superuser=True))

    result = await anonymize_user(db, su1.id)
    assert result.is_active is False


async def test_jit_provision_creates_new_user_from_claims(db: AsyncSession) -> None:
    """jit_provision creates a new User row when no matching provider+sub exists."""
    fake = FakeOIDCProvider(
        provider_id="sso",
        username_claim="preferred_username",
        claims={
            "sub": "sso-sub-001",
            "preferred_username": "jituser",
            "email": "jituser@example.com",
        },
    )

    user = await jit_provision(
        db,
        claims=await fake.complete(request=None),  # type: ignore[arg-type]
        auth_provider_value=fake.auth_provider_value,
        username_claim=fake.username_claim,
    )

    assert user.id is not None
    assert user.username == "jituser"
    assert user.email == "jituser@example.com"
    assert user.auth_provider == "oidc:sso"
    assert user.external_subject == "sso-sub-001"
    assert user.is_active is True
    assert user.is_superuser is False

    result = await db.execute(select(User).where(User.id == user.id))
    persisted = result.scalar_one()
    assert persisted.username == "jituser"
    assert persisted.email == "jituser@example.com"
    assert persisted.auth_provider == "oidc:sso"
    assert persisted.external_subject == "sso-sub-001"


async def test_jit_provision_returns_existing_user_on_repeated_call(
    db: AsyncSession,
) -> None:
    """jit_provision returns the existing User without creating a duplicate row."""
    fake = FakeOIDCProvider(
        provider_id="sso",
        username_claim="preferred_username",
        claims={
            "sub": "sso-sub-002",
            "preferred_username": "existinguser",
            "email": "existinguser@example.com",
        },
    )
    claims = await fake.complete(request=None)  # type: ignore[arg-type]

    first = await jit_provision(
        db,
        claims=claims,
        auth_provider_value=fake.auth_provider_value,
        username_claim=fake.username_claim,
    )

    second = await jit_provision(
        db,
        claims=claims,
        auth_provider_value=fake.auth_provider_value,
        username_claim=fake.username_claim,
    )

    assert second.id == first.id

    result = await db.execute(
        select(User).where(
            User.auth_provider == "oidc:sso",
            User.external_subject == "sso-sub-002",
        )
    )
    rows = result.scalars().all()
    assert len(rows) == 1


async def test_jit_provision_syncs_changed_email(db: AsyncSession) -> None:
    """jit_provision updates the email when the provider returns a new address."""
    fake = FakeOIDCProvider(
        provider_id="sso",
        username_claim="preferred_username",
        claims={
            "sub": "sso-sub-email",
            "preferred_username": "emailuser",
            "email": "old@example.com",
        },
    )

    await jit_provision(
        db,
        claims=await fake.complete(request=None),  # type: ignore[arg-type]
        auth_provider_value=fake.auth_provider_value,
        username_claim=fake.username_claim,
    )

    updated_claims = {
        "sub": "sso-sub-email",
        "preferred_username": "emailuser",
        "email": "new@example.com",
    }
    updated_user = await jit_provision(
        db,
        claims=updated_claims,
        auth_provider_value=fake.auth_provider_value,
        username_claim=fake.username_claim,
    )

    assert updated_user.email == "new@example.com"

    result = await db.execute(select(User).where(User.id == updated_user.id))
    persisted = result.scalar_one()
    assert persisted.email == "new@example.com"


async def test_jit_provision_falls_back_to_sub_when_username_claim_absent(
    db: AsyncSession,
) -> None:
    """jit_provision uses sub as the username when the username_claim is missing."""
    claims = {
        "sub": "fallback-sub-003",
        "email": "fallback@example.com",
    }

    user = await jit_provision(
        db,
        claims=claims,
        auth_provider_value="oidc:sso",
        username_claim="preferred_username",
    )

    assert user.username == "fallback-sub-003"


async def test_jit_provision_deduplicates_colliding_usernames(
    db: AsyncSession,
) -> None:
    """jit_provision appends a suffix to resolve username collisions."""
    (existing,) = await persist(db, make_user(username="collision_user"))

    claims = {
        "sub": "collision-sub-unique",
        "preferred_username": "collision_user",
        "email": "collision@example.com",
    }

    new_user = await jit_provision(
        db,
        claims=claims,
        auth_provider_value="oidc:sso",
        username_claim="preferred_username",
    )

    assert new_user.username != existing.username
    assert new_user.username.startswith("collision_user-")


async def test_oidc_callback_provisions_user_via_fake_provider(
    db: AsyncSession,
) -> None:
    """The full callback path provisions a new user when driven with FakeOIDCProvider."""
    fake = FakeOIDCProvider(
        provider_id="myidp",
        username_claim="preferred_username",
        claims={
            "sub": "callback-sub-001",
            "preferred_username": "callbackuser",
            "email": "callbackuser@example.com",
        },
    )

    claims = await fake.complete(request=None)  # type: ignore[arg-type]
    user = await jit_provision(
        db,
        claims=claims,
        auth_provider_value=fake.auth_provider_value,
        username_claim=fake.username_claim,
    )

    assert user.is_active is True
    assert user.is_superuser is False
    assert user.username == "callbackuser"
    assert user.email == "callbackuser@example.com"
    assert user.auth_provider == "oidc:myidp"
    assert user.external_subject == "callback-sub-001"

    result = await db.execute(select(User).where(User.id == user.id))
    persisted = result.scalar_one()
    assert persisted.username == "callbackuser"
    assert persisted.auth_provider == "oidc:myidp"
    assert persisted.external_subject == "callback-sub-001"


async def test_oidc_callback_returns_same_user_on_second_login(
    db: AsyncSession,
) -> None:
    """Repeated OIDC logins for the same subject return the same user row."""
    fake = FakeOIDCProvider(
        provider_id="myidp",
        username_claim="preferred_username",
        claims={
            "sub": "callback-sub-002",
            "preferred_username": "repeatuser",
            "email": "repeatuser@example.com",
        },
    )
    claims = await fake.complete(request=None)  # type: ignore[arg-type]

    user_first = await jit_provision(
        db,
        claims=claims,
        auth_provider_value=fake.auth_provider_value,
        username_claim=fake.username_claim,
    )

    user_second = await jit_provision(
        db,
        claims=claims,
        auth_provider_value=fake.auth_provider_value,
        username_claim=fake.username_claim,
    )

    assert user_second.id == user_first.id
