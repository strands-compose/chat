/**
 * Welcome screen — shown when there is no active session.
 *
 * Layout (single centred column):
 *   1. "Welcome to {title}" heading
 *   2. Agent selector + hint text
 *   3. Composer
 *   4. Suggestion chips
 *
 * The selected agent's description is shown by AgentDescriptionPanel, mounted
 * by the app shell in the right-hand panel slot. A help button next to the agent
 * selector toggles it.
 */

import type { ReactElement } from 'react';
import { memo, useCallback, useEffect } from 'react';
import { LuCircleAlert, LuCircleHelp } from 'react-icons/lu';
import { useChatStore } from '@/store';
import { Button, IconButton } from '@/components';
import { useAppConfig } from '@/contexts';
import { isMobileViewport } from '@/services/utils';
import { AgentSelector } from './AgentSelector';
import { ConnectedComposer } from './ConnectedComposer';
import styles from './WelcomeView.module.css';

const WelcomeViewComponent = (): ReactElement => {
  // ======================
  // STATE, HOOKS & REFS
  // ======================
  const suggestions = useChatStore((s) => s.suggestedQuestions);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const agents = useChatStore((s) => s.agents);
  const agentsLoaded = useChatStore((s) => s.agentsLoaded);
  const agentsError = useChatStore((s) => s.agentsError);
  const loadAgents = useChatStore((s) => s.loadAgents);
  const hasDescription = useChatStore((s) => s.selectedAgentDescription.trim().length > 0);
  const descriptionPanelClosed = useChatStore((s) => s.descriptionPanelClosed);
  const openDescriptionPanel = useChatStore((s) => s.openDescriptionPanel);
  const closeDescriptionPanel = useChatStore((s) => s.closeDescriptionPanel);
  const { title } = useAppConfig();

  useEffect(() => {
    loadAgents();
  }, [loadAgents]);

  /**
   * `null`  — fetch not yet settled (still loading)
   * `true`  — fetch settled with at least one agent
   * `false` — fetch settled with empty list or error
   */
  const hasSomeAgents: boolean | null = agentsLoaded ? agents.length > 0 && !agentsError : null;

  // ======================
  // HANDLERS
  // ======================
  const handleToggleDescription = useCallback(() => {
    if (descriptionPanelClosed) openDescriptionPanel();
    else closeDescriptionPanel();
  }, [descriptionPanelClosed, openDescriptionPanel, closeDescriptionPanel]);

  const handleChip = useCallback(
    (text: string) => () => sendMessage(text),
    [sendMessage],
  );


  // ======================
  // RENDER FUNCTIONS
  // ======================
  const renderTitle = (): ReactElement => (
    <h2 className={styles.title}>
      Welcome to <div className={styles.accent}>{title ?? 'Strands Compose'}</div>
    </h2>
  );

  const renderDescriptionToggle = (): ReactElement | null => {
    // The panel is not mounted on mobile, so the toggle would do nothing there.
    if (!hasDescription || isMobileViewport()) return null;
    const isOpen = !descriptionPanelClosed;
    const label = isOpen ? 'Hide agent description' : 'Show agent description';
    return (
      <IconButton
        size="lg"
        onClick={handleToggleDescription}
        isActive={isOpen}
        title={label}
        aria-label={label}
        aria-pressed={isOpen}
      >
        <LuCircleHelp size={18} />
      </IconButton>
    );
  };

  const renderNoAgentsBanner = (): ReactElement => (
    <div className={styles.centeredContent}>
      {renderTitle()}
      <div className={styles.noAgentsBanner} role="alert">
        <LuCircleAlert size={32} className={styles.noAgentsIcon} aria-hidden="true" />
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

  const renderAgentContent = (): ReactElement => (
    <div className={styles.mainColumn}>
      {renderTitle()}
      <div className={styles.agentRow}>
        <p className={styles.hint}>Choose your agent and start conversation</p>
        <AgentSelector />
        {renderDescriptionToggle()}
      </div>
      <div className={styles.inputWrapper}>
        <ConnectedComposer />
      </div>
      {renderSuggestions()}
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
