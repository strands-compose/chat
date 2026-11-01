# Chapter 13 — Operations

Day-two topics: health checks, logs, upgrades, rollbacks, and rotating secrets.

## Health Endpoints

| Path | Checks | Returns |
|------|--------|---------|
| `/health` | The process answers. No database access | `200 {"status":"ok"}` |
| `/ready` | Runs `SELECT 1` on the database | `200 {"status":"ready"}`, or `503 {"status":"db unavailable"}` |

Both exist at the root and under `URL_PREFIX`, need no sign-in, and skip the `TRUSTED_HOSTS` check, so probes that call the task by IP work. Neither one checks agents or AgentCore. Point load balancer and container checks at `/health`. Use `/ready` by hand or in a monitor when you want to know about the database.

## Logs

The app writes one line per event to stdout. With `LOG_FORMAT=json` ([Chapter 09](Chapter_09.md#logging)) each line is a JSON object:

```json
{"user_id": "u1", "usage": 10.2, "budget": 10.0, "event": "Budget exceeded", "level": "warning", "timestamp": "2026-11-01T02:15:41.234464Z", "filename": "invocation.py", "func_name": "invoke", "lineno": 76}
```

`event` is the message, `level` the severity, and everything else is context. In CloudWatch Logs Insights, filter on `event` and `level`. The default `console` format is for people at a terminal, not for parsers.

A processor removes these field names from every line: `password`, `password_hash`, `id_token`, `authorization`, `cookie`, `set-cookie`, and the same three header names inside a `headers` field. It works on field names only. It does not scan message text, and it does not know about other secrets.

Gunicorn adds its own plain-text lines, including the access log. Those lines contain the full request path with query string, which includes the one-time `code` of an OIDC callback.

### What to Search For

| `event` or text | Level | Meaning |
|-----------------|-------|---------|
| `upstream agent error` | warning | The call to AgentCore failed: access denied, throttling, unreachable runtime. The user saw "The agent service is currently unavailable" |
| `unexpected error during agent stream` | error | Unhandled exception while streaming, with a traceback. One known cause is a runtime agent that sends nothing for 60 s (`ReadTimeoutError`). The user saw "An internal error occurred" |
| `Unhandled exception` | error | Unhandled exception in a normal request. The client got a generic 500 |
| `failed to persist ...; stream unaffected` | warning | A database write failed during a turn. The user got the answer, but it is missing from history or usage |
| `Budget exceeded` | warning | A user hit the monthly budget (HTTP 402) |
| `stream interrupted by client disconnect` | info | The browser left mid-stream |
| `failed to stop agentcore session` | warning | The follow-up stop call failed, usually a missing `StopRuntimeSession` permission |
| `api-key auth failed: ...` | warning | Bad, revoked, expired or inactive key |
| `Bootstrap superuser created`, `JIT-provisioned new user` | info | A first admin or a first SSO sign-in |
| `Worker failed to boot` | Gunicorn | Settings, database URL or OIDC configuration invalid. The traceback above it names the cause |
| `Maximum request limit of N exceeded` | Gunicorn | A worker is recycling ([Chapter 11](Chapter_11.md#recycling-and-streams)) |
| `WORKER TIMEOUT` | Gunicorn | A worker was killed after it stopped sending heartbeats. Often a recycle that ran into a long stream |

## Security Headers

Every response, including static files, carries:

| Header | Value |
|--------|-------|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` |
| `X-Content-Type-Options` | `nosniff` |
| `X-XSS-Protection` | `1; mode=block` |
| `Referrer-Policy` | `no-referrer` |
| `Content-Security-Policy` | `default-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; frame-src 'self' blob:; frame-ancestors 'self'` (or `'none'`) |
| `X-Frame-Options` | `SAMEORIGIN` (or `DENY`) |
| `Server` | Empty |

The last two framing values follow `FRAME_ANCESTORS`. Admin pages always allow same-origin framing, because the dashboard is embedded in the admin panel.

## Upgrades and Rollback

An upgrade is: back up, migrate, roll.

1. Read the [changelog](../CHANGELOG.md) for the new version.
2. Take an RDS snapshot.
3. Build and push the new image tag ([Chapter 11](Chapter_11.md)), then register a task definition revision that uses it.
4. Run the migration task from that revision and wait for exit code `0` ([Chapter 12](Chapter_12.md#run-the-migration)).
5. Update the service to the new revision. ECS starts new tasks before it stops old ones.
6. Check `/ready`, sign in, send a message.

During step 5, old and new code run against the new schema for a few minutes. The three migrations so far are small (a `json` to `jsonb` change on Postgres, then new columns with defaults), so old tasks keep working. Check the changelog for any release that says otherwise.

**Rolling back the code.** Register or select the previous task definition revision and update the service. This is safe when the migration was additive, as above.

**Rolling back the schema.** Every revision has a `downgrade()`. The `scc` command does not expose it, so run Alembic against the packaged config in a one-off task:

```bash
alembic -c /app/.venv/lib/python3.13/site-packages/strands_compose_chat/alembic.ini downgrade -1
```

This was tested on SQLite only (`0003` down to `0002` and up again), not on Postgres. Downgrades drop data: `0003` removes the cache token columns, and `0001` removes every table. If data matters, restore the snapshot instead.

## Rotating Secrets

| Secret | Effect | How |
|--------|--------|-----|
| `SESSION_SECRET_KEY` | Every signed-in user is signed out, and admin logins end. API keys are unaffected, they do not use this key | Update the secret, force a new deployment. During the roll, users may bounce between old and new tasks, so do it off-peak |
| OIDC client secret | New sign-ins fail with the old secret. Signed-in users are unaffected | Create the new secret at the identity provider while the old one still works, update Secrets Manager, force a new deployment, then retire the old secret |
| Database password | Existing connections stay up until they are recycled. New ones fail with the old password | Change it in RDS and in the `DATABASE_URL` secret, force a new deployment |
| API key | Only that key | Revoke it in the admin panel and issue a new one ([Chapter 07](Chapter_07.md)) |

Settings are read once at startup. Updating a secret in Secrets Manager does nothing until tasks restart. `aws ecs update-service --force-new-deployment` does that.

## Bootstrap Admin

At every start the app checks for a superuser. If the table has none and both `ADMIN_BOOTSTRAP_USERNAME` and `ADMIN_BOOTSTRAP_PASSWORD` are set, it creates one. If one exists, nothing happens, even if that account is deactivated.

So the variables are inert after the first start. Changing the password variable later does not change the admin's password. Do that in the admin panel. If you lock yourself out of every superuser, you need a direct database edit (`is_superuser` or `is_active` on a user row).

> **Watch out:** on a brand-new database, start one task first. Two tasks that boot at the same moment can both try to create the admin. The loser can fail on the unique username and restart.

## Next

[Chapter 14 — HTTP API and Streaming](Chapter_14.md)
