<div align="center">
<img src="https://raw.githubusercontent.com/strands-compose/.github/main/img/chat-logo.png" alt="strands-compose-chat" width="300">

# Strands Compose Chat

**A ready-to-run web chat application for agents built with [strands-compose](https://github.com/strands-compose/sdk-python).**

<p>
  <a href="https://www.python.org/"><img src="https://img.shields.io/badge/python-3.11+-blue.svg" alt="Python 3.11+"></a>
  <a href="https://pypi.org/project/strands-compose-chat/"><img src="https://img.shields.io/pypi/v/strands-compose-chat.svg" alt="PyPI version"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-Apache--2.0-blue.svg" alt="License"></a>
</p>

</div>

> [!IMPORTANT]
> Community project — not affiliated with AWS or the strands-agents team. Bugs here? [Open an issue](https://github.com/strands-compose/chat/issues). Bugs in the underlying SDK? Head to [strands-agents](https://github.com/strands-agents/sdk-python).


## Overview

[Strands Compose](https://github.com/strands-compose/sdk-python) lets you describe an agent system in a single YAML file, and
[Strands Compose Agentcore](https://github.com/strands-compose/bedrock-agentcore)
runs that system on AWS Bedrock AgentCore Runtime.

**Strands Compose Chat** is the front door: a complete web application where people sign in, open a conversation, and chat with the agents you have built.
It handles everything around them - user accounts, conversations, history, access control, and usage tracking.

**Focus on building agents, and this app makes them accessible to your users.**

---

Where it fits in the ecosystem:

| Layer | Package | Who uses it |
|-------|---------|-------------|
| Define the agents | [strands-compose](https://github.com/strands-compose/sdk-python) | Developers |
| Run / deploy the agents | [strands-compose-agentcore](https://github.com/strands-compose/bedrock-agentcore) | Developers, operations |
| **Put the agents in front of people** | [**strands-compose-chat**](https://github.com/strands-compose/chat-ui) | **End users** |

## What's included

The application comes complete — there is nothing to assemble:

| Feature | What it gives you |
|---------|-------------------|
| **Chat interface** | Live, streaming replies with multi-agent systems showing their work as it happens. Conversations are saved so people can return to earlier threads. |
| **File attachments** | Users can send images and documents alongside their messages, within configurable size limits. |
| **User accounts and sign-in** | Built-in username/password accounts, plus optional single sign-on (SSO) through your existing identity provider — Microsoft Entra, Okta, Google, or any standards-based OAuth provider. |
| **Access control** | Agents are organised by group, so each person only sees the agents they are entitled to use. Access is closed by default. |
| **Admin panel** | A web console where an administrator registers agents, manages users and groups, and reviews activity. |
| **Usage and cost tracking** | Every interaction records token usage, with per-model pricing, per-user budgets, and a dashboard for both administrators and individual users. |

## Who it's for

- **Freelancers and small teams** who have built an agent and need to put it in
  front of clients or colleagues quickly, with a polished interface and proper
  sign-in.
- **Organisations** that want an internal AI assistant or department-specific
  agents, gated behind company SSO, with usage and cost visibility for
  budgeting.
- **Anyone** delivering an agent as a product or internal service who would
  rather configure a chat app than build and maintain one.

## Getting started

The application is published on PyPI as `strands-compose-chat` and includes the
web interface bundled in. Installing it gives you a command-line tool available
as `strands-compose-chat` or its short alias `scc`.

```bash
pip install strands-compose-chat
```

A minimal local run:

```bash
scc migrate     # create the database
scc serve       # start the web server on http://127.0.0.1:8000
```

Two worked setups are in the [`examples`](examples) directory:

- [`01-local-dev`](examples/01-local-dev) — run on your own machine with a
  local database. The fastest way to try the app.
- [`02-docker`](examples/02-docker) — a production-like stack (the app plus a
  PostgreSQL database) with Docker Compose. **Recommended for production**, and
  the basis for deploying to orchestrators such as ECS or Kubernetes.

Each example has step-by-step instructions and a configuration template.

## Technical overview

The intent here is a brief map, not a deep reference — detailed documentation
lives in separate documents.

**Architecture.**

A single deployable application made of two parts: a Python
backend and a web frontend that ships bundled inside it. The backend exposes the
API and serves the interface; the frontend is what users see in the browser. The
backend talks to your agents only through the strands-compose SDK, so anything
agent-related stays consistent with the rest of the ecosystem.

**Tech stack.**

Built on a modern, high-performance stack selected for streaming and multi-tenant workloads. The async backend handles concurrent SSE streams without blocking, the database layer uses async SQLAlchemy 2.0 with eager-loaded relationships and parameterised queries throughout, and the frontend delivers a responsive interface with real-time updates via an event-driven store.

| Layer | Technology |
|-------|------------|
| Backend | FastAPI, async SQLAlchemy, Pydantic, Alembic, sqladmin, uvicorn |
| Frontend | React, TypeScript, Vite |
| Database | SQLite (local development), PostgreSQL (production) |

**Security.**

Authentication, authorisation, and transport security are implemented to production standards with no shortcuts. Every endpoint is gated, every credential is hashed or redacted, and production mode enforces a strict baseline at startup — refusing misconfiguration rather than running with it silently.

| Area | Implementation |
|------|---------------|
| Authentication | Session-cookie and Bearer API key. Constant-time, enumeration-safe.|
| Password storage | Argon2id hashes only; raw credentials are never persisted or logged. |
| Authorisation | Role-based FastAPI dependencies on every endpoint. Agent visibility requires explicit group membership. |
| OIDC / SSO | Standards-based OAuth 2.0 / OpenID Connect; redirect targets validated against open-redirect. |
| Security headers | `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Content-Security-Policy`, `X-XSS-Protection`, `Referrer-Policy` on every response. |
| Transport | `TrustedHostMiddleware`, configurable `CORS_ALLOWED_ORIGINS`.|
| Production hardening | `APP_ENV=prod` enforces HTTPS-only cookies, rejects SQLite and wildcard CORS/host settings at startup. |
| Secrets handling | All credentials via environment variables; sensitive fields redacted in logs, diagnostics, and config repr. |
