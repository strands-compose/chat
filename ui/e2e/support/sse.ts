/**
 * Server-sent-event bodies and small, valid stream event sequences for
 * `POST /api/v1/invocations`. Shapes mirror the backend's StreamEvent wire
 * format (see the recorded turn in src/services/demo-fixtures/events.ts).
 */

import { events as recordedTurn } from '@/services/demo-fixtures/events';
import type { BackendStreamEvent } from '@/types';

const TIMESTAMP = '2026-07-15T09:00:00.000000+00:00';

/** The recorded turn behind the demo: `main` delegates to `doc_expert` and `developer`, which call tools. */
export const DEMO_TURN: readonly BackendStreamEvent[] = recordedTurn;

/** One `data: <json>` frame per event, separated by blank lines. */
export function sseBody(events: readonly BackendStreamEvent[]): string {
  return events.map((event) => `data: ${JSON.stringify(event)}\n\n`).join('');
}

function event(
  type: string,
  agentName: string,
  data: Record<string, unknown> = {},
): BackendStreamEvent {
  return { type, agent_name: agentName, timestamp: TIMESTAMP, data };
}

export interface ToolCall {
  name: string;
  input?: unknown;
  result?: string;
  status?: 'success' | 'error';
}

export interface TurnOptions {
  /** The answer text. Streamed word by word so the UI must join the tokens. */
  text: string;
  /** Agent that answers. Defaults to `main`. */
  agent?: string;
  /** Tool calls made before the answer, shown in the workflow panel. */
  tools?: ToolCall[];
  /** Reasoning text streamed before the answer. */
  reasoning?: string;
}

/** A tool_start + tool_end pair per call. */
function toolEvents(agent: string, tools: ToolCall[]): BackendStreamEvent[] {
  return tools.flatMap((tool, i) => {
    const toolUseId = `tooluse_${i + 1}`;
    return [
      event('tool_start', agent, {
        tool_name: tool.name,
        tool_use_id: toolUseId,
        tool_input: tool.input ?? {},
      }),
      event('tool_end', agent, {
        tool_name: tool.name,
        tool_use_id: toolUseId,
        status: tool.status ?? 'success',
        tool_result: tool.result ?? '',
      }),
    ];
  });
}

/**
 * A complete single-agent turn: session_start → agent_start → [reasoning] →
 * [tools] → tokens → agent_complete → session_end. The fake backend replaces
 * the session id with the request's session.
 */
export function streamTurn({
  text,
  agent = 'main',
  tools = [],
  reasoning,
}: TurnOptions): BackendStreamEvent[] {
  const out: BackendStreamEvent[] = [
    event('session_start', agent, { session_id: 'replaced-by-fake-backend' }),
    event('agent_start', agent),
  ];
  if (reasoning) out.push(event('reasoning', agent, { text: reasoning }));
  out.push(...toolEvents(agent, tools));
  for (const token of text.match(/\S+\s*/g) ?? [text]) {
    out.push(event('token', agent, { text: token }));
  }
  out.push(
    event('agent_complete', agent, {
      usage: {
        input_tokens: 100,
        output_tokens: 20,
        total_tokens: 120,
        cache_read_input_tokens: 0,
        cache_write_input_tokens: 0,
      },
    }),
  );
  out.push(event('session_end', agent, { text }));
  return out;
}

/**
 * A turn that fails mid-stream: the agent starts, makes the given tool calls,
 * then the backend emits an `error` event and closes the session.
 */
export function errorTurn(
  message: string,
  { agent = 'main', tools = [] }: { agent?: string; tools?: ToolCall[] } = {},
): BackendStreamEvent[] {
  return [
    event('session_start', agent, { session_id: 'replaced-by-fake-backend' }),
    event('agent_start', agent),
    ...toolEvents(agent, tools),
    event('error', agent, { text: message }),
    event('session_end', agent, {}),
  ];
}
