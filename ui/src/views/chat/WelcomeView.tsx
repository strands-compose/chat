/**
 * Welcome screen — shown when there is no active session.
 *
 * Layout:
 *   Left column (always visible):
 *     1. "Welcome to {title}" heading
 *     2. Agent selector + hint text
 *     3. Composer
 *     4. Suggestion chips
 *   Right panel (slides in when the selected agent has a description):
 *     - Agent description rendered as Markdown
 */

import type { ReactElement } from 'react';
import { memo, useCallback, useEffect, useState } from 'react';
import { FiAlertCircle, FiCopy, FiCheck } from 'react-icons/fi';
import { RiRobot2Line } from "react-icons/ri";
import { useChatStore } from '@/store';
import { Button, IconButton, Markdown } from '@/components';
import { useAppConfig } from '@/contexts';
import { AgentSelector } from './AgentSelector';
import { ConnectedComposer } from './ConnectedComposer';
import styles from './WelcomeView.module.css';

const WelcomeViewComponent = (): ReactElement => {
  // ======================
  // STATE, HOOKS & REFS
  // ======================
  const suggestions = useChatStore((s) => s.suggestedQuestions);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const agentDescription = useChatStore((s) => s.selectedAgentDescription);
  const agentLabel = useChatStore((s) => s.selectedAgentLabel);
  const agents = useChatStore((s) => s.agents);
  const agentsLoaded = useChatStore((s) => s.agentsLoaded);
  const agentsError = useChatStore((s) => s.agentsError);
  const loadAgents = useChatStore((s) => s.loadAgents);
  const { title } = useAppConfig();

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadAgents();
  }, [loadAgents]);

  /**
   * `null`  — fetch not yet settled (still loading)
   * `true`  — fetch settled with at least one agent
   * `false` — fetch settled with empty list or error
   */
  const hasSomeAgents: boolean | null = agentsLoaded ? agents.length > 0 && !agentsError : null;
  const hasDescription = agentDescription.trim().length > 0;

  // ======================
  // HANDLERS
  // ======================
  const handleChip = useCallback(
    (text: string) => () => sendMessage(text),
    [sendMessage],
  );

  const handleCopyDescription = useCallback(() => {
    const markdown = `# ${agentLabel}\n\n${agentDescription}`;
    navigator.clipboard
      .writeText(markdown)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(console.error);
  }, [agentLabel, agentDescription]);

  // ======================
  // RENDER FUNCTIONS
  // ======================
  const renderTitle = (): ReactElement => (
    <h2 className={styles.title}>
      Welcome to <span className={styles.accent}>{title ?? 'Strands Compose'}</span>
    </h2>
  );

  const renderNoAgentsBanner = (): ReactElement => (
    <div className={styles.centeredContent}>
      {renderTitle()}
      <div className={styles.noAgentsBanner} role="alert">
        <FiAlertCircle size={32} className={styles.noAgentsIcon} aria-hidden="true" />
        <span>
          You do not have access to any AI agents.
          <br />
          Contact your administrator to request access.
        </span>
      </div>
    </div>
  );

  const renderSuggestions = (): ReactElement | null => {
    if (suggestions.length === 0) return null;
    return (
      <div className={styles.suggestionsArea}>
        <p className={styles.suggestionsLabel}>Suggested</p>
        <div className={styles.suggestions}>
          {suggestions.map((s) => (
            <Button
              key={s}
              variant="ghost"
              fullWidth
              alignStart
              className={styles.chip}
              onClick={handleChip(s)}
            >
              {s}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  const renderDescriptionPanel = (): ReactElement | null => {
    if (!hasDescription) return null;
    return (
      <aside className={styles.descriptionPanel}>
        <div className={styles.descriptionHeader}>
          <RiRobot2Line size={25} className={styles.descriptionHeaderIcon} aria-hidden="true" />
          <span className={styles.descriptionHeaderLabel}>{agentLabel}</span>
          <IconButton
            size="sm"
            className={styles.descriptionCopyButton}
            onClick={handleCopyDescription}
            title="Copy description as Markdown"
            aria-label="Copy description as Markdown"
          >
            {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
          </IconButton>
        </div>
        <div className={styles.descriptionBody}>
          <Markdown>{agentDescription}</Markdown>
        </div>
      </aside>
    );
  };

  const renderAgentContent = (): ReactElement => (
    <div className={`${styles.splitRoot} ${hasDescription ? styles.splitRootOpen : ''}`}>
      <div className={styles.mainColumn}>
        {renderTitle()}
        <div className={styles.agentRow}>
          <p className={styles.hint}>Choose your agent and start conversation</p>
          <AgentSelector />
        </div>
        <div className={styles.inputWrapper}>
          <ConnectedComposer />
        </div>
        {renderSuggestions()}
      </div>
      {renderDescriptionPanel()}
    </div>
  );

  return (
    <div className={styles.root}>
      {hasSomeAgents === false && renderNoAgentsBanner()}
      {hasSomeAgents === true && renderAgentContent()}
    </div>
  );
};

export const WelcomeView = memo(WelcomeViewComponent);
export default WelcomeView;
