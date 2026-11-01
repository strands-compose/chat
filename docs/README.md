# strands-compose-chat Documentation

Everything you need to install, run, administer and extend **strands-compose-chat**, the web chat application for agents built with [strands-compose](https://github.com/strands-compose/sdk-python) and run with [strands-compose-agentcore](https://github.com/strands-compose/bedrock-agentcore).

Commands run as written in bash, zsh and PowerShell 7.3 or newer. Commands shown for inside a container are Linux only.

## Contents

### Part I — Overview

| Chapter | What you get |
|---------|--------------|
| [Chapter 01 — What Is This?](Chapter_01.md) | The problem, the features, what the app is not |
| [Chapter 02 — Architecture](Chapter_02.md) | Diagrams of the parts, one chat turn, and what is saved when |

### Part II — Using and Administering

| Chapter | What you get |
|---------|--------------|
| [Chapter 03 — Getting Started](Chapter_03.md) | Install, first run, first agent, first chat |
| [Chapter 04 — Using the Chat](Chapter_04.md) | A tour of the chat for end users |
| [Chapter 05 — The Admin Panel](Chapter_05.md) | Every admin view and what it is for |
| [Chapter 06 — Agents](Chapter_06.md) | Registering AgentCore and local agents |
| [Chapter 07 — Authentication](Chapter_07.md) | Local sign-in, OIDC single sign-on, API keys |
| [Chapter 08 — Access, Budgets and Pricing](Chapter_08.md) | Groups, monthly budgets, model pricing |

### Part III — Running in Production

| Chapter | What you get |
|---------|--------------|
| [Chapter 09 — Configuration Reference](Chapter_09.md) | Every setting, default and production check |
| [Chapter 10 — Database](Chapter_10.md) | Tables, migrations, backups |
| [Chapter 11 — Docker and Gunicorn](Chapter_11.md) | The production image and server settings |
| [Chapter 12 — Deploying on ECS Fargate](Chapter_12.md) | Step-by-step deployment and a go-live checklist |
| [Chapter 13 — Operations](Chapter_13.md) | Health checks, logs, upgrades, secret rotation |

### Part IV — Developers

| Chapter | What you get |
|---------|--------------|
| [Chapter 14 — HTTP API and Streaming](Chapter_14.md) | Endpoints, errors, and the SSE event stream |
| [Chapter 16 — Developer Guide](Chapter_16.md) | Code map, dev servers, `just` recipes, tests |

### Also

| Page | What you get |
|------|--------------|
| [Chapter 15 — Troubleshooting](Chapter_15.md) | Symptom, cause, fix tables |
| [Quick Recipes](Quick_Recipes.md) | Copy-paste `.env` blocks and one-liners |

## Reading Order

| If you are... | Read |
|---------------|------|
| **New here** | 01, 02, 03, then 04 |
| **An admin** | 03, 05, 06, 07, 08 |
| **Deploying to ECS** | 09, 10, 11, 12, 13, then 15 and Quick Recipes |
| **Building on the API** | 14, then 16 (and 07 for API keys) |

## Links

- Source: [github.com/strands-compose/chat](https://github.com/strands-compose/chat)
- Live demo (fixtures, no backend): [strands-compose.github.io/chat](https://strands-compose.github.io/chat/)
- Sibling docs: [strands-compose](https://github.com/strands-compose/sdk-python), [strands-compose-agentcore](https://github.com/strands-compose/bedrock-agentcore)
