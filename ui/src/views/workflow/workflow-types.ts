/** Props for the AgentEvent block component. */
export interface AgentEventProps {
  variant: 'agent_start' | 'agent_stop' | 'handoff';
  agentName?: string;
  content?: string;
  isOrchestrator?: boolean;
}
