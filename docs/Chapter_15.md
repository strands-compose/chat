# Chapter 15 — Troubleshooting

Find your symptom, check the cause, apply the fix. Rows are grouped by where the problem shows up. When a row names a log line, search for it as described in [Chapter 13](Chapter_13.md#logs).

## Startup

The process exits before it listens. In Gunicorn you see `Worker failed to boot`. The real error is the traceback above it.

| Symptom (message) | Cause | Fix |
|-------------------|-------|-----|
| `SESSION_SECRET_KEY must decode to at least 32 bytes` | Missing, short, or a short hex string. A 32-character hex value is valid base64 and decodes to 24 bytes | `python -c "import secrets; print(secrets.token_urlsafe(32))"` |
| `error parsing value for field "TRUSTED_HOSTS"` (or `CORS_ALLOWED_ORIGINS`, `OIDC_PROVIDERS`, `FRAME_ANCESTORS`) | List written as plain text | JSON array: `["chat.example.com"]` |
| `... must not contain '*' in prod` | Wildcard host or origin with `APP_ENV=prod` | List the real host names |
| `DATABASE_URL must not use SQLite in prod` | SQLite with `APP_ENV=prod` | Use Postgres ([Chapter 10](Chapter_10.md)) |
| `Unsupported DATABASE_URL scheme` | Plain `postgresql://` or `postgres://` | Write `postgresql+psycopg://...` |
| `'psycopg' package is not installed` | Postgres URL, package installed without the extra | `pip install "strands-compose-chat[postgres]"`. The Docker example already has it |
| `Input should be 'dev', 'test' or 'prod'` | Typo in `APP_ENV` | Use one of the three |
| `AUTH_LOCAL_SIGNIN_ENABLED=false requires at least one OIDC_PROVIDERS entry` | Local sign-in off and no SSO | Add a provider or turn local sign-in back on |
| `Provider 'entra' is missing required configuration: ...` | A required `OIDC_<ID>_*` key is absent | Set `..._DISCOVERY_URL` and `..._CLIENT_ID` ([Chapter 09](Chapter_09.md#oidc-provider-keys)) |
| `CHAT_MEDIA_MAX_FILE_BYTES (...) must not exceed CHAT_MEDIA_MAX_TOTAL_BYTES` | Per-file limit above the total | Raise the total or lower the file limit |
| `FRAME_ANCESTORS accepts only 'self' or 'none'` | Another origin listed | Cross-origin framing is not supported |
| A setting has no effect | Name misspelled (unknown names are ignored), or `.env` is not in the working directory | Compare with [Chapter 09](Chapter_09.md). Run from the folder that holds `.env` |

## Sign-In

| Symptom | Cause | Fix |
|---------|-------|-----|
| Login seems to do nothing; you land on the login page again (prod) | The session cookie is `Secure` and you are on plain `http://` | Use HTTPS end to end. Keep `APP_ENV=dev` only for local HTTP |
| `400 Invalid host header` on every page | The host name is not in `TRUSTED_HOSTS` | Add the exact name users type. Health checks are exempt, which is why they still pass |
| Signed out after every deploy, or randomly | `SESSION_SECRET_KEY` changed, or tasks have different keys | One key for all tasks, stored as a secret |
| Signed out after about 12 hours | `SESSION_TTL_SECONDS` | Raise it. Activity does not extend the cookie |
| IdP shows a redirect URI mismatch | The URI sent differs from the one registered. Behind an ALB the inferred URI can come out as `http://` | Set `OIDC_REDIRECT_URI=https://<host>/auth/callback` and register exactly that |
| `400 No active sign-in was found` after the IdP | The cookie from the start of sign-in did not come back: different host name (`www` versus apex), plain HTTP, or another task with another secret key | Use the same host for start and callback. Check the key on all tasks |
| `401 Authentication failed` after the IdP | Wrong client secret, or token checks failed (`OIDC_<ID>_CLIENT_SECRET`, clock, scopes) | Check the secret and the IdP app registration |
| `502 The identity provider is currently unavailable` | The task cannot reach the discovery URL | Check egress (NAT or endpoint) and the URL |
| `403 Your account is deactivated` | An admin deactivated the user | Reactivate in the admin panel |
| `403 User registration is currently disabled` | `AUTH_REGISTRATION_ENABLED` is off (the default once an OIDC provider exists) | Create users in the admin panel, or enable it explicitly |
| `403 Local sign-in is currently disabled` | `AUTH_LOCAL_SIGNIN_ENABLED=false` | Use SSO |
| SSO works but the user sees no agents | New SSO users start with no group ([Chapter 08](Chapter_08.md)) | Add the user to a group that has the agent |
| API call returns `401` | Key missing, revoked or expired, owner inactive, or the token does not start with `sck_` | Issue a new key ([Chapter 07](Chapter_07.md)) |

## Agents

| Symptom | Cause | Fix |
|---------|-------|-----|
| Agent not in the picker | Agent disabled, or it shares no group with the user | Enable it, link a group ([Chapter 08](Chapter_08.md)) |
| "The agent service is currently unavailable" | Log shows `upstream agent error`. Usually `AccessDeniedError` (task role lacks `bedrock-agentcore:InvokeAgentRuntime`), a wrong ARN or region, or throttling | Fix the IAM policy or the agent entry ([Chapter 06](Chapter_06.md)) |
| "An internal error occurred" a minute into an answer | A runtime agent sent no data for 60 s. The AWS SDK default read timeout applies, and the app does not change it. Log: `unexpected error during agent stream` with `ReadTimeoutError` | Have the agent emit events during long tool calls. There is no setting for this in the app |
| Local agent unreachable | The URL is resolved from inside the container, so `localhost` is the container itself. In prod the URL must be `https://` | Use a reachable host name. Connect timeout is 5 s, read timeout 300 s |
| `402 Budget exceeded` | The user's spend this UTC month reached their budget | Raise the budget in the admin panel, or wait for the 1st |
| `404 Agent ... not available` in an old chat | The agent was disabled or removed from the user's groups | Restore access. Each chat stays locked to its agent |
| Answer reached the user but is missing after reload | Log shows `failed to persist ...; stream unaffected` | Fix the database problem ([Database](#database)) |

## Streaming

| Symptom | Cause | Fix |
|---------|-------|-----|
| Stream stops at a fixed time (30 s, 60 s, ...) | A proxy or load balancer timeout shorter than the gap between bytes. The app sends `: ping` every 20 s, and the ALB default is 60 s | Make every hop's idle timeout at least 30 s. Look for a CDN or WAF in front |
| The whole answer appears at once at the end | A proxy buffers the response. The app already sends `X-Accel-Buffering: no` and `Cache-Control: no-cache` | Turn off response buffering on the proxy |
| Streams cut and `WORKER TIMEOUT` in the log | Worker recycled while a stream was running ([Chapter 11](Chapter_11.md#recycling-and-streams)) | Raise `GUNICORN_MAX_REQUESTS` (for example `20000`) |
| Short stalls, health checks failing now and then | Same recycling with one worker. New connections wait for the replacement | Same fix, and run two or more tasks |
| Sporadic `502` from the ALB | Gunicorn closes idle connections (30 s) before the ALB does (60 s) | `GUNICORN_KEEPALIVE=65` |
| `503` from the ALB | No healthy targets | See [Deployment](#deployment) |
| Streams cut during a deploy or scale-in | Task stopped before streams finished | Raise `stopTimeout` and `GUNICORN_GRACEFUL_TIMEOUT` ([Chapter 12](Chapter_12.md)). Max `stopTimeout` on Fargate is 120 s |

## Uploads

| Symptom | Cause | Fix |
|---------|-------|-----|
| UI refuses a file | Larger than `CHAT_MEDIA_MAX_FILE_BYTES`, total or count limit hit | Raise the limits ([Chapter 09](Chapter_09.md#attachments)) |
| `422 Cannot determine a supported media format` | Unknown extension and content type | Use a listed format. The picker shows them, they come from `/api/v1/media/capabilities` |
| Files over about 1 MB fail only in the container | No writable `/tmp`, so the upload cannot spill to disk | Mount a volume at `/tmp` ([Chapter 11](Chapter_11.md#read-only-root-filesystem)) |
| Large file accepted by the UI is rejected later | The agent runtime applies its own payload limits | Check the agent's limits. The chat backend does not check size |

## Database

| Symptom | Cause | Fix |
|---------|-------|-----|
| `no such table`, `relation "users" does not exist`, or `column ... does not exist` | Migrations did not run, or an upgrade skipped them | Run `scc migrate` ([Chapter 10](Chapter_10.md#migrations)) |
| Migration task exits non-zero | Database unreachable, wrong credentials, or a secret not injected | Read the task's log stream. Check security groups and `DATABASE_URL` |
| `QueuePool limit ... reached, connection timed out` | More than 15 connections wanted by one worker | Look for slow queries or a stuck database. The pool size is not configurable |
| `too many connections` | Tasks times 15 exceeds the instance's `max_connections` | Fewer tasks or workers, or a larger instance |
| Password with `@` or `/` is rejected | Not URL-encoded | `@` becomes `%40`, `/` becomes `%2F` |
| `database is locked` (SQLite) | Several writers | Dev only. Use Postgres |

## Deployment

| Symptom | Cause | Fix |
|---------|-------|-----|
| Targets unhealthy right after start | Health check starts before the app is up | Health check grace period 60 s, container `startPeriod` 60 s |
| Targets unhealthy later | Wrong port or path, or the security group blocks the ALB | Path `/health`, port `8000`, ALB group allowed on 8000 |
| Task stops at once with "cannot pull image" or "unable to retrieve secret" | Execution role lacks ECR or `secretsmanager:GetSecretValue` | Fix the execution role. The task role is not involved at this stage |
| Container exits with a write error on the filesystem | `readonlyRootFilesystem` without a `/tmp` volume | Add the volume and mount ([Chapter 12](Chapter_12.md)) |
| Everything is `400` but `/health` is fine | `TRUSTED_HOSTS` still has the default | Set it to your host name |
| Page 404 under a sub-path | `URL_PREFIX` differs from the path the ALB forwards | The ALB does not strip paths, so use the same prefix in both |

## Next

[Chapter 16 — Developer Guide](Chapter_16.md)
