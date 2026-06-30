/**
 * AgentsList — agents available to the user, as an accordion.
 *
 * Each row shows the agent name and a kind badge; expanding a row reveals the
 * agent's description rendered as markdown (same renderer as the welcome view).
 */

import type { ReactElement } from 'react';
import { memo, useState } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Markdown,
  StatusBadge,
} from '@/components';
import type { Agent } from '@/services/api';
import styles from './AgentsList.module.css';

// ======================
// TYPES & HELPERS
// ======================

interface AgentsListProps {
  agents: Agent[];
}

/** Map an agent's kind to a human-readable badge label. */
const kindLabel = (agentKind: string): string => (
  agentKind.replaceAll("_", " ").toUpperCase()
)

// ======================
// AGENT ROW
// ======================

interface AgentRowProps {
  agent: Agent;
}

const AgentRow = ({ agent }: AgentRowProps): ReactElement => {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className={styles.row}>
      <CollapsibleTrigger asChild>
        <button type="button" className={styles.rowHeader}>
          <FiChevronRight
            size={16}
            className={open ? `${styles.chevron} ${styles.chevronOpen}` : styles.chevron}
          />
          <span className={styles.agentName}>{agent.name}</span>
          <StatusBadge variant="neutral" label={kindLabel(agent.agent_kind)} />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className={styles.rowBody}>
        {agent.description ? (
          <Markdown className={styles.description}>
            {agent.description}
          </Markdown>
        ) : (
          <p className={styles.noDescription}>No description provided.</p>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

// ======================
// COMPONENT
// ======================

const AgentsListComponent = ({ agents }: AgentsListProps): ReactElement => {
  if (agents.length === 0) {
    return <p className={styles.emptyState}>No agents available</p>
  }

  return (
    <div className={styles.list}>
      {agents.map((agent) => (
        <AgentRow key={agent.id} agent={agent} />
      ))}
    </div>
  );
};

export const AgentsList = memo(AgentsListComponent);
