/**
 * Dropdown that lets the user switch between available agents.
 *
 * Triggers the store's one-time agent fetch on mount and reads the list,
 * loading, and error flags from the store. Selecting an agent updates the
 * Zustand store so all consumers (WelcomeView, suggestions, invocation
 * requests) see the new value.
 */

import type { ReactElement } from 'react';
import { memo, useEffect, useCallback } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { useChatStore } from '@/store';
import type { Agent } from '@/services';
import {
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components';
import styles from './AgentSelector.module.css';

const AgentSelectorComponent = (): ReactElement => {
  // ======================
  // STATE, HOOKS & REFS
  // ======================
  const selectedAgent = useChatStore((s) => s.selectedAgent);
  const selectedAgentLabel = useChatStore((s) => s.selectedAgentLabel);
  const selectAgent = useChatStore((s) => s.selectAgent);
  const agents = useChatStore((s) => s.agents);
  const loading = useChatStore((s) => s.agentsLoading);
  const error = useChatStore((s) => s.agentsError);
  const loadAgents = useChatStore((s) => s.loadAgents);

  useEffect(() => {
    loadAgents();
  }, [loadAgents]);

  // ======================
  // HANDLERS
  // ======================
  const handleSelect = useCallback(
    (agent: Agent) => () => {
      sessionStorage.setItem('lastSelectedAgentId', agent.id);
      selectAgent(agent);
    },
    [selectAgent],
  );

  // ======================
  // RENDER FUNCTIONS
  // ======================
  const triggerLabel = loading
    ? 'Loading…'
    : error
      ? 'Error'
      : selectedAgentLabel || '---';

  const renderItems = (): ReactElement[] => {
    if (error) {
      return [
        <DropdownMenuItem key="__error" className={styles.dropdownMsg}>
          Failed to load agents
        </DropdownMenuItem>,
      ];
    }
    return agents.map((agent) => (
      <DropdownMenuItem
        key={agent.id}
        isChecked={agent.id === selectedAgent}
        onSelect={handleSelect(agent)}
      >
        <span className={styles.agentName}>{agent.name}</span>
      </DropdownMenuItem>
    ));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={loading || error} className={styles.trigger}>
          {triggerLabel}
          <FiChevronDown size={13} className={styles.chevron} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">{renderItems()}</DropdownMenuContent>
    </DropdownMenu>
  );
};

export const AgentSelector = memo(AgentSelectorComponent);
