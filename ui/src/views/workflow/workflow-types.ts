import type { WorkflowGroupedItems, WorkflowItem } from '@/types';

/**
 * One contiguous activation of a single agent: everything it emitted between
 * its start and stop, already grouped for rendering.
 */
export interface AgentRun {
  /** Stable across flushes — the trace is append-only. */
  key: string;
  /** Undefined for the trailing run holding items the backend left unattributed. */
  agentName?: string;
  isOrchestrator: boolean;
  /** True once the agent's stop event arrived; false while it runs or is paused mid-delegation. */
  hasEnded: boolean;
  groups: WorkflowGroupedItems[];
  /** Tokens reported when the agent finished. */
  inputTokens?: number;
  outputTokens?: number;
  /** Sub-agent runs launched by a delegation tool call in this run, keyed by that tool item. */
  children: Map<WorkflowItem, AgentRun[]>;
}

/** One distinct agent in a trace, for the panel's agent chips. */
export interface AgentSummary {
  agentName: string;
  isOrchestrator: boolean;
  /** Number of activations in the trace. */
  runCount: number;
  /** CSS colour assigned to this agent. */
  color: string;
}
