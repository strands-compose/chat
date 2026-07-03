# strands-compose-chat — Agent Instructions

This is **strands-compose-chat**: a chat UI for
[strands-compose](https://github.com/strands-compose/sdk-python) with the
[strands-compose-agentcore](https://github.com/strands-compose/bedrock-agentcore)
AWS Bedrock AgentCore adapter.

---

## Read the Skill First — MANDATORY

Before touching any code, load the skill for the area you are working in.
Skills are the authoritative source for conventions, mental models, patterns,
dependency rules, and file placement. Everything language- or framework-specific
lives there, not here.

| Area | Skill file to load |
|------|--------------------|
| **Python backend** (`src/strands_compose_chat/`) | `.kiro/skills/backend-development/SKILL.md` + `.kiro/skills/backend-development/references/project-map.md` |
| **React frontend** (`ui/`) | `.kiro/skills/frontend-development/SKILL.md` + `.kiro/skills/frontend-development/references/project-map.md` |

**If you work on the backend, read the backend skill. If you work on the
frontend, read the frontend skill. If you work on both in one task, read both.
No exceptions.**

The skills describe the target standard — follow them, not whatever pattern
happened to be written before the skill existed.

---

## Core Principles — Apply Everywhere

These values guide every decision across both backend and frontend. When in
doubt, apply them in order.

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

---

## Communication Style — Apply Everywhere

- **Short and essential by default.** Answer directly. No preamble, no storytelling, no background context unless explicitly asked.
- **Explain only when asked.** If the user asks "why" or "explain", provide detail. Otherwise, give the result.
- **No filler.** No "Great question!", no "As you can see…", no summaries restating what was just done.

---

## Behaviour Rules — Apply Everywhere

- **Smallest reasonable change.** Don't refactor unrelated code to land a
  feature. Touch only what the task requires.
- **Read before writing.** Before editing a file, read it. Before creating
  something new, read a sibling that plays the same role and match its shape.
- **No hardcoded secrets.** All credentials and sensitive config come from
  environment variables.
- **Comments explain what and why, never when or how something changed.**
  No temporal context ("recently refactored", "moved from …") in comments.
- **If you find something broken in the area you're working, fix it.** Don't
  leave broken or commented-out code behind.
- **Never add files or change code outside the scope of the task.**
