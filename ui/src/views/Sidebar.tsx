/**
 * Collapsible left sidebar: app title, new chat, session history, and the
 * user card (budget + user menu) at the bottom.
 */

import type { ReactElement } from 'react';
import { memo, useEffect, useState } from 'react';
import { LuPanelLeftClose, LuPanelLeftOpen, LuPencil, LuSquarePen, LuTrash2 } from 'react-icons/lu';
import { useChatStore } from '@/store';
import { useAppConfig } from '@/contexts';
import { cn, isMobileViewport } from '@/services/utils';
import type { Session } from '@/services/api';
import { IconButton, ConfirmDialog, RenameSessionDialog } from '@/components';
import { SidebarUserCard } from './SidebarUserCard';
import styles from './Sidebar.module.css';

// ====== TIME BUCKET HELPERS ======

type Bucket = 'Today' | 'Yesterday' | 'This week' | 'Older';

function getBucket(date: Date): Bucket {
  const diffDays = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
  if (diffDays < 1) return 'Today';
  if (diffDays < 2) return 'Yesterday';
  if (diffDays < 7) return 'This week';
  return 'Older';
}

function groupSessions(sessions: Session[]): Array<{ label: Bucket; items: Session[] }> {
  const buckets: Record<Bucket, Session[]> = { Today: [], Yesterday: [], 'This week': [], Older: [] };
  for (const s of sessions) {
    buckets[getBucket(new Date(s.last_used_at))].push(s);
  }
  const order: Bucket[] = ['Today', 'Yesterday', 'This week', 'Older'];
  return order.filter((l) => buckets[l].length > 0).map((l) => ({ label: l, items: buckets[l] }));
}

// ====== SUB-COMPONENTS ======

interface HistoryGroupProps {
  label: Bucket;
  items: Session[];
  activeSessionId: string;
  onSelect: (sessionId: string) => void;
  onRenameClick: (sessionId: string, currentTitle: string) => void;
  onDeleteClick: (sessionId: string) => void;
}

const HistoryGroup = ({
  label,
  items,
  activeSessionId,
  onSelect,
  onRenameClick,
  onDeleteClick,
}: HistoryGroupProps): ReactElement => (
  <div className={styles.historyGroup}>
    <div className={styles.historyGroupLabel}>{label}</div>
    {items.map((s) => (
      <div
        key={s.session_id}
        className={cn(styles.historyRow, s.session_id === activeSessionId && styles.historyRowActive)}
      >
        <button
          className={styles.historyItem}
          type="button"
          title={s.title ?? s.session_id}
          onClick={() => onSelect(s.session_id)}
        >
          {s.title ?? s.session_id}
        </button>
        <div className={styles.historyActions}>
          <IconButton
            size="sm"
            title="Rename session"
            aria-label="Rename session"
            onClick={(e) => {
              e.stopPropagation();
              onRenameClick(s.session_id, s.title ?? s.session_id);
            }}
          >
            <LuPencil size={15} />
          </IconButton>
          <IconButton
            size="sm"
            title="Delete session"
            aria-label="Delete session"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteClick(s.session_id);
            }}
          >
            <LuTrash2 size={15} />
          </IconButton>
        </div>
      </div>
    ))}
  </div>
);

// ====== ROOT COMPONENT ======

const SidebarComponent = (): ReactElement => {
  // ======================
  // STATE, HOOKS & REFS
  // ======================
  // Collapsed by default on mobile viewports; expanded on larger screens.
  const [expanded, setExpanded] = useState(() => !isMobileViewport());
  const [renameTarget, setRenameTarget] = useState<{ sessionId: string; title: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const { title } = useAppConfig();
  const clearChat = useChatStore((s) => s.clearChat);
  const restoreSession = useChatStore((s) => s.restoreSession);
  const guardInterrupt = useChatStore((s) => s.guardInterrupt);
  const sessionId = useChatStore((s) => s.sessionId);
  const sessions = useChatStore((s) => s.sessions);
  const sessionsLoading = useChatStore((s) => s.sessionsLoading);
  const loadSessions = useChatStore((s) => s.loadSessions);
  const renameSession = useChatStore((s) => s.renameSession);
  const deleteSession = useChatStore((s) => s.deleteSession);

  // Load sessions on mount.
  useEffect(() => { loadSessions(); }, [loadSessions]);

  // ======================
  // HANDLERS
  // ======================
  const toggleSidebar = (): void => setExpanded((prev) => !prev);
  const handleNewChat = (): void => guardInterrupt(() => {
    clearChat();
    if (isMobileViewport()) setExpanded(false);
  });
  const handleSelectSession = (sid: string): void => guardInterrupt(() => {
    restoreSession(sid);
    if (isMobileViewport()) setExpanded(false);
  });

  const handleRenameSession = (newTitle: string): void => {
    if (!renameTarget) return;
    renameSession(renameTarget.sessionId, newTitle).catch((err) => {
      console.error('[Sidebar] Failed to rename session:', err);
    });
    setRenameTarget(null);
  };

  const handleDeleteSession = (): void => {
    if (!deleteTarget) return;
    deleteSession(deleteTarget).catch((err) => {
      console.error('[Sidebar] Failed to delete session:', err);
    });
    setDeleteTarget(null);
  };

  // ======================
  // RENDER FUNCTIONS
  // ======================
  const renderHead = (): ReactElement => (
    <div className={styles.head}>
      {expanded && <span className={styles.title}>{title ?? 'Strands Compose'}</span>}
      <IconButton
        size="lg"
        onClick={toggleSidebar}
        title={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
        aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {expanded ? <LuPanelLeftClose size={18} /> : <LuPanelLeftOpen size={18} />}
      </IconButton>
    </div>
  );

  const renderNewChat = (): ReactElement => (
    <button
      className={styles.newChat}
      onClick={handleNewChat}
      type="button"
      title="New chat"
      aria-label="New chat"
    >
      <LuSquarePen size={18} className={styles.newChatIcon} />
      <span className={styles.newChatLabel}>New chat</span>
    </button>
  );

  const renderHistory = (): ReactElement => {
    if (sessionsLoading && sessions.length === 0) {
      return <div className={styles.historyLoading} aria-busy="true">Loading…</div>;
    }
    if (sessions.length === 0) {
      return <div className={styles.historyEmpty}>No history yet</div>;
    }
    return (
      <>
        {groupSessions(sessions).map(({ label, items }) => (
          <HistoryGroup
            key={label}
            label={label}
            items={items}
            activeSessionId={sessionId}
            onSelect={handleSelectSession}
            onRenameClick={(sid, sessionTitle) => setRenameTarget({ sessionId: sid, title: sessionTitle })}
            onDeleteClick={(sid) => setDeleteTarget(sid)}
          />
        ))}
      </>
    );
  };

  const renderDialogs = (): ReactElement => (
    <>
      {renameTarget && (
        <RenameSessionDialog
          open={!!renameTarget}
          initialTitle={renameTarget.title}
          onConfirm={handleRenameSession}
          onCancel={() => setRenameTarget(null)}
        />
      )}
      {deleteTarget && (
        <ConfirmDialog
          open={!!deleteTarget}
          title="Delete Session"
          message={`Are you sure you want to delete this session?\nThis action cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={handleDeleteSession}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </>
  );

  return (
    <div className={cn(styles.sidebar, expanded ? styles.sidebarExpanded : styles.sidebarCollapsed)}>
      <nav className={styles.navSection} aria-label="Chat navigation">
        {renderHead()}
        {renderNewChat()}
      </nav>
      <div className={styles.history} aria-label="Chat history">
        {expanded && renderHistory()}
      </div>
      <div className={styles.footer}>
        <SidebarUserCard collapsed={!expanded} />
      </div>
      {renderDialogs()}
    </div>
  );
};

export const Sidebar = memo(SidebarComponent);
