import type { CSSProperties, ReactElement } from 'react';
import { Fragment, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  LuArrowDown,
  LuArrowRightLeft,
  LuBot,
  LuBrain,
  LuChevronDown,
  LuCircleCheck,
  LuNetwork,
  LuWorkflow,
  LuX,
} from 'react-icons/lu';
import { useShallow } from 'zustand/react/shallow';
import type { ToolBadgeStatus } from '@/components';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  IconButton,
  Markdown,
  StatusBadge,
  SubheaderBar,
  ToolBadge,
  UsagePill,
} from '@/components';
import { cn, formatAgentLabel, formatTokenCount } from '@/services/utils';
import { useChatStore } from '@/store';
import type { WorkflowGroupedItems, WorkflowItem } from '@/types';
import styles from './WorkflowView.module.css';
import {
  agentNameSet,
  buildAgentRuns,
  selectWorkflowStatus,
  selectWorkflowTokens,
  selectWorkflowTrace,
  summarizeAgents,
} from './workflow-selectors';
import type { AgentRun, AgentSummary } from './workflow-types';

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

const InlineReasoning = memo(
  ({ content }: { content: string }): ReactElement => (
    <Collapsible defaultOpen className={styles.reasoning}>
      <CollapsibleTrigger asChild>
        <button type="button" className={styles.reasoningLabel} title="Show or hide thinking">
          <LuBrain size={13} />
          Thinking
          <LuChevronDown size={13} className={styles.reasoningChevron} aria-hidden="true" />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent asChild>
        <p className={styles.reasoningText}>{content}</p>
      </CollapsibleContent>
    </Collapsible>
  ),
);

const StreamingTextBox = memo(
  ({ content, live }: { content: string; live: boolean }): ReactElement => (
    <Markdown className={cn(styles.streamingTextBox, live && styles.streamingTextLive)}>
      {content}
    </Markdown>
  ),
);

const Handoff = memo(({ targets }: { targets: string[] | undefined }): ReactElement => {
  const label = targets?.length ? targets.map(formatAgentLabel).join(', ') : 'next agent';
  return (
    <div className={styles.handoff}>
      <LuArrowRightLeft size={14} />
      <span>Handoff to {label}</span>
    </div>
  );
});

// ======================
// HELPERS
// ======================

/** Tool status to show: the recorded one, or success when output exists without a status. */
const resolveToolStatus = (
  item: WorkflowItem,
  isStreaming: boolean,
): ToolBadgeStatus | undefined => {
  if (item.toolStatus === 'running') return isStreaming ? 'running' : undefined;
  if (item.toolStatus) return item.toolStatus;
  return item.toolOutput ? 'success' : undefined;
};

const formatRunTokens = (run: AgentRun): string | null => {
  if (!run.totalTokens) return null;
  return `${formatTokenCount(run.totalTokens)} tokens`;
};

// ======================
// MAIN COMPONENT
// ======================

const WorkflowViewComponent = (): ReactElement => {
  // ======================
  // STORE SELECTORS
  // ======================

  const { workflowItems, isStreaming, resolvedMessageId, isSuccess, tokens } = useChatStore(
    useShallow((s) => {
      const trace = selectWorkflowTrace(s);
      const status = selectWorkflowStatus(s);
      return {
        workflowItems: trace.items.length > 0 ? trace.items : EMPTY_ITEMS,
        isStreaming: trace.isStreaming,
        resolvedMessageId: status.messageId,
        isSuccess: status.isSuccess,
        tokens: selectWorkflowTokens(s),
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
  // Keys of agent runs the user folded via their avatar; run keys are only
  // unique within one message's trace.
  const [collapsedRuns, setCollapsedRuns] = useState<ReadonlySet<string>>(() => new Set());

  // A different message starts pinned to its latest item with every run open,
  // so reset during render instead of in an effect (avoids a cascading re-render).
  if (jumpResetFor !== resolvedMessageId) {
    setJumpResetFor(resolvedMessageId);
    setShowJump(false);
    setCollapsedRuns(new Set());
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

  const toggleRun = useCallback((runKey: string): void => {
    setCollapsedRuns((prev) => {
      const next = new Set(prev);
      if (!next.delete(runKey)) next.add(runKey);
      return next;
    });
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
            inputTokens={tokens?.input}
            outputTokens={tokens?.output}
            cacheReadTokens={tokens?.cacheRead}
            cacheWriteTokens={tokens?.cacheWrite}
            size="sm"
            title="Tokens for this turn"
          />
        </span>
        <IconButton
          size="lg"
          onClick={handleClose}
          title="Close workflow panel"
          aria-label="Close workflow panel"
        >
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
      // Trace items carry no ids and are only ever appended, so their position is a stable key.
      case 'handoff':
        return group.items.map((item, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: append-only trace items (see above).
          <Handoff key={`${groupKey}-${i}`} targets={item.handoffTargets} />
        ));
      default:
        return group.items.map((item, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: append-only trace items (see above).
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
          {run.groups.map((group, i) =>
            renderGroup(group, run, `${run.key}-${i}`, i === run.groups.length - 1),
          )}
        </div>
      );
    }

    const label = formatAgentLabel(run.agentName);
    const RunIcon = run.isOrchestrator ? LuNetwork : LuBot;
    const isCollapsed = collapsedRuns.has(run.key);
    return (
      <div
        key={run.key}
        className={cn(styles.run, nested && styles.runNested)}
        style={{ '--agent': colorOf(run.agentName) } as CSSProperties}
      >
        <div className={styles.runHead}>
          <button
            type="button"
            className={styles.runAvatar}
            onClick={() => toggleRun(run.key)}
            aria-expanded={!isCollapsed}
            title={isCollapsed ? `Expand ${label}` : `Collapse ${label}`}
            aria-label={isCollapsed ? `Expand ${label}` : `Collapse ${label}`}
          >
            <RunIcon size={14} />
          </button>
          <span className={styles.runName}>{label}</span>
          <span className={styles.runKind}>{run.isOrchestrator ? 'Orchestrator' : 'Agent'}</span>
          <span className={styles.runMeta}>{renderRunMeta(run)}</span>
        </div>
        {isCollapsed ? (
          <div className={styles.runBodyCollapsed} />
        ) : (
          <div className={styles.runBody}>
            {run.groups.map((group, i) =>
              renderGroup(group, run, `${run.key}-${i}`, i === run.groups.length - 1),
            )}
          </div>
        )}
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
    <section className={styles.workflowPanel} aria-label="Workflow">
      {renderTitleBar()}
      {hasAssistantMessages && renderAgentChips()}
      {!hasAssistantMessages ? renderEmpty() : renderContent()}
    </section>
  );
};

export const WorkflowView = memo(WorkflowViewComponent);
