"""Route-contract tests for the media slice.

One test per observable contract: the auth gate exists, and an authenticated
request returns a body matching ``MediaCapabilitiesOut``. Field values are
proven at the service layer.
"""

import pytest

from strands_compose_chat.schemas.media import MediaCapabilitiesOut
from tests.factories import as_user


@pytest.mark.asyncio
async def test_get_capabilities_requires_auth(client) -> None:
    resp = await client.get("/api/v1/media/capabilities")

    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_get_capabilities_returns_200_and_valid_shape(client, db) -> None:
    headers = await as_user(db)

    resp = await client.get("/api/v1/media/capabilities", headers=headers)

    assert resp.status_code == 200
    MediaCapabilitiesOut.model_validate(resp.json())
