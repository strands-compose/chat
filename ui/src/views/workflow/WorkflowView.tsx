import { Fragment, memo, useEffect, useMemo, useRef, useCallback, useState } from 'react';
import type { CSSProperties, ReactElement } from 'react';
import { useShallow } from 'zustand/react/shallow';
import {
  LuArrowDown,
  LuArrowRightLeft,
  LuBot,
  LuBrain,
  LuCircleCheck,
  LuNetwork,
  LuWorkflow,
  LuX,
} from 'react-icons/lu';
import { useChatStore } from '@/store';
import { IconButton, Markdown, StatusBadge, SubheaderBar, ToolBadge, UsagePill } from '@/components';
import type { ToolBadgeStatus } from '@/components';
import { cn, formatAgentLabel, formatTokenCount } from '@/services/utils';
import {
  agentNameSet,
  buildAgentRuns,
  selectWorkflowTrace,
  selectWorkflowTokens,
  summarizeAgents,
} from './workflow-selectors';
import styles from './WorkflowView.module.css';

import type { AgentRun, AgentSummary } from './workflow-types';
import type { WorkflowItem, WorkflowGroupedItems } from '@/types';

// ======================
// FILE-SCOPE STABLE FALLBACKS
// ======================

const EMPTY_ITEMS: WorkflowItem[] = [];
const FALLBACK_AGENT_COLOR = 'var(--sc-text-tertiary)';
/** Distance from the bottom (px) still treated as "at the latest item". */
const STICK_THRESHOLD = 40;

// ======================
// BLOCK COMPONENTS (only used here)
// ======================

const InlineReasoning = memo(({ content }: { content: string }): ReactElement => (
  <div className={styles.reasoning}>
    <span className={styles.reasoningLabel}>
      <LuBrain size={13} />
      Thinking
    </span>
    <p className={styles.reasoningText}>{content}</p>
  </div>
));

const StreamingTextBox = memo(({ content, live }: { content: string; live: boolean }): ReactElement => (
  <Markdown className={cn(styles.streamingTextBox, live && styles.streamingTextLive)}>
    {content}
  </Markdown>
));

const Handoff = memo(({ content }: { content: string }): ReactElement => (
  <div className={styles.handoff}>
    <LuArrowRightLeft size={14} />
    <span>{content}</span>
  </div>
));

// ======================
// HELPERS
// ======================

/** Tool status to show: the recorded one, or success when output exists without a status. */
const resolveToolStatus = (item: WorkflowItem, isStreaming: boolean): ToolBadgeStatus | undefined => {
  if (item.toolStatus === 'running') return isStreaming ? 'running' : undefined;
  if (item.toolStatus) return item.toolStatus;
  return item.toolOutput ? 'success' : undefined;
};

const formatRunTokens = (run: AgentRun): string | null => {
  if (run.inputTokens == null && run.outputTokens == null) return null;
  return `${formatTokenCount(run.inputTokens ?? 0)} in · ${formatTokenCount(run.outputTokens ?? 0)} out`;
};

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

  const closeWorkflowPanel = useChatStore((s) => s.closeWorkflowPanel);

  const handleClose = useCallback(() => {
    closeWorkflowPanel();
  }, [closeWorkflowPanel]);

  const hasAssistantMessages = useChatStore((s) =>
    s.messageOrder.some((id) => s.messages[id]?.role === 'assistant'),
  );

  // ======================
  // LOCAL STATE & REFS
  // ======================

  const contentRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef(true);
  const [showJump, setShowJump] = useState(false);
  const [jumpResetFor, setJumpResetFor] = useState(resolvedMessageId);

  // A different message starts pinned to its latest item, so drop the jump button
  // during render instead of in an effect (avoids a cascading re-render).
  if (jumpResetFor !== resolvedMessageId) {
    setJumpResetFor(resolvedMessageId);
    setShowJump(false);
  }

  const agentRuns = useMemo(() => buildAgentRuns(workflowItems), [workflowItems]);
  const agentSummaries = useMemo(() => summarizeAgents(workflowItems), [workflowItems]);
  const agentColors = useMemo(
    () => new Map(agentSummaries.map((a) => [a.agentName, a.color])),
    [agentSummaries],
  );
  const agentNames = useMemo(() => agentNameSet(agentSummaries), [agentSummaries]);

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

  // ======================
  // HANDLERS
  // ======================

  const handleScroll = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < STICK_THRESHOLD;
    autoScrollRef.current = atBottom;
    setShowJump(!atBottom);
  }, []);

  const handleJumpToLatest = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;
    // Jump instantly and re-pin: a smooth scroll chases content that keeps
    // growing, and its intermediate scroll events would un-pin auto-scroll.
    autoScrollRef.current = true;
    setShowJump(false);
    el.scrollTop = el.scrollHeight;
  }, []);

  const colorOf = (agentName: string | undefined): string =>
    (agentName && agentColors.get(agentName)) || FALLBACK_AGENT_COLOR;

  // ======================
  // RENDER FUNCTIONS
  // ======================

  const renderTitleBar = (): ReactElement => {
    const statusBadge = (() => {
      if (isStreaming) return <StatusBadge variant="running" label="Running" />;
      if (!isSuccess) return <StatusBadge variant="error" label="Error" />;
      return <StatusBadge variant="completed" label="Completed" />;
    })();

    const left = (
      <div className={styles.titleLeft}>
        <LuWorkflow size={17} className={styles.titleIcon} />
        <span className={styles.titleText}>Workflow</span>
        {statusBadge}
      </div>
    );

    const right = (
      <>
        <span className={styles.headerUsage}>
          <UsagePill
            inputTokens={inputTokens}
            outputTokens={outputTokens}
            size="sm"
            title="Tokens for this turn"
          />
        </span>
        <IconButton size="lg" onClick={handleClose} title="Close workflow panel">
          <LuX size={18} />
        </IconButton>
      </>
    );

    return <SubheaderBar left={left} right={right} className={styles.workflowSubheader} />;
  };

  const renderAgentChip = (agent: AgentSummary): ReactElement => (
    <span
      key={agent.agentName}
      className={styles.agentChip}
      style={{ '--agent': agent.color } as CSSProperties}
    >
      <i className={styles.agentDot} />
      <b className={styles.agentChipName}>{formatAgentLabel(agent.agentName)}</b>
      {agent.runCount > 1 && <span>×{agent.runCount}</span>}
    </span>
  );

  const renderAgentChips = (): ReactElement | null => {
    if (agentSummaries.length === 0) return null;
    return <div className={styles.agentChips}>{agentSummaries.map(renderAgentChip)}</div>;
  };

  const renderEmpty = (): ReactElement => (
    <div className={styles.workflowPanelEmpty}>
      <LuWorkflow size={34} className={styles.emptyIcon} />
      Workflow steps will appear here when the agent runs.
    </div>
  );

  const renderTool = (item: WorkflowItem, run: AgentRun, key: string): ReactElement => {
    const toolName = item.toolName || 'Unknown Tool';
    const isDelegate = agentNames.has(toolName.toUpperCase());
    const children = run.children.get(item) ?? [];
    return (
      <Fragment key={key}>
        <ToolBadge
          toolName={toolName}
          toolInput={item.toolInput}
          toolOutput={item.toolOutput}
          status={resolveToolStatus(item, isStreaming)}
          title={isDelegate ? `Ask ${formatAgentLabel(toolName)}` : undefined}
          icon={isDelegate ? <LuBot size={15} /> : undefined}
          accentColor={isDelegate ? colorOf(toolName.toUpperCase()) : undefined}
          errorLabel={isDelegate ? 'Rejected' : 'Failed'}
        />
        {children.map((child) => renderRun(child, true))}
      </Fragment>
    );
  };

  const renderGroup = (
    group: WorkflowGroupedItems,
    run: AgentRun,
    groupKey: string,
    isLastGroup: boolean,
  ): ReactElement | ReactElement[] | null => {
    switch (group.type) {
      case 'reasoning':
        // Reasoning arrives as streamed deltas, so the chunks concatenate without a separator.
        return (
          <InlineReasoning
            key={groupKey}
            content={group.items.map((item) => item.content).join('')}
          />
        );
      case 'text': {
        // Token runs are already whole strings, so they concatenate without a separator.
        const textContent = group.items.map((item) => item.content).join('');
        if (textContent.trim() === '') return null;
        return (
          <StreamingTextBox
            key={groupKey}
            content={textContent}
            live={isStreaming && !run.hasEnded && isLastGroup}
          />
        );
      }
      case 'tool':
        return group.items.map((item, i) => renderTool(item, run, `${groupKey}-${i}`));
      case 'handoff':
        return group.items.map((item, i) => (
          <Handoff key={`${groupKey}-${i}`} content={item.content} />
        ));
      default:
        return group.items.map((item, i) => (
          <span key={`${groupKey}-${i}`} className={styles.workflowText}>
            {item.content}
          </span>
        ));
    }
  };

  const renderRunMeta = (run: AgentRun): string => {
    if (run.hasEnded) return formatRunTokens(run) ?? '';
    if (!isStreaming) return '';
    return run.isOrchestrator ? 'running' : 'streaming…';
  };

  function renderRun(run: AgentRun, nested = false): ReactElement {
    // Items the backend left unattributed have no lane chrome.
    if (!run.agentName) {
      return (
        <div key={run.key} className={styles.runBody}>
          {run.groups.map((group, i) => renderGroup(group, run, `${run.key}-${i}`, i === run.groups.length - 1))}
        </div>
      );
    }

    const label = formatAgentLabel(run.agentName);
    const RunIcon = run.isOrchestrator ? LuNetwork : LuBot;
    return (
      <div
        key={run.key}
        className={cn(styles.run, nested && styles.runNested)}
        style={{ '--agent': colorOf(run.agentName) } as CSSProperties}
      >
        <div className={styles.runHead}>
          <span className={styles.runAvatar}><RunIcon size={14} /></span>
          <span className={styles.runName}>{label}</span>
          <span className={styles.runKind}>{run.isOrchestrator ? 'Orchestrator' : 'Agent'}</span>
          <span className={styles.runMeta}>{renderRunMeta(run)}</span>
        </div>
        <div className={styles.runBody}>
          {run.groups.map((group, i) => renderGroup(group, run, `${run.key}-${i}`, i === run.groups.length - 1))}
        </div>
        {run.hasEnded && (
          <div className={styles.runFoot}>
            <LuCircleCheck size={16} className={styles.runFootIcon} />
            {label} finished
          </div>
        )}
      </div>
    );
  }

  const renderJump = (): ReactElement | null => {
    if (!showJump || workflowItems === EMPTY_ITEMS) return null;
    return (
      <button type="button" className={styles.jump} onClick={handleJumpToLatest}>
        <LuArrowDown size={15} />
        Jump to latest
      </button>
    );
  };

  const renderContent = (): ReactElement => (
    <div className={styles.contentWrap}>
      <div ref={contentRef} className={styles.workflowPanelContent} onScroll={handleScroll}>
        {resolvedMessageId === null && workflowItems === EMPTY_ITEMS
          ? renderEmpty()
          : agentRuns.map((run) => renderRun(run))}
      </div>
      {renderJump()}
    </div>
  );

  return (
    <div className={styles.workflowPanel}>
      {renderTitleBar()}
      {hasAssistantMessages && renderAgentChips()}
      {!hasAssistantMessages ? renderEmpty() : renderContent()}
    </div>
  );
};

export const WorkflowView = memo(WorkflowViewComponent);
