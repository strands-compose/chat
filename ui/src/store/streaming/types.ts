/**
 * Internal streaming-state types used by the buffer/scheduler/handler modules.
 *
 * Not exported from the public types barrel — these describe the in-memory
 * shape of the streaming pipeline only, not the React/store contract.
 */

import type { Message, WorkflowItem } from '../../types';

/**
 * Mutable buffer that accumulates events for a single in-flight assistant turn.
 *
 * Lives outside React state because token events arrive at ~30/sec and
 * writing each one into Zustand would thrash the reconciler. The scheduler
 * coalesces buffer changes into throttled React updates.
 */
export interface StreamingState {
  /** All workflow items accumulated so far for the current turn. */
  workflowItemsBuffer: WorkflowItem[];

  /** Input tokens summed across this turn's `agent_complete` events. */
  inputTokens: number;
  /** Output tokens summed across this turn's `agent_complete` events. */
  outputTokens: number;

  /** First error message received in this turn — subsequent errors are ignored. */
  errorMessage: string | null;

  /**
   * Set to `true` once `finalizeMessage` has committed the turn result.
   * Guards against double-finalization when an `error` event is followed by
   * a `session_end` (or multiple `error` events arrive before `session_end`).
   */
  isFinalized: boolean;
}

/**
 * Token totals for a single turn, summed across `agent_complete` events.
 */
export interface TurnTokens {
  input: number;
  output: number;
}

/**
 * Side-effect surface that streaming handlers are allowed to use.
 *
 * Passed in rather than imported directly so handlers stay decoupled from
 * Zustand and can be unit-tested with a fake.
 */
export interface StreamingSideEffects {
  /** Schedule a throttled React state update from the buffer. */
  scheduleFlush: () => void;
  /** Cancel any pending flush (used when finalizing or aborting). */
  cancelFlush: () => void;
  /**
   * Apply a partial update to the pending assistant message at end of turn.
   * No content reconstruction required — the backend is the source of truth.
   */
  commitFinal: (patch: Partial<Message>) => void;
  /**
   * Called once when the session_start event arrives.
   * By this point the backend has already committed the chat_sessions row,
   * so a sidebar reload fired here will always find the new session.
   *
   * Receives the backend-minted session id (when present) so a new
   * conversation can adopt it for follow-up turns and restore.
   */
  onSessionStart: (sessionId?: string) => void;
  /**
   * Called when a session_end event arrives for a successful turn.
   * Triggers the backend refetch to rebuild the thread from persisted data.
   *
   * Receives a snapshot of the completed turn's workflow items and token
   * totals, captured before finalization resets the per-turn buffer, so they
   * can be associated with the persisted assistant message.
   */
  onSessionEnd: (trace: WorkflowItem[], tokens: TurnTokens) => void;
}
