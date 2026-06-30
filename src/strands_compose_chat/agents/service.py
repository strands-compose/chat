"""Agent registry read and visibility logic.

Agent writes (create/update/delete) are handled by the sqladmin ``AgentAdmin``
view — there is no programmatic write API.
"""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from ..db.models import Agent, Group, UserGroup


def is_agent_visible(agent: Agent, user_groups: list[str]) -> bool:
    """Return True if a user with *user_groups* may see *agent*.

    Decision tree:
    1. Disabled agent — not visible.
    2. Empty access_groups — closed by default, not visible.
    3. Group intersection — visible if user belongs to at least one group
       listed in agent.access_groups.

    Superusers are subject to the same rules; explicit group membership is
    required even for admin accounts.

    Args:
        agent: The agent being checked.
        user_groups: Group names the user belongs to.

    Returns:
        True when the agent is visible to the user.
    """
    if not agent.enabled:
        return False
    allowed: list[str] = [g.name for g in agent.access_groups] if agent.access_groups else []
    if not allowed:
        return False
    allowed_set = set(allowed)
    return any(g in allowed_set for g in user_groups)


async def load_user_groups(db: AsyncSession, user_id: str) -> list[str]:
    """Return group names for *user_id* from the user_groups join table.

    Args:
        db: Async database session.
        user_id: The user whose group membership is loaded.

    Returns:
        A list of group name strings.
    """
    result = await db.execute(
        select(Group.name)
        .join(UserGroup, UserGroup.group_id == Group.id)
        .where(UserGroup.user_id == user_id)
    )
    return [row[0] for row in result.all()]


async def list_visible(
    db: AsyncSession,
    user_groups: list[str],
    *,
    limit: int = 50,
    offset: int = 0,
) -> list[Agent]:
    """Return Agent rows visible to the user, ordered by id, with pagination.

    Visibility requires explicit group membership — superusers are not exempt.

    Args:
        db: Async database session.
        user_groups: Group names the user belongs to.
        limit: Maximum number of rows to return.
        offset: Number of rows to skip.

    Returns:
        A list of visible Agent rows.
    """
    result = await db.execute(
        select(Agent)
        .options(selectinload(Agent.access_groups))
        .where(Agent.enabled.is_(True))
        .order_by(Agent.id)
    )
    agents: list[Agent] = list(result.scalars().all())
    visible = [a for a in agents if is_agent_visible(a, user_groups)]
    return visible[offset : offset + limit]


async def get_visible(
    db: AsyncSession,
    agent_id: str,
    user_groups: list[str],
) -> Agent | None:
    """Fetch a single Agent by *agent_id* if visible to the user.

    Returns None when the agent does not exist or is not visible, so callers
    can return HTTP 404 without disclosing existence.

    Args:
        db: Async database session.
        agent_id: The agent identifier.
        user_groups: Group names the user belongs to.

    Returns:
        The Agent row when visible, otherwise None.
    """
    result = await db.execute(
        select(Agent).options(selectinload(Agent.access_groups)).where(Agent.id == agent_id)
    )
    agent: Agent | None = result.scalar_one_or_none()
    if agent is None:
        return None
    if not is_agent_visible(agent, user_groups):
        return None
    return agent
