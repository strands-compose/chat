# Chapter 05 — The Admin Panel

The admin panel is where you register agents, manage people and watch spend. It is a [sqladmin](https://github.com/aminalaee/sqladmin) site, so every table has a list page with search, sort and paging, plus detail, create and edit pages where the view allows them.

## Getting In

The panel lives at `/admin` (or `<URL_PREFIX>/admin`). Only active superusers get in. There are two ways:

| Route | Who it fits |
|---|---|
| **Admin panel** in the chat user menu | Any superuser already signed in to the chat, including OIDC users |
| `/admin/login` form | Local superusers (username and password). Works even when local sign-in is turned off for the chat |

A user becomes a superuser when an admin ticks **Is Superuser** on the user. The first one comes from `ADMIN_BOOTSTRAP_USERNAME` and `ADMIN_BOOTSTRAP_PASSWORD`, which only create a user when no superuser exists yet ([Chapter 03](Chapter_03.md)). New OIDC users are never superusers.

> **Tips & Tricks**
> Signing out of the admin panel only ends the admin login. Your chat session stays open.

## The Views

![Admin dashboard with KPI tiles and charts](img/admin-dashboard.png)

| View | What you do there | Create / Edit / Delete |
|---|---|---|
| **Dashboard** (home page) | Read spend, tokens, hits and budgets | read-only |
| **Users** | Create local users, set budget, groups, active and superuser flags, reset a password. Action: **Anonymize user** | yes / yes / no |
| **Groups** | Name a group, pick members and agents | yes / yes / **hard delete** |
| **Agents** | Register agents ([Chapter 06](Chapter_06.md)) | yes / yes / **soft delete** |
| **Chat Sessions** | Find a conversation. Action: **View transcript** | no / no / no |
| **Chat Messages** | Inspect single messages, including `is_success` and attachment metadata | no / no / no |
| **Token Usage** | Audit every billed agent run. Action: **Recalculate cost** | no / no / no |
| **Model Pricing** | Set per-million-token prices ([Chapter 08](Chapter_08.md#pricing)) | yes / yes / **hard delete** |
| **API Keys** | Issue and revoke keys ([Chapter 07](Chapter_07.md#api-keys)) | yes / yes / **hard delete** |
| **Session Transcript** | Read a whole conversation (opened from Chat Sessions, not in the menu) | read-only |

Lists also offer sqladmin's **Export** (CSV or JSON). Nothing in the app turns it off, so treat export as read access to everything the view shows.

### Soft versus hard delete

| Kind | What happens | Views |
|---|---|---|
| Not allowed | No delete button | Users, Chat Sessions, Chat Messages, Token Usage |
| Soft | Row stays, flag changes | **Agents**: *Delete* sets `enabled` to false. The agent disappears for users, old chats keep their link to it. Tick **Enabled** again to bring it back |
| Hard | Row is gone for good | **Groups** (members and agent access are unlinked at once), **Model Pricing**, **API Keys** |

Users are never deleted because that would destroy chat history and the billing ledger. To remove a person's data, use **Anonymize user**. It replaces username and email, clears profile fields, deactivates the account, blanks chat text and titles, and keeps token usage. It cannot be undone, and it refuses the last active superuser.

> **Watch out:** to stop an API key, use **Revoke**. It keeps the row and its `last_used_at` for audit. *Delete* removes the record.

Chat sessions deleted by users are only archived. They stay in **Chat Sessions** with **Is Archived** set.

## Transcript View

![Session transcript rendered as a conversation](img/admin-transcript.png)

Select a session in **Chat Sessions** (list or detail) and choose **View transcript**. You get the whole conversation as bubbles, ordered by `seq`, with the owner, agent, timestamps, attachment names and failed turns marked. Markdown is shown as plain text here, not rendered as in the chat. If you select several rows, only the first opens. The session detail page also shows the saved agent manifest and a token total.

Search in Chat Sessions matches username, agent name, title and session id.

## Dashboard

The dashboard is the panel's home page. Its title is *Usage Analytics*.

**Filters**: a date range (default: the 1st of this UTC month until today), plus **Users**, **Agents** and **Groups** multi-selects. They apply to the tiles and both charts.

| Part | Contents |
|---|---|
| KPI tiles | Total Cost, Input Tokens, Output Tokens, Cache Read Tokens, Cache Write Tokens, Hits, Active Users |
| Usage Over Time | Interval (Daily, Weekly, Monthly), Metric (Cost, Tokens, Hits), Stack by (None, User, Agent, Group). *Max groups* (5 to 25, default 10) caps the series; the rest fold into *Other* |
| Top Breakdown | Category (Users, Agents, Groups), Metric, Stack by, *Max groups*, and a top-N bar count (5 to 100, default 10) |
| User Budgets | Spend against budget for every active user, filter by username. Status: **LOW** under 50%, **MEDIUM** under 85%, **HIGH** from 85% |

*Hits* counts successful assistant replies. *Active Users* counts users with at least one billed run in the range. Dates are UTC and budgets use the current UTC month.

The User Budgets table is for the current month only and ignores the date filter.

## Day-to-Day Pages

![Users list with provider and groups](img/admin-users.png)

*The users list shows name, email, groups, flags and provider. Budget is on the detail and edit pages.*

![Token usage list with cost and cache columns](img/admin-token-usage.png)

**Token Usage** has one row per agent run: agent, session, cost, the four token counts, model id and provider. Search matches username, agent name and model id. Rows are never edited by hand. After you change a price, select rows and choose **Recalculate cost** to re-price them. Rows whose model has no pricing entry are set to `$0`.

## Next

[Chapter 06 — Agents](Chapter_06.md)
