/**
 * Public entry point for the streaming pipeline.
 *
 * The store imports `dispatchStreamEvent` and a few lifecycle helpers.
 * Everything else is hidden behind this barrel to keep call sites simple.
 */

import type { ChatStreamEvent } from '../../types';
import type { StreamingSideEffects } from './types';
import {
  handleSessionStart,
  handleSessionEnd,
  handleToken,
  handleReasoning,
  handleToolStart,
  handleToolEnd,
  handleAgentStart,
  handleMultiagentStart,
  handleNodeStart,
  handleNodeStop,
  handleHandoff,
  handleComplete,
  handleMultiagentComplete,
  handleError,
} from './handlers';

export { streamingState, resetStreamingState, makeInitialStreamingState } from './state';
export { configureScheduler, scheduleFlush, cancelFlush } from './scheduler';
export type { StreamingState, StreamingSideEffects } from './types';

/** Route a single backend event to the right handler. */
export function dispatchStreamEvent(
  event: ChatStreamEvent,
  effects: StreamingSideEffects,
): void {
  switch (event.type) {
    case 'session_start':
      return handleSessionStart(event, effects);
    case 'session_end':
      return handleSessionEnd(event, effects);
    case 'token':
      return handleToken(event, effects);
    case 'reasoning':
      return handleReasoning(event, effects);
    case 'tool_start':
      return handleToolStart(event, effects);
    case 'tool_end':
      return handleToolEnd(event, effects);
    case 'agent_start':
      return handleAgentStart(event, effects);
    case 'multiagent_start':
      return handleMultiagentStart(event, effects);
    case 'node_start':
      return handleNodeStart(event, effects);
    case 'node_stop':
      return handleNodeStop(event, effects);
    case 'handoff':
      return handleHandoff(event, effects);
    case 'agent_complete':
      return handleComplete(event, effects);
    case 'multiagent_complete':
      return handleMultiagentComplete(event, effects);
    case 'error':
      return handleError(event, effects);
    case 'interrupt':
      return;
  }
}
