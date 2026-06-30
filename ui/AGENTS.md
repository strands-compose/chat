# Frontend — Agent Instructions

The frontend conventions, mental model, and where-does-it-go guidance now live as
a Kiro skill so they load on demand instead of always-on context:

- **Skill:** `.kiro/skills/frontend-development/SKILL.md`
- **Navigation map:** `.kiro/skills/frontend-development/references/project-map.md`

Kiro activates the skill automatically when a request touches `ui/`, or you can
invoke it from chat with `/frontend-development`. Editors that read `AGENTS.md`
should follow the skill as the source of truth for all UI work.

This document is about the **UI only** (`ui/`, React + TypeScript + Vite). It does
not describe the Python backend; the UI talks to the backend solely through the
service layer (`services/`).
