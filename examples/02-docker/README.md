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
   cp .env.example .env
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

- **Pin the version.** The image installs `strands-compose-chat==0.1.0`. Change
  it by editing the `STRANDS_COMPOSE_CHAT_VERSION` build arg in `Dockerfile`,
  or pass `--build-arg STRANDS_COMPOSE_CHAT_VERSION=X.Y.Z` to `docker build`.
- **Database data** persists in the `pgdata` volume across restarts.
- **Deploying to a real server?** Set `APP_ENV=prod`, set `TRUSTED_HOSTS`,
  `CORS_ALLOWED_ORIGINS`, and (if using SSO) `OIDC_REDIRECT_URI` to your public
  domain, and serve over HTTPS behind a reverse proxy. In `prod` the session
  cookie is HTTPS-only, so signing in over plain HTTP will not work — HTTPS is
  required. See `.env.example` and the [examples overview](../README.md) for
  ECS / Kubernetes guidance.

## Next steps

For configuration options and usage, see the project documentation.
