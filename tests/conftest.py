"""Root test harness: settings/engine bootstrap, schema lifecycle, and fixtures.

The engine in ``db.base`` is built from ``get_settings().DATABASE_URL`` at import
time, so the settings override has to be installed before anything imports the
application package. Only the ``strands_compose_chat`` imports are deferred for
that reason; the third-party imports below are ordinary top-of-file imports.
"""

import asyncio
import inspect
import sys
from collections.abc import AsyncIterator
from datetime import UTC, datetime

import pytest
import time_machine
from httpx import ASGITransport, AsyncClient
from sqlalchemy import event
from sqlalchemy.ext.asyncio import AsyncSession

# Windows' default Proactor loop mismanages aiosqlite's worker-thread
# connections (and noisily fails to close itself). The Selector loop matches
# Linux/macOS behaviour and works cleanly with aiosqlite.
if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())  # ty: ignore

from strands_compose_chat import config

_TEST_SETTINGS = config.Settings(
    # "dev" keeps SessionMiddleware from setting https_only, so the in-process
    # client over http://test can carry the session cookie back to the app.
    APP_ENV="dev",
    SESSION_SECRET_KEY="t" * 43,
    DATABASE_URL="sqlite+aiosqlite:///file:memdb?mode=memory&cache=shared&uri=true",
    # httpx ASGITransport sends Host: test; allow it past TrustedHostMiddleware.
    TRUSTED_HOSTS=["test", "localhost", "127.0.0.1"],
)

config.get_settings.cache_clear()
config.get_settings = lambda: _TEST_SETTINGS  # type: ignore

# Deferred until after the override above so the engine binds to the test DB.
from strands_compose_chat.app import create_app  # noqa: E402
from strands_compose_chat.db.base import Base, engine  # noqa: E402
from strands_compose_chat.deps import get_db, get_settings  # noqa: E402

_FIXED_INSTANT = datetime(2024, 1, 15, 12, 0, 0, tzinfo=UTC)


@pytest.fixture(scope="session", autouse=True)
async def _schema() -> AsyncIterator[None]:
    """Create the schema once for the session and drop it at the end."""
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    except Exception as exc:
        pytest.exit(f"schema setup failed: {exc}", returncode=1)

    yield

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest.fixture(scope="session")
def app():
    """The application, built once with the test settings."""
    application = create_app(settings=_TEST_SETTINGS)
    application.dependency_overrides[get_settings] = lambda: _TEST_SETTINGS
    return application


@pytest.fixture
async def db(app) -> AsyncIterator[AsyncSession]:
    """A session bound to an outer transaction that is rolled back after the test.

    Production ``get_db`` and the streaming helpers call ``commit()``, so the
    session joins an external transaction: an outer transaction plus a SAVEPOINT
    that restarts after each inner commit. In-request commits are visible during
    the test and vanish when the outer transaction rolls back. The ``get_db``
    override points route handlers at this same session so requests and
    assertions share one transaction.
    """
    async with engine.connect() as conn:
        await conn.begin()
        session = AsyncSession(bind=conn, expire_on_commit=False, autoflush=False)
        await session.begin_nested()

        @event.listens_for(session.sync_session, "after_transaction_end")
        def _restart_savepoint(_session: object, transaction: object) -> None:
            if transaction.nested and not transaction._parent.nested:  # type: ignore
                session.sync_session.begin_nested()

        async def _yield_test_session():
            yield session

        app.dependency_overrides[get_db] = _yield_test_session

        try:
            yield session
        finally:
            app.dependency_overrides.pop(get_db, None)
            await session.close()
            await conn.rollback()


@pytest.fixture
async def client(app) -> AsyncIterator[AsyncClient]:
    """In-process async client over ASGITransport (no real socket)."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c


@pytest.fixture(scope="module", autouse=True)
def frozen_time():
    """Freeze the clock for the module so timestamp-dependent code is deterministic.

    The backend calls ``datetime.now(UTC)`` directly in several modules, so there
    is no single clock seam to inject; ``time_machine`` patches them all at once.
    """
    with time_machine.travel(_FIXED_INSTANT, tick=False):
        yield


async def wait_for(condition, timeout: float = 5.0) -> None:
    """Poll ``condition`` (sync or async) until truthy, or raise after ``timeout``."""
    poll_interval = 0.05
    deadline = asyncio.get_event_loop().time() + timeout

    while True:
        result = condition()
        if inspect.isawaitable(result):
            result = await result
        if result:
            return
        if asyncio.get_event_loop().time() >= deadline:
            raise TimeoutError(f"condition not satisfied within {timeout}s")
        await asyncio.sleep(poll_interval)
