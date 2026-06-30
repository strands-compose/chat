/**
 * ProfilePanelDialog — the floating Profile panel.
 *
 * Agent data is fetched once when the dialog mounts and kept alive for the
 * lifetime of the dialog — switching tabs never re-fetches agents.
 * Usage data is fetched independently by UsageDashboard and AccountForm.
 */

import { memo } from 'react';
import type { ReactElement } from 'react';
import {
  Dialog,
  ErrorBoundary,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components';
import { useAuth } from '@/contexts';
import { fetchAgents } from '@/services/api';
import { AccountForm } from './AccountForm';
import { AgentsList } from './AgentsList';
import { UsageDashboard } from './UsageDashboard';
import { useFetchOnce } from '@/hooks';
import { ProfileProvider } from './contexts/ProfileContext';
import styles from './ProfilePanelDialog.module.css';

// ======================
// DIALOG
// ======================

interface ProfilePanelDialogProps {
  open: boolean;
  onClose: () => void;
}

const ProfilePanelDialogComponent = ({ open, onClose }: ProfilePanelDialogProps): ReactElement | null => {
  const { user } = useAuth();

  const { data: agents, isLoading: agentsLoading } = useFetchOnce(fetchAgents);

  if (!user) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Profile"
      description="View and edit your profile, available agents, and usage statistics."
      draggable
      resizable
      maximizable
      initialWidth={1200}
      initialHeight={760}
    >
      <ProfileProvider>
        <Tabs defaultValue="account" className={styles.tabs}>
          <TabsList label="Profile sections">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="agents">Agents</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
          </TabsList>

          <TabsContent value="account" className={styles.panelFill}>
            <ErrorBoundary message="Couldn't load your account details.">
              <AccountForm />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="agents" className={styles.panel}>
            <ErrorBoundary message="Couldn't load the agents list.">
              {agentsLoading
                ? <div className={styles.loading}>Loading…</div>
                : <AgentsList agents={agents ?? []} />
              }
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="usage" className={styles.panelFill}>
            <ErrorBoundary message="Couldn't load your usage data.">
              <UsageDashboard />
            </ErrorBoundary>
          </TabsContent>
        </Tabs>
      </ProfileProvider>
    </Dialog>
  );
};

export const ProfilePanelDialog = memo(ProfilePanelDialogComponent);
