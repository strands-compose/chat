"""Build the agent client for an Agent row, reusing AgentCore clients per runtime.

An ``AgentCoreClient`` costs about 150 ms of CPU and 10 MB to build and streams
many invocations at once, so one is kept per runtime (ARN + region) for the
life of the process. Each replica holds its own cache of connections only — no
data that could go stale — so horizontal scaling needs no invalidation. Local
agents keep a fresh ``AsyncLocalClient`` per invocation.
"""

import asyncio

import httpx
from strands_compose_agentcore import AgentCoreClient, AsyncLocalClient

from ..db.models import Agent

AgentClient = AgentCoreClient | AsyncLocalClient


class AgentClientCache:
    def __init__(self) -> None:
        """Process-wide cache of ``AgentCoreClient`` objects, keyed by runtime ARN and region.

        Create one per app and close it at shutdown with :meth:`aclose`.
        """
        self._runtime_clients: dict[tuple[str | None, str | None], AgentClient] = {}

    def get(self, agent: Agent) -> AgentClient:
        """Return the client for *agent*.

        ``agentcore_runtime`` agents share one cached client per runtime; it is
        built on first use and must not be closed by the caller. ``local``
        agents get a new client that the caller closes when the stream ends.

        Args:
            agent: The agent registry row to invoke.

        Returns:
            The cached ``AgentCoreClient`` or a new ``AsyncLocalClient``.

        Raises:
            ValueError: When required fields for the agent kind are missing or
                the kind is unknown.
        """
        if agent.agent_kind != "agentcore_runtime":
            return build_client(agent)
        key = (agent.agent_runtime_arn, agent.region)
        client = self._runtime_clients.get(key)
        if client is None:
            client = build_client(agent)
            self._runtime_clients[key] = client
        return client

    async def aclose(self) -> None:
        """Close every cached client; later :meth:`get` calls build new ones."""
        clients = list(self._runtime_clients.values())
        self._runtime_clients.clear()
        for client in clients:
            await asyncio.to_thread(client.close)


def build_client(agent: Agent) -> AgentClient:
    """Build the agent client for *agent* based on its kind.

    Args:
        agent: The agent registry row to build a client for.

    Returns:
        An ``AgentCoreClient`` for ``agentcore_runtime`` agents or an
        ``AsyncLocalClient`` for ``local`` agents.

    Raises:
        ValueError: When required fields for the agent kind are missing or the
            kind is unknown.
    """
    if agent.agent_kind == "agentcore_runtime":
        if agent.agent_runtime_arn is None or agent.region is None:
            raise ValueError(
                f"agentcore_runtime agent {agent.id!r} missing agent_runtime_arn or region"
            )
        return AgentCoreClient(
            agent_runtime_arn=agent.agent_runtime_arn,
            region=agent.region,
        )

    if agent.agent_kind == "local":
        if agent.endpoint_url is None:
            raise ValueError(f"local agent {agent.id!r} missing endpoint_url")
        base = agent.endpoint_url.rstrip("/")
        # Tolerate users who paste the full invocations path instead of the base URL
        base = base.removesuffix("/invocations")
        return AsyncLocalClient(
            url=base + "/invocations",
            timeout=httpx.Timeout(connect=5.0, read=300.0, write=None, pool=None),
        )

    raise ValueError(f"Unknown agent_kind {agent.agent_kind!r} for agent {agent.id!r}")
