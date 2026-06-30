"""POST /api/v1/invocations — parse request, stream agent events back as SSE."""

import asyncio
from contextlib import aclosing
from uuid import uuid4

import structlog
from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse
from strands_compose_agentcore import (
    AgentCoreClient,
    AgentCoreClientError,
    AsyncLocalClient,
    ClientConnectionError,
)

from ..analytics.service import get_monthly_spend
from ..auth.current_user import ApiKeyOrSessionUser
from ..deps import DbSession
from ..errors import ProblemDetailsException
from ..sessions.service import lock_or_create, touch_last_used
from .client import build_client
from .payload import parse_request
from .service import get_visible, load_user_groups
from .streaming import (
    format_error,
    stream_turn,
)

logger: structlog.stdlib.BoundLogger = structlog.get_logger(__name__)


# Strong references to detached stop tasks so they are not garbage-collected
# before they finish. Discarded automatically on completion.
_stop_tasks: set[asyncio.Task[None]] = set()

router = APIRouter(tags=["invocations"])


@router.post("/invocations")
async def invoke(
    request: Request,
    current_user: ApiKeyOrSessionUser,
    db: DbSession,
) -> StreamingResponse:
    """Forward an agent invocation and stream events back as SSE."""
    body, prompt, attachments = await parse_request(request)

    # Mint the session id when the client omits it (new conversation). The id is
    # returned to the client on the session_start event so it can be reused for
    # follow-up turns and shown in the sidebar. Generating it server-side avoids
    # depending on crypto.randomUUID, which is unavailable in non-secure (HTTP)
    # browser contexts.
    session_id: str = body.session_id or str(uuid4())

    # Calculate monthly spend and compare to user's budget
    current_spend = await get_monthly_spend(db, current_user.id)
    if current_spend >= current_user.budget:
        logger.warning(
            "Budget exceeded",
            user_id=current_user.id,
            usage=current_spend,
            budget=current_user.budget,
        )
        raise ProblemDetailsException(
            status_code=402,
            detail="Budget exceeded. Please contact your administrator.",
        )

    logger.debug(
        "invocation received",
        user_id=current_user.id,
        agent_id=body.agent_id,
        session_id=session_id,
    )

    chat_session, _ = await lock_or_create(db, current_user.id, session_id, body.agent_id, prompt)
    user_groups = await load_user_groups(db, current_user.id)
    agent = await get_visible(db, chat_session.agent_id, user_groups)
    if agent is None:
        raise ProblemDetailsException(404, f"Agent {chat_session.agent_id!r} not available.")

    logger.debug(
        "agent resolved, starting stream",
        agent_id=agent.id,
        agent_name=agent.name,
        agent_kind=agent.agent_kind,
        chat_session_id=chat_session.id,
    )

    await touch_last_used(db, session_id)

    # Capture plain scalars before committing so the generator closes over
    # primitives only and never touches the request session during the run.
    chat_session_id: str = chat_session.id
    user_id: str = current_user.id

    # Commit now — makes the session row + last_used_at durable and releases
    # the shared DB connection back to the pool before the stream begins.
    await db.commit()

    client = build_client(agent)

    async def event_stream():
        stream_finished = False
        try:
            # ``aclosing`` guarantees the nested stream generators are closed on disconnect.
            # Without it the inner generators are only finalized later by the GC hook,
            # leaving the upstream connection open and the agent running.
            sse_stream = stream_turn(
                client,
                prompt,
                session_id=session_id,
                chat_session_id=chat_session_id,
                user_id=user_id,
                attachments=attachments,
            )
            async with aclosing(sse_stream):
                async for sse in sse_stream:
                    yield sse

            stream_finished = True

        except (AgentCoreClientError, ClientConnectionError):
            stream_finished = True
            logger.warning(
                "upstream agent error",
                exc_info=True,
            )
            yield format_error("The agent service is currently unavailable. Please try again.")
        except Exception:
            stream_finished = True
            logger.error(
                "unexpected error during agent stream",
                exc_info=True,
            )
            yield format_error("An internal error occurred. Please try again later.")
        finally:
            if isinstance(client, AsyncLocalClient):
                try:
                    await client.aclose()
                except Exception:  # noqa: BLE001
                    logger.warning("client close failed", exc_info=True)
            elif stream_finished:
                # AgentCoreClient — stream ended normally, just close.
                try:
                    await asyncio.to_thread(client.close)
                except Exception:  # noqa: BLE001
                    logger.warning("client close failed", exc_info=True)
            else:
                # AgentCoreClient — client disconnected mid-stream; stop the
                # remote session before closing so the runtime doesn't keep running.
                logger.info(
                    "stream interrupted by client disconnect",
                    session_id=session_id,
                )
                task = asyncio.ensure_future(_stop_and_close_agentcore(client, session_id))
                _stop_tasks.add(task)
                task.add_done_callback(_stop_tasks.discard)

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


async def _stop_and_close_agentcore(
    client: AgentCoreClient,
    session_id: str,
) -> None:
    """Signal the AgentCore runtime to stop the session, then close the client.

    Args:
        client: The ``AgentCoreClient`` whose session should be stopped.
        session_id: The session identifier to stop.
    """
    try:
        result = await client.stop_session(session_id)
        logger.info(
            "agentcore session stopped",
            session_id=session_id,
            status_code=result.status_code,
        )
    except Exception:  # noqa: BLE001
        logger.warning(
            "failed to stop agentcore session",
            session_id=session_id,
            exc_info=True,
        )
    finally:
        try:
            await asyncio.to_thread(client.close)
        except Exception:  # noqa: BLE001
            logger.warning("client close failed", exc_info=True)
