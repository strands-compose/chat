# Chapter 14 — HTTP API and Streaming

This chapter lists every endpoint, the error format, and the event stream that carries a chat turn. The web UI uses exactly these endpoints, so anything it does you can do from a script.

The interactive OpenAPI pages (`/docs`, `/redoc`, `/openapi.json`) are disabled at runtime. A snapshot of the contract is kept in [`tests/contract/openapi.snapshot.json`](../tests/contract/openapi.snapshot.json).

## Conventions

- **Prefix.** With `URL_PREFIX=/ai/chat`, every path below starts with `/ai/chat`. The API lives under `{prefix}/api/v1`, auth under `{prefix}/auth`.
- **Auth.** Two ways to prove who you are:

| Method | How | Accepted on |
|--------|-----|-------------|
| Session cookie | Sign in with `POST /auth/login` (or OIDC) and keep the cookie | Everything |
| API key | `Authorization: Bearer sck_...` | Only the endpoints marked **key** below |

A bearer token that does not start with `sck_` gets `401`. It never falls back to the cookie. Admins create keys in the admin panel ([Chapter 07](Chapter_07.md)).

- **JSON.** Request and response bodies are JSON unless noted.
- **Pagination.** `limit` and `offset` query parameters.

## Endpoints

Auth column: **public** needs nothing, **key** accepts cookie or API key, **cookie** accepts the session cookie only, **admin** needs a session cookie of a superuser.

### Chat

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/api/v1/invocations` | key | Send a prompt, stream the reply as SSE |
| GET | `/api/v1/agents` | key | Agents visible to you. `limit` default 50, `offset` default 0 |
| GET | `/api/v1/agents/{agent_id}` | key | One visible agent, else `404` |
| GET | `/api/v1/media/capabilities` | key | Allowed attachment formats and the size and count limits |

### Sessions

`{session_id}` is the conversation's `session_id` string (the one returned on `session_start`), not an internal row id. Only your own, non-archived sessions are visible; anything else is `404`.

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/v1/sessions` | cookie | Your sessions, newest first. `limit` default 50, capped at `CHAT_SESSION_MAX_PAGE_SIZE` (default 100) |
| GET | `/api/v1/sessions/{session_id}` | cookie | Session detail with the captured manifest |
| PATCH | `/api/v1/sessions/{session_id}` | cookie | Rename. Body `{"title": "..."}`, 1 to 255 characters |
| GET | `/api/v1/sessions/{session_id}/messages` | cookie | Messages in `seq` order (`role`, `content`, `seq`, `is_success`, `attachments`) |
| GET | `/api/v1/sessions/{session_id}/usage` | cookie | Token totals and total cost for the session |
| DELETE | `/api/v1/sessions/{session_id}` | cookie | Archive (soft delete). Returns `204` |

### Account and usage

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/auth/providers` | public | Sign-in options: OIDC providers, `registration_enabled`, `local_signin_enabled` |
| POST | `/auth/register` | public | Create a local account. `403` when registration is off. Body: `username`, `email`, `password` |
| POST | `/auth/login` | public | Local sign-in. Body: `username`, `password`. Sets the cookie, returns the profile and `next` |
| GET | `/auth/logout` | public | Clears the session, redirects to `/login` |
| GET | `/auth/login/{provider_id}` | public | Starts OIDC sign-in (redirect). Optional `next` path |
| GET | `/auth/callback` | public | OIDC return point |
| GET | `/auth/me` | cookie | Your profile, groups, budget and this month's usage |
| PATCH | `/auth/me` | cookie | Update first and last name, location, company, department |
| GET | `/api/v1/users/me/usage` | cookie | Your usage in time buckets. Query: `from`, `to` (dates), `interval` (`daily`, `weekly`, `monthly`) |

### Admin analytics

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/v1/analytics/filters` | admin | Users, agents and groups for filter pickers |
| POST | `/api/v1/analytics/timeline` | admin | Time series. Body: `from`, `to`, `interval`, `metric`, `stack_by`, optional `filters` |
| POST | `/api/v1/analytics/summary` | admin | Totals for a date range |
| POST | `/api/v1/analytics/breakdown` | admin | Ranked categories. Body adds `category` |
| GET | `/api/v1/analytics/budgets` | admin | Per-user budget status this month. Query `status` (`all`, `approaching`, `over`) |

`metric` is `cost`, `tokens` or `hits`. `stack_by` is `none`, `user`, `agent` or `group`.

### Pages and health

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/` | cookie | Chat page. Redirects to `/login` when signed out |
| GET | `/login` | public | Login page. Redirects away when already signed in |
| GET | `/static/...` | public | Compiled UI assets |
| GET | `/admin/...` | admin | The sqladmin panel, with its own `/admin/login` |
| GET | `/health` | public | `200 {"status": "ok"}`. Does not touch the database |
| GET | `/ready` | public | `200` when the database answers, else `503` |

`/health` and `/ready` exist both with and without the URL prefix, and skip the `TRUSTED_HOSTS` check.

## Errors

Every error from the API is an [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457) Problem Details body with the content type `application/problem+json`:

```json
{
  "type": "about:blank",
  "title": "Payment Required",
  "status": 402,
  "detail": "Budget exceeded. Please contact your administrator.",
  "instance": "/api/v1/invocations"
}
```

Validation failures (`422`) add an `errors` list with `loc`, `msg` and `type` for each field. Submitted values are never echoed back. Unexpected failures return a generic `500` with no internals.

| Status | Seen on | Meaning |
|--------|---------|---------|
| 401 | Anything protected | Not signed in, or a bad, revoked or expired key. The same message for every cause |
| 402 | Invocations | The month's spend has reached your budget |
| 403 | Register, login | Registration or local sign-in is turned off |
| 404 | Invocations, sessions, agents | Not found, or not visible to you |
| 409 | Invocations | Session belongs to another user, or is locked to a different agent |
| 422 | Invocations and others | Invalid JSON, missing `agent_id` on a new session, bad file part key, unsupported file type, failed validation |

## Streaming a Chat Turn

### Request

`POST /api/v1/invocations` takes a JSON body:

| Field | Required | Meaning |
|-------|----------|---------|
| `prompt` | yes | A string, one content block (for example `{"text": "Hi"}`), or a list of content blocks |
| `agent_id` | on a new conversation | The agent's `id` from `GET /api/v1/agents`. Lowercase letters, digits and hyphens, up to 64 characters |
| `session_id` | no | Omit it to start a conversation. Reuse the id from `session_start` for follow-ups. 33 to 256 characters |

A session is locked to the agent it started with. Sending a different `agent_id` for an existing session is a `409`.

**Attachments** use `multipart/form-data` instead: a `payload` field holding the same JSON, plus one `file:<index>` part per file (`file:0`, `file:1`, ...). Files are turned into image or document blocks and appended after your prompt. The format comes from the file extension, then the declared MIME type. The allowed formats and limits are listed by `GET /api/v1/media/capabilities`.

### Response

The reply is `text/event-stream`. Each frame carries one event as JSON:

```
event: token
data: {"type":"token","agent_name":"writer","timestamp":"2026-01-01T12:00:00+00:00","data":{"text":"Hel"}}

```

The `data` object depends on the event type:

| Event | When | Key fields in `data` |
|-------|------|----------------------|
| `session_start` | First event of every turn | `session_id`, `manifest` (agents and orchestration of the session) |
| `agent_start` | An agent begins | none |
| `multiagent_start` | An orchestrator (swarm, graph) begins | `multiagent_type` |
| `node_start` / `node_stop` | A node in an orchestration starts or ends | `node_id`, `multiagent_type` |
| `handoff` | A swarm hands over to another node | `from_node_ids`, `to_node_ids`, `message` |
| `token` | A chunk of answer text | `text` |
| `reasoning` | A chunk of model reasoning | `text` |
| `tool_start` | A tool call begins | `tool_name`, `tool_use_id`, `tool_input` |
| `tool_end` | A tool call ends | `tool_name`, `tool_use_id`, `status` (`success` or `error`), `tool_result`, `error` |
| `interrupt` | The agent asks for human input | `interrupt_id`, `name`, `reason`. The UI ignores it |
| `agent_complete` | An agent finishes | `usage` (`input_tokens`, `output_tokens`, `cache_read_input_tokens`, `cache_write_input_tokens`), `model` (`model_id`, `provider`), `text`, `stop_reason` |
| `multiagent_complete` | An orchestrator finishes | `multiagent_type` |
| `error` | Something failed | `text` |
| `session_end` | Last event of a finished turn | `session_id`, `text` (the final answer), `result` |

`agent_name` on every frame says which agent produced it. Agents can run in parallel, so frames from different agents interleave.

Between events, the server sends a comment line `: ping` every 20 seconds so proxies keep the connection open. Clients ignore it.

### How a Turn Ends

- **Success.** `session_end` is the last event, then the connection closes.
- **Failure before streaming.** A normal HTTP error with a Problem Details body (table above).
- **Failure during streaming.** The HTTP status is already `200`, so the failure arrives as an `error` event. Two cases:
  - The agent reports the error itself. A `session_end` may still follow, but the turn is saved as an error bubble, not an answer.
  - The app cannot reach the agent, or it crashes. The app sends one `error` with a generic message and closes the stream. No `session_end` follows.

  Repeats of the same error text within a turn are dropped.
- **Client disconnects.** The app stops reading. For AgentCore agents it also asks the runtime to stop the session.

### Example

List the agents you can use, then stream a reply:

```bash
curl -s -H "Authorization: Bearer <key>" https://chat.example.com/api/v1/agents

curl -N https://chat.example.com/api/v1/invocations -H "Authorization: Bearer <key>" -H "Content-Type: application/json" -H "Accept: text/event-stream" -d '{"agent_id": "<id from the list>", "prompt": "What can you do?"}'
```

`-N` turns off curl's buffering so frames print as they arrive. Copy `session_id` from the `session_start` frame into your next request to continue the conversation. Conversations started with a key show up in that user's history in the web UI.

> **Tips & Tricks**
> To get just the answer text, read the `text` field of the `session_end` frame. To show it live, concatenate the `text` of `token` frames. Do that per `agent_name`, because sub-agents emit tokens too.

## Next

[Chapter 15 — Troubleshooting](Chapter_15.md)
