"""Shared base view and common helpers for all admin ModelViews."""

from datetime import datetime
from typing import Any, Tuple

from markupsafe import Markup
from sqladmin import ModelView


def _format_datetime(value: datetime) -> Any:
    """Format a datetime as ``YYYY-MM-DD HH:MM:SS`` for display in admin tables."""
    return value.strftime("%Y-%m-%d %H:%M:%S") if value else ""


def _badge(label: str, color: str) -> Markup:
    """Return a Bootstrap-styled pill badge ``<span>``."""
    style = (
        "display:inline-block;padding:2px 9px;border-radius:4px;"
        f"background:{color};color:#fff;font-size:0.78em;font-weight:600;"
        "white-space:nowrap;text-decoration:none;"
    )
    return Markup(f'<span style="{style}">{label}</span>')  # nosec B704 — label is backend-controlled enum/str value


def _relation_badge_list(items: list[Any], color: str = "#d79750") -> list[Markup]:
    """Return one badge ``<span>`` per item. An ↗ icon is appended to signal clickability."""
    return [
        Markup(  # nosec B704 — label is str() of a backend ORM object, SVG is a literal constant
            f'<span style="display:inline-block;padding:2px 9px;border-radius:4px;'
            f"background:{color};color:#fff;font-size:0.78em;font-weight:600;"
            f'white-space:nowrap;text-decoration:none;">'
            f"{str(item)}"
            f'<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24"'
            f' fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"'
            f' stroke-linejoin="round" style="margin-left:4px;vertical-align:middle;opacity:0.85;">'
            f'<line x1="7" y1="17" x2="17" y2="7"/>'
            f'<polyline points="7 7 17 7 17 17"/>'
            f"</svg>"
            f"</span>"
        )
        for item in items
    ]


class BaseModelView(ModelView):
    """ModelView base class with consistent formatters for all admin views."""

    column_type_formatters = {**ModelView.column_type_formatters, datetime: _format_datetime}

    # Render relation lists without the compact (item) wrapping parens.
    show_compact_lists = False

    # Subclasses declare which relation props should render as badge lists so
    # get_list_value / get_detail_value can intercept them.  Each entry maps a
    # prop name (str) to a badge color.
    _badge_relation_props: dict[str, str] = {}

    def __init__(self) -> None:
        """Auto-fill column labels for list/detail headers using the same underscore→space
        title-case transform WTForms applies to form fields. Explicit ``column_labels``
        entries always take priority.
        """
        super().__init__()
        for prop_name in self._prop_names:
            if prop_name not in self._column_labels:
                self._column_labels[prop_name] = prop_name.replace("_", " ").title()
        # Rebuild the reverse lookup that sqladmin maintains alongside the forward map.
        self._column_labels_value_by_key = {v: k for k, v in self._column_labels.items()}

    async def get_list_value(self, obj: Any, prop: str) -> Tuple[Any, Any]:
        """Return badge list as formatted_value for declared relation props."""
        value, formatted_value = await super().get_list_value(obj, prop)
        if prop in self._badge_relation_props and isinstance(value, list):
            color = self._badge_relation_props[prop]
            formatted_value = _relation_badge_list(value, color)
        return value, formatted_value

    async def get_detail_value(self, obj: Any, prop: str) -> Tuple[Any, Any]:
        """Return badge list as formatted_value for declared relation props."""
        value, formatted_value = await super().get_detail_value(obj, prop)
        if prop in self._badge_relation_props and isinstance(value, list):
            color = self._badge_relation_props[prop]
            formatted_value = _relation_badge_list(value, color)
        return value, formatted_value
