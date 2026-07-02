# ===========================================================================
# Stage 1: frontend — builds the React app.

FROM node:22-slim AS frontend

WORKDIR /ui

COPY ui/package.json ui/package-lock.json ./
RUN npm ci

COPY ui/ ./
RUN npm run build


# ===========================================================================
# Stage 2: Python dependency builder — uv + Python 3.13 on Debian slim.

FROM ghcr.io/astral-sh/uv:python3.13-trixie-slim AS builder

WORKDIR /app

COPY pyproject.toml .
COPY uv.lock .
COPY LICENSE .
COPY README.md .
COPY src/ src/

# Copy pre-built frontend assets (required for wheel artifacts).
COPY --from=frontend /ui/dist src/strands_compose_chat/static

# Install package and all dependencies (no dev groups, installed as a proper wheel).
RUN uv sync --extra postgres --no-dev --no-editable


# ===========================================================================
# Stage 3: runtime — minimal image with only what the app needs.

FROM python:3.13-slim AS runtime

RUN groupadd --gid 1001 app && \
    useradd --uid 1001 --gid 1001 --no-create-home --shell /bin/false app

WORKDIR /app

COPY --from=builder /app/.venv .venv

ENV PATH="/app/.venv/bin:$PATH"

USER app

EXPOSE 8000

# Apply migrations, then start the server bound to all interfaces in the container.
CMD ["sh", "-c", "strands-compose-chat migrate && strands-compose-chat serve --host 0.0.0.0 --port 8000"]
