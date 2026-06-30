/**
 * RAF-based throttled flush from streaming buffers into the Zustand store.
 *
 * Why this exists:
 *   Token events arrive at ~30/sec; flushing each into React would burn
 *   frame budget on the reconciler. We coalesce all buffer changes into one
 *   state update per `FLUSH_INTERVAL_MS` window, keyed on `requestAnimationFrame`
 *   so updates align with the browser repaint cadence.
 */

import type { WorkflowItem } from '../../types';
import { streamingState } from './state';

/** Minimum gap between flushes — caps store updates at ~10/sec, smooth on 60Hz displays. */
const FLUSH_INTERVAL_MS = 100;

/**
 * Configuration the scheduler needs from the host store.
 *
 * `applyWorkflowItems` is invoked with a snapshot of the current workflow items buffer.
 */
interface SchedulerHooks {
  applyWorkflowItems: (items: WorkflowItem[]) => void;
  applyWorkflowTokens: (tokens: { input: number; output: number }) => void;
}

let hooks: SchedulerHooks | null = null;
let flushRafId: number | null = null;
let lastFlushTime = 0;

/**
 * Wire the scheduler up to the host store. Call once during store creation.
 *
 * Why a setup step rather than direct import:
 *   Avoids a circular dependency between the store and the streaming module.
 */
export function configureScheduler(h: SchedulerHooks): void {
  hooks = h;
}

/**
 * Request a flush. Safe to call from any hot path — it is idempotent within
 * a single animation frame.
 */
export function scheduleFlush(): void {
  if (flushRafId !== null) return;

  flushRafId = requestAnimationFrame(() => {
    flushRafId = null;

    const now = performance.now();
    if (now - lastFlushTime < FLUSH_INTERVAL_MS) {
      // Too soon since the last flush — defer to the next frame.
      scheduleFlush();
      return;
    }
    lastFlushTime = now;

    if (!hooks) return;

    hooks.applyWorkflowItems([...streamingState.workflowItemsBuffer]);
    hooks.applyWorkflowTokens({
      input: streamingState.inputTokens,
      output: streamingState.outputTokens,
    });
  });
}

/**
 * Cancel any pending flush. Used by `finalizeMessage` (which writes the final
 * snapshot itself) and on abort.
 */
export function cancelFlush(): void {
  if (flushRafId !== null) {
    cancelAnimationFrame(flushRafId);
    flushRafId = null;
  }
}
