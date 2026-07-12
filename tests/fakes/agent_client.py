"""Fake agent client standing in for the object returned by ``agents.client.build_client``.

Lets streaming tests drive ``agents.streaming.stream_turn`` (and the
``/invocations`` route) without a real agent runtime.

Inject via::

    monkeypatch.setattr(
        "strands_compose_chat.agents.invocation.build_client",
        lambda agent: fake,
    )
"""

import asyncio
from collections.abc import AsyncIterator
from typing import Any

from strands_compose import StreamEvent


class FakeAgentClient:
    """Implements the ``build_client()`` client contract, yielding scripted events.

    Covers both client surfaces the production code uses:

    - ``AsyncLocalClient``: ``invoke``, ``aclose``
    - ``AgentCoreClient``: ``invoke``, ``close``, ``stop_session``

    Args:
        events: Ordered sequence of :class:`~strands_compose.StreamEvent` objects
            to yield from ``invoke``.
        raise_after: When given, raise a ``RuntimeError`` after emitting this
            many events (0-indexed). Useful for error-path streaming tests.
        gate_before: When given, block on the provided ``asyncio.Event`` before
            yielding the event at this index, simulating a frozen model.  The
            test sets the event to unblock the stream.  Using a gate instead of
            a sleep keeps the test deterministic and clock-free.
        blocked_at: Optional companion to ``gate_before``. Maps the same event
            indices to a second ``asyncio.Event`` that is **set** by the fake
            immediately before it starts waiting on the gate. This lets a
            releasing task know the fake is genuinely blocked (and at least one
            heartbeat has fired) before it opens the gate.
    """

    def __init__(
        self,
        events: list[StreamEvent],
        *,
        raise_after: int | None = None,
        gate_before: dict[int, asyncio.Event] | None = None,
        blocked_at: dict[int, asyncio.Event] | None = None,
    ) -> None:
        self._events = list(events)
        self._raise_after = raise_after
        self._gate_before = gate_before or {}
        self._blocked_at = blocked_at or {}

        # Recorded so tests can inspect teardown behaviour.
        self.aclose_called: bool = False
        self.close_called: bool = False
        self.stop_session_calls: list[str] = []

    async def invoke(self, prompt: Any, *, session_id: str) -> AsyncIterator[StreamEvent]:  # type: ignore[override]
        """Yield the scripted events, honouring gates and ``raise_after``."""
        for i, event in enumerate(self._events):
            if self._raise_after is not None and i >= self._raise_after:
                raise RuntimeError(
                    f"FakeAgentClient: raise_after={self._raise_after} reached at event index {i}"
                )
            if i in self._gate_before:
                if i in self._blocked_at:
                    self._blocked_at[i].set()  # signal: "I am now blocked on the gate"
                await self._gate_before[i].wait()
            yield event

    async def aclose(self) -> None:
        """Mark the client as closed (``AsyncLocalClient`` surface)."""
        self.aclose_called = True

    def close(self) -> None:
        """Mark the client as closed (``AgentCoreClient`` surface)."""
        self.close_called = True

    async def stop_session(self, session_id: str) -> None:
        """Record a stop-session call (``AgentCoreClient`` surface)."""
        self.stop_session_calls.append(session_id)
