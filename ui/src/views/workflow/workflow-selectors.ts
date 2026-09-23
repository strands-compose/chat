/**
 * WorkflowView-specific store selectors and helpers.
 *
 * Kept alongside the view because no other component needs them and
 * they're tightly coupled to the view's rendering rules.
 */

import type { WorkflowItem, ChatStore } from '@/types';
import type { AgentRun } from './workflow-types';

/**
 * Split the flat trace into per-agent runs so agents streaming in parallel
 * render under their own separator instead of interleaved line by line.
 *
 * Runs appear in the order they opened, and consecutive items of the same type
 * within a run are merged into one group. An agent that delegates opens a fresh
 * run when the sub-agent it launched ends, so its continuation reads below that
 * sub-agent's block rather than inside its own earlier one. Items the backend
 * left unattributed collect in a nameless run at the end.
 */
export function buildAgentRuns(items: WorkflowItem[]): AgentRun[] {
  const runs: AgentRun[] = [];
  const openRuns = new Map<string, AgentRun>();
  /** Agents whose delegate has ended and whose next item therefore opens a new run. */
  const resumingAgents = new Set<string>();
  /** Sub-agent name -> the agent whose delegation tool launched it. */
  const delegatedBy = new Map<string, string>();
  const orchestrators = new Set<string>();
  const unattributed: AgentRun = {
    key: 'unattributed',
    isOrchestrator: false,
    hasEnded: false,
    groups: [],
  };

  const startRun = (agentKey: string, agentName: string): AgentRun => {
    const run: AgentRun = {
      key: `${agentKey}#${runs.length}`,
      agentName,
      isOrchestrator: orchestrators.has(agentKey),
      hasEnded: false,
      groups: [],
    };
    runs.push(run);
    openRuns.set(agentKey, run);
    resumingAgents.delete(agentKey);
    return run;
  };

  for (const item of items) {
    const agentName = item.agentName;
    const agentKey = agentName ?? '';

    if (item.isOrchestrator) orchestrators.add(agentKey);

    // Start/stop items are run boundaries; the separators are rendered from the run itself.
    if (item.type === 'agent_start') {
      if (agentName && !openRuns.has(agentKey)) startRun(agentKey, agentName);
      continue;
    }
    if (item.type === 'agent_stop') {
      const ending = openRuns.get(agentKey);
      if (!ending) continue;
      ending.hasEnded = true;
      openRuns.delete(agentKey);
      const delegator = delegatedBy.get(agentKey);
      if (delegator && openRuns.has(delegator)) resumingAgents.add(delegator);
      continue;
    }

    let target: AgentRun;
    if (!agentName) {
      target = unattributed;
    } else {
      const open = openRuns.get(agentKey);
      target = !open || resumingAgents.has(agentKey) ? startRun(agentKey, agentName) : open;
      // A delegation tool is named after the sub-agent it invokes; both names are
      // display-normalized and differ only in case.
      if (item.type === 'tool' && item.toolName) {
        delegatedBy.set(item.toolName.toUpperCase(), agentKey);
      }
    }

    const lastGroup = target.groups[target.groups.length - 1];
    if (lastGroup?.type === item.type) lastGroup.items.push(item);
    else target.groups.push({ type: item.type, items: [item] });
  }

  if (unattributed.groups.length > 0) runs.push(unattributed);

  return runs;
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
