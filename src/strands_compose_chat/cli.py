"""Command-line entry points for operating the application.

Exposes the ``strands-compose-chat`` console script with two subcommands:

- ``migrate`` — apply all pending database migrations (``alembic upgrade head``).
- ``serve`` — run the ASGI application (gunicorn+uvicorn on Linux, plain uvicorn
  on Windows, where gunicorn is unavailable).

The commands are intentionally separate and composable: a container or init
job runs ``migrate`` once, then ``serve`` starts the web process.
"""

import argparse
import platform
from pathlib import Path
from typing import Any

from alembic import command
from alembic.config import Config

# The Alembic config ships inside the installed package; its ``script_location``
# resolves the migrations via importlib regardless of the working directory.
_ALEMBIC_INI = Path(__file__).parent / "alembic.ini"

_DEFAULT_HOST = "127.0.0.1"
_DEFAULT_PORT = 8000

# Recycle a worker after ~500 requests (jittered) to bound memory growth.
_MAX_REQUESTS = 500
_MAX_REQUESTS_JITTER = 50
# High enough that gunicorn's worker-silence watchdog never fires on a slow
# model time-to-first-token or a long-lived SSE stream.
_TIMEOUT = 120
_GRACEFUL_TIMEOUT = 30
_KEEPALIVE = 30


def _alembic_config() -> Config:
    """Build an Alembic ``Config`` pointing at the packaged ``alembic.ini``."""
    return Config(str(_ALEMBIC_INI))


def migrate() -> None:
    """Apply all pending database migrations up to the latest revision."""
    command.upgrade(_alembic_config(), "head")


def _serve_gunicorn(host: str, port: int) -> None:
    """Run the app under gunicorn with a recycling uvicorn worker.

    Plain uvicorn's ``limit_max_requests`` exits the whole process, which kills
    the ECS task and trips the ALB health check; gunicorn recycles the worker
    without ever stopping the process, so request-based recycling is safe here.
    """
    from gunicorn.app.base import BaseApplication  # noqa: PLC0415 — deferred, Linux-only dep

    options = {
        "bind": f"{host}:{port}",
        "worker_class": "uvicorn_worker.UvicornWorker",
        "workers": 1,
        "timeout": _TIMEOUT,
        "graceful_timeout": _GRACEFUL_TIMEOUT,
        "keepalive": _KEEPALIVE,
        "max_requests": _MAX_REQUESTS,
        "max_requests_jitter": _MAX_REQUESTS_JITTER,
        "forwarded_allow_ips": "*",
    }

    class _GunicornApplication(BaseApplication):
        """Programmatic gunicorn application wrapping the ASGI app."""

        def load_config(self) -> None:
            if self.cfg is None:
                raise RuntimeError("gunicorn did not initialise its configuration")
            for key, value in options.items():
                self.cfg.set(key, value)

        def load(self) -> Any:
            from strands_compose_chat.app import app  # noqa: PLC0415

            return app

    _GunicornApplication().run()


def serve(host: str = _DEFAULT_HOST, port: int = _DEFAULT_PORT) -> None:
    """Run the web server.

    Args:
        host: Interface to bind (default: loopback; use ``0.0.0.0`` in containers).
        port: TCP port to listen on.
    """
    if platform.system() == "Windows":
        # gunicorn does not support Windows; fall back to plain uvicorn without
        # request-based recycling (see `_serve_gunicorn` for why it matters).
        import uvicorn  # noqa: PLC0415 — deferred so `migrate` does not import the server stack

        uvicorn.run(
            "strands_compose_chat.app:app",
            host=host,
            port=port,
            timeout_keep_alive=_KEEPALIVE,
            proxy_headers=True,
            forwarded_allow_ips="*",
        )
    else:
        _serve_gunicorn(host, port)


def main(argv: list[str] | None = None) -> None:
    """Parse arguments and dispatch to the selected subcommand.

    Args:
        argv: Optional argument vector; defaults to ``sys.argv`` when None.
    """
    parser = argparse.ArgumentParser(
        prog="strands-compose-chat",
        description="Operate the strands-compose-chat server.",
    )
    subcommands = parser.add_subparsers(dest="command", required=True)

    subcommands.add_parser(
        "migrate",
        help="Apply pending database migrations (alembic upgrade head).",
    )

    serve_parser = subcommands.add_parser("serve", help="Run the web server.")
    serve_parser.add_argument(
        "--host",
        default=_DEFAULT_HOST,
        help=f"Interface to bind (default: {_DEFAULT_HOST}; use 0.0.0.0 in containers).",
    )
    serve_parser.add_argument(
        "--port",
        type=int,
        default=_DEFAULT_PORT,
        help=f"TCP port to listen on (default: {_DEFAULT_PORT}).",
    )

    args = parser.parse_args(argv)

    if args.command == "migrate":
        migrate()
    elif args.command == "serve":
        serve(args.host, args.port)


if __name__ == "__main__":
    main()
