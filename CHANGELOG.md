# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## v0.1.0 (2026-06-30)

### Feat

- initial release of strands-compose-chat

  Complete web chat application for agents built with strands-compose and
  deployed via strands-compose-agentcore on AWS Bedrock AgentCore Runtime.

  - FastAPI async backend with SQLAlchemy 2.0, Alembic migrations, SQLite and PostgreSQL support
  - React/TypeScript frontend bundled into the wheel, served by the backend
  - Streaming agent responses over SSE; multi-agent tool-use visible in real time
  - User accounts with Argon2id password hashing; OIDC/SSO via any OAuth 2.0 provider
  - Role-based access control — agents organised into groups, access closed by default
  - File attachments (images and documents) with configurable size limits
  - Per-user token usage and cost tracking with admin dashboard
  - sqladmin management panel for users, agents, and groups
  - CLI entry point (`scc`) for `serve` and `migrate` commands
