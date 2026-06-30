"""Service-layer tests for ``sessions.service``: CRUD round-trips,
``lock_or_create``, archive visibility, ``next_seq`` monotonicity, and
pagination bounds.
"""

import pytest
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from strands_compose_chat.db.models import ChatSession
from strands_compose_chat.errors import ProblemDetailsException
from strands_compose_chat.sessions.service import (
    archive_user_session,
    get_user_session,
    list_session_messages,
    list_user_sessions,
    lock_or_create,
    next_seq,
    rename_user_session,
)
from tests.factories import (
    make_agent,
    make_chat_message,
    make_chat_session,
    make_user,
    persist,
)


async def _seed_user_agent(db: AsyncSession):
    """Persist a user + agent and return them."""
    user = make_user()
    agent = make_agent()
    await persist(db, user, agent)
    return user, agent


async def test_get_user_session_returns_persisted_session(db: AsyncSession) -> None:
    """Persisting a ChatSession and reading it back via get_user_session yields the same row."""
    user, agent = await _seed_user_agent(db)
    session = make_chat_session(user_id=user.id, agent_id=agent.id)
    await persist(db, session)

    fetched = await get_user_session(db, user_id=user.id, session_id=session.session_id)

    assert fetched is not None
    assert fetched.id == session.id
    assert fetched.session_id == session.session_id
    assert fetched.user_id == user.id
    assert fetched.agent_id == agent.id
    assert fetched.is_archived is False


async def test_get_user_session_returns_none_for_unknown_session(db: AsyncSession) -> None:
    """get_user_session returns None when the session does not exist."""
    user, _ = await _seed_user_agent(db)

    fetched = await get_user_session(db, user_id=user.id, session_id="sess_" + "x" * 59)

    assert fetched is None


async def test_rename_user_session_persists_new_title(db: AsyncSession) -> None:
    """rename_user_session updates the title field and the re-read row reflects it."""
    user, agent = await _seed_user_agent(db)
    session = make_chat_session(user_id=user.id, agent_id=agent.id, title="old title")
    await persist(db, session)

    result = await rename_user_session(
        db, user_id=user.id, session_id=session.session_id, title="new title"
    )

    assert result is not None
    fetched = await get_user_session(db, user_id=user.id, session_id=session.session_id)
    assert fetched is not None
    assert fetched.title == "new title"


async def test_rename_user_session_returns_none_for_missing_session(db: AsyncSession) -> None:
    """rename_user_session returns None when the session does not exist."""
    user, _ = await _seed_user_agent(db)

    result = await rename_user_session(
        db, user_id=user.id, session_id="sess_" + "z" * 59, title="x"
    )

    assert result is None


async def test_lock_or_create_creates_new_session(db: AsyncSession) -> None:
    """lock_or_create inserts a new session row when no row with that session_id exists."""
    user, agent = await _seed_user_agent(db)
    new_session_id = "sess_" + "a" * 59

    chat_session, is_new = await lock_or_create(
        db,
        user_id=user.id,
        session_id=new_session_id,
        agent_id=agent.id,
        prompt="Hello world",
    )

    assert is_new is True
    assert chat_session.session_id == new_session_id
    assert chat_session.user_id == user.id
    assert chat_session.agent_id == agent.id
    row = await db.execute(select(ChatSession).where(ChatSession.session_id == new_session_id))
    assert row.scalar_one_or_none() is not None


async def test_lock_or_create_resumes_existing_session(db: AsyncSession) -> None:
    """lock_or_create returns the existing session with is_new=False when the session already exists."""
    user, agent = await _seed_user_agent(db)
    session = make_chat_session(user_id=user.id, agent_id=agent.id)
    await persist(db, session)

    returned, is_new = await lock_or_create(
        db,
        user_id=user.id,
        session_id=session.session_id,
        agent_id=agent.id,
    )

    assert is_new is False
    assert returned.id == session.id


async def test_lock_or_create_derives_title_from_prompt(db: AsyncSession) -> None:
    """lock_or_create sets the session title from the first 64 characters of the prompt."""
    user, agent = await _seed_user_agent(db)
    new_session_id = "sess_" + "b" * 59
    prompt = "Tell me about the weather today"

    chat_session, _ = await lock_or_create(
        db,
        user_id=user.id,
        session_id=new_session_id,
        agent_id=agent.id,
        prompt=prompt,
    )

    assert chat_session.title == prompt


async def test_lock_or_create_raises_409_for_cross_user_conflict(db: AsyncSession) -> None:
    """lock_or_create raises ProblemDetailsException(409) when the session belongs to another user."""
    user1, agent = await _seed_user_agent(db)
    user2 = make_user()
    await persist(db, user2)
    session = make_chat_session(user_id=user1.id, agent_id=agent.id)
    await persist(db, session)

    with pytest.raises(ProblemDetailsException) as exc_info:
        await lock_or_create(db, user_id=user2.id, session_id=session.session_id, agent_id=agent.id)

    assert exc_info.value.status_code == 409


async def test_lock_or_create_raises_409_for_agent_lock_conflict(db: AsyncSession) -> None:
    """lock_or_create raises ProblemDetailsException(409) when a different agent_id is supplied for an existing session."""
    user, agent = await _seed_user_agent(db)
    agent2 = make_agent()
    await persist(db, agent2)
    session = make_chat_session(user_id=user.id, agent_id=agent.id)
    await persist(db, session)

    with pytest.raises(ProblemDetailsException) as exc_info:
        await lock_or_create(db, user_id=user.id, session_id=session.session_id, agent_id=agent2.id)

    assert exc_info.value.status_code == 409


async def test_lock_or_create_raises_422_for_new_session_without_agent_id(db: AsyncSession) -> None:
    """lock_or_create raises ProblemDetailsException(422) when agent_id is None for a brand-new session."""
    user, _ = await _seed_user_agent(db)
    new_session_id = "sess_" + "c" * 59

    with pytest.raises(ProblemDetailsException) as exc_info:
        await lock_or_create(db, user_id=user.id, session_id=new_session_id, agent_id=None)

    assert exc_info.value.status_code == 422


async def test_archiving_session_hides_it_from_default_listing(db: AsyncSession) -> None:
    """Archiving a session removes it from the default (non-archived) listing."""
    user, agent = await _seed_user_agent(db)
    session = make_chat_session(user_id=user.id, agent_id=agent.id)
    await persist(db, session)

    await archive_user_session(db, user_id=user.id, session_id=session.session_id)

    visible = await list_user_sessions(db, user_id=user.id)
    assert session.id not in {s.id for s in visible}


async def test_archived_session_flag_is_persisted(db: AsyncSession) -> None:
    """After archiving, re-reading the row shows is_archived=True."""
    user, agent = await _seed_user_agent(db)
    session = make_chat_session(user_id=user.id, agent_id=agent.id)
    await persist(db, session)

    result = await archive_user_session(db, user_id=user.id, session_id=session.session_id)

    assert result is True
    row = await db.execute(select(ChatSession).where(ChatSession.id == session.id))
    fetched = row.scalar_one()
    assert fetched.is_archived is True


async def test_archived_session_is_excluded_from_get_user_session(db: AsyncSession) -> None:
    """get_user_session returns None for an archived session (it is treated as absent)."""
    user, agent = await _seed_user_agent(db)
    session = make_chat_session(user_id=user.id, agent_id=agent.id)
    await persist(db, session)
    await archive_user_session(db, user_id=user.id, session_id=session.session_id)

    fetched = await get_user_session(db, user_id=user.id, session_id=session.session_id)

    assert fetched is None


async def test_non_archived_sessions_remain_after_archiving_another(db: AsyncSession) -> None:
    """Archiving one session does not affect other non-archived sessions in the listing."""
    user, agent = await _seed_user_agent(db)
    session_a = make_chat_session(user_id=user.id, agent_id=agent.id)
    session_b = make_chat_session(user_id=user.id, agent_id=agent.id)
    await persist(db, session_a, session_b)

    await archive_user_session(db, user_id=user.id, session_id=session_a.session_id)

    visible = await list_user_sessions(db, user_id=user.id)
    ids = {s.id for s in visible}
    assert session_a.id not in ids
    assert session_b.id in ids


async def test_next_seq_returns_one_when_no_messages_exist(db: AsyncSession) -> None:
    """next_seq returns 1 when there are no messages yet in the session."""
    user, agent = await _seed_user_agent(db)
    session = make_chat_session(user_id=user.id, agent_id=agent.id)
    await persist(db, session)

    seq = await next_seq(db, chat_session_id=session.id)

    assert seq == 1


async def test_next_seq_is_strictly_greater_than_previous_seq(db: AsyncSession) -> None:
    """Each new seq is strictly greater than the immediately preceding seq."""
    user, agent = await _seed_user_agent(db)
    session = make_chat_session(user_id=user.id, agent_id=agent.id)
    await persist(db, session)

    seq1 = await next_seq(db, chat_session_id=session.id)
    msg1 = make_chat_message(chat_session_id=session.id, seq=seq1, role="user")
    await persist(db, msg1)

    seq2 = await next_seq(db, chat_session_id=session.id)
    msg2 = make_chat_message(chat_session_id=session.id, seq=seq2, role="assistant")
    await persist(db, msg2)

    seq3 = await next_seq(db, chat_session_id=session.id)
    msg3 = make_chat_message(chat_session_id=session.id, seq=seq3, role="user")
    await persist(db, msg3)

    assert seq1 >= 1
    assert seq2 > seq1
    assert seq3 > seq2


async def test_next_seq_increments_from_existing_max(db: AsyncSession) -> None:
    """next_seq returns max(seq)+1 when messages already exist with arbitrary seq values."""
    user, agent = await _seed_user_agent(db)
    session = make_chat_session(user_id=user.id, agent_id=agent.id)
    await persist(db, session)
    existing = make_chat_message(chat_session_id=session.id, seq=5)
    await persist(db, existing)

    seq = await next_seq(db, chat_session_id=session.id)

    assert seq == 6


async def test_list_session_messages_returns_messages_in_seq_order(db: AsyncSession) -> None:
    """list_session_messages returns messages ordered by seq ascending."""
    user, agent = await _seed_user_agent(db)
    session = make_chat_session(user_id=user.id, agent_id=agent.id)
    await persist(db, session)

    msg_seq3 = make_chat_message(chat_session_id=session.id, seq=3, role="user")
    msg_seq1 = make_chat_message(chat_session_id=session.id, seq=1, role="user")
    msg_seq2 = make_chat_message(chat_session_id=session.id, seq=2, role="assistant")
    await persist(db, msg_seq3, msg_seq1, msg_seq2)

    messages = await list_session_messages(db, chat_session_id=session.id)

    assert len(messages) == 3
    seqs = [m.seq for m in messages]
    assert seqs == sorted(seqs)
    assert seqs[0] < seqs[1] < seqs[2]


async def test_list_user_sessions_respects_limit(db: AsyncSession) -> None:
    """list_user_sessions returns at most `limit` sessions."""
    user, agent = await _seed_user_agent(db)
    sessions = [make_chat_session(user_id=user.id, agent_id=agent.id) for _ in range(5)]
    await persist(db, *sessions)

    result = await list_user_sessions(db, user_id=user.id, limit=3, offset=0)

    assert len(result) <= 3


async def test_list_user_sessions_offset_skips_rows(db: AsyncSession) -> None:
    """list_user_sessions with offset returns a different page of results."""
    user, agent = await _seed_user_agent(db)
    sessions = [make_chat_session(user_id=user.id, agent_id=agent.id) for _ in range(4)]
    await persist(db, *sessions)

    page1 = await list_user_sessions(db, user_id=user.id, limit=2, offset=0)
    page2 = await list_user_sessions(db, user_id=user.id, limit=2, offset=2)

    page1_ids = {s.id for s in page1}
    page2_ids = {s.id for s in page2}
    assert page1_ids.isdisjoint(page2_ids)


async def test_list_user_sessions_limit_with_fewer_rows_than_limit(db: AsyncSession) -> None:
    """list_user_sessions never returns more items than exist, even when limit > row count."""
    user, agent = await _seed_user_agent(db)
    sessions = [make_chat_session(user_id=user.id, agent_id=agent.id) for _ in range(2)]
    await persist(db, *sessions)

    result = await list_user_sessions(db, user_id=user.id, limit=100, offset=0)

    assert len(result) <= 100
    assert len(result) == 2


async def test_list_user_sessions_offset_beyond_total_returns_empty(db: AsyncSession) -> None:
    """list_user_sessions returns an empty list when offset exceeds the total row count."""
    user, agent = await _seed_user_agent(db)
    sessions = [make_chat_session(user_id=user.id, agent_id=agent.id) for _ in range(3)]
    await persist(db, *sessions)

    result = await list_user_sessions(db, user_id=user.id, limit=10, offset=100)

    assert result == []
