# Deployment examples

Starter setups for running strands-compose-chat. The application is published
to PyPI as `strands-compose-chat` and ships with the web UI bundled in, so
these examples only provide the deployment glue around it.

| Example | Use it when you want to… | Database |
|---------|--------------------------|----------|
| [`01-local-dev`](01-local-dev) | Run on your machine to try or develop the app | SQLite |
| [`02-docker`](02-docker) | Run a production-like stack on one host | PostgreSQL |

Each example contains its own README with step-by-step instructions and an
`example.env` you copy to `.env`. The `.env` files are grouped into
**mandatory**, **common**, and **optional** settings.

## Configuration at a glance

- **`SESSION_SECRET_KEY`** is the only always-required setting. Generate one
  with `python -c "import secrets; print(secrets.token_urlsafe(32))"`.
- **`APP_ENV=prod`** turns on production safety checks: SQLite is rejected,
  `TRUSTED_HOSTS` / `CORS_ALLOWED_ORIGINS` must name real hosts (no `*`), and
  session cookies become HTTPS-only — so production must be served over HTTPS.
- A first-run admin account is created from `ADMIN_BOOTSTRAP_USERNAME` /
  `ADMIN_BOOTSTRAP_PASSWORD`; create further users from the admin panel.

See the project documentation for the full configuration reference and an
explanation of how the app works.

## Running on ECS, Kubernetes, or other orchestrators

The image built in [`02-docker`](02-docker) is a standard container and runs
anywhere. A few things to get right:

- **Migrations.** Run `strands-compose-chat migrate` once per release as a
  one-off task (ECS run-task) or an init container (Kubernetes) before starting
  the server. The server itself starts with `strands-compose-chat serve --host
  0.0.0.0`.
- **Configuration via the platform.** Inject every setting as task/pod
  environment variables. Provide secrets — `SESSION_SECRET_KEY`, `DATABASE_URL`
  credentials, and any `OIDC_*_CLIENT_SECRET` — through your secrets manager
  (AWS Secrets Manager, Kubernetes Secrets), never baked into the image.
- **Database.** Point `DATABASE_URL` at a managed Postgres (e.g. Amazon RDS)
  using the `postgresql+psycopg://` scheme.
- **Behind a load balancer / ingress.** Terminate TLS at the proxy and forward
  proxy headers; the server already trusts them. Set `APP_ENV=prod`,
  `TRUSTED_HOSTS`, `CORS_ALLOWED_ORIGINS`, and `OIDC_REDIRECT_URI` to your
  public domain. Use `URL_PREFIX` when hosting under a sub-path.
- **Health probes.** Use `/health` for liveness and `/ready` for readiness
  (`/ready` also checks database connectivity).
