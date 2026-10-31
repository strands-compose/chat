"""Tests for ``agents.client.AgentClientCache``: one AgentCore client per runtime."""

import pytest
from strands_compose_agentcore import AgentCoreClient, AsyncLocalClient

from strands_compose_chat.agents.client import AgentClientCache
from tests.factories import make_agent

_ARN = "arn:aws:bedrock-agentcore:eu-central-1:123456789012:runtime/support-XXXXXXXXXX"
_OTHER_ARN = "arn:aws:bedrock-agentcore:eu-central-1:123456789012:runtime/sales-XXXXXXXXXX"


@pytest.fixture(autouse=True)
def _offline_aws(monkeypatch: pytest.MonkeyPatch) -> None:
    """Point boto3 at fake credentials and a closed local port, so no call leaves the host."""
    monkeypatch.setenv("AWS_ACCESS_KEY_ID", "test")
    monkeypatch.setenv("AWS_SECRET_ACCESS_KEY", "test")
    monkeypatch.delenv("AWS_PROFILE", raising=False)
    monkeypatch.setenv("AWS_ENDPOINT_URL_BEDROCK_AGENTCORE", "http://127.0.0.1:9")


def _runtime_agent(arn: str = _ARN):
    return make_agent(
        agent_kind="agentcore_runtime",
        agent_runtime_arn=arn,
        region="eu-central-1",
        endpoint_url=None,
    )


async def test_agents_on_the_same_runtime_share_one_client() -> None:
    cache = AgentClientCache()

    first = cache.get(_runtime_agent())
    same_runtime = cache.get(_runtime_agent())
    other_runtime = cache.get(_runtime_agent(_OTHER_ARN))

    assert isinstance(first, AgentCoreClient)
    assert same_runtime is first
    assert other_runtime is not first
    await cache.aclose()


async def test_local_agents_get_a_new_client_per_invocation() -> None:
    cache = AgentClientCache()
    agent = make_agent()

    first, second = cache.get(agent), cache.get(agent)

    assert isinstance(first, AsyncLocalClient)
    assert isinstance(second, AsyncLocalClient)
    assert first is not second
    await first.aclose()
    await second.aclose()


async def test_closing_the_cache_closes_its_runtime_clients() -> None:
    cache = AgentClientCache()
    client = cache.get(_runtime_agent())

    await cache.aclose()

    with pytest.raises(RuntimeError):
        await anext(client.invoke("hi", session_id="s" * 33))
