"""Agent registry routes — read-only, user-scoped.

Agent management (create/update/delete) is handled by the sqladmin
``AgentAdmin`` view, not by this API.
"""

import structlog
from fastapi import APIRouter, Query

from ..auth.current_user import ApiKeyOrSessionUser
from ..deps import DbSession
from ..errors import ProblemDetailsException
from ..schemas.agents import AgentOut
from .service import get_visible, list_visible, load_user_groups

logger: structlog.stdlib.BoundLogger = structlog.get_logger(__name__)

router = APIRouter(prefix="/agents", tags=["agents"])


@router.get("", response_model=list[AgentOut])
async def list_agents(
    current_user: ApiKeyOrSessionUser,
    db: DbSession,
    limit: int = Query(default=50, ge=1),
    offset: int = Query(default=0, ge=0),
) -> list[AgentOut]:
    """List agents visible to the authenticated user."""
    user_groups = await load_user_groups(db, current_user.id)
    agents = await list_visible(db, user_groups, limit=limit, offset=offset)
    return [AgentOut.model_validate(agent, from_attributes=True) for agent in agents]


@router.get("/{agent_id}", response_model=AgentOut)
async def get_agent(
    agent_id: str,
    current_user: ApiKeyOrSessionUser,
    db: DbSession,
) -> AgentOut:
    """Return a single agent visible to the authenticated user."""
    user_groups = await load_user_groups(db, current_user.id)
    agent = await get_visible(db, agent_id, user_groups)
    if agent is None:
        raise ProblemDetailsException(status_code=404, detail=f"Agent '{agent_id}' not found.")
    return AgentOut.model_validate(agent, from_attributes=True)
