/**
 * Fixed control bar at the top of the chat message list.
 *
 * Left slot:  collapse / expand buttons, then "Agent: <name>" label.
 * Right slot: total cost badge (when pricing data is available), then total
 *             token usage across the conversation.
 *
 * Uses the shared SubheaderBar so it matches the WorkflowView title bar.
 */

import type { ReactElement } from 'react';
import { memo } from 'react';
import { FiChevronsUp, FiChevronsDown } from 'react-icons/fi';
import { CostBadge, SubheaderBar, TokenBadges } from '@/components';
import { useChatStore } from '@/store';
import styles from './ControlBar.module.css';

interface ChatControlBarProps {
  onCollapseAll: () => void;
  onExpandAll: () => void;
}

const ChatControlBarComponent = ({
  onCollapseAll,
  onExpandAll,
}: ChatControlBarProps): ReactElement => {
  const inputTokens = useChatStore((s) => s.sessionInputTokens);
  const outputTokens = useChatStore((s) => s.sessionOutputTokens);
  const sessionCost = useChatStore((s) => s.sessionCost);
  const agentLabel = useChatStore((s) => s.selectedAgentLabel);

  // ======================
  // RENDER FUNCTIONS
  // ======================

  const renderAgentLabel = (): ReactElement | null => {
    if (!agentLabel) return null;
    return (
      <span className={styles.agentLabel}>
        Agent: <span className={styles.agentName}>{agentLabel}</span>
      </span>
    );
  };

  const left = (
    <div className={styles.subheaderGroup}>
      <button
        className={styles.subheaderBtn}
        onClick={onCollapseAll}
        type="button"
        title="Collapse all messages"
      >
        <FiChevronsUp size={14} />
      </button>
      <button
        className={styles.subheaderBtn}
        onClick={onExpandAll}
        type="button"
        title="Expand all messages"
      >
        <FiChevronsDown size={14} />
      </button>
      {renderAgentLabel()}
    </div>
  );

  const right = (
    <div className={styles.rightSlot}>
      <CostBadge cost={sessionCost} label="Total cost" />
      <TokenBadges inputTokens={inputTokens} outputTokens={outputTokens} label="Total tokens" />
    </div>
  );

  return <SubheaderBar left={left} right={right} />;
};

export const ChatControlBar = memo(ChatControlBarComponent);
