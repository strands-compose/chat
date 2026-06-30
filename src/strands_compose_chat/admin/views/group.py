"""Admin view for the Group model."""

from ...db.models import Group
from .base import BaseModelView


class GroupAdmin(BaseModelView, model=Group):
    """Admin view for the groups table."""

    name = "Group"
    name_plural = "Groups"
    icon = "fa-solid fa-layer-group"

    column_list = [
        Group.name,
        Group.description,
        Group.agents,
        Group.created_at,
    ]
    column_details_list = [
        Group.name,
        Group.description,
        Group.agents,
        Group.members,
        Group.created_at,
    ]
    form_columns = [
        Group.name,
        Group.description,
        Group.members,
        Group.agents,
    ]

    column_searchable_list = [Group.name]
    column_default_sort = [(Group.name, False)]

    # members and agents render as clickable orange badges
    _badge_relation_props = {"members": "#d79750", "agents": "#d79750"}

    form_ajax_refs = {
        "members": {
            "fields": ("username", "email"),
            "order_by": "username",
        },
        "agents": {
            "fields": ("name",),
            "order_by": "name",
        },
    }
