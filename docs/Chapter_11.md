# Chapter 11 — Docker and Gunicorn

This chapter builds the production image and explains the Gunicorn settings that decide whether chat streams survive a busy day. Everything lives in [`examples/02-docker`](../examples/02-docker).

> **Watch out:** the repo root also has a `Dockerfile`. That one builds from source and runs plain `serve` for development. Do not deploy it.

## Build the Image

The Dockerfile installs the published package from PyPI, so you need no source checkout of the app.

```bash
docker build --build-arg STRANDS_COMPOSE_CHAT_VERSION=0.8.0 -t strands-compose-chat:0.8.0 examples/02-docker
```

The Dockerfile pins `0.8.0` by default. Pass the build argument anyway, so the tag and the version inside always match.

What you get:

| Part | Detail |
|------|--------|
| Base | `python:3.13-slim`, built in two stages so the runtime image carries only the virtualenv |
| Package | `strands-compose-chat[postgres]` at the pinned version, with Gunicorn and the Uvicorn worker |
| User | Non-root `app` (uid 1001) |
| Environment | `HOME=/tmp` and `TMPDIR=/tmp` |
| Extras | `curl`, used by the health check |
| Port | `8000` |
| Command | `strands-compose-chat migrate`, then `exec gunicorn -c /app/gunicorn.conf.py strands_compose_chat.app:app` |

The image has no `HEALTHCHECK` instruction. Compose and ECS define the check themselves (see below). Configuration comes from environment variables only ([Chapter 09](Chapter_09.md)).

## Why Gunicorn, Not `serve`

`scc serve` is one bare Uvicorn process. If it dies, the container dies with it. Gunicorn sits on top as a process manager:

- it restarts a crashed worker without stopping the container
- it recycles the worker after a number of requests, which caps slow memory growth
- as PID 1 (`exec`) it gets `SIGTERM` directly and drains cleanly

The worker class is `uvicorn_worker.UvicornWorker`, so the app still runs on asyncio. One worker handles many concurrent requests and streams.

## Gunicorn Settings

All values come from environment variables ([Chapter 09](Chapter_09.md#gunicorn-variables)). Defaults suit a small task.

| Variable | Default | Advice |
|----------|---------|--------|
| `WEB_CONCURRENCY` | `1` | Keep `1` on 0.25 vCPU. Each extra worker adds a full copy of the app in memory and its own database pool. Add tasks before workers |
| `GUNICORN_MAX_REQUESTS` | `1000` | See [Recycling and Streams](#recycling-and-streams). Use `20000` in production |
| `GUNICORN_MAX_REQUESTS_JITTER` | `100` | Use `2000` with the larger limit |
| `GUNICORN_TIMEOUT` | `120` | Not a stream limit in normal operation. During a recycle it sets how long a running stream may keep going (next section) |
| `GUNICORN_GRACEFUL_TIMEOUT` | `30` | Time to finish streams when the task is stopped. Raise it together with the ECS `stopTimeout` ([Chapter 12](Chapter_12.md)) |
| `GUNICORN_KEEPALIVE` | `30` | Behind an ALB with the default 60 s idle timeout, use `65`. The backend should keep idle connections longer than the load balancer does, or the ALB occasionally reuses a connection that was just closed and returns a 502 |
| `FORWARDED_ALLOW_IPS` | `*` | Trust `X-Forwarded-*` from any peer. Fine when only the load balancer can reach the task (security group). The app needs these headers to know it is on HTTPS |
| `GUNICORN_BIND` | `0.0.0.0:8000` | Change only together with the port in your health check and target group |
| `GUNICORN_ACCESSLOG`, `GUNICORN_ERRORLOG` | `-` | Stdout, which is what you want in a container |

A long stream does not trip `GUNICORN_TIMEOUT`. The worker sends its heartbeat from the event loop, not from requests, so a stream that runs for ten minutes is fine as long as the loop stays responsive. The app also sends an SSE comment (`: ping`) every 20 seconds while the agent is silent, which keeps proxies from closing the connection.

## Recycling and Streams

The request limit counts **every** HTTP request: page loads, assets, API calls and health checks. Health checks alone add roughly 5 to 10 requests per minute on a task behind an ALB, and every page load adds a request per asset and API call. Under real use the default of 1000 is reached within tens of minutes (an estimate, count your own access log).

What happens when a worker reaches the limit (observed with Gunicorn 26 and Uvicorn worker 0.4, with a test app, not the chat app itself):

1. The worker stops accepting connections and lets running requests finish.
2. It no longer sends heartbeats. Gunicorn kills it once `GUNICORN_TIMEOUT` passes, between half of and the full timeout in practice. A stream still running then is **cut**.
3. `GUNICORN_GRACEFUL_TIMEOUT` plays no part here. It applies only when Gunicorn itself asks the worker to stop.
4. With one worker, new connections wait in the socket backlog until the replacement has booted. During a long drain, health checks time out too.

So a low limit costs you a brief stall every few tens of minutes, and cut streams whenever a stream is longer than the drain window. A high limit makes this rare. `20000` with a jitter of `2000` is the recommended starting point. It is an estimate, not a measurement: nobody has profiled memory growth of this app on Fargate, and the limit is only a safety net. Watch task memory for a week and lower the limit if the graph climbs steadily.

## Read-Only Root Filesystem

You can run the container with a read-only root filesystem (ECS `readonlyRootFilesystem`). Mount **one writable volume at `/tmp`** and nothing else.

| Why `/tmp` | Used for |
|------------|----------|
| `HOME=/tmp` | Gunicorn's control socket (it falls back to a folder under `$HOME`) |
| `TMPDIR=/tmp` | Gunicorn's worker heartbeat files, and uploads: files above 1 MB spill from memory to a temp file, so without a writable `/tmp` larger attachments fail |

Python bytecode is precompiled during the build, so the app itself writes nothing else. On Fargate use a task volume, not `tmpfs` ([Chapter 12](Chapter_12.md)).

## TCP Keepalive

Set the kernel parameter `net.ipv4.tcp_keepalive_time` to `60` in the container. On AWS, NAT gateways and VPC endpoints drop connections that are idle for 350 s, and without this setting the first message after a quiet period waits more than a minute for AgentCore ([Chapter 12](Chapter_12.md#idle-connections-to-agentcore)). The Compose file sets it with `sysctls:`. With plain Docker, pass `--sysctl`:

```bash
docker run --sysctl net.ipv4.tcp_keepalive_time=60 -p 8000:8000 --env-file .env strands-compose-chat:0.8.0
```

On ECS it is a `systemControls` entry in the task definition.

## Logs and Health

- All logs go to stdout and stderr. Set `LOG_FORMAT=json` so the app's lines are structured ([Chapter 13](Chapter_13.md#logs)). Gunicorn's own lines stay plain text.
- `GET /health` returns `200` without touching the database. It answers even when `TRUSTED_HOSTS` does not match, so probes by IP work. Use it for the container check:

```bash
curl --fail --silent http://localhost:8000/health
```

## Try It Locally With Compose

[`examples/02-docker/docker-compose.yaml`](../examples/02-docker/docker-compose.yaml) starts the image plus Postgres 17, with a `curl` health check on `/health`.

```bash
cd examples/02-docker
cp example.env .env          # set SESSION_SECRET_KEY and ADMIN_BOOTSTRAP_PASSWORD
docker compose up --build -d
```

Open `http://localhost:8000`. Keep `APP_ENV=dev` here, because `prod` makes the cookie HTTPS-only and plain `http://localhost` would not sign in.

## Next

[Chapter 12 — Deploying on ECS Fargate](Chapter_12.md)
