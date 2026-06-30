"""Service-layer tests for ``agents.service`` agent visibility and pagination."""

from sqlalchemy.ext.asyncio import AsyncSession

from strands_compose_chat.agents.service import (
    get_visible,
    is_agent_visible,
    list_visible,
    load_user_groups,
)
from strands_compose_chat.db.models import Agent, AgentGroup, UserGroup
from tests.factories import make_agent, make_group, make_user, persist


def test_is_agent_visible_rejects_a_disabled_agent() -> None:
    group = make_group(name="eng")
    agent = make_agent(enabled=False)
    agent.access_groups = [group]

    assert is_agent_visible(agent, ["eng"]) is False


def test_is_agent_visible_rejects_an_agent_with_no_access_groups() -> None:
    agent = make_agent(enabled=True)
    agent.access_groups = []

    assert is_agent_visible(agent, ["eng", "admin"]) is False


def test_is_agent_visible_accepts_an_agent_when_a_group_is_shared() -> None:
    group = make_group(name="eng")
    agent = make_agent(enabled=True)
    agent.access_groups = [group]

    assert is_agent_visible(agent, ["eng"]) is True


def test_is_agent_visible_rejects_an_agent_when_no_group_is_shared() -> None:
    group = make_group(name="eng")
    agent = make_agent(enabled=True)
    agent.access_groups = [group]

    assert is_agent_visible(agent, ["hr", "finance"]) is False


def test_is_agent_visible_accepts_when_one_of_many_groups_matches() -> None:
    grp_a = make_group(name="eng")
    grp_b = make_group(name="science")
    agent = make_agent(enabled=True)
    agent.access_groups = [grp_a, grp_b]

    assert is_agent_visible(agent, ["science", "hr"]) is True


def test_is_agent_visible_rejects_when_user_has_no_groups() -> None:
    group = make_group(name="eng")
    agent = make_agent(enabled=True)
    agent.access_groups = [group]

    assert is_agent_visible(agent, []) is False


async def test_load_user_groups_returns_group_names_for_user(db: AsyncSession) -> None:
    user = make_user()
    group_a = make_group(name="alpha")
    group_b = make_group(name="beta")
    await persist(db, user, group_a, group_b)
    db.add_all(
        [
            UserGroup(user_id=user.id, group_id=group_a.id),
            UserGroup(user_id=user.id, group_id=group_b.id),
        ]
    )
    await db.flush()

    result = await load_user_groups(db, user.id)

    assert set(result) == {"alpha", "beta"}


async def test_load_user_groups_returns_empty_list_when_user_has_no_groups(
    db: AsyncSession,
) -> None:
    user = make_user()
    await persist(db, user)

    result = await load_user_groups(db, user.id)

    assert result == []


async def test_load_user_groups_does_not_return_groups_of_other_users(db: AsyncSession) -> None:
    user_a = make_user()
    user_b = make_user()
    group = make_group(name="shared")
    await persist(db, user_a, user_b, group)
    db.add(UserGroup(user_id=user_b.id, group_id=group.id))
    await db.flush()

    result = await load_user_groups(db, user_a.id)

    assert "shared" not in result


async def test_list_visible_returns_an_agent_when_a_group_is_shared(db: AsyncSession) -> None:
    group = make_group(name="engineers")
    agent = make_agent()
    user = make_user()
    await persist(db, group, agent, user)
    db.add(UserGroup(user_id=user.id, group_id=group.id))
    db.add(AgentGroup(agent_id=agent.id, group_id=group.id))
    await db.flush()

    result = await list_visible(db, ["engineers"])

    agent_ids = [a.id for a in result]
    assert agent.id in agent_ids


async def test_list_visible_omits_an_agent_without_a_shared_group(db: AsyncSession) -> None:
    group = make_group(name="exclusive")
    agent = make_agent()
    await persist(db, group, agent)
    db.add(AgentGroup(agent_id=agent.id, group_id=group.id))
    await db.flush()

    result = await list_visible(db, ["other_group"])

    agent_ids = [a.id for a in result]
    assert agent.id not in agent_ids


async def test_list_visible_omits_a_disabled_agent(db: AsyncSession) -> None:
    group = make_group(name="devs")
    agent = make_agent(enabled=False)
    await persist(db, group, agent)
    db.add(AgentGroup(agent_id=agent.id, group_id=group.id))
    await db.flush()

    result = await list_visible(db, ["devs"])

    agent_ids = [a.id for a in result]
    assert agent.id not in agent_ids


async def test_list_visible_omits_an_agent_with_no_access_groups(db: AsyncSession) -> None:
    agent = make_agent(enabled=True)
    await persist(db, agent)

    result = await list_visible(db, ["admin", "eng"])

    agent_ids = [a.id for a in result]
    assert agent.id not in agent_ids


async def test_list_visible_returns_only_agents_with_a_shared_group(db: AsyncSession) -> None:
    group_a = make_group(name="team_a")
    group_b = make_group(name="team_b")
    agent_visible = make_agent()
    agent_hidden = make_agent()
    await persist(db, group_a, group_b, agent_visible, agent_hidden)
    db.add(AgentGroup(agent_id=agent_visible.id, group_id=group_a.id))
    db.add(AgentGroup(agent_id=agent_hidden.id, group_id=group_b.id))
    await db.flush()

    result = await list_visible(db, ["team_a"])

    agent_ids = [a.id for a in result]
    assert agent_visible.id in agent_ids
    assert agent_hidden.id not in agent_ids


async def test_list_visible_respects_the_pagination_limit(db: AsyncSession) -> None:
    group = make_group(name="paginate_group")
    await persist(db, group)

    agents: list[Agent] = []
    for _ in range(5):
        a = make_agent()
        await persist(db, a)
        db.add(AgentGroup(agent_id=a.id, group_id=group.id))
        agents.append(a)
    await db.flush()

    page1 = await list_visible(db, ["paginate_group"], limit=3, offset=0)
    assert len(page1) <= 3

    page2 = await list_visible(db, ["paginate_group"], limit=3, offset=3)
    assert len(page2) <= 3


async def test_list_visible_offset_advances_the_result_window(db: AsyncSession) -> None:
    group = make_group(name="offset_group")
    await persist(db, group)

    agents: list[Agent] = []
    for _ in range(4):
        a = make_agent()
        await persist(db, a)
        db.add(AgentGroup(agent_id=a.id, group_id=group.id))
        agents.append(a)
    await db.flush()

    page1 = await list_visible(db, ["offset_group"], limit=2, offset=0)
    page2 = await list_visible(db, ["offset_group"], limit=2, offset=2)

    all_ids = {a.id for a in page1} | {a.id for a in page2}
    expected_ids = {a.id for a in agents}
    assert all_ids == expected_ids
    assert len({a.id for a in page1} & {a.id for a in page2}) == 0


async def test_list_visible_returns_empty_list_for_offset_beyond_end(db: AsyncSession) -> None:
    group = make_group(name="end_group")
    agent = make_agent()
    await persist(db, group, agent)
    db.add(AgentGroup(agent_id=agent.id, group_id=group.id))
    await db.flush()

    result = await list_visible(db, ["end_group"], limit=10, offset=9999)

    assert result == []


async def test_list_visible_count_never_exceeds_page_size_for_any_limit(db: AsyncSession) -> None:
    group = make_group(name="size_group")
    await persist(db, group)

    for _ in range(10):
        a = make_agent()
        await persist(db, a)
        db.add(AgentGroup(agent_id=a.id, group_id=group.id))
    await db.flush()

    for page_size in [1, 3, 5, 7, 10, 20]:
        result = await list_visible(db, ["size_group"], limit=page_size, offset=0)
        assert len(result) <= page_size, (
            f"list_visible returned {len(result)} items for limit={page_size}"
        )


async def test_list_visible_returns_agents_matching_any_user_group(db: AsyncSession) -> None:
    group_x = make_group(name="grp_x")
    group_y = make_group(name="grp_y")
    agent_x = make_agent()
    agent_y = make_agent()
    await persist(db, group_x, group_y, agent_x, agent_y)
    db.add(AgentGroup(agent_id=agent_x.id, group_id=group_x.id))
    db.add(AgentGroup(agent_id=agent_y.id, group_id=group_y.id))
    await db.flush()

    result = await list_visible(db, ["grp_x", "grp_y"])

    agent_ids = {a.id for a in result}
    assert agent_x.id in agent_ids
    assert agent_y.id in agent_ids


async def test_get_visible_returns_the_agent_when_a_group_is_shared(db: AsyncSession) -> None:
    group = make_group(name="crew")
    agent = make_agent()
    await persist(db, group, agent)
    db.add(AgentGroup(agent_id=agent.id, group_id=group.id))
    await db.flush()

    found = await get_visible(db, agent.id, ["crew"])

    assert found is not None
    assert found.id == agent.id


async def test_get_visible_returns_none_when_no_group_is_shared(db: AsyncSession) -> None:
    group = make_group(name="restricted")
    agent = make_agent()
    await persist(db, group, agent)
    db.add(AgentGroup(agent_id=agent.id, group_id=group.id))
    await db.flush()

    found = await get_visible(db, agent.id, ["public"])

    assert found is None


async def test_get_visible_returns_none_for_a_disabled_agent(db: AsyncSession) -> None:
    group = make_group(name="devs_gv")
    agent = make_agent(enabled=False)
    await persist(db, group, agent)
    db.add(AgentGroup(agent_id=agent.id, group_id=group.id))
    await db.flush()

    found = await get_visible(db, agent.id, ["devs_gv"])

    assert found is None


async def test_get_visible_returns_none_for_a_nonexistent_agent(db: AsyncSession) -> None:
    found = await get_visible(db, "nonexistent-id", ["any_group"])

    assert found is None


async def test_get_visible_returned_fields_match_persisted_values(db: AsyncSession) -> None:
    group = make_group(name="verify_group")
    agent = make_agent(name="my-special-agent", enabled=True)
    await persist(db, group, agent)
    db.add(AgentGroup(agent_id=agent.id, group_id=group.id))
    await db.flush()

    found = await get_visible(db, agent.id, ["verify_group"])

    assert found is not None
    assert found.name == "my-special-agent"
    assert found.enabled is True
