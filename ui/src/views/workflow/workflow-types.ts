import type { WorkflowGroupedItems } from '@/types';

/** Props for the AgentEvent block component. */
export interface AgentEventProps {
  variant: 'agent_start' | 'agent_stop' | 'handoff';
  agentName?: string;
  content?: string;
  isOrchestrator?: boolean;
}

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
}
