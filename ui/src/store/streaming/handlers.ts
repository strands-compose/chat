/**
 * One handler per backend event type.
 *
 * Each handler reads/writes `streamingState` directly and may schedule a
 * throttled flush via `effects.scheduleFlush()`. `finalizeMessage` commits
 * the end-of-turn result — including error commits surfaced when `session_end`
 * arrives if `streamingState.errorMessage` was set.
 *
 * Multi-agent events (`multiagent_start`, `multiagent_complete`) are folded
 * into the agent lifecycle: an orchestrator behaves the same as an agent for
 * UI purposes — start banner, end banner if it's a sub-agent, no end banner
 * if it's the entry.
 */

import type { ChatStreamEvent, WorkflowItem } from '../../types';
import { streamingState, resetStreamingState } from './state';
import { cancelFlush } from './scheduler';
import type { StreamingSideEffects } from './types';

// ====== FINALIZE ======

/**
 * Commit the final assistant message and reset all per-turn state.
 *
 * Idempotent — subsequent calls within the same turn are no-ops. This guards
 * against the common backend sequence where an `error` event is followed by
 * a `session_end` (or multiple `error` events precede `session_end`): only
 * the first finalization wins.
 */
function finalizeMessage(
  _event: ChatStreamEvent,
  effects: StreamingSideEffects,
): void {
  if (streamingState.isFinalized) return;
  streamingState.isFinalized = true;
  cancelFlush();

  if (streamingState.errorMessage) {
    const errorMessage = streamingState.errorMessage;
    resetStreamingState();
    // Survive the reset so a trailing session_end is a no-op.
    streamingState.isFinalized = true;
    effects.commitFinal({
      content: `${errorMessage}`,
      isStreaming: false,
      isSuccess: false,
    });
    return;
  }

  // Success: backend is the source of truth. The session_end refetch (onSessionEnd)
  // rebuilds the thread. Just close the live streaming state.
  resetStreamingState();
  streamingState.isFinalized = true;
  effects.commitFinal({ isStreaming: false });
}

// ====== HELPERS ======

/** Display-friendly agent name: underscores → spaces, uppercased. */
const normalizeAgentName = (name: string | null | undefined): string | undefined =>
  name ? name.replaceAll('_', ' ').toUpperCase() : undefined;

/** Display-friendly tool name: underscores → spaces. */
const normalizeToolName = (name: string | null | undefined): string =>
  name ? name.replaceAll('_', ' ') : '';

/** Push an item to the buffer and schedule a flush. */
const pushItem = (item: WorkflowItem, effects: StreamingSideEffects): void => {
  streamingState.workflowItemsBuffer.push(item);
  effects.scheduleFlush();
};

/**
 * Push an `agent_start` separator unless the previous item is already an
 * `agent_start` for the same agent — handles back-to-back emissions like
 * `node_start` → `agent_start` and `multiagent_start` → `agent_start`.
 */
const pushAgentStartOnce = (
  agentName: string | undefined,
  effects: StreamingSideEffects,
  isOrchestrator = false,
): void => {
  const buffer = streamingState.workflowItemsBuffer;
  const last = buffer[buffer.length - 1];
  if (last?.type === 'agent_start' && last.agentName === agentName) return;
  pushItem({ type: 'agent_start', content: '', agentName, isOrchestrator }, effects);
};

/**
 * Push an `agent_stop` separator unless the previous item is already an
 * `agent_stop` for the same agent — `complete` and `node_stop` both fire
 * for sub-agents in Graph/Swarm topologies.
 */
const pushAgentStopOnce = (
  agentName: string | undefined,
  effects: StreamingSideEffects,
  isOrchestrator = false,
): void => {
  const buffer = streamingState.workflowItemsBuffer;
  const last = buffer[buffer.length - 1];
  if (last?.type === 'agent_stop' && last.agentName === agentName) return;
  pushItem({ type: 'agent_stop', content: '', agentName, isOrchestrator }, effects);
};

// ====== SESSION_START / SESSION_END ======

/** Session lifecycle signal. Adopts the backend-minted session id (if any). */
export function handleSessionStart(event: ChatStreamEvent, effects: StreamingSideEffects): void {
  effects.onSessionStart(event.session_id);
}

/** Authoritative end-of-turn signal. Builds the final message and resets state. */
export function handleSessionEnd(event: ChatStreamEvent, effects: StreamingSideEffects): void {
  // Snapshot the trace and token totals before finalizeMessage resets the
  // per-turn buffer, otherwise onSessionEnd would persist empty values.
  const trace = [...streamingState.workflowItemsBuffer];
  const tokens = { input: streamingState.inputTokens, output: streamingState.outputTokens };
  finalizeMessage(event, effects);
  effects.onSessionEnd(trace, tokens);
}

// ====== TOKEN ======

/**
 * Append a streamed text chunk. Consecutive tokens from the same agent
 * coalesce into a single `text` workflow item.
 */
export function handleToken(event: ChatStreamEvent, effects: StreamingSideEffects): void {
  const content = event.content ?? '';
  const agentName = normalizeAgentName(event.agent_name);
  const buffer = streamingState.workflowItemsBuffer;
  const last = buffer[buffer.length - 1];

  if (last?.type === 'text' && last.agentName === agentName) {
    last.content += content;
  } else {
    buffer.push({ type: 'text', content, agentName });
  }

  effects.scheduleFlush();
}

// ====== REASONING ======

export function handleReasoning(event: ChatStreamEvent, effects: StreamingSideEffects): void {
  pushItem(
    {
      type: 'reasoning',
      content: event.content ?? '',
      agentName: normalizeAgentName(event.agent_name),
    },
    effects,
  );
}

// ====== TOOL_START / TOOL_END ======

export function handleToolStart(event: ChatStreamEvent, effects: StreamingSideEffects): void {
  pushItem(
    {
      type: 'tool',
      content: '',
      toolName: normalizeToolName(event.name),
      toolInput: event.input ?? undefined,
      agentName: normalizeAgentName(event.agent_name),
    },
    effects,
  );
}

/** Attach output to the most recent matching `tool` item. */
export function handleToolEnd(event: ChatStreamEvent, effects: StreamingSideEffects): void {
  const buffer = streamingState.workflowItemsBuffer;
  const target = normalizeToolName(event.name);
  for (let i = buffer.length - 1; i >= 0; i--) {
    if (buffer[i].type === 'tool' && buffer[i].toolName === target) {
      buffer[i].toolOutput =
        event.status === 'error'
          ? `${event.output ?? 'Unknown error'}`
          : event.output ?? undefined;
      break;
    }
  }
  effects.scheduleFlush();
}

// ====== AGENT_START / NODE_START ======

/** Push an agent-start separator. */
export function handleAgentStart(event: ChatStreamEvent, effects: StreamingSideEffects): void {
  pushAgentStartOnce(normalizeAgentName(event.agent_name), effects, false);
}

/** Swarm/Graph node entry — same separator as an agent_start. */
export function handleNodeStart(event: ChatStreamEvent, effects: StreamingSideEffects): void {
  pushAgentStartOnce(normalizeAgentName(event.node_id ?? event.agent_name), effects, false);
}

/** Orchestrator invocation start — same separator but flagged as orchestrator. */
export function handleMultiagentStart(event: ChatStreamEvent, effects: StreamingSideEffects): void {
  pushAgentStartOnce(normalizeAgentName(event.agent_name), effects, true);
}

// ====== NODE_STOP / AGENT_COMPLETE / MULTIAGENT_COMPLETE ======

/** Swarm/Graph node exit — pushes an agent-end separator. */
export function handleNodeStop(event: ChatStreamEvent, effects: StreamingSideEffects): void {
  pushAgentStopOnce(normalizeAgentName(event.node_id ?? event.agent_name), effects, false);
}

/**
 * Agent or orchestrator finished. Sub-agents push an agent-end separator.
 * Does NOT finalize the turn — `session_end` is the authoritative end signal.
 */
const handleCompleteLike = (
  event: ChatStreamEvent,
  effects: StreamingSideEffects,
  isOrchestrator: boolean,
): void => {
  pushAgentStopOnce(normalizeAgentName(event.agent_name), effects, isOrchestrator);
};

export function handleComplete(event: ChatStreamEvent, effects: StreamingSideEffects): void {
  // Accumulate per-turn token usage from agent_complete events only. This
  // mirrors the backend, which persists usage on AGENT_COMPLETE (not
  // multiagent_complete) so the orchestrator total isn't double-counted.
  streamingState.inputTokens += event.input_tokens ?? 0;
  streamingState.outputTokens += event.output_tokens ?? 0;
  handleCompleteLike(event, effects, false);
}

export function handleMultiagentComplete(event: ChatStreamEvent, effects: StreamingSideEffects): void {
  handleCompleteLike(event, effects, true);
}

// ====== HANDOFF ======

export function handleHandoff(event: ChatStreamEvent, effects: StreamingSideEffects): void {
  const agentName = normalizeAgentName(event.agent_name);
  pushItem(
    {
      type: 'handoff',
      content: `Handoff to ${agentName ?? 'next agent'}`,
      agentName,
    },
    effects,
  );
}

// ====== ERROR ======

/**
 * Finalize the turn immediately with the error message.
 * Do not wait for session_end — on connection failures it never arrives.
 * Only the first error wins; subsequent error events before session_end are ignored.
 */
export function handleError(event: ChatStreamEvent, effects: StreamingSideEffects): void {
  if (streamingState.isFinalized) return;
  const message = event.content ?? 'Unknown error';
  streamingState.errorMessage = message;
  finalizeMessage(event, effects);
}
