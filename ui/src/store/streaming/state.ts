/**
 * Singleton holder for the per-turn streaming state.
 *
 * Lives outside React state because token events arrive at ~30/sec.
 * The scheduler coalesces buffer changes into throttled Zustand updates.
 */

import type { StreamingState } from './types';

/** Build a fresh, empty streaming state. */
export function makeInitialStreamingState(): StreamingState {
  return {
    workflowItemsBuffer: [],
    inputTokens: 0,
    outputTokens: 0,
    errorMessage: null,
    isFinalized: false,
  };
}

/** The single live streaming state. Read-write from handlers and the dispatcher. */
export const streamingState: StreamingState = makeInitialStreamingState();

/** Reset all per-turn buffers in place. Called at the start of each turn and after finalization. */
export function resetStreamingState(): void {
  Object.assign(streamingState, makeInitialStreamingState());
}
