import { useState, useCallback, memo } from 'react';
import type { ReactElement } from 'react';
import {
  LuBot,
  LuChevronDown,
  LuCircleAlert,
  LuCopy,
  LuCheck,
  LuFileText,
  LuImage,
  LuRefreshCw,
  LuUser,
  LuWorkflow,
} from 'react-icons/lu';
import { useChatStore } from '@/store';
import { useContentReveal } from '@/hooks';
import { Avatar, Markdown, IconButton } from '@/components';
import { useCollapseContext } from '@/contexts';
import { cn } from '@/services/utils';
import { formatFileSize } from '@/services';
import { selectLiveActivity } from './live-activity';
import type { LiveActivity } from './live-activity';
import styles from './Message.module.css';

// ======================
// HELPERS
// ======================

/** First non-empty line of a markdown answer, stripped of markdown markers. */
const previewLine = (content: string): string => {
  const line = content.split('\n').find((l) => l.replace(/[-#*_`>|\s]/g, '') !== '') ?? '';
  return line.replace(/[#*_`>|]/g, '').trim();
};

interface ChatMessageProps {
  messageId: string;
}

const ChatMessageComponent = ({
  messageId,
}: ChatMessageProps): ReactElement | null => {
  // ======================
  // STORE SELECTORS (subscribe to this message only)
  // ======================
  const message = useChatStore((s) => s.messages[messageId]);

  // Atomic selectors for workflow panel
  const selectedWorkflowSeq = useChatStore((s) => s.selectedWorkflowSeq);
  const setSelectedWorkflowSeq = useChatStore((s) => s.setSelectedWorkflowSeq);
  const openWorkflowPanel = useChatStore((s) => s.openWorkflowPanel);
  const workflowPanelClosed = useChatStore((s) => s.workflowPanelClosed);
  const workflowTraces = useChatStore((s) => s.workflowTraces);
  // While a turn streams, the panel is pinned to the live trace, so workflow
  // buttons on other messages are non-functional and must be disabled.
  const isLoading = useChatStore((s) => s.isLoading);
  // Seq of the turn that just completed this session — drives the one-shot
  // content reveal (fresh answer animates; restored history renders instantly).
  const lastCompletedSeq = useChatStore((s) => s.lastCompletedSeq);
  // Live trace — only read by the streaming message for its activity hint.
  const liveItems = useChatStore((s) =>
    s.messages[messageId]?.isStreaming ? s.activeWorkflowItems : null,
  );

  // Stable store actions — never change identity
  const copyMessage = useChatStore((s) => s.copyMessage);
  const resendMessage = useChatStore((s) => s.resendMessage);

  // ======================
  // LOCAL STATE & HOOKS
  // ======================
  const [copiedMsg, setCopiedMsg] = useState(false);

  const { collapsedIds, toggle } = useCollapseContext();
  const collapsed = collapsedIds.has(messageId);

  const handleToggleCollapse = useCallback(() => {
    toggle(messageId);
  }, [messageId, toggle]);

  const isUser = message?.role === 'user';
  const isComplete = !message?.isStreaming && !!message?.content;
  // Reveal only the turn that just completed this session; persisted history
  // (any other seq) renders instantly so its action bar shows on first paint.
  const skipReveal = message?.seq != null && message.seq !== lastCompletedSeq;
  const { content: displayedContent, isRevealing } = useContentReveal(
    message?.content ?? '',
    isComplete,
    skipReveal,
  );

  // ======================
  // HANDLERS
  // ======================
  const handleCopy = useCallback(() => {
    copyMessage(messageId);
    setCopiedMsg(true);
    setTimeout(() => setCopiedMsg(false), 2000);
  }, [messageId, copyMessage]);

  const handleResend = useCallback(() => {
    resendMessage(messageId);
  }, [messageId, resendMessage]);

  const handleShowWorkflow = useCallback(() => {
    if (!message) return;
    // The in-flight turn: reopen the panel, which shows the live streaming trace.
    if (message.isStreaming) {
      openWorkflowPanel();
      return;
    }
    // Other messages stay non-functional while a different turn is streaming.
    if (isLoading) return;
    if (message.seq == null) return;
    setSelectedWorkflowSeq(message.seq);
  }, [message, isLoading, setSelectedWorkflowSeq, openWorkflowPanel]);

  // Guard: message might have been removed (e.g. during regeneration)
  if (!message) return null;

  const collapseTitle = collapsed ? 'Expand message' : 'Collapse message';

  // ======================
  // RENDER FUNCTIONS
  // ======================
  const renderCopyButton = (): ReactElement => (
    <IconButton onClick={handleCopy} title="Copy message">
      {copiedMsg ? <LuCheck size={15} /> : <LuCopy size={15} />}
    </IconButton>
  );

  const renderAttachments = (): ReactElement | null => {
    const visible = (message.attachments ?? []).filter((a) => a.size > 0);
    if (visible.length === 0) return null;

    return (
      <div className={styles.attachments}>
        {visible.map((attachment, index) => {
          const isImage = attachment.type === 'image';
          return (
            <span key={`${attachment.filename}-${index}`} className={styles.fileChip}>
              <span className={cn(styles.fileIcon, isImage ? styles.fileIconImage : styles.fileIconDoc)}>
                {isImage ? <LuImage size={16} /> : <LuFileText size={16} />}
              </span>
              <span className={styles.fileMeta}>
                <span className={styles.fileName}>{attachment.filename}</span>
                <span className={styles.fileSize}>
                  {isImage ? 'Image' : 'Document'} · {formatFileSize(attachment.size)}
                </span>
              </span>
            </span>
          );
        })}
      </div>
    );
  };

  /**
   * Workflow pill — assistant only, pinned top-right of the reply in every
   * state (open, collapsed, streaming) so a closed panel can always be
   * reopened. Shown while the turn streams and afterwards when a stored
   * trace exists for this turn.
   */
  const renderWorkflowButton = (): ReactElement | null => {
    const seq = message.seq;
    const hasTrace = seq != null && (workflowTraces[seq]?.length ?? 0) > 0;
    if (!hasTrace && !message.isStreaming) return null;

    const disabled = isLoading && !message.isStreaming;
    const isActive = message.isStreaming
      ? !workflowPanelClosed
      : !disabled && !workflowPanelClosed && selectedWorkflowSeq === seq;
    const title = disabled
      ? 'Available when the agent finishes'
      : isActive
        ? 'Workflow panel open'
        : 'Show workflow in panel';
    return (
      <button
        className={cn(styles.workflowButton, isActive && styles.workflowButtonActive)}
        onClick={handleShowWorkflow}
        type="button"
        disabled={disabled}
        title={title}
      >
        <LuWorkflow size={15} />
        <span>Workflow</span>
        {message.isStreaming && <span className={styles.liveDot} />}
      </button>
    );
  };

  const renderLiveActivity = (activity: LiveActivity | null): ReactElement | null => {
    if (!activity) return null;
    return (
      <div className={styles.activity}>
        <span className={styles.activityChip}>
          <LuBot size={14} />
          {activity.agentLabel}
        </span>
        <span>{activity.detail}</span>
      </div>
    );
  };

  const renderThinking = (): ReactElement => (
    <div className={styles.thinking}>
      <span className={styles.shimmer}>Working on it…</span>
      {renderLiveActivity(liveItems ? selectLiveActivity(liveItems) : null)}
    </div>
  );

  const renderAssistantContent = (): ReactElement => {
    if (!displayedContent && message.isStreaming) return renderThinking();

    const markdown = displayedContent ? <Markdown>{displayedContent}</Markdown> : null;
    if (message.isSuccess === false) {
      return (
        <div className={styles.error}>
          <LuCircleAlert size={18} className={styles.errorIcon} />
          <div className={styles.errorBody}>{markdown}</div>
        </div>
      );
    }
    return (
      <div className={cn(styles.content, isRevealing && styles.revealing)}>{markdown}</div>
    );
  };

  const renderCollapsedPreview = (): ReactElement => (
    <button type="button" className={styles.collapsedRow} onClick={handleToggleCollapse} title="Expand message">
      <span className={styles.collapsedText}>
        {previewLine(message.content) || (message.isStreaming ? 'Working on it…' : '')}
      </span>
      <LuChevronDown size={16} className={styles.collapsedChevron} />
    </button>
  );

  const renderUserMessage = (): ReactElement => (
    <div className={styles.userMessage}>
      <div className={styles.userStack}>
        <div className={styles.userBlock}>
        <div className={styles.userHead}>
          <div className={styles.userActions}>
            {renderCopyButton()}
            <IconButton onClick={handleResend} title="Resend message">
              <LuRefreshCw size={15} />
            </IconButton>
          </div>
          <span className={styles.senderLabel}>You</span>
        </div>
        {renderAttachments()}
        {collapsed ? (
          <button type="button" className={cn(styles.bubble, styles.bubbleCollapsed)} onClick={handleToggleCollapse} title="Expand message">
            <span className={styles.collapsedText}>{message.content}</span>
            <LuChevronDown size={16} className={styles.collapsedChevron} />
          </button>
        ) : (
          <div className={styles.bubble}>{message.content}</div>
        )}
        </div>
      </div>
      <Avatar
        icon={<LuUser size={17} />}
        tone="neutral"
        onClick={handleToggleCollapse}
        title={collapseTitle}
        ariaLabel={collapseTitle}
        ariaExpanded={!collapsed}
      />
    </div>
  );

  const renderAssistantMessage = (): ReactElement => {
    const showCopy = !message.isStreaming && !isRevealing && !!message.content;
    return (
      <div className={styles.assistantMessage}>
        <Avatar
          icon={<LuBot size={17} />}
          tone="accent"
          spinning={!!message.isStreaming}
          onClick={handleToggleCollapse}
          title={collapseTitle}
          ariaLabel={collapseTitle}
          ariaExpanded={!collapsed}
        />
        <div className={styles.assistantBody}>
          <div className={styles.assistantHead}>
            <span className={styles.senderLabel}>Assistant</span>
            <span className={styles.grow} />
            {showCopy && renderCopyButton()}
            {renderWorkflowButton()}
          </div>
          {collapsed ? renderCollapsedPreview() : renderAssistantContent()}
        </div>
      </div>
    );
  };

  return isUser ? renderUserMessage() : renderAssistantMessage();
};

export const ChatMessage = memo(ChatMessageComponent);
