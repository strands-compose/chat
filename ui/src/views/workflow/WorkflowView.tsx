import { memo, useEffect, useMemo, useRef, useCallback } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { FiActivity, FiX, FiPlay, FiSquare, FiCpu, FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import type { IconType } from 'react-icons';
import { useChatStore } from '@/store';
import { Markdown, TokenBadges, IconButton, StatusBadge, SubheaderBar, ToolBadge } from '@/components';
import { groupConsecutiveItems, selectWorkflowTrace, selectWorkflowTokens } from './workflow-selectors';
import styles from './WorkflowView.module.css';

import type { ReactElement } from 'react';
import type { AgentEventProps } from './workflow-types';
import type { WorkflowItem, WorkflowGroupedItems } from '@/types';

// ======================
// FILE-SCOPE STABLE FALLBACKS
// ======================

const EMPTY_ITEMS: WorkflowItem[] = [];

// ======================
// AGENT EVENT CONFIG
// ======================

type AgentEventConfig = { Icon: IconType; label: string };
type AgentEventConfigMap = Record<
  AgentEventProps['variant'],
  { agent: AgentEventConfig; orchestrator: AgentEventConfig }
>

const AGENT_EVENT_CONFIG: AgentEventConfigMap = {
  agent_start: {
    agent:        { Icon: FiPlay,        label: 'Agent started' },
    orchestrator: { Icon: FiCpu,         label: 'Orchestrator started' },
  },
  agent_stop: {
    agent:        { Icon: FiSquare,      label: 'Agent ended' },
    orchestrator: { Icon: FiCheckCircle, label: 'Orchestrator ended' },
  },
  handoff: {
    agent:        { Icon: FiArrowRight,  label: 'Handoff' },
    orchestrator: { Icon: FiArrowRight,  label: 'Delegating work to agent' },
  },
};

// ======================
// BLOCK COMPONENTS (only used here)
// ======================

const InlineReasoning = memo(({ content }: { content: string }): ReactElement => (
  <p className={styles.inlineReasoning}>{content}</p>
));

const StreamingTextBox = memo(({ content }: { content: string }): ReactElement => (
  <Markdown className={styles.streamingTextBox}>
    {content}
  </Markdown>
));

const AgentEvent = memo(({ variant, agentName, content, isOrchestrator }: AgentEventProps): ReactElement => {
  const cfg = AGENT_EVENT_CONFIG[variant];
  const { Icon, label } = isOrchestrator ? cfg.orchestrator : cfg.agent;
  const agentLabel = agentName ?? content ?? '';
  return (
    <div className={styles.agentEvent}>
      <span className={styles.agentEventIcon}><Icon size={13} /></span>
      <span className={styles.agentEventText}>{label}: {agentLabel}</span>
    </div>
  );
});

// ======================
// MAIN COMPONENT
// ======================

const WorkflowViewComponent = (): ReactElement => {
  // ======================
  // STORE SELECTORS
  // ======================

  const {
    workflowItems,
    isStreaming,
    resolvedMessageId,
    isSuccess,
    inputTokens,
    outputTokens
  } = useChatStore(
    useShallow((s) => {
      const trace = selectWorkflowTrace(s);
      const tokens = selectWorkflowTokens(s);

      // Resolve the message id for the active seq (for token display).
      let resolvedMessageId: string | null = null;
      let isSuccess = true;
      const targetSeq = s.isLoading ? null : s.selectedWorkflowSeq;
      if (targetSeq != null) {
        const found = s.messageOrder.find((id) => s.messages[id]?.seq === targetSeq);
        resolvedMessageId = found ?? null;
        if (resolvedMessageId) {
          isSuccess = s.messages[resolvedMessageId]?.isSuccess !== false;
        }
      } else if (!s.isLoading) {
        // Auto: find latest assistant with a seq.
        for (let i = s.messageOrder.length - 1; i >= 0; i--) {
          const msg = s.messages[s.messageOrder[i]];
          if (msg?.role === 'assistant' && msg.seq != null) {
            resolvedMessageId = msg.id;
            isSuccess = msg.isSuccess !== false;
            break;
          }
        }
      }

      return {
        workflowItems: trace.items.length > 0 ? trace.items : EMPTY_ITEMS,
        isStreaming: trace.isStreaming,
        resolvedMessageId,
        isSuccess,
        inputTokens: tokens.inputTokens,
        outputTokens: tokens.outputTokens,
      };
    }),
  );

  const setSelectedWorkflowSeq = useChatStore((s) => s.setSelectedWorkflowSeq);

  const handleClose = useCallback(() => {
    setSelectedWorkflowSeq(null);
  }, [setSelectedWorkflowSeq]);

  const hasAssistantMessages = useChatStore((s) =>
    s.messageOrder.some((id) => s.messages[id]?.role === 'assistant'),
  );

  // ======================
  // LOCAL STATE & REFS
  // ======================

  const contentRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef(true);

  // ======================
  // EFFECTS
  // ======================

  useEffect(() => {
    autoScrollRef.current = true;
    const el = contentRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [resolvedMessageId]);

  useEffect(() => {
    if (!autoScrollRef.current) return;
    const el = contentRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [workflowItems]);

  const handleScroll = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;
    autoScrollRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
  }, []);

  // ======================
  // RENDER FUNCTIONS
  // ======================

  const groupedItems = useMemo(
    () => groupConsecutiveItems(workflowItems),
    [workflowItems],
  );

  const renderTitleBar = (): ReactElement => {
    const statusBadge = (() => {
      if (isStreaming) return <StatusBadge variant="running" label="Running" />;
      if (!isSuccess) return <StatusBadge variant="error" label="Error" />;
      return <StatusBadge variant="completed" label="Completed" />;
    })();

    const left = (
      <div className={styles.workflowPanelTitleLeft}>
        <FiActivity size={14} className={styles.workflowPanelTitleIcon} />
        <span className={styles.workflowPanelTitleText}>Workflow</span>
        {statusBadge}
      </div>
    );

    const right = (
      <>
        <TokenBadges
          inputTokens={inputTokens}
          outputTokens={outputTokens}
          label="Tokens"
        />
        <IconButton
          size="sm"
          onClick={handleClose}
          title="Close workflow panel"
        >
          <FiX size={16} />
        </IconButton>
      </>
    );

    return <SubheaderBar left={left} right={right} className={styles.workflowSubheader} />;
  };

  const renderEmpty = (): ReactElement => (
    <div className={styles.workflowPanelEmpty}>
      Workflow steps will appear here when the agent runs.
    </div>
  );

  const renderGroup = (group: WorkflowGroupedItems, groupIndex: number): ReactElement | ReactElement[] | null => {
    switch (group.type) {
      case 'reasoning':
        return (
          <InlineReasoning
            key={groupIndex}
            content={group.items.map((item) => item.content).join('\n\n')}
          />
        );
      case 'text': {
        // Skip blank text groups (e.g. a lone "\n" token)
        const textContent = group.items.map((item) => item.content).join('\n\n');
        if (textContent.trim() === '') return null;
        return (
          <StreamingTextBox
            key={groupIndex}
            content={textContent}
          />
        );
      }
      case 'tool':
        return group.items.map((item, i) => (
          <ToolBadge
            key={`${groupIndex}-${i}`}
            toolName={item.toolName || 'Unknown Tool'}
            toolInput={item.toolInput}
            toolOutput={item.toolOutput}
            agentName={item.agentName}
          />
        ));
      case 'agent_start':
      case 'agent_stop':
      case 'handoff':
        return group.items.map((item, i) => (
          <AgentEvent
            key={`${groupIndex}-${i}`}
            variant={group.type as AgentEventProps['variant']}
            agentName={item.agentName}
            content={item.content}
            isOrchestrator={item.isOrchestrator}
          />
        ));
      default:
        return group.items.map((item, i) => (
          <span key={`${groupIndex}-${i}`} className={styles.workflowText}>
            {item.content}
          </span>
        ));
    }
  };

  const renderContent = (): ReactElement => (
    <div ref={contentRef} className={styles.workflowPanelContent} onScroll={handleScroll}>
      {resolvedMessageId === null && workflowItems === EMPTY_ITEMS
        ? renderEmpty()
        : groupedItems.map((group, i) => renderGroup(group, i))}
    </div>
  );

  return (
    <div className={styles.workflowPanel}>
      {renderTitleBar()}
      {!hasAssistantMessages ? renderEmpty() : renderContent()}
    </div>
  );
};

export const WorkflowView = memo(WorkflowViewComponent);
