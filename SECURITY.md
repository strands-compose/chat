# Security Policy

## Supported Versions

| Version | Supported          |
|---------|--------------------|
| latest  | :white_check_mark: |

## Reporting Security Issues

We take security seriously. Please **do not** open a public GitHub issue for security vulnerabilities.

Instead, please report via [GitHub Security Advisories](https://github.com/strands-compose/chat/security/advisories/new).

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

## Security Practices

strands-compose-chat follows these rules in code and review:

- **No hardcoded secrets.** Every credential comes from environment variables; sensitive settings are redacted in logs and in the config repr.
- **Passwords hashed with Argon2id.** Raw passwords are never stored or logged. API keys are stored only as SHA-256 hashes.
- **Every endpoint is gated.** Auth dependencies on each route; agent visibility requires an explicit shared group.
- **Parameterised queries only.** All database access goes through SQLAlchemy.
- **Production checks at startup.** `APP_ENV=prod` rejects SQLite and wildcard hosts or origins, and makes the session cookie HTTPS-only.
- **No raw HTML from agents.** The chat renders agent and tool output as Markdown without parsing embedded HTML.
- **Automated scanning.** Bandit runs in `uv run just check-security`; `detect-secrets` runs as a pre-commit hook.

The security model, headers and production checklist are described in the [documentation](docs/README.md), mainly [Chapter 07](docs/Chapter_07.md), [Chapter 09](docs/Chapter_09.md) and [Chapter 13](docs/Chapter_13.md).
