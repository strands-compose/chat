"""Command-line entry points for operating the application.

Exposes the ``strands-compose-chat`` console script with two subcommands:

- ``migrate`` — apply all pending database migrations (``alembic upgrade head``).
- ``serve`` — run the ASGI application with uvicorn.

The commands are intentionally separate and composable: a container or init
job runs ``migrate`` once, then ``serve`` starts the web process.
"""

import argparse
from pathlib import Path

from alembic import command
from alembic.config import Config

# The Alembic config ships inside the installed package; its ``script_location``
# resolves the migrations via importlib regardless of the working directory.
_ALEMBIC_INI = Path(__file__).parent / "alembic.ini"

_DEFAULT_HOST = "127.0.0.1"
_DEFAULT_PORT = 8000


def _alembic_config() -> Config:
    """Build an Alembic ``Config`` pointing at the packaged ``alembic.ini``."""
    return Config(str(_ALEMBIC_INI))


def migrate() -> None:
    """Apply all pending database migrations up to the latest revision."""
    command.upgrade(_alembic_config(), "head")


def serve(host: str = _DEFAULT_HOST, port: int = _DEFAULT_PORT) -> None:
    """Run the web server.

    Args:
        host: Interface to bind (default: loopback; use ``0.0.0.0`` in containers).
        port: TCP port to listen on.
    """
    import uvicorn  # noqa: PLC0415 — deferred so `migrate` does not import the server stack

    uvicorn.run(
        "strands_compose_chat.app:app",
        host=host,
        port=port,
        timeout_keep_alive=30,
        proxy_headers=True,
        forwarded_allow_ips="*",
        limit_max_requests=500,
        limit_max_requests_jitter=50,
    )


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
