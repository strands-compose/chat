/**
 * Chat view — control bar, message list, and composer, or the welcome screen
 * when there is no active session.
 *
 * The collapse context is provided by the app shell; this view only consumes it.
 * An existing session with no messages (empty history) renders an empty thread.
 */

import type { ReactElement } from 'react';
import { lazy, memo, Suspense, useCallback, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useChatStore } from '@/store';
import { useCollapseContext } from '@/contexts';
import { cn } from '@/services/utils';
import { ChatControlBar } from './ControlBar';
import { MessageList } from './MessageList';
import { ConnectedComposer } from './ConnectedComposer';
import styles from './ChatView.module.css';

const WelcomeView = lazy(() => import('./WelcomeView'));

const FULL_WIDTH_KEY = 'chatFullWidth';

/** Read the persisted width preference. Full width unless compact was chosen explicitly. */
const readFullWidth = (): boolean => {
  try {
    return localStorage.getItem(FULL_WIDTH_KEY) !== '0';
  } catch {
    return true;
  }
};

const ChatViewComponent = (): ReactElement => {
  const { messageOrder, sessionId } = useChatStore(
    useShallow((s) => ({
      messageOrder: s.messageOrder,
      sessionId: s.sessionId,
    })),
  );

  const { collapseAll, expandAll } = useCollapseContext();
  const [isFullWidth, setIsFullWidth] = useState(readFullWidth);

  const handleToggleWidth = useCallback(() => {
    setIsFullWidth((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(FULL_WIDTH_KEY, next ? '1' : '0');
      } catch {
        // Storage unavailable: the preference just won't persist.
      }
      return next;
    });
  }, []);
  const isWelcome = !sessionId && messageOrder.length === 0;

  const handleCollapseAll = useCallback(
    () => collapseAll(messageOrder),
    [collapseAll, messageOrder],
  );

  return (
    <>
      <ChatControlBar
        onCollapseAll={handleCollapseAll}
        onExpandAll={expandAll}
        isFullWidth={isFullWidth}
        onToggleWidth={isWelcome ? undefined : handleToggleWidth}
      />

      {isWelcome ? (
        <main className={styles.chatContainerEmpty}>
          <Suspense fallback={null}>
            <WelcomeView />
          </Suspense>
        </main>
      ) : (
        <>
          <MessageList isFullWidth={isFullWidth} />
          <div className={cn(styles.composerDock, isFullWidth && styles.composerDockFull)}>
            <ConnectedComposer />
          </div>
        </>
      )}
    </>
  );
};

export const ChatView = memo(ChatViewComponent);
