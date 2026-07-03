"""Admin view for the Agent model."""

import re
from typing import Any
from urllib.parse import urlparse

from markupsafe import Markup
from wtforms import SelectField, TextAreaField
from wtforms.validators import DataRequired

from ...db.models import Agent
from ...deps import get_settings
from .base import BaseModelView, _badge

_PRE_STYLE = (
    "margin:0;padding:8px;background:var(--tblr-secondary-bg);"
    "border:1px solid var(--tblr-border-color);"
    "border-radius:4px;max-height:400px;overflow:auto;color:var(--tblr-body-color);"
    "font-size:0.8em;white-space:pre;"
)


def _format_description(model: Any, _prop: Any) -> str:
    """Truncate agent description to 60 characters in the list view."""
    desc: str = getattr(model, "description", "") or ""
    return desc[:60] + "…" if len(desc) > 60 else desc


def _format_description_detail(model: Any, _prop: Any) -> Markup:
    """Render the full agent description in a scrollable <pre> block."""
    desc: str = getattr(model, "description", "") or ""
    if not desc:
        return Markup("")
    return Markup(  # nosec B704 — description is operator-supplied text, not user HTML
        f'<pre style="{_PRE_STYLE}">{desc}</pre>'
    )


def _format_suggested_questions_detail(model: Any, _prop: Any) -> Markup:
    """Render suggested_questions as one question per line in a <pre> block."""
    value: list[str] | None = getattr(model, "suggested_questions", None)
    if not value:
        return Markup("")
    text = "\n".join(str(q) for q in value)
    return Markup(  # nosec B704 — questions are operator-supplied text, not user HTML
        f'<pre style="{_PRE_STYLE}">{text}</pre>'
    )


def _format_agent_kind(model: Any, _prop: Any) -> Markup:
    """Render agent_kind as a coloured badge."""
    kind: str = getattr(model, "agent_kind", "") or ""
    colour_map = {
        "agentcore_runtime": "#6f42c1",
        "local": "#0d6efd",
    }
    label_map = {
        "agentcore_runtime": "AgentCore",
        "local": "Local",
    }
    return _badge(label_map.get(kind, kind or "—"), colour_map.get(kind, "#6c757d"))


class SuggestedQuestionsField(TextAreaField):
    """WTForms field that stores a JSON list of strings as newline-separated text.

    The textarea shows one question per line. On submit the value is split on
    newlines, stripped, and empty lines are discarded before being stored as a
    JSON array. On load a ``list`` from the DB JSON column is joined back to
    newline-separated text so the textarea is pre-populated correctly.
    """

    def process_formdata(self, valuelist: list[str]) -> None:
        if valuelist:
            lines = [line.strip() for line in valuelist[0].splitlines()]
            self.data = [line for line in lines if line]
        else:
            self.data = None

    def _value(self) -> str:
        if isinstance(self.data, list):
            return "\n".join(self.data)
        return self.data or ""


class AgentAdmin(BaseModelView, model=Agent):
    """Admin view for the agents table.

    Soft-delete is used instead of hard delete to preserve chat_sessions
    foreign-key references: ``delete_model`` sets ``enabled=False``.

    ``agent_kind`` is rendered as a dropdown. Kind-specific fields carry
    description hints so the admin user knows which apply to which type.
    ``suggested_questions`` is a newline-separated textarea that serialises
    to a JSON array on the model.
    """

    name = "Agent"
    name_plural = "Agents"
    icon = "fa-solid fa-robot"

    column_list = [
        Agent.name,
        Agent.description,
        Agent.access_groups,
        Agent.enabled,
        Agent.multimodal,
        Agent.agent_kind,
        Agent.created_at,
        Agent.updated_at,
    ]
    column_details_list = [
        Agent.name,
        Agent.description,
        Agent.access_groups,
        Agent.enabled,
        Agent.multimodal,
        Agent.agent_kind,
        Agent.agent_runtime_arn,
        Agent.region,
        Agent.endpoint_url,
        Agent.suggested_questions,
        Agent.created_at,
        Agent.updated_at,
    ]
    form_columns = [
        Agent.name,
        Agent.description,
        Agent.access_groups,
        Agent.enabled,
        Agent.multimodal,
        Agent.agent_kind,
        Agent.agent_runtime_arn,
        Agent.region,
        Agent.endpoint_url,
        Agent.suggested_questions,
    ]

    column_searchable_list = [Agent.name, Agent.id]
    column_default_sort = [(Agent.name, False)]

    form_defaults = {"enabled": True, "multimodal": False}

    # access_groups renders as badge list via BaseModelView.get_list_value / get_detail_value
    _badge_relation_props = {"access_groups": "#d79750"}

    column_formatters = {  # type: ignore[assignment]
        Agent.description: _format_description,
        Agent.agent_kind: _format_agent_kind,
    }
    column_formatters_detail = {  # type: ignore[assignment]
        Agent.description: _format_description_detail,
        Agent.agent_kind: _format_agent_kind,
        Agent.suggested_questions: _format_suggested_questions_detail,
    }

    form_overrides = {
        "agent_kind": SelectField,
        "description": TextAreaField,
        "suggested_questions": SuggestedQuestionsField,
    }
    form_args = {
        "agent_kind": {
            "choices": [
                ("agentcore_runtime", "Agentcore Runtime"),
                ("local", "Local"),
            ]
        },
        "description": {
            "label": "Description",
            "validators": [DataRequired()],
            "description": "Shown above the chat composer on the welcome page. Use newlines for multiple lines.",
            "render_kw": {
                "rows": 4,
                "placeholder": "This agent can help you with...",
                "class": "form-control w-100",
                "style": "width:100%!important;box-sizing:border-box;resize:vertical",
            },
        },
        "agent_runtime_arn": {
            "description": "Required for Agentcore Runtime agents only.",
        },
        "region": {
            "description": "Required for Agentcore Runtime agents only.",
        },
        "endpoint_url": {
            "description": "Required for Local agents only.",
        },
        "suggested_questions": {
            "label": "Suggested Questions",
            "description": "One question per line. Shown as quick-start prompts on the welcome page.",
            "render_kw": {
                "rows": 4,
                "placeholder": "What can you help me with?\nSummarise the latest changes",
                "class": "form-control w-100",
                "style": "width:100%!important;box-sizing:border-box;resize:vertical",
            },
        },
    }

    form_ajax_refs = {
        "access_groups": {
            "fields": ("name",),
            "order_by": "name",
        }
    }

    async def on_model_delete(self, model: Any, request: Any) -> None:
        """Soft-delete: set enabled=False instead of deleting the row."""
        model.enabled = False

    async def on_model_change(self, data: dict, model: Any, is_created: bool, request: Any) -> None:
        """Validate kind-specific required fields.

        In dev, ``http://`` is allowed only for localhost/127.0.0.1/*.local endpoints.
        In prod, ``https://`` is enforced on all local-kind agents.
        """
        kind = data.get("agent_kind") or getattr(model, "agent_kind", None)

        if kind == "agentcore_runtime":
            arn = (data.get("agent_runtime_arn") or "").strip()
            region = (data.get("region") or "").strip()
            missing = []
            if not arn:
                missing.append("Agent Runtime ARN")
            if not region:
                missing.append("Region")
            if missing:
                raise ValueError(f"Agentcore Runtime agents require: {', '.join(missing)}.")

        if kind == "local":
            endpoint_url = (data.get("endpoint_url") or "").strip()
            if not endpoint_url:
                raise ValueError("Local agents require an Endpoint URL.")
            app_env = get_settings().APP_ENV
            parsed = urlparse(endpoint_url)
            scheme = parsed.scheme.lower()
            host = parsed.hostname or ""
            if scheme != "https":
                if app_env == "prod":
                    raise ValueError(
                        f"endpoint_url scheme must be 'https' in prod; got {endpoint_url!r}"
                    )
                if scheme != "http" or (
                    host not in {"localhost", "127.0.0.1"}
                    and not re.match(r"^[a-zA-Z0-9\-]+\.local$", host)
                ):
                    raise ValueError(
                        f"endpoint_url with http:// is only allowed for localhost, 127.0.0.1, "
                        f"or *.local hosts in dev; got host={host!r}"
                    )

    async def delete_model(self, request: Any, pk: Any) -> None:
        """Override hard-delete with a soft-delete (enabled=False)."""
        from sqlalchemy import select  # noqa: PLC0415

        async with self.session_maker() as session:
            stmt = select(Agent).where(Agent.id == pk)
            result = await session.execute(stmt)
            agent = result.scalar_one_or_none()
            if agent is not None:
                agent.enabled = False
                await session.commit()
