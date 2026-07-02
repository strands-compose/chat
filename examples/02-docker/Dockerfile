# ===========================================================================
# Stage 1: build a virtualenv containing the published package from PyPI.

FROM ghcr.io/astral-sh/uv:python3.13-trixie-slim AS builder

ENV UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    VIRTUAL_ENV=/app/.venv

WORKDIR /app

# Pin the version to deploy. Override at build time with:
#   docker build --build-arg STRANDS_COMPOSE_CHAT_VERSION=X.Y.Z .
ARG STRANDS_COMPOSE_CHAT_VERSION=0.1.3

RUN uv venv "$VIRTUAL_ENV" && \
    uv pip install "strands-compose-chat[postgres]==${STRANDS_COMPOSE_CHAT_VERSION}"


# ===========================================================================
# Stage 2: minimal runtime image with only the virtualenv and a non-root user.

FROM python:3.13-slim AS runtime

# curl is used by the docker-compose healthcheck.
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*

RUN groupadd --gid 1001 app && \
    useradd --uid 1001 --gid 1001 --no-create-home --shell /bin/false app

WORKDIR /app

COPY --from=builder /app/.venv /app/.venv
ENV PATH="/app/.venv/bin:$PATH"

USER app

EXPOSE 8000

# Apply migrations, then start the server bound to all interfaces in the container.
CMD ["sh", "-c", "strands-compose-chat migrate && strands-compose-chat serve --host 0.0.0.0 --port 8000"]
