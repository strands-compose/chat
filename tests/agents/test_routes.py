"""Route-contract tests for ``agents.routes``: status codes, response shape, and auth gate."""

from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from strands_compose_chat.db.models import AgentGroup, UserGroup
from strands_compose_chat.schemas.agents import AgentOut
from tests.factories import (
    as_user,
    make_agent,
    make_group,
    make_user,
    persist,
)


async def test_list_agents_requires_auth(client: AsyncClient) -> None:
    resp = await client.get("/api/v1/agents")
    assert resp.status_code == 401


async def test_list_agents_returns_200_for_authenticated_user(
    client: AsyncClient, db: AsyncSession
) -> None:
    headers = await as_user(db)
    resp = await client.get("/api/v1/agents", headers=headers)
    assert resp.status_code == 200


async def test_list_agents_response_is_a_list(client: AsyncClient, db: AsyncSession) -> None:
    headers = await as_user(db)
    resp = await client.get("/api/v1/agents", headers=headers)
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)


async def test_list_agents_response_shape_matches_schema(
    client: AsyncClient, db: AsyncSession
) -> None:
    """Set up one visible agent, then validate every item through ``AgentOut``."""
    user = make_user()
    group = make_group()
    agent = make_agent()
    await persist(db, user, group, agent)
    db.add(UserGroup(user_id=user.id, group_id=group.id))
    db.add(AgentGroup(agent_id=agent.id, group_id=group.id))
    await db.flush()

    headers = await as_user(db, user)
    resp = await client.get("/api/v1/agents", headers=headers)

    assert resp.status_code == 200
    items = resp.json()
    assert len(items) >= 1
    for item in items:
        AgentOut.model_validate(item)


async def test_list_agents_empty_when_user_has_no_group_membership(
    client: AsyncClient, db: AsyncSession
) -> None:
    headers = await as_user(db)
    resp = await client.get("/api/v1/agents", headers=headers)

    assert resp.status_code == 200
    assert resp.json() == []


async def test_list_agents_accepts_limit_and_offset_query_params(
    client: AsyncClient, db: AsyncSession
) -> None:
    headers = await as_user(db)
    resp = await client.get("/api/v1/agents?limit=10&offset=0", headers=headers)
    assert resp.status_code == 200


async def test_list_agents_returns_422_for_limit_below_minimum(
    client: AsyncClient, db: AsyncSession
) -> None:
    headers = await as_user(db)
    resp = await client.get("/api/v1/agents?limit=0", headers=headers)
    assert resp.status_code == 422


async def test_list_agents_returns_422_for_negative_offset(
    client: AsyncClient, db: AsyncSession
) -> None:
    headers = await as_user(db)
    resp = await client.get("/api/v1/agents?offset=-1", headers=headers)
    assert resp.status_code == 422


async def test_get_agent_requires_auth(client: AsyncClient, db: AsyncSession) -> None:
    resp = await client.get("/api/v1/agents/some-agent-id")
    assert resp.status_code == 401


async def test_get_agent_returns_200_and_matches_schema(
    client: AsyncClient, db: AsyncSession
) -> None:
    user = make_user()
    group = make_group()
    agent = make_agent()
    await persist(db, user, group, agent)
    db.add(UserGroup(user_id=user.id, group_id=group.id))
    db.add(AgentGroup(agent_id=agent.id, group_id=group.id))
    await db.flush()

    headers = await as_user(db, user)
    resp = await client.get(f"/api/v1/agents/{agent.id}", headers=headers)

    assert resp.status_code == 200
    AgentOut.model_validate(resp.json())


async def test_get_agent_returns_404_when_agent_not_visible(
    client: AsyncClient, db: AsyncSession
) -> None:
    user = make_user()
    group = make_group()
    agent = make_agent()
    await persist(db, user, group, agent)
    # Agent belongs to the group but the user does not, so it is not visible.
    db.add(AgentGroup(agent_id=agent.id, group_id=group.id))
    await db.flush()

    headers = await as_user(db, user)
    resp = await client.get(f"/api/v1/agents/{agent.id}", headers=headers)

    assert resp.status_code == 404


async def test_get_agent_returns_404_for_nonexistent_id(
    client: AsyncClient, db: AsyncSession
) -> None:
    headers = await as_user(db)
    resp = await client.get("/api/v1/agents/does-not-exist", headers=headers)
    assert resp.status_code == 404


async def test_get_agent_response_fields_are_typed_correctly(
    client: AsyncClient, db: AsyncSession
) -> None:
    user = make_user()
    group = make_group()
    agent = make_agent(
        name="typed-agent",
        agent_kind="local",
        multimodal=False,
        description="A test agent",
    )
    await persist(db, user, group, agent)
    db.add(UserGroup(user_id=user.id, group_id=group.id))
    db.add(AgentGroup(agent_id=agent.id, group_id=group.id))
    await db.flush()

    headers = await as_user(db, user)
    resp = await client.get(f"/api/v1/agents/{agent.id}", headers=headers)

    assert resp.status_code == 200
    body = resp.json()
    out = AgentOut.model_validate(body)
    assert isinstance(out.id, str)
    assert isinstance(out.name, str)
    assert isinstance(out.description, str)
    assert isinstance(out.agent_kind, str)
    assert isinstance(out.multimodal, bool)
