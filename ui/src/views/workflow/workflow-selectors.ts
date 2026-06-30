/**
 * WorkflowView-specific store selectors and helpers.
 *
 * Kept alongside the view because no other component needs them and
 * they're tightly coupled to the view's rendering rules.
 */

import type { WorkflowItem, WorkflowGroupedItems, ChatStore } from '@/types';

/**
 * Merge consecutive items of the same type and agent into one group.
 *
 * Keeps the full trace, including the trailing answer text, so the panel stays
 * stable when a turn finalizes. The answer thus shows here and in the thread.
 */
export function groupConsecutiveItems(
  items: WorkflowItem[],
): WorkflowGroupedItems[] {
  if (!items) return [];

  const groups: WorkflowGroupedItems[] = [];
  for (const item of items) {
    const lastGroup = groups[groups.length - 1];
    const sameType = lastGroup && lastGroup.type === item.type;
    const sameAgent =
      lastGroup && (lastGroup.items[0].agentName ?? '') === (item.agentName ?? '');

    if (sameType && sameAgent) {
      lastGroup.items.push(item);
    } else {
      groups.push({ type: item.type, items: [item] });
    }
  }

  return groups;
}

/**
 * Result of resolving which workflow trace the panel should display.
 */
export interface WorkflowTraceSelection {
  items: WorkflowItem[];
  isStreaming: boolean;
}

/**
 * Resolve which trace the panel shows: the live buffer while a turn runs or has
 * just finished, otherwise the stored trace for the selected (or latest)
 * assistant seq.
 */
export function selectWorkflowTrace(
  state: ChatStore | null | undefined,
): WorkflowTraceSelection {
  if (!state) return { items: [], isStreaming: false };

  // While streaming, show the live buffer.
  if (state.isLoading) {
    return { items: state.activeWorkflowItems, isStreaming: true };
  }

  // Just finished: the buffer holds this turn's trace until the refetch assigns
  // its seq, so prefer it over the still-stale selectedWorkflowSeq.
  if (state.activeWorkflowItems.length > 0) {
    return { items: state.activeWorkflowItems, isStreaming: false };
  }

  // Fall back to the latest assistant seq when none is selected.
  let targetSeq: number | null = state.selectedWorkflowSeq;
  if (targetSeq === null) {
    for (let i = state.messageOrder.length - 1; i >= 0; i--) {
      const msg = state.messages[state.messageOrder[i]];
      if (msg?.role === 'assistant' && msg.seq != null) {
        targetSeq = msg.seq;
        break;
      }
    }
  }

  if (targetSeq === null) {
    return { items: [], isStreaming: false };
  }
  return { items: state.workflowTraces[targetSeq] ?? [], isStreaming: false };
}

/**
 * Resolve the token totals the panel shows, mirroring selectWorkflowTrace.
 * Zero maps to `undefined` so the badge hides instead of showing "0".
 */
export function selectWorkflowTokens(
  state: ChatStore | null | undefined,
): { inputTokens: number | undefined; outputTokens: number | undefined } {
  const zeroToUndef = (n: number): number | undefined => (n > 0 ? n : undefined);

  if (!state) return { inputTokens: undefined, outputTokens: undefined };

  if (state.isLoading) {
    return {
      inputTokens: zeroToUndef(state.activeWorkflowTokens.input),
      outputTokens: zeroToUndef(state.activeWorkflowTokens.output),
    };
  }

  // Just finished: prefer the live totals, mirroring selectWorkflowTrace.
  if (state.activeWorkflowItems.length > 0) {
    return {
      inputTokens: zeroToUndef(state.activeWorkflowTokens.input),
      outputTokens: zeroToUndef(state.activeWorkflowTokens.output),
    };
  }

  let targetSeq: number | null = state.selectedWorkflowSeq;
  if (targetSeq === null) {
    for (let i = state.messageOrder.length - 1; i >= 0; i--) {
      const msg = state.messages[state.messageOrder[i]];
      if (msg?.role === 'assistant' && msg.seq != null) {
        targetSeq = msg.seq;
        break;
      }
    }
  }

  if (targetSeq === null) {
    return {
      inputTokens: zeroToUndef(state.activeWorkflowTokens.input),
      outputTokens: zeroToUndef(state.activeWorkflowTokens.output),
    };
  }

  const tokens = state.workflowTokens[targetSeq];
  if (!tokens) return { inputTokens: undefined, outputTokens: undefined };
  return {
    inputTokens: zeroToUndef(tokens.input),
    outputTokens: zeroToUndef(tokens.output),
  };
}
