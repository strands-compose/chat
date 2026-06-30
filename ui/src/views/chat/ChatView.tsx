/**
 * Chat view — control bar, message list, and composer, or the welcome screen
 * when there is no active session.
 *
 * The collapse context is provided by the app shell; this view only consumes it.
 * An existing session with no messages (empty history) renders an empty thread.
 */

import type { ReactElement } from 'react';
import { lazy, memo, Suspense, useCallback } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useChatStore } from '@/store';
import { useCollapseContext } from '@/contexts';
import { ChatControlBar } from './ControlBar';
import { MessageList } from './MessageList';
import { ConnectedComposer } from './ConnectedComposer';
import styles from './ChatView.module.css';

const WelcomeView = lazy(() => import('./WelcomeView'));

const ChatViewComponent = (): ReactElement => {
  const { messageOrder, sessionId } = useChatStore(
    useShallow((s) => ({
      messageOrder: s.messageOrder,
      sessionId: s.sessionId,
    })),
  );

  const { collapseAll, expandAll } = useCollapseContext();

  const handleCollapseAll = useCallback(
    () => collapseAll(messageOrder),
    [collapseAll, messageOrder],
  );

  return (
    <>
      <ChatControlBar onCollapseAll={handleCollapseAll} onExpandAll={expandAll} />

      {!sessionId && messageOrder.length === 0 ? (
        <main className={styles.chatContainerEmpty}>
          <Suspense fallback={null}>
            <WelcomeView />
          </Suspense>
        </main>
      ) : (
        <>
          <MessageList />
          <ConnectedComposer />
        </>
      )}
    </>
  );
};

export const ChatView = memo(ChatViewComponent);
