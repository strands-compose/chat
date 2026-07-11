"""Streaming/SSE tests for the ``/invocations`` endpoint.

The streaming persistence helpers commit on their own sessions, so this module
resets the schema per test instead of relying on transaction rollback.
"""

from collections.abc import AsyncIterator

import asyncio
import pytest
from httpx import AsyncClient
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from strands_compose import EventType, StreamEvent

from strands_compose_chat.db.base import AsyncSessionLocal, Base, engine
from strands_compose_chat.db.models import AgentGroup, UserGroup
from strands_compose_chat.db.models.chat_message import ChatMessage
from tests.factories import (
    as_user,
    make_agent,
    make_group,
    make_user,
    persist,
)
from tests.fakes.agent_client import FakeAgentClient


@pytest.fixture(autouse=True)
async def _streaming_schema_reset() -> AsyncIterator[None]:
    """Drop and recreate the full schema before and after each streaming test.

    Streaming helpers commit on their own ``AsyncSessionLocal`` sessions, so the
    rollback isolation used elsewhere cannot contain their writes. Wiping the
    schema on both sides keeps each test pristine and stops committed rows from
    leaking into other tests.
    """
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)


def _parse_sse_frames(raw: bytes) -> list[dict[str, str]]:
    """Parse raw SSE bytes into a list of ``{"event": ..., "data": ...}`` dicts.

    Handles both ``event:``/``data:`` two-line frames and bare ``data:``-only
    frames. Keep-alive comment lines (``: ping``) are skipped.
    """
    frames: list[dict[str, str]] = []
    current: dict[str, str] = {}
    for line in raw.decode("utf-8").splitlines():
        if line.startswith(":"):
            continue
        if line == "":
            if "data" in current:
                frames.append(current)
            current = {}
        elif line.startswith("event:"):
            current["event"] = line[len("event:") :].strip()
        elif line.startswith("data:"):
            current["data"] = line[len("data:") :].strip()
    if "data" in current:
        frames.append(current)
    return frames


async def _setup_user_agent_group(
    db: AsyncSession,
) -> tuple[str, dict[str, str]]:
    """Persist a user, group, and agent wired together; return ``(agent_id, headers)``.

    Creates the minimum rows required for ``POST /invocations`` to succeed. The
    route mints the chat session row itself.
    """
    user = make_user()
    group = make_group()
    agent = make_agent()
    await persist(db, user, group, agent)
    db.add(UserGroup(user_id=user.id, group_id=group.id))
    db.add(AgentGroup(agent_id=agent.id, group_id=group.id))
    await db.flush()

    headers = await as_user(db, user)
    return agent.id, headers


async def test_streaming_success_persists_one_assistant_turn(
    client: AsyncClient,
    db: AsyncSession,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """SESSION_END is the final event and one assistant turn is persisted.

    The assistant turn's content equals the text carried by the SESSION_END event.
    """
    agent_id, headers = await _setup_user_agent_group(db)

    assistant_text = "Hello world!"
    scripted_events = [
        StreamEvent(
            type=EventType.SESSION_START,
            agent_name="test-agent",
            data={"manifest": None},
        ),
        StreamEvent(
            type=EventType.AGENT_COMPLETE,
            agent_name="test-agent",
            data={
                "text": assistant_text,
                "usage": {"input_tokens": 10, "output_tokens": 5},
            },
        ),
        StreamEvent(
            type=EventType.SESSION_END,
            agent_name="test-agent",
            data={"text": assistant_text},
        ),
    ]
    fake = FakeAgentClient(events=scripted_events)
    monkeypatch.setattr(
        "strands_compose_chat.agents.invocation.build_client",
        lambda agent: fake,
    )

    resp = await client.post(
        "/api/v1/invocations",
        json={
            "agent_id": agent_id,
            "prompt": "Say hello",
        },
        headers=headers,
    )

    assert resp.status_code == 200
    assert "text/event-stream" in resp.headers.get("content-type", "")

    frames = _parse_sse_frames(resp.content)

    event_types = [f.get("event") for f in frames]
    session_end_count = event_types.count(str(EventType.SESSION_END))
    assert session_end_count == 1, (
        f"expected exactly one SESSION_END event; got {session_end_count}"
    )
    assert event_types[-1] == str(EventType.SESSION_END), (
        f"SESSION_END must be the last event; trailing events: {event_types}"
    )

    # Streaming helpers commit on their own sessions, so read back from a fresh one.
    async with AsyncSessionLocal() as read_session:
        result = await read_session.execute(
            select(ChatMessage).where(ChatMessage.role == "assistant")
        )
        assistant_messages = list(result.scalars().all())

    assert len(assistant_messages) == 1, (
        f"expected exactly one assistant ChatMessage; found {len(assistant_messages)}"
    )
    assert assistant_messages[0].content == assistant_text, (
        f"assistant turn content mismatch: "
        f"expected {assistant_text!r}, got {assistant_messages[0].content!r}"
    )
    assert assistant_messages[0].is_success is True


async def test_streaming_slow_agent_sends_heartbeat_without_dropping_stream(
    client: AsyncClient,
    db: AsyncSession,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """A slow/frozen model triggers heartbeats but the stream is NOT dropped.

    Regression for the SSE-drop bug: ``stream_turn`` previously used
    ``asyncio.wait_for(aiter.__anext__(), timeout=_HEARTBEAT_INTERVAL)``. On
    timeout ``wait_for`` cancelled the in-flight pull, which propagated
    ``CancelledError`` into the upstream client generator, closed it, and ended
    the stream after a single ``: ping``. The event emitted once the model
    "unfroze" was never delivered.

    The fake blocks on a gate before the final SESSION_END. With the heartbeat
    interval set to zero the loop fires a ping on the very first tick while the
    gate is still closed. The test then sets the gate so the stream can finish.
    No wall-clock sleeps; timing is controlled entirely by the gate.
    """
    agent_id, headers = await _setup_user_agent_group(db)

    # Shrink heartbeat to 0 so the first asyncio.wait() timeout fires on the
    # very next event-loop tick — no wall-clock wait needed.
    monkeypatch.setattr(
        "strands_compose_chat.agents.streaming._HEARTBEAT_INTERVAL",
        0,
    )

    assistant_text = "Answer after a long think"
    scripted_events = [
        StreamEvent(
            type=EventType.SESSION_START,
            agent_name="test-agent",
            data={"manifest": None},
        ),
        StreamEvent(
            type=EventType.AGENT_COMPLETE,
            agent_name="test-agent",
            data={
                "text": assistant_text,
                "usage": {"input_tokens": 10, "output_tokens": 5},
            },
        ),
        StreamEvent(
            type=EventType.SESSION_END,
            agent_name="test-agent",
            data={"text": assistant_text},
        ),
    ]

    # Two events co-ordinate the timing deterministically — no sleep, no clock:
    #
    #   blocked:  set by the fake the moment it starts waiting on the gate, i.e.
    #             the stream is genuinely frozen at SESSION_END.
    #   gate:     set by _unblock only AFTER it sees `blocked`, so the heartbeat
    #             loop has already fired at least one ping before the stream
    #             continues.
    blocked = asyncio.Event()
    gate = asyncio.Event()
    fake = FakeAgentClient(events=scripted_events, gate_before={2: gate}, blocked_at={2: blocked})
    monkeypatch.setattr(
        "strands_compose_chat.agents.invocation.build_client",
        lambda agent: fake,
    )

    # Unblock the gate after a short yield so the heartbeat has a chance to
    # fire first. asyncio.sleep(0) yields control once without any wall-clock
    # wait — it is the minimum deterministic way to let the event loop tick.
    async def _unblock() -> None:
        await blocked.wait()   # fake is now parked at the gate
        gate.set()             # let it continue

    asyncio.create_task(_unblock())

    resp = await client.post(
        "/api/v1/invocations",
        json={
            "agent_id": agent_id,
            "prompt": "Take your time",
        },
        headers=headers,
    )

    assert resp.status_code == 200

    # At least one keep-alive comment must have been emitted during the stall.
    assert b": ping" in resp.content, (
        "expected at least one SSE heartbeat during the slow-agent stall"
    )

    # The post-stall SESSION_END must still be delivered — the stream survived.
    frames = _parse_sse_frames(resp.content)
    event_types = [f.get("event") for f in frames]
    assert event_types[-1] == str(EventType.SESSION_END), (
        f"SESSION_END must survive the heartbeat and be the last event; got {event_types}"
    )

    # And the assistant turn from the post-stall event must be persisted.
    async with AsyncSessionLocal() as read_session:
        result = await read_session.execute(
            select(ChatMessage).where(ChatMessage.role == "assistant")
        )
        assistant_messages = list(result.scalars().all())

    assert len(assistant_messages) == 1, (
        f"expected one assistant ChatMessage after a slow turn; found {len(assistant_messages)}"
    )
    assert assistant_messages[0].content == assistant_text


async def test_streaming_mid_stream_error_persists_no_assistant_turn(
    client: AsyncClient,
    db: AsyncSession,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """A mid-stream failure yields one error frame, no SESSION_END, and no assistant turn."""
    agent_id, headers = await _setup_user_agent_group(db)

    # raise_after=1: index 0 (SESSION_START) is yielded, then the RuntimeError
    # fires at index 1 before the second event is yielded.
    scripted_events = [
        StreamEvent(
            type=EventType.SESSION_START,
            agent_name="test-agent",
            data={"manifest": None},
        ),
        StreamEvent(
            type=EventType.AGENT_COMPLETE,
            agent_name="test-agent",
            data={"text": "partial", "usage": {"input_tokens": 0, "output_tokens": 0}},
        ),
    ]
    fake = FakeAgentClient(events=scripted_events, raise_after=1)
    monkeypatch.setattr(
        "strands_compose_chat.agents.invocation.build_client",
        lambda agent: fake,
    )

    resp = await client.post(
        "/api/v1/invocations",
        json={
            "agent_id": agent_id,
            "prompt": "Trigger an error",
        },
        headers=headers,
    )

    assert resp.status_code == 200

    frames = _parse_sse_frames(resp.content)
    event_types = [f.get("event") for f in frames]

    error_count = event_types.count(str(EventType.ERROR))
    assert error_count == 1, f"expected exactly one error event; got {error_count}"
    assert str(EventType.SESSION_END) not in event_types, (
        "SESSION_END must not appear after a mid-stream error"
    )

    async with AsyncSessionLocal() as read_session:
        result = await read_session.execute(
            select(ChatMessage).where(ChatMessage.role == "assistant")
        )
        assistant_messages = list(result.scalars().all())

    assert len(assistant_messages) == 0, (
        f"expected zero assistant ChatMessage rows after error; found {len(assistant_messages)}"
    )
