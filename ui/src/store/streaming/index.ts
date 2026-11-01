/**
 * Public entry point for the streaming pipeline.
 *
 * The store imports `dispatchStreamEvent` and a few lifecycle helpers.
 * Everything else is hidden behind this barrel to keep call sites simple.
 */

import type { ChatStreamEvent } from '../../types';
import {
  handleAgentStart,
  handleComplete,
  handleError,
  handleHandoff,
  handleMultiagentComplete,
  handleMultiagentStart,
  handleNodeStart,
  handleNodeStop,
  handleReasoning,
  handleSessionEnd,
  handleSessionStart,
  handleToken,
  handleToolEnd,
  handleToolStart,
} from './handlers';
import type { StreamingSideEffects } from './types';

export { cancelFlush, configureScheduler, scheduleFlush } from './scheduler';
export { makeInitialStreamingState, resetStreamingState, streamingState } from './state';
export type { StreamingSideEffects, StreamingState } from './types';

/** Route a single backend event to the right handler. */
export function dispatchStreamEvent(event: ChatStreamEvent, effects: StreamingSideEffects): void {
  switch (event.type) {
    case 'session_start':
      handleSessionStart(event, effects);
      break;
    case 'session_end':
      handleSessionEnd(event, effects);
      break;
    case 'token':
      handleToken(event, effects);
      break;
    case 'reasoning':
      handleReasoning(event, effects);
      break;
    case 'tool_start':
      handleToolStart(event, effects);
      break;
    case 'tool_end':
      handleToolEnd(event, effects);
      break;
    case 'agent_start':
      handleAgentStart(event, effects);
      break;
    case 'multiagent_start':
      handleMultiagentStart(event, effects);
      break;
    case 'node_start':
      handleNodeStart(event, effects);
      break;
    case 'node_stop':
      handleNodeStop(event, effects);
      break;
    case 'handoff':
      handleHandoff(event, effects);
      break;
    case 'agent_complete':
      handleComplete(event, effects);
      break;
    case 'multiagent_complete':
      handleMultiagentComplete(event, effects);
      break;
    case 'error':
      handleError(event, effects);
      break;
    case 'interrupt':
      break;
  }
}
