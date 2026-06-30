# Contributing to strands-compose-chat

Thank you for your interest in contributing! Whether it's a bug report, new feature, correction, or additional documentation, we greatly value feedback and contributions from our community.

Please read through this document before submitting any issues or pull requests to ensure we have all the necessary information to effectively respond to your bug report or contribution.

## Reporting Bugs / Feature Requests

We welcome you to use [GitHub Issues](https://github.com/strands-compose/chat/issues) to report bugs or suggest features.

When filing an issue, please check [existing issues](https://github.com/strands-compose/chat/issues) first and try to include:

- A reproducible test case or series of steps
- The version of strands-compose-chat being used
- Any modifications you've made relevant to the bug

## Finding Contributions to Work On

Looking at existing issues is a great way to find something to contribute. Before starting work:

1. Check if someone is already assigned or working on it
2. Comment on the issue to express your interest
3. Wait for maintainer confirmation before beginning significant work

## Development Tenets

These principles guide every design decision in strands-compose. When contributing, please keep them in mind:

1. **SDK-first** — always check what `strands-compose` /
   `strands-compose-agentcore` already provides before implementing anything
   from scratch. Use the SDK directly; never re-implement what it exports.
2. **Explicit over implicit** — no hidden magic, no auto-registration, no global
   singletons. Wire things by hand and make dependencies obvious.
3. **Simple over clever** — the dullest solution that correctly solves the
   problem is the right one. Readable and maintainable beats terse and
   "efficient".
4. **Transparency over performance** — prefer code that clearly shows what it
   does over code that squeezes out speed at the cost of legibility. Optimize
   only when you have measured evidence that it matters.
5. **Composition over inheritance** — build big things out of small, focused
   pieces that compose. Prefer functions, small modules, and thin wrappers over
   deep class hierarchies.
6. **Single responsibility** — each file, module, component, and function does
   one thing. When something grows a second job, split it.
7. **One-way dependencies** — inner layers never import outward. The dependency
   direction for each area is defined in its skill.

## Development Environment

### Prerequisites

- Python 3.11+
- [uv](https://docs.astral.sh/uv/) package manager
- Git

### Getting Started

```bash
git clone https://github.com/strands-compose/chat
cd chat
uv run just install
```

This installs all dependencies **and** wires the git hooks in one step.
If you only want to (re-)install the hooks later:

```bash
uv run just install-hooks
```

### Pre-commit Hooks

Three hook stages are registered automatically by `just install-hooks`:

| Stage | Triggered by | Runs |
|---|---|---|
| `pre-commit` | `git commit` | ruff lint + format, file checks, detect-secrets |
| `pre-push` | `git push` | same as above |
| `commit-msg` | `git commit` | commitizen validates conventional commit format |

> **Note:** `.git/hooks/` is not tracked by git. Every fresh clone requires running `uv run just install-hooks` once.

### Quality Checks

```bash
uv run just check    # format + lint + type check + security
uv run just test     # pytest with coverage (≥70%)
uv run just format   # auto-format with Ruff
```

### Coding Standards

All coding standards — type annotations, docstrings, naming, module organization, testing, and security rules — are documented in **[AGENTS.md](AGENTS.md)**. This is the single source of truth for how code should be written in this project.

## Contributing via Pull Requests

Contributions via pull requests are much appreciated. Before sending us a pull request, please ensure that:

1. You are working against the latest source on the `main` branch
2. You check existing open and recently merged pull requests to make sure someone else hasn't addressed the problem already
3. You open an issue to discuss any significant work — we would hate for your time to be wasted

To send us a pull request:

1. Create a branch from `main`
2. Make your changes — focus on the specific contribution
3. Run `uv run just check && uv run just test`
4. Commit using [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`)
5. Open a PR with a clear description of what and why
6. Pay attention to any automated CI failures and stay involved in the conversation

### PR Checklist

- [ ] All checks pass (`uv run just check`)
- [ ] Tests pass with adequate coverage (`uv run just test`)
- [ ] New public APIs have docstrings and tests
- [ ] No hardcoded secrets or credentials
- [ ] Changes are focused — one concern per PR

## Security Issue Notifications

If you discover a potential security issue in this project we ask that you notify us via [GitHub Security Advisories](https://github.com/strands-compose/chat/security/advisories/new). Please do **not** create a public GitHub issue.

## Licensing

See the [LICENSE](LICENSE) file for our project's licensing. We will ask you to confirm the licensing of your contribution.
