"""Persistence and manifest helpers for the invocation event stream.

These functions persist data captured from agent stream events and parse the
session manifest. Each function opens its own short-lived database session,
commits immediately on success, and swallows errors so a database hiccup
never breaks an in-flight stream.
"""

import asyncio
import json
from collections.abc import AsyncGenerator
from contextlib import suppress
from datetime import UTC, datetime
from typing import Any

import structlog
from sqlalchemy import select, update
from strands_compose import EventType, StreamEvent

from ..analytics.service import compute_cost
from ..db.base import AsyncSessionLocal
from ..db.models import ChatSession, ModelPricing, TokenUsage
from ..db.models.chat_message import ChatMessage
from ..sessions.service import next_seq
from .client import AgentClient

logger: structlog.stdlib.BoundLogger = structlog.get_logger(__name__)

# Interval between SSE keep-alive pings
_HEARTBEAT_INTERVAL: float = 20.0

# SSE comment line — invisible to clients, keeps TCP alive through proxies.
_SSE_HEARTBEAT: bytes = b": ping\n\n"


def format_sse(event: StreamEvent) -> bytes:
    """Serialise a StreamEvent into an SSE ``event:``/``data:`` frame.

    Args:
        event: The stream event to serialise.

    Returns:
        The encoded SSE frame.
    """
    data_str = json.dumps(event.asdict(), ensure_ascii=False)
    if event.type:
        return f"event: {event.type}\ndata: {data_str}\n\n".encode("utf-8")
    return f"data: {data_str}\n\n".encode("utf-8")


def format_error(message: str) -> bytes:
    """Build an SSE ``error`` frame carrying *message*.

    Args:
        message: Human-readable error description.

    Returns:
        The encoded SSE error frame.
    """
    event = StreamEvent(type=EventType.ERROR, agent_name="", data={"text": message})
    return format_sse(event)


def resolve_model_from_manifest(
    manifest: dict[str, Any] | None,
    agent_name: str | None,
) -> tuple[str | None, str | None]:
    """Helper to resolve (model_id, provider) from the manifest for an agent."""
    if not manifest or not agent_name:
        return None, None

    agents = manifest.get("agents", [])
    for item in agents:
        if item.get("name") == agent_name:
            model_info = item.get("model", {})
            return model_info.get("model_id"), model_info.get("provider")

    return None, None


async def save_token_usage(
    chat_session_id: str,
    user_id: str,
    event: StreamEvent,
    manifest: dict[str, Any] | None,
) -> None:
    """Persist an ``agent_complete`` event's token usage. Logs and swallows errors.

    Args:
        chat_session_id: The owning chat session id.
        user_id: The invoking user id.
        event: The ``agent_complete`` stream event carrying usage data.
        manifest: The session manifest used to resolve model metadata.
    """
    usage = event.data.get("usage", {})
    input_tokens = usage.get("input_tokens", 0)
    output_tokens = usage.get("output_tokens", 0)

    if input_tokens == 0 and output_tokens == 0:
        return

    model_id, provider = resolve_model_from_manifest(manifest, event.agent_name)

    async with AsyncSessionLocal() as session:
        try:
            pricing_result = await session.execute(
                select(ModelPricing).where(
                    ModelPricing.model_id == model_id,
                    ModelPricing.provider == provider,
                )
            )
            pricing = pricing_result.scalar_one_or_none()
            if pricing:
                in_price = pricing.input_token_price
                out_price = pricing.output_token_price
            else:
                in_price = 0.0
                out_price = 0.0

            cost = round(
                compute_cost(in_price, out_price, input_tokens, output_tokens),
                6,
            )
            session.add(
                TokenUsage(
                    chat_session_id=chat_session_id,
                    user_id=user_id,
                    agent_name=event.agent_name,
                    model_id=model_id,
                    provider=provider,
                    input_tokens=input_tokens,
                    output_tokens=output_tokens,
                    cost=cost,
                    created_at=datetime.now(UTC),
                )
            )
            await session.commit()
        except Exception:  # noqa: BLE001
            await session.rollback()
            logger.warning(
                "failed to persist token usage; stream unaffected",
                chat_session_id=chat_session_id,
                agent_name=event.agent_name,
                exc_info=True,
            )


async def save_manifest(
    chat_session_id: str,
    event: StreamEvent,
) -> dict[str, Any] | None:
    """Persist a ``session_start`` manifest. Logs and swallows errors.

    Args:
        chat_session_id: The chat session to attach the manifest to.
        event: The ``session_start`` stream event carrying the manifest payload.

    Returns:
        The manifest dict when present, otherwise ``None``.
    """
    manifest = event.data.get("manifest")
    if not isinstance(manifest, dict):
        return None

    async with AsyncSessionLocal() as session:
        try:
            now = datetime.now(UTC)
            stmt = (
                update(ChatSession)
                .where(ChatSession.id == chat_session_id)
                .values(manifest=manifest, manifest_captured_at=now)
            )
            await session.execute(stmt)
            await session.commit()
        except Exception:  # noqa: BLE001
            await session.rollback()
            logger.warning(
                "failed to persist session manifest; stream unaffected",
                chat_session_id=chat_session_id,
                exc_info=True,
            )
    return manifest


async def save_user_message(
    chat_session_id: str,
    prompt: Any,
    attachments: list[dict[str, Any]] | None = None,
) -> None:
    """Persist the user message for a turn. Logs and swallows errors.

    Called once at the start of a turn, before the event loop begins.

    Args:
        chat_session_id: Primary key of the owning ``chat_sessions`` row.
        prompt: The raw prompt value passed to the invocation.
        attachments: Attachment metadata dicts extracted from the request file
            parts. Entries with a non-positive ``size`` are dropped; the column
            is left ``NULL`` when nothing remains.
    """
    # Parse prompt to string
    text: str = ""
    if isinstance(prompt, str):
        text = prompt
    if isinstance(prompt, dict):
        text = str(prompt.get("text", ""))
    if isinstance(prompt, list):
        text = "".join(
            str(block["text"]) for block in prompt if isinstance(block, dict) and "text" in block
        )

    if not text.strip():
        return

    kept = [a for a in (attachments or []) if a.get("size", 0) > 0]
    attachments_value = kept or None

    async with AsyncSessionLocal() as session:
        try:
            seq = await next_seq(session, chat_session_id)
            session.add(
                ChatMessage(
                    chat_session_id=chat_session_id,
                    role="user",
                    content=text,
                    seq=seq,
                    attachments=attachments_value,
                )
            )
            await session.commit()
        except Exception:  # noqa: BLE001
            await session.rollback()
            logger.warning(
                "failed to persist user message; stream unaffected",
                chat_session_id=chat_session_id,
                exc_info=True,
            )


async def save_assistant_message(
    chat_session_id: str,
    event: StreamEvent,
) -> None:
    """Persist the assistant message from the last ``agent_complete`` event.

    In multi-agent turns the top-level orchestrator fires ``agent_complete``
    last, so the last event's text is the user-facing final answer.
    Called on ``session_end`` after confirming no error occurred.

    Args:
        chat_session_id: Primary key of the owning ``chat_sessions`` row.
        event: The last ``agent_complete`` event carrying ``data["text"]``
            and ``agent_name``.
    """
    text: str = event.data.get("text", "")
    if not text:
        return

    async with AsyncSessionLocal() as session:
        try:
            seq = await next_seq(session, chat_session_id)
            session.add(
                ChatMessage(
                    chat_session_id=chat_session_id,
                    role="assistant",
                    content=text,
                    seq=seq,
                )
            )
            await session.commit()
        except Exception:  # noqa: BLE001
            await session.rollback()
            logger.warning(
                "failed to persist assistant message; stream unaffected",
                chat_session_id=chat_session_id,
                exc_info=True,
            )


async def save_assistant_error(
    chat_session_id: str,
    event: StreamEvent,
) -> None:
    """Persist a streaming error as an assistant message. Logs and swallows errors.

    Called on ``EventType.ERROR``. The row is ``role='assistant'`` with
    ``is_success=False`` so restored threads can render the failure as an error
    bubble. Best-effort: a database hiccup is logged and never breaks the stream.

    Args:
        chat_session_id: Primary key of the owning ``chat_sessions`` row.
        event: The ``error`` stream event carrying ``data['text']``.
    """
    data = event.data or {}
    text: str = data.get("text", "")
    if not text:
        return

    async with AsyncSessionLocal() as session:
        try:
            seq = await next_seq(session, chat_session_id)
            session.add(
                ChatMessage(
                    chat_session_id=chat_session_id,
                    role="assistant",
                    content=text,
                    seq=seq,
                    is_success=False,
                )
            )
            await session.commit()
        except Exception:  # noqa: BLE001
            await session.rollback()
            logger.warning(
                "failed to persist assistant error; stream unaffected",
                chat_session_id=chat_session_id,
                exc_info=True,
            )


def _normalise_error_text(event: StreamEvent) -> str:
    """Return the error text collapsed to single spaces for comparison."""
    data = event.data or {}
    return " ".join(str(data.get("text", "")).split())


def _is_duplicate_error(text: str, seen: list[str]) -> bool:
    """Return whether *text* repeats an error already emitted this turn.

    Agents often surface the same failure twice — once raw and once wrapped in
    a generic prefix (e.g. "Internal error during agent invocation: ..."). The
    wrapped form contains the raw form, so a two-way substring check treats them
    as the same error.

    Args:
        text: The normalised candidate error text.
        seen: Normalised error texts already emitted this turn.

    Returns:
        ``True`` when *text* duplicates a prior error, otherwise ``False``.
    """
    if not text:
        return False
    return any(text == prior or text in prior or prior in text for prior in seen)


async def stream_turn(
    client: AgentClient,
    prompt: Any,
    *,
    session_id: str,
    chat_session_id: str,
    user_id: str,
    attachments: list[dict[str, Any]] | None = None,
) -> AsyncGenerator[bytes, None]:
    """Invoke the agent and yield each event as an SSE frame.

    Persistence side-effects are best-effort: each helper opens its own
    short-lived database session and swallows errors so a database hiccup
    never interrupts the stream.

    Turn message persistence:
    - User message is saved once before the event loop begins.
    - On ``EventType.ERROR``, the error text is persisted as an assistant message
      with ``is_success=False`` and an ``error_occurred`` flag is set.
    - On ``EventType.SESSION_END``, the final assistant message is only persisted
      when ``not error_occurred``; this prevents a stale success message from being
      saved after an error has already been recorded.

    Args:
        client: The agent client to invoke.
        prompt: The raw prompt value forwarded to ``client.invoke``.
        session_id: The UI-generated session identifier sent to the agent.
        chat_session_id: Primary key of the owning ``chat_sessions`` row.
        user_id: The invoking user id, persisted with token usage.
        attachments: Attachment metadata dicts to persist with the user message.

    Yields:
        Encoded SSE frames, one per upstream stream event.
    """
    await save_user_message(chat_session_id, prompt, attachments)

    manifest_data: dict[str, Any] | None = None
    error_occurred = False
    seen_error_texts: list[str] = []

    events = client.invoke(prompt, session_id=session_id)
    aiter = events.__aiter__()
    # Pull the next upstream event with a *persistent* task. A heartbeat is
    # emitted whenever the pull hasn't completed within _HEARTBEAT_INTERVAL,
    # but the same in-flight pull is preserved across heartbeats. This is
    # deliberately NOT asyncio.wait_for: wait_for cancels the pull on timeout,
    # which propagates CancelledError into the upstream client generator, runs
    # its finally (closing the stream) and terminates it — so a slow/frozen
    # model would drop the whole stream after a single ping. asyncio.wait
    # returns on timeout without cancelling, keeping the upstream alive.
    pending: asyncio.Task[Any] | None = None
    try:
        while True:
            if pending is None:
                pending = asyncio.ensure_future(aiter.__anext__())
            done, _ = await asyncio.wait({pending}, timeout=_HEARTBEAT_INTERVAL)
            if not done:
                # Upstream still working (e.g. model generating). Send a
                # keep-alive and keep waiting on the same pull.
                yield _SSE_HEARTBEAT
                continue

            try:
                event = pending.result()
            except StopAsyncIteration:
                break
            finally:
                pending = None

            if event is None:
                continue

            logger.debug(
                "stream event",
                event_type=event.type,
                agent_name=event.agent_name,
            )

            if event.type == EventType.SESSION_START:
                manifest_data = await save_manifest(chat_session_id, event)
            elif event.type == EventType.AGENT_COMPLETE:
                await save_token_usage(chat_session_id, user_id, event, manifest_data)
            elif event.type == EventType.ERROR:
                error_text = _normalise_error_text(event)
                if _is_duplicate_error(error_text, seen_error_texts):
                    logger.debug(
                        "suppressing duplicate error event",
                        agent_name=event.agent_name,
                    )
                    continue
                seen_error_texts.append(error_text)
                error_occurred = True
                await save_assistant_error(chat_session_id, event)
            elif event.type == EventType.SESSION_END:
                if not error_occurred:
                    await save_assistant_message(chat_session_id, event)

            yield format_sse(event)
    finally:
        # Cancel any in-flight pull before closing the generator. Closing while
        # a __anext__ task is still pending raises "async generator is already
        # running" (e.g. client disconnects mid-stream during a heartbeat).
        if pending is not None:
            pending.cancel()
            with suppress(BaseException):
                await pending
        await events.aclose()
