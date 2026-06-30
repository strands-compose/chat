"""Media capabilities routes — read-only, authenticated.

Exposes the supported attachment formats and the configured size/count
limits so the UI can self-configure its file selection surface.
"""

import structlog
from fastapi import APIRouter

from ..auth.current_user import ApiKeyOrSessionUser
from ..deps import AppSettings
from ..schemas.media import MediaCapabilitiesOut
from .service import build_capabilities

logger: structlog.stdlib.BoundLogger = structlog.get_logger(__name__)

router = APIRouter(prefix="/media", tags=["media"])


@router.get("/capabilities", response_model=MediaCapabilitiesOut)
async def get_capabilities(
    current_user: ApiKeyOrSessionUser,
    settings: AppSettings,
) -> MediaCapabilitiesOut:
    """Return supported attachment formats and configured size/count limits."""
    return build_capabilities(settings)
