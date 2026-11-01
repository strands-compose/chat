# Chapter 10 — Database

The app stores everything in one relational database: users, agents, conversations and usage. This chapter covers which database to pick, what the tables hold, how migrations work, and how to back up.

## SQLite or Postgres

| | SQLite | PostgreSQL |
|---|--------|------------|
| Use it for | Trying the app, local development | Anything real |
| `DATABASE_URL` | `sqlite+aiosqlite:///./strands-chat.sqlite` (default) | `postgresql+psycopg://user:password@host:5432/dbname` <!-- pragma: allowlist secret --> |
| Extra install | none | `pip install "strands-compose-chat[postgres]"` (the Docker example already includes it) |
| `APP_ENV=prod` | Rejected at startup | Required in practice |
| Several app processes | No. One file, one host | Yes, share one database |

The Docker Compose example runs Postgres 17, and [Chapter 12](Chapter_12.md) uses Amazon RDS for PostgreSQL. Special characters in the password must be URL-encoded (`@` becomes `%40`).

## Tables

```mermaid
erDiagram
    users ||--o{ chat_sessions : owns
    users ||--o{ api_keys : has
    users }o--o{ groups : "user_groups"
    agents }o--o{ groups : "agent_groups"
    agents ||--o{ chat_sessions : "runs in"
    chat_sessions ||--o{ chat_messages : contains
    chat_sessions ||--o{ token_usage : "billed in"

    users {
        string id PK
        string username UK
        string auth_provider
        string external_subject
        float budget
        bool is_superuser
    }
    agents {
        string id PK
        string name UK
        string agent_kind
        bool enabled
    }
    chat_sessions {
        string id PK
        string user_id FK
        string agent_id FK
        string session_id UK
        json manifest
        bool is_archived
    }
    chat_messages {
        string id PK
        string chat_session_id FK
        int seq
        string role
    }
    token_usage {
        string id PK
        string chat_session_id FK
        string user_id
        float cost
    }
    model_pricing {
        string id PK
        string model_id
        string provider
    }
```

| Table | Holds |
|-------|-------|
| `users` | Local and SSO accounts, password hash (local only), budget, superuser flag |
| `groups` | Named sets of users |
| `user_groups` | Which users are in which group |
| `agents` | The registry: kind, runtime ARN and region or endpoint URL, flags, suggested questions |
| `agent_groups` | Which groups can see which agent |
| `chat_sessions` | One conversation: owner, agent, AgentCore session id, captured manifest, archived flag |
| `chat_messages` | User and assistant messages in order (`seq`), attachment metadata, error flag |
| `token_usage` | One row per agent completion: tokens, cache tokens, model, cost |
| `model_pricing` | Admin-set price per model and provider |
| `api_keys` | SHA-256 hash of each key, display prefix, expiry and revocation times |

Notes that matter when you touch the data:

- Primary keys are UUID strings. Timestamps are timezone-aware.
- `token_usage.user_id` is a copy, not a foreign key, and `token_usage.chat_session_id` is `RESTRICT`. You cannot delete a session that still has usage rows.
- Deleting a user or a session cascades to their messages, API keys and group links. The app avoids this: users are deactivated, sessions are archived, agents are disabled instead of deleted.
- Attachment bytes are **not** stored. Only metadata (`filename`, `size`, `type`) lives in `chat_messages.attachments`.

## Migrations

Schema changes ship as Alembic revisions inside the package.

| Revision | Change |
|----------|--------|
| `0001` | Initial schema, all ten tables |
| `0002` | `agents.suggested_questions` becomes `jsonb` on Postgres (no-op on SQLite) |
| `0003` | Cache read/write token columns on `token_usage` and `model_pricing` (existing rows get `0`) |

```bash
scc migrate        # same as: alembic upgrade head
```

- **The app never migrates by itself** and does not check the schema at startup. A database that is behind fails later, with SQL errors.
- **Run it once per release**, before the new version takes traffic. The Docker example image runs `migrate` in front of Gunicorn on every container start. On ECS, run it as a one-off task and skip it in the service ([Chapter 12](Chapter_12.md)).
- **Do not run it from several processes at once.** Alembic takes no lock of its own. Two simultaneous upgrades on a fresh database can collide, and one of them fails.
- Running it again at the latest revision does nothing.
- Every revision has a `downgrade()`, but see [Chapter 13](Chapter_13.md#upgrades-and-rollback) before you use one.

## Connections

Each process creates one SQLAlchemy engine when the app is imported. On Postgres it uses the SQLAlchemy defaults: 5 pooled connections plus 10 overflow per process, and a liveness check (`pool_pre_ping`) before each reuse.

So one worker holds at most 15 connections. Multiply by workers per task and by tasks, and compare with `max_connections` of your database instance. Four tasks with one worker each is 60. A chat stream does not hold a connection while it runs: the connection goes back to the pool before streaming starts, and messages and usage are saved in short separate transactions.

## Backup and Restore

| Database | Backup | Restore |
|----------|--------|---------|
| RDS / Aurora | Automated backups plus a manual snapshot before each upgrade | Restore the snapshot into a new instance, point `DATABASE_URL` at it |
| Self-run Postgres | `pg_dump -Fc dbname > chat.dump` | `pg_restore -d dbname chat.dump` into an empty database |
| SQLite | Stop the app, copy the `.sqlite` file | Put the file back before starting |

> **Watch out:** copying a SQLite file while the app runs can give you a torn copy. Stop first, or use `sqlite3 file ".backup copy"`.

## What Grows

Nothing is ever deleted by the app. The "delete" button in the chat archives a conversation, and the admin panel offers no hard delete for users, sessions, messages or usage.

| Table | Growth |
|-------|--------|
| `chat_messages` | Two rows per turn, full text. Usually the biggest |
| `chat_sessions` | One row per conversation, with the manifest JSON |
| `token_usage` | One row per agent that completes in a turn, so multi-agent turns add several |

Budgets only read the current UTC month of `token_usage`, but the usage dashboards read older data too. If you prune by SQL, delete `token_usage` rows first, then messages, then sessions, and take a snapshot before you start.

## Next

[Chapter 11 — Docker and Gunicorn](Chapter_11.md)
