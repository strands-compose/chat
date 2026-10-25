/**
 * WorkflowView-specific store selectors and helpers.
 *
 * Kept alongside the view because no other component needs them and
 * they're tightly coupled to the view's rendering rules.
 */

import type { WorkflowItem, ChatStore } from '@/types';
import type { AgentRun, AgentSummary } from './workflow-types';

/** Number of colours in the per-agent palette (`--sc-agent-1` … `--sc-agent-5`). */
const AGENT_PALETTE_SIZE = 5;

/**
 * Split the flat trace into per-agent runs so agents streaming in parallel
 * render under their own lane instead of interleaved line by line.
 *
 * A delegation is a tool call named after the sub-agent it invokes (names are
 * display-normalized and differ only in case). When a sub-agent starts while
 * such a call is pending in its delegator's open run, the sub-agent's run is
 * nested under that tool item (`children`) and the delegator's run simply
 * continues after it. Calls are matched first-in-first-out, skipping calls
 * that already failed (a rejected parallel call never starts a run).
 *
 * Sub-agents that cannot be matched to a call stay top-level; their delegator
 * then opens a fresh run once they end, so its continuation reads below them.
 * Items the backend left unattributed collect in a nameless run at the end.
 */
export function buildAgentRuns(items: WorkflowItem[]): AgentRun[] {
  const runs: AgentRun[] = [];
  const openRuns = new Map<string, AgentRun>();
  /** Agents whose unmatched delegate has ended and whose next item therefore opens a new run. */
  const resumingAgents = new Set<string>();
  /** Sub-agent name -> the agent whose delegation tool launched it. */
  const delegatedBy = new Map<string, string>();
  /** Sub-agent name -> delegation calls not yet matched to a run, oldest first. */
  const pendingCalls = new Map<string, Array<{ run: AgentRun; item: WorkflowItem }>>();
  /** Sub-agents whose current run is nested under a delegation call. */
  const nestedAgents = new Set<string>();
  const orchestrators = new Set<string>();
  const unattributed: AgentRun = {
    key: 'unattributed',
    isOrchestrator: false,
    hasEnded: false,
    groups: [],
    children: new Map(),
  };

  const takePendingCall = (agentKey: string): { run: AgentRun; item: WorkflowItem } | undefined => {
    const queue = pendingCalls.get(agentKey);
    if (!queue) return undefined;
    while (queue.length > 0) {
      const call = queue.shift()!;
      if (call.item.toolStatus !== 'error') return call;
    }
    return undefined;
  };

  /** Counts every run (top-level and nested) so keys stay unique and stable. */
  let runCounter = 0;

  const startRun = (agentKey: string, agentName: string): AgentRun => {
    const run: AgentRun = {
      key: `${agentKey}#${runCounter++}`,
      agentName,
      isOrchestrator: orchestrators.has(agentKey),
      hasEnded: false,
      groups: [],
      children: new Map(),
    };
    const call = takePendingCall(agentKey);
    if (call) {
      const siblings = call.run.children.get(call.item) ?? [];
      siblings.push(run);
      call.run.children.set(call.item, siblings);
      nestedAgents.add(agentKey);
    } else {
      runs.push(run);
      nestedAgents.delete(agentKey);
    }
    openRuns.set(agentKey, run);
    resumingAgents.delete(agentKey);
    return run;
  };

  for (const item of items) {
    const agentName = item.agentName;
    const agentKey = agentName ?? '';

    if (item.isOrchestrator) orchestrators.add(agentKey);

    // Start/stop items are run boundaries; the lane header/footer is rendered from the run itself.
    if (item.type === 'agent_start') {
      if (agentName && !openRuns.has(agentKey)) startRun(agentKey, agentName);
      continue;
    }
    if (item.type === 'agent_stop') {
      const ending = openRuns.get(agentKey);
      if (!ending) continue;
      ending.hasEnded = true;
      ending.inputTokens = item.inputTokens;
      ending.outputTokens = item.outputTokens;
      openRuns.delete(agentKey);
      const delegator = delegatedBy.get(agentKey);
      if (delegator && openRuns.has(delegator) && !nestedAgents.has(agentKey)) {
        resumingAgents.add(delegator);
      }
      nestedAgents.delete(agentKey);
      continue;
    }

    let target: AgentRun;
    if (!agentName) {
      target = unattributed;
    } else {
      const open = openRuns.get(agentKey);
      target = !open || resumingAgents.has(agentKey) ? startRun(agentKey, agentName) : open;
      if (item.type === 'tool' && item.toolName) {
        const callee = item.toolName.toUpperCase();
        delegatedBy.set(callee, agentKey);
        const queue = pendingCalls.get(callee) ?? [];
        queue.push({ run: target, item });
        pendingCalls.set(callee, queue);
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
 * Distinct agents in a trace, in order of first appearance, with their run
 * count and a stable colour from the per-agent palette.
 */
export function summarizeAgents(items: WorkflowItem[]): AgentSummary[] {
  const byName = new Map<string, AgentSummary>();
  for (const item of items) {
    if (item.type !== 'agent_start' || !item.agentName) continue;
    const existing = byName.get(item.agentName);
    if (existing) {
      existing.runCount += 1;
      existing.isOrchestrator ||= !!item.isOrchestrator;
      continue;
    }
    byName.set(item.agentName, {
      agentName: item.agentName,
      isOrchestrator: !!item.isOrchestrator,
      runCount: 1,
      color: `var(--sc-agent-${(byName.size % AGENT_PALETTE_SIZE) + 1})`,
    });
  }
  return [...byName.values()];
}

/** Names of all agents that started in the trace (to recognise delegation tool calls). */
export function agentNameSet(summaries: AgentSummary[]): Set<string> {
  return new Set(summaries.map((s) => s.agentName.toUpperCase()));
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
