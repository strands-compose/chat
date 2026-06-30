"""Admin dashboard view — custom BaseView exposed at /dashboard."""

from fastapi import Request
from sqladmin import BaseView, expose
from starlette.responses import Response

from ...config import get_settings


class DashboardView(BaseView):
    """Full-page dashboard served inside the sqladmin home iframe.

    Registered via ``admin.add_base_view(DashboardView)`` in ``app.py``.
    sqladmin mounts it at ``{base_url}/dashboard`` and enforces its own
    authentication check before the handler runs.

    Args:
        name: Sidebar label shown in the admin navigation.
        icon: Tabler/Font Awesome icon class for the sidebar entry.
    """

    name = "Dashboard"
    icon = "fa-solid fa-gauge-high"

    def is_visible(self, request: Request) -> bool:  # noqa: ARG002
        """Hide this view from the sidebar navigation."""
        return False

    @expose("/dashboard", methods=["GET"], include_in_schema=False)
    async def dashboard(self, request: Request) -> Response:
        """Render the standalone dashboard page.

        Args:
            request: The current Starlette request.

        Returns:
            An HTML response rendering ``dashboard.html``.
        """
        settings = get_settings()
        return await self.templates.TemplateResponse(
            request,
            "dashboard.html",
            {"url_prefix": settings.URL_PREFIX},
        )
