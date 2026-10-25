/**
 * Fixed top bar of the chat column.
 *
 * Left slot:  agent name, then collapse-all / expand-all buttons and the
 *             compact/full-width toggle for the message column (only when
 *             `onToggleWidth` is given).
 * Right slot: session usage pill (cost + input/output tokens), then the
 *             light/dark theme toggle.
 *
 * Uses the shared SubheaderBar so it matches the WorkflowView title bar.
 */

import type { ReactElement } from 'react';
import { memo } from 'react';
import {
  LuChevronsDown,
  LuChevronsUp,
  LuFoldHorizontal,
  LuMoon,
  LuSun,
  LuUnfoldHorizontal,
} from 'react-icons/lu';
import { IconButton, SubheaderBar, UsagePill } from '@/components';
import { useTheme } from '@/contexts';
import { useChatStore } from '@/store';
import styles from './ControlBar.module.css';

interface ChatControlBarProps {
  onCollapseAll: () => void;
  onExpandAll: () => void;
  /** True when the message column uses the full available width. */
  isFullWidth?: boolean;
  /** Toggles compact / full width. Omit to hide the control (e.g. on the welcome screen). */
  onToggleWidth?: () => void;
}

const ChatControlBarComponent = ({
  onCollapseAll,
  onExpandAll,
  isFullWidth = false,
  onToggleWidth,
}: ChatControlBarProps): ReactElement => {
  // ======================
  // STATE, HOOKS & REFS
  // ======================
  const inputTokens = useChatStore((s) => s.sessionInputTokens);
  const outputTokens = useChatStore((s) => s.sessionOutputTokens);
  const sessionCost = useChatStore((s) => s.sessionCost);
  const agentLabel = useChatStore((s) => s.selectedAgentLabel);
  const { toggle, isDark } = useTheme();

  // ======================
  // RENDER FUNCTIONS
  // ======================
  const renderAgentLabel = (): ReactElement | null => {
    if (!agentLabel) return null;
    return (
      <>
        <span className={styles.agentName}>{agentLabel}</span>
        <span className={styles.separator} aria-hidden="true" />
      </>
    );
  };

  const left = (
    <div className={styles.leftGroup}>
      {renderAgentLabel()}
      <IconButton size="lg" onClick={onCollapseAll} title="Collapse all messages">
        <LuChevronsUp size={18} />
      </IconButton>
      <IconButton size="lg" onClick={onExpandAll} title="Expand all messages">
        <LuChevronsDown size={18} />
      </IconButton>
      {onToggleWidth && (
        <IconButton
          size="lg"
          onClick={onToggleWidth}
          isActive={isFullWidth}
          title={isFullWidth ? 'Use compact width' : 'Use full width'}
          aria-label={isFullWidth ? 'Use compact width' : 'Use full width'}
          aria-pressed={isFullWidth}
        >
          {isFullWidth ? <LuFoldHorizontal size={18} /> : <LuUnfoldHorizontal size={18} />}
        </IconButton>
      )}
    </div>
  );

  const right = (
    <div className={styles.rightGroup}>
      <span className={styles.usage}>
        <UsagePill
          cost={sessionCost}
          inputTokens={inputTokens}
          outputTokens={outputTokens}
          title="Session usage"
        />
      </span>
      <IconButton
        size="lg"
        onClick={toggle}
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? <LuSun size={18} /> : <LuMoon size={18} />}
      </IconButton>
    </div>
  );

  return <SubheaderBar left={left} right={right} />;
};

export const ChatControlBar = memo(ChatControlBarComponent);
