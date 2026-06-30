"""Build the per-invocation agent client for an Agent row.

Each invocation builds its own client and closes it when the stream ends —
there is no shared cache, so the service is correct under horizontal scaling
without any cross-task cache invalidation.
"""

import httpx
from strands_compose_agentcore import AgentCoreClient, AsyncLocalClient

from ..db.models import Agent

AgentClient = AgentCoreClient | AsyncLocalClient


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
        if base.endswith("/invocations"):
            base = base[: -len("/invocations")]
        return AsyncLocalClient(
            url=base + "/invocations",
            timeout=httpx.Timeout(connect=5.0, read=300.0, write=None, pool=None),
        )

    raise ValueError(f"Unknown agent_kind {agent.agent_kind!r} for agent {agent.id!r}")
