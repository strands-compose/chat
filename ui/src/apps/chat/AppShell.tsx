import type { ReactElement } from 'react';
import { lazy, Suspense, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { Header, Sidebar } from '@/views';
import { ConfirmDialog, ErrorDialog, SplitLayout } from '@/components';
import { CollapseProvider, useAuth } from '@/contexts';
import { useChatStore } from '@/store';
import { LOGIN_URL } from '@/services/api';
import styles from './ChatApp.module.css';

const ChatView = lazy(() => import('@/views/chat'));
const WorkflowView = lazy(() => import('@/views/workflow'));

const AppShell = (): ReactElement => {
  const { user, isLoading, authError } = useAuth();
  // Open while a turn is selected or running, and across the brief gap after a
  // turn ends (buffer still set) until the refetch restores selectedWorkflowSeq.
  const workflowOpen = useChatStore(
    (s) => s.selectedWorkflowSeq !== null || s.isLoading || s.activeWorkflowItems.length > 0,
  );
  const { interruptConfirmOpen, confirmInterrupt, cancelInterrupt } = useChatStore(
    useShallow((s) => ({
      interruptConfirmOpen: s.interruptConfirmOpen,
      confirmInterrupt: s.confirmInterrupt,
      cancelInterrupt: s.cancelInterrupt,
    })),
  );

  const errorDialogOpen = !isLoading && !!authError;

  useEffect(() => {
    if (isLoading || authError) return;
    if (user === null) {
      window.location.href = LOGIN_URL;
    }
  }, [isLoading, user, authError]);

  return (
    <div className={styles.app}>
      <Header />
      <div className={styles.body}>
        <Sidebar />
        <SplitLayout
          rightOpen={workflowOpen}
          left={
            <CollapseProvider>
              <Suspense fallback={null}>
                <ChatView />
              </Suspense>
            </CollapseProvider>
          }
          right={
            workflowOpen ? (
              <Suspense fallback={null}>
                <WorkflowView />
              </Suspense>
            ) : null
          }
        />
      </div>
      <ErrorDialog
        open={errorDialogOpen}
        message={authError ?? ''}
        onClose={() => {}}
      />
      <ConfirmDialog
        open={interruptConfirmOpen}
        title="Agent is running"
        message="Are you sure you want to stop the agent? The current response will be discarded."
        confirmLabel="Stop agent"
        cancelLabel="Keep running"
        onConfirm={confirmInterrupt}
        onCancel={cancelInterrupt}
      />
    </div>
  );
};

export default AppShell;
