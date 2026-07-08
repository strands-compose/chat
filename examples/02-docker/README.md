# Docker Compose

Run strands-compose-chat with Docker Compose: the app plus a PostgreSQL
database. This is the simplest production-like setup on a single host.

The image is built from the published PyPI package — no application source is
needed.

## Prerequisites

- Docker with the Compose plugin (`docker compose`)

## Steps

1. **Configure environment.** Copy the template and set the required values:

   ```bash
   cp example.env .env
   ```

   Open `.env` and set `SESSION_SECRET_KEY` (the file shows the command to
   generate one) and `ADMIN_BOOTSTRAP_PASSWORD`. The database connection is
   already wired to the bundled Postgres in `docker-compose.yaml`.

2. **Start.**

   ```bash
   docker compose up --build -d
   ```

   On first start the container applies database migrations automatically,
   then launches the server.

3. **Open the app** at http://localhost:8000 and sign in with the admin
   account from your `.env`. The admin panel is at
   http://localhost:8000/admin, where you add the agents users can chat with.

## Useful commands

```bash
docker compose logs -f backend     # follow logs
docker compose down                # stop (database volume is kept)
docker compose down -v             # stop and delete the database volume
```

## Notes

- **Why gunicorn, not `serve`.**

  CLI command `serve` is a single unmanaged uvicorn process meant for local
  development — if it exits (crash, or hitting a request limit) the container
  dies and the health check fails.

  In production, we recommend **Gunicorn** as process manager: it recycles
  its worker after `max_requests` to bound memory growth from slow leaks,
  and replaces a crashed worker without terminating the container. This matters
  on small tasks (e.g. 0.25 vCPU / 512 MB) where an unbounded process gets OOM-killed.
  Tune it with the `GUNICORN_*` / `WEB_CONCURRENCY` environment variables —
  see `gunicorn.conf.py`
- **Pin the version.** The image installs `strands-compose-chat==0.1.6`. Change
  it by editing the `STRANDS_COMPOSE_CHAT_VERSION` build arg in `Dockerfile`,
  or pass `--build-arg STRANDS_COMPOSE_CHAT_VERSION=X.Y.Z` to `docker build`.
- **Database data** persists in the `pgdata` volume across restarts.
- **Read-only root filesystem?** If you lock the container's root filesystem
  (e.g. AWS ECS `readonlyRootFilesystem: true`), mount **one writable volume at
  `/tmp`** — that is the only writable path the app needs. Gunicorn's control
  socket (`HOME`) and file-upload spillover (`TMPDIR`) are both pinned to `/tmp`
  in the `Dockerfile`. FastAPI buffers uploads in memory up to 1 MB and rolls
  larger attachments over to `TMPDIR`, so without a writable `/tmp` uploads over
  1 MB fail. On Fargate use a task `volumes` entry mounted at `/tmp` (backed by
  task ephemeral storage); `linuxParameters.tmpfs` is EC2-only. No broader
  filesystem access is required.

  ```json
  "containerDefinitions": [{
    "readonlyRootFilesystem": true,
    "mountPoints": [{ "sourceVolume": "tmp", "containerPath": "/tmp" }]
  }],
  "volumes": [{ "name": "tmp" }]
  ```
- **Deploying to a real server?** Set `APP_ENV=prod`, set `TRUSTED_HOSTS`,
  `CORS_ALLOWED_ORIGINS`, and (if using SSO) `OIDC_REDIRECT_URI` to your public
  domain, and serve over HTTPS behind a reverse proxy. In `prod` the session
  cookie is HTTPS-only, so signing in over plain HTTP will not work — HTTPS is
  required. See `example.env` and the [examples overview](../README.md) for
  ECS / Kubernetes guidance.

## Next steps

For configuration options and usage, see the project documentation.
