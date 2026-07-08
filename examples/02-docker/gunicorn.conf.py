"""Gunicorn configuration for running strands-compose-chat in production.

Gunicorn acts as the process manager: it keeps the container alive and recycles
its worker on a request count, so a slow memory leak never grows unbounded and a
crashed worker is replaced without terminating the container (which would trip
the ECS/ALB health check and kill the task).

Every value can be overridden with an environment variable, so the same image
tunes to different CPU/memory budgets without a rebuild. Defaults target a small
container (e.g. 0.25 vCPU / 512 MB).
"""

import os

# Bind to all interfaces inside the container.
bind = os.getenv("GUNICORN_BIND", "0.0.0.0:8000")

# One async uvicorn worker per process. A single ASGI worker already handles
# concurrent requests; scale with WEB_CONCURRENCY only when you have the CPU.
workers = int(os.getenv("WEB_CONCURRENCY", "1"))
worker_class = "uvicorn_worker.UvicornWorker"

# Recycle a worker after this many requests
# (+ jitter so workers don't all recycle at once).
max_requests = int(os.getenv("GUNICORN_MAX_REQUESTS", "1000"))
max_requests_jitter = int(os.getenv("GUNICORN_MAX_REQUESTS_JITTER", "100"))

# High worker timeout so the silence watchdog never fires on a slow model
# time-to-first-token or a long-lived SSE stream.
timeout = int(os.getenv("GUNICORN_TIMEOUT", "120"))
graceful_timeout = int(os.getenv("GUNICORN_GRACEFUL_TIMEOUT", "30"))
keepalive = int(os.getenv("GUNICORN_KEEPALIVE", "30"))

# Behind a reverse proxy / load balancer: trust forwarded headers.
forwarded_allow_ips = os.getenv("FORWARDED_ALLOW_IPS", "*")

# Log to stdout/stderr for container log collection.
accesslog = os.getenv("GUNICORN_ACCESSLOG", "-")
errorlog = os.getenv("GUNICORN_ERRORLOG", "-")
