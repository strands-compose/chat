/**
 * Sidebar footer — the signed-in user, their monthly budget, and the user menu
 * (Profile, Admin panel, Sign out).
 *
 * Expanded: avatar + name + email, then the budget bar with amounts.
 * Collapsed (rail): the avatar wrapped in a budget ring; same menu on click.
 */

import type { ReactElement } from 'react';
import { lazy, memo, Suspense, useEffect, useState } from 'react';
import { LuChevronDown, LuLogOut, LuShield, LuUser } from 'react-icons/lu';
import {
  Avatar,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  ProgressBar,
  ProgressRing,
} from '@/components';
import { useAppConfig, useAuth } from '@/contexts';
import { useChatStore } from '@/store';
import { cn, formatCost, formatNextMonthReset } from '@/services/utils';
import styles from './SidebarUserCard.module.css';

// Lazy-loaded so the ECharts bundle is only fetched when the user opens the
// Profile panel, keeping it out of the initial page load.
const ProfilePanelDialog = lazy(() =>
  import('./profile').then((m) => ({ default: m.ProfilePanelDialog })),
);

/** Sidebar width transition (see Sidebar.module.css) plus a small margin. */
const SIDEBAR_TRANSITION_MS = 240;

interface SidebarUserCardProps {
  /** True when the sidebar is collapsed to its icon rail. */
  collapsed: boolean;
}

const SidebarUserCardComponent = ({ collapsed }: SidebarUserCardProps): ReactElement | null => {
  // ======================
  // STATE, HOOKS & REFS
  // ======================
  const [profileOpen, setProfileOpen] = useState(false);
  const { baseUrl } = useAppConfig();
  const { user, signOut, refetchUser } = useAuth();
  const isLoading = useChatStore((s) => s.isLoading);

  // The card is hidden while the sidebar resizes, then fades in at its final
  // width so its contents never visibly stretch or re-wrap mid-transition.
  const [settledFor, setSettledFor] = useState(collapsed);
  const isSettled = settledFor === collapsed;
  useEffect(() => {
    const timer = setTimeout(() => setSettledFor(collapsed), SIDEBAR_TRANSITION_MS);
    return () => clearTimeout(timer);
  }, [collapsed]);

  // Refetch the current month spend on mount and whenever an invocation finishes.
  useEffect(() => {
    if (!isLoading) {
      refetchUser().catch((err) => {
        console.error('[SidebarUserCard] failed to refetch user:', err);
      });
    }
  }, [isLoading, refetchUser]);

  if (!user) return null;

  const pct = user.budget > 0 ? Math.round((user.usage / user.budget) * 100) : 0;
  const initial = user.username.charAt(0).toUpperCase();
  const budgetLabel = `${formatCost(user.usage)} / ${formatCost(user.budget)}`;

  // ======================
  // RENDER FUNCTIONS
  // ======================
  const renderMenuContent = (): ReactElement => (
    <DropdownMenuContent align={collapsed ? 'start' : 'end'} sideOffset={8}>
      <div className={styles.menuHeader}>
        <span className={styles.menuUsername}>{user.username}</span>
        <span className={styles.menuEmail}>{user.email}</span>
      </div>
      <DropdownMenuSeparator />
      <DropdownMenuItem onSelect={() => setProfileOpen(true)}>
        <span className={styles.menuItemRow}>
          <LuUser size={15} />
          Profile
        </span>
      </DropdownMenuItem>
      {user.is_superuser && (
        <DropdownMenuItem onSelect={() => { window.location.href = `${baseUrl}/admin`; }}>
          <span className={styles.menuItemRow}>
            <LuShield size={15} />
            Admin panel
          </span>
        </DropdownMenuItem>
      )}
      <DropdownMenuSeparator />
      <DropdownMenuItem onSelect={signOut} className={styles.itemDanger}>
        <span className={styles.menuItemRow}>
          <LuLogOut size={15} />
          Sign out
        </span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );

  const renderRail = (): ReactElement => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={styles.railTrigger}
          aria-label="User menu"
          title={`Monthly budget: ${budgetLabel} (${pct}%)`}
        >
          <ProgressRing value={user.usage} max={user.budget} ariaLabel="Budget usage">
            <Avatar icon={initial} tone="inverse" size="md" />
          </ProgressRing>
        </button>
      </DropdownMenuTrigger>
      {renderMenuContent()}
    </DropdownMenu>
  );

  const renderExpanded = (): ReactElement => (
    <div className={styles.card}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button type="button" className={styles.userRow} aria-label="User menu">
            <Avatar icon={initial} tone="inverse" size="lg" />
            <span className={styles.meta}>
              <span className={styles.name}>{user.username}</span>
              <span className={styles.email}>{user.email}</span>
            </span>
            <LuChevronDown size={16} className={styles.chevron} />
          </button>
        </DropdownMenuTrigger>
        {renderMenuContent()}
      </DropdownMenu>
      <div className={styles.budget}>
        <div className={styles.budgetRow}>
          <span>Monthly budget</span>
          <span>
            <b className={styles.amount}>{formatCost(user.usage)}</b>
            <span className={styles.of}> / {formatCost(user.budget)}</span>
          </span>
        </div>
        <ProgressBar value={user.usage} max={user.budget} ariaLabel="Budget usage" />
        <div className={styles.budgetNote}>
          <span>{pct}% used</span>
          <span>Resets {formatNextMonthReset()}</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className={cn(styles.root, !isSettled && styles.pending)}>
        {collapsed ? renderRail() : renderExpanded()}
      </div>
      {profileOpen && (
        <Suspense fallback={null}>
          <ProfilePanelDialog open={profileOpen} onClose={() => setProfileOpen(false)} />
        </Suspense>
      )}
    </>
  );
};

export const SidebarUserCard = memo(SidebarUserCardComponent);
