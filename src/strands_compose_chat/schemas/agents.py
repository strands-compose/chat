"""Pydantic v2 response schemas for the agents endpoints."""

from pydantic import BaseModel, field_validator


class AgentOut(BaseModel):
    """Agent response for the chat UI.

    Only exposes what the UI needs to render the agent selector and start a
    conversation. All internal fields (access_groups, enabled, timestamps)
    and infrastructure details (ARN, region, endpoint) are intentionally omitted.
    """

    id: str
    """Standard UUID identifier — needed by the UI to address invocation requests."""

    name: str
    description: str
    """Human-readable description shown above the composer on the welcome page.
    Coerced to an empty string when the DB row has NULL (legacy data)."""

    agent_kind: str
    """Discriminator: ``"agentcore_runtime"`` or ``"local"``."""

    multimodal: bool
    """When True, the agent accepts file attachments in the payload.
    Controls whether the file upload button is enabled in the chat UI."""

    suggested_questions: list[str] | None
    """Optional list of suggested starter questions shown on the welcome page."""

    @field_validator("description", mode="before")
    @classmethod
    def coerce_none_to_empty(cls, value: str | None) -> str:
        """Return an empty string when the DB column is NULL.

        Args:
            value: Raw value from the ORM object.

        Returns:
            The original string, or ``""`` when value is None.
        """
        return value if value is not None else ""
