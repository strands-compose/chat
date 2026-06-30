"""Per-user usage router — authenticated user's own usage data."""

from datetime import date

from fastapi import APIRouter, Query

from ..auth.current_user import CurrentUser
from ..deps import DbSession
from ..errors import ProblemDetailsException
from ..schemas.analytics import Interval, MeUsageOut
from .service import get_user_usage

router = APIRouter(prefix="/users/me/usage", tags=["usage"])


@router.get("", response_model=MeUsageOut)
async def me_usage_handler(
    current_user: CurrentUser,
    db: DbSession,
    from_date: date = Query(alias="from"),
    to_date: date = Query(alias="to"),
    interval: Interval = Query(),
) -> MeUsageOut:
    """Return pre-bucketed usage data for the authenticated user.

    Args:
        current_user: The authenticated user (injected, never from request params).
        db: Async database session.
        from_date: Start date (inclusive), parsed from "from" query param.
        to_date: End date (inclusive), parsed from "to" query param.
        interval: Time bucket granularity (daily, weekly, monthly).

    Returns:
        MeUsageOut with interval and ordered list of usage data points.

    Raises:
        ProblemDetailsException: HTTP 422 when from_date > to_date.
    """
    if from_date > to_date:
        raise ProblemDetailsException(status_code=422, detail="from must be <= to")

    return await get_user_usage(db, current_user.id, from_date, to_date, interval)
