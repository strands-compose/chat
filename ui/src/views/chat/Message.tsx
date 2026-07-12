import { useState, useCallback, memo } from 'react';
import type { ReactElement } from 'react';
import { FiCopy, FiCheck, FiArrowUp, FiUser, FiActivity } from 'react-icons/fi';
import { LuBotMessageSquare } from 'react-icons/lu';
import { useChatStore } from '@/store';
import { useContentReveal } from '@/hooks';
import { Markdown, IconButton } from '@/components';
import { useCollapseContext } from '@/contexts';
import { cn } from '@/services/utils';
import { formatFileSize } from '@/services';
import styles from './Message.module.css';

/** Three-dot typing indicator — only used here. */
const TypingIndicator = memo((): ReactElement => (
  <span className={styles.typingIndicator}>
    <span className={styles.dot}></span>
    <span className={styles.dot}></span>
    <span className={styles.dot}></span>
  </span>
));

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

  // ======================
  // RENDER FUNCTIONS
  // ======================
  const renderAttachments = (): ReactElement | null => {
    if (!isUser) return null;
    const visible = (message.attachments ?? []).filter((a) => a.size > 0);
    if (visible.length === 0) return null;

    return (
      <div className={styles.attachments}>
        <span className={styles.attachmentsLabel}>Attachments:</span>
        {visible.map((attachment, index) => {
          const label = attachment.type === 'document' ? 'Document' : 'Image';
          return (
            <span key={`${attachment.filename}-${index}`}>
              {label}: {attachment.filename} ({formatFileSize(attachment.size)})
            </span>
          );
        })}
      </div>
    );
  };

  /**
   * Workflow button — assistant only. Shown while the turn streams (reopens the
   * live panel) and afterwards when a stored trace exists for this turn.
   */
  const renderWorkflowButton = (): ReactElement | null => {
    if (message.role !== 'assistant') return null;
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
        className={cn(styles.showWorkflowButton, isActive && styles.showWorkflowButtonActive)}
        onClick={handleShowWorkflow}
        type="button"
        disabled={disabled}
        title={title}
      >
        <FiActivity size={13} />
        <span>Workflow</span>
      </button>
    );
  };

  /**
   * Top-right header actions bar — copy, resend, and (assistant-only) workflow.
   * While streaming, only the workflow toggle shows (copy/resend act on final
   * content); otherwise it's hidden until the content-reveal settles.
   */
  const renderHeaderActions = (): ReactElement | null => {
    if (collapsed) return null;

    if (message.isStreaming) {
      const workflowButton = renderWorkflowButton();
      if (!workflowButton) return null;
      return <div className={styles.headerActions}>{workflowButton}</div>;
    }

    if (isRevealing) return null;

    return (
      <div className={styles.headerActions}>
        <IconButton size="sm" onClick={handleCopy} title="Copy message">
          {copiedMsg ? <FiCheck size={14} /> : <FiCopy size={14} />}
        </IconButton>
        {isUser && (
          <IconButton size="sm" onClick={handleResend} title="Resend message">
            <FiArrowUp size={14} />
          </IconButton>
        )}
        {renderWorkflowButton()}
      </div>
    );
  };

  const renderMessageContent = (): ReactElement => {
    const contentClasses = cn(
      styles.content,
      message.isSuccess === false && styles.error,
      !message.content && message.isStreaming && styles.loading,
      isRevealing && styles.revealing,
    );

    return (
      <div className={contentClasses}>
        {displayedContent ? (
          <Markdown>{displayedContent}</Markdown>
        ) : message.isStreaming ? (
          <TypingIndicator />
        ) : (
          ''
        )}
      </div>
    );
  };

  const renderUserMessage = (): ReactElement => (
    <div className={styles.message}>
      <button
        type="button"
        className={cn(styles.avatar, styles.userAvatar)}
        onClick={handleToggleCollapse}
        title={collapsed ? 'Expand message' : 'Collapse message'}
        aria-label={collapsed ? 'Expand message' : 'Collapse message'}
        aria-expanded={!collapsed}
      >
        <FiUser size={16} />
      </button>
      <div className={styles.contentSection}>
        <div className={styles.senderLabel}>You</div>
        {renderHeaderActions()}
        {!collapsed && (
          <>
            <div className={cn(styles.content, styles.userContent)}>
              {message.content}
            </div>
            {renderAttachments()}
          </>
        )}
      </div>
    </div>
  );

  const renderAssistantMessage = (): ReactElement => (
    <div className={styles.message}>
      <button
        type="button"
        className={cn(styles.avatar, styles.assistantAvatar)}
        onClick={handleToggleCollapse}
        title={collapsed ? 'Expand message' : 'Collapse message'}
        aria-label={collapsed ? 'Expand message' : 'Collapse message'}
        aria-expanded={!collapsed}
      >
        <LuBotMessageSquare size={16} />
      </button>
      <div className={styles.contentSection}>
        <div className={styles.senderLabel}>Assistant</div>
        {renderHeaderActions()}
        {!collapsed && (
          <>
            {renderMessageContent()}
          </>
        )}
      </div>
    </div>
  );

  if (isUser) {
    return renderUserMessage();
  }

  return renderAssistantMessage();
};

export const ChatMessage = memo(ChatMessageComponent);
