"""Admin view for the Group model."""

from typing import Any, ClassVar

from ...db.models import Group
from .base import BaseModelView


class GroupAdmin(BaseModelView, model=Group):
    """Admin view for the groups table."""

    name = "Group"
    name_plural = "Groups"
    icon = "fa-solid fa-layer-group"

    column_list: ClassVar[list[Any]] = [
        Group.name,
        Group.description,
        Group.agents,
        Group.created_at,
    ]
    column_details_list: ClassVar[list[Any]] = [
        Group.name,
        Group.description,
        Group.agents,
        Group.members,
        Group.created_at,
    ]
    form_columns: ClassVar[list[Any]] = [
        Group.name,
        Group.description,
        Group.members,
        Group.agents,
    ]

    column_searchable_list: ClassVar[list[Any]] = [Group.name]
    column_default_sort: ClassVar[list[Any]] = [(Group.name, False)]

    # members and agents render as clickable orange badges
    _badge_relation_props: ClassVar[dict[str, str]] = {"members": "#d79750", "agents": "#d79750"}

    form_ajax_refs: ClassVar[dict[str, Any]] = {
        "members": {
            "fields": ("username", "email"),
            "order_by": "username",
        },
        "agents": {
            "fields": ("name",),
            "order_by": "name",
        },
    }
