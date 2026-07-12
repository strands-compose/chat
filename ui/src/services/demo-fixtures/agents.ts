const description = `
This is a **mocked** agent for the **Strands Compose Chat** showcase.
It runs entirely in your browser with no backend, so it always replies with the
**same pre-recorded answer** no matter what you ask.

---
Send any message (or tap a suggestion) and watch a realistic, streamed response
that walks through **Strands Compose** end to end:

- **What it is** — a declarative, *Docker Compose-style* layer for multi-agent systems
- **Architecture & core concept** — YAML in, **native \`strands\` objects** out, with no wrapper at runtime
- **The two packages** — the \`strands-compose\` core library and the optional \`bedrock-agentcore\` deployment adapter
- **Unique value** — configuration as data, unified streaming, reviewable topologies, no lock-in
- **Three orchestration modes** — \`delegate\` (hub-and-spoke), \`swarm\` (peer collaboration), and \`graph\` (deterministic pipeline), freely nestable
- **Core building blocks** — tools, hooks, and sessions
- **A concrete example** — a delegate wiring two agents together with custom tools
- **Deployment** — optional managed hosting on AWS Bedrock AgentCore

Everything you see — streaming tokens, tool calls, sub-agent traces, and
token/cost metrics — is **simulated** to demonstrate the UI.`;

export const agents = [
  {
    id: 'adb0bb94-04a5-4f24-a2bd-7f895cb266a1',
    name: 'Demo Agent',
    description,
    agent_kind: 'local',
    multimodal: true,
    suggested_questions: [
      'What is Strands Compose and what problem does it solve?',
      'How does the architecture work, and what are the orchestration modes?',
      'Show me a concrete example with tools.',
    ],
  },
];
