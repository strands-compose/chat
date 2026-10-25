/**
 * Scrollable message list. Owns its own auto-scroll behavior via useAutoScroll
 * so App.tsx doesn't need to manage refs or scroll effects.
 */

import type { ReactElement } from 'react';
import { memo } from 'react';
import { useChatStore } from '@/store';
import { useAutoScroll } from '@/hooks';
import { cn } from '@/services';
import { ChatMessage } from './Message';
import styles from './ChatView.module.css';

interface MessageListProps {
  /** Let the message column span the full width instead of the compact 760px. */
  isFullWidth?: boolean;
}

const MessageListComponent = ({ isFullWidth = false }: MessageListProps): ReactElement => {
  const messageOrder = useChatStore((s) => s.messageOrder);
  const restoringSession = useChatStore((s) => s.restoringSession);

  // Drive auto-scroll on the streaming tail. Both pieces of data come from the
  // store — no need to pass them down through props.
  const lastMsgId = useChatStore((s) => s.messageOrder[s.messageOrder.length - 1]);
  const isStreamingTail = useChatStore(
    (s) => !!(lastMsgId && s.messages[lastMsgId]?.isStreaming),
  );

  const { containerRef, endRef } = useAutoScroll(messageOrder, isStreamingTail);

  return (
    <main className={styles.chatContainer} ref={containerRef}>
      <div
        className={cn(
          styles.messages,
          isFullWidth && styles.messagesFull,
          restoringSession && styles.messagesRestoring,
        )}
      >
        {messageOrder.map((msgId) => (
          <ChatMessage key={msgId} messageId={msgId} />
        ))}
        <div ref={endRef} />
      </div>
    </main>
  );
};

export const MessageList = memo(MessageListComponent);
