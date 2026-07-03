/**
 * Collapsible left sidebar — Gemini/OpenAI style.
 */

import type { ReactElement } from 'react';
import { memo, useEffect, useState } from 'react';
import { FiEdit, FiTrash2, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';
import { useChatStore } from '@/store';
import { cn } from '@/services/utils';
import type { Session } from '@/services/api';
import { IconButton, ConfirmDialog, RenameSessionDialog } from '@/components';
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

interface NavButtonProps {
  onClick?: () => void;
  label: string;
  title: string;
  children: ReactElement;
  disabled?: boolean;
}

const NavButton = ({ onClick, label, title, children, disabled = false }: NavButtonProps): ReactElement => (
  <div className={styles.navItem}>
    <button
      className={styles.navBtn}
      onClick={onClick}
      type="button"
      title={title}
      aria-label={title}
      disabled={disabled}
    >
      <span className={styles.navBtnIcon}>{children}</span>
      <span className={styles.navBtnLabel}>{label}</span>
    </button>
  </div>
);

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
      <div key={s.session_id} className={styles.historyRow}>
        <button
          className={cn(styles.historyItem, s.session_id === activeSessionId && styles.historyItemActive)}
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
            <FiEdit size={15} />
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
            <FiTrash2 size={15} />
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
  const [expanded, setExpanded] = useState(true);
  const [renameTarget, setRenameTarget] = useState<{ sessionId: string; title: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

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
  const handleNewChat = (): void => guardInterrupt(() => clearChat());
  const handleSelectSession = (sid: string): void => guardInterrupt(() => restoreSession(sid));

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
            onRenameClick={(sid, title) => setRenameTarget({ sessionId: sid, title })}
            onDeleteClick={(sid) => setDeleteTarget(sid)}
          />
        ))}
      </>
    );
  };

  return (
    <div className={cn(styles.sidebar, expanded ? styles.sidebarExpanded : styles.sidebarCollapsed)}>
      <nav className={styles.navSection} aria-label="Chat navigation">
        <NavButton
          onClick={toggleSidebar}
          label="Collapse"
          title={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {expanded ? <FiChevronsLeft size={17} /> : <FiChevronsRight size={17} />}
        </NavButton>
        <NavButton onClick={handleNewChat} label="New chat" title="New chat">
          <FiEdit size={17} />
        </NavButton>
        {/* TODO: enable when implemented */}
        {/* <NavButton label="Search" title="Search chats (coming soon)" disabled>
          <FiSearch size={17} />
        </NavButton> */}
      </nav>
      <div className={styles.history} aria-label="Chat history">
        {renderHistory()}
      </div>

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
    </div>
  );
};

export const Sidebar = memo(SidebarComponent);
