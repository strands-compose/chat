/**
 * Right-hand panel with the selected agent's description (Markdown).
 *
 * Mounted by the app shell in the split layout's right slot while the welcome
 * screen is showing, so it spans the full height next to the chat column just
 * like the workflow panel does.
 */

import type { ReactElement } from 'react';
import { memo, useCallback, useState } from 'react';
import { LuBot, LuCheck, LuCopy } from 'react-icons/lu';
import { useChatStore } from '@/store';
import { IconButton, Markdown } from '@/components';
import styles from './AgentDescriptionPanel.module.css';

const COPIED_RESET_MS = 2000;

const AgentDescriptionPanelComponent = (): ReactElement => {
  // ======================
  // STATE, HOOKS & REFS
  // ======================
  const agentDescription = useChatStore((s) => s.selectedAgentDescription);
  const agentLabel = useChatStore((s) => s.selectedAgentLabel);
  const [copied, setCopied] = useState(false);

  // ======================
  // HANDLERS
  // ======================
  const handleCopy = useCallback(() => {
    const markdown = `# ${agentLabel}\n\n${agentDescription}`;
    navigator.clipboard
      .writeText(markdown)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), COPIED_RESET_MS);
      })
      .catch(console.error);
  }, [agentLabel, agentDescription]);

  return (
    <aside className={styles.panel}>
      <header className={styles.header}>
        <LuBot size={18} className={styles.icon} aria-hidden="true" />
        <span className={styles.label}>{agentLabel}</span>
        <IconButton
          size="lg"
          onClick={handleCopy}
          title="Copy description as Markdown"
          aria-label="Copy description as Markdown"
        >
          {copied ? <LuCheck size={17} /> : <LuCopy size={17} />}
        </IconButton>
      </header>
      <div className={styles.body}>
        <Markdown className={styles.markdown}>{agentDescription}</Markdown>
      </div>
    </aside>
  );
};

export const AgentDescriptionPanel = memo(AgentDescriptionPanelComponent);
