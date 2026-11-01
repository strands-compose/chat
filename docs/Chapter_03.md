# Chapter 03 — Getting Started

By the end of this chapter you have the app running on your machine, one agent registered, and a user chatting with it. You need Python 3.11 or newer.

## Install

```bash
pip install strands-compose-chat
```

With [uv](https://docs.astral.sh/uv/):

```bash
uv venv
uv pip install strands-compose-chat
```

Add the `[postgres]` extra (`"strands-compose-chat[postgres]"`) when you plan to use Postgres. The package installs two identical commands, `strands-compose-chat` and the short alias `scc`. Keep the virtual environment active, or the command will not be found.

## Configure

The app reads a `.env` file from the **current working directory**, so run every `scc` command from the folder that holds it. Create `.env`:

```bash
APP_ENV=dev
SESSION_SECRET_KEY=<paste the output of the command below>
ADMIN_BOOTSTRAP_USERNAME=admin
ADMIN_BOOTSTRAP_PASSWORD=<a password you will remember>
```

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

| Setting | Why you need it |
|---------|-----------------|
| `SESSION_SECRET_KEY` | Signs the session cookie. Required, at least 32 bytes. The app refuses to start without it |
| `ADMIN_BOOTSTRAP_USERNAME` / `ADMIN_BOOTSTRAP_PASSWORD` | Creates the first superuser at startup, but only if both are set and no superuser exists yet |
| `APP_ENV=dev` | Allows SQLite and cookies over plain `http://`. This is also the default |

Without `DATABASE_URL`, the app uses a SQLite file named `strands-chat.sqlite` in the working directory. Every other setting is in [Chapter 09](Chapter_09.md).

## Run

```bash
scc migrate    # creates the tables
scc serve      # http://127.0.0.1:8000
```

`serve` is a single-process development server. For production, see [Chapter 11](Chapter_11.md).

<p align="center"><img src="img/login.png" alt="The sign-in page with a username and password form and a single sign-on button" width="600"></p>

Open <http://127.0.0.1:8000> and sign in with the bootstrap account. The admin panel is at <http://127.0.0.1:8000/admin>.

## First Steps as Admin

Do these in order. Steps 2 to 5 happen in the admin panel.

1. **Sign in.** Use the bootstrap account.
2. **Create a group.** Groups, then Create. A group is the unit of access: users in it can see the agents in it.
3. **Register an agent.** Agents, then Create. Choose the kind (Agentcore Runtime or Local), fill in its address, and select your group under Access Groups. [Chapter 06](Chapter_06.md) explains every field.
4. **Add people to the group.** Edit a user and pick the group, or edit the group and add members. Add yourself too.
5. **Create a user, or let people sign up.** In Users, Create adds an account with a username, email, password, groups and budget. Self sign-up is on by default when no OIDC provider is configured, and off otherwise (`AUTH_REGISTRATION_ENABLED` overrides). See [Chapter 07](Chapter_07.md).
6. **Chat.** Sign in as that user at `/`, pick the agent, and send a message.

![A new chat showing the agent picker and suggested questions](img/chat-welcome.png)

> **Watch out:** Access is closed by default, and superusers get no exception. An agent is visible only when the user shares a group with it. If the agent picker is empty, check group membership first. Users who sign up themselves start with no groups.

New users start with a monthly budget of 10.00, counted in the cost your pricing table produces. With no pricing rows, every turn costs 0 and the budget never trips. See [Chapter 08](Chapter_08.md).

## Where to Go Next

| You want to | Read |
|-------------|------|
| A worked local setup to copy | [`examples/01-local-dev`](../examples/01-local-dev) |
| A production-like stack with Postgres | [`examples/02-docker`](../examples/02-docker) |
| Production settings and checks | [Chapter 09](Chapter_09.md) and [Chapter 11](Chapter_11.md) |
| Deploy on AWS | [Chapter 12](Chapter_12.md) |

## Next

[Chapter 04 — Using the Chat](Chapter_04.md)
