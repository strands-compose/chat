import type { ReactElement } from 'react';
import { lazy, memo, Suspense, useEffect, useState } from 'react';
import { FiSun, FiMoon, FiUser, FiChevronDown, FiLogOut, FiShield } from 'react-icons/fi';
import {
  IconButton,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  ProgressBar,
} from '@/components';
import { formatCost } from '@/services/utils';
import { useAppConfig, useAuth, useTheme } from '@/contexts';
import { useChatStore } from '@/store';
import styles from './Header.module.css';

// Lazy-loaded so the ECharts bundle is only fetched when the user opens the
// Profile panel, keeping it out of the initial page load.
const ProfilePanelDialog = lazy(() =>
  import('./profile').then((m) => ({ default: m.ProfilePanelDialog })),
);

const HeaderComponent = (): ReactElement => {
  // ======================
  // STATE, HOOKS & REFS
  // ======================
  const [profileOpen, setProfileOpen] = useState(false);
  const { toggle, isDark } = useTheme();
  const { title, baseUrl } = useAppConfig();
  const { user, signOut, refetchUser } = useAuth();
  const isLoading = useChatStore((s) => s.isLoading);

  // Trigger refetch of current month spend on mount and whenever any invocation finishes
  useEffect(() => {
    if (!isLoading) {
      refetchUser().catch((err) => {
        console.error('[Header] failed to refetch user:', err);
      });
    }
  }, [isLoading, refetchUser]);

  // ======================
  // RENDER FUNCTIONS
  // ======================
  const renderTitle = (): ReactElement => {
    if (title) {
      return <h1 className={styles.title}>{title}</h1>;
    }
    return (
      <h1 className={styles.title}>
        Strands <span className={styles.accent}>Compose</span>
      </h1>
    );
  };

  const renderColorModeToggle = (): ReactElement => (
    <IconButton
      onClick={toggle}
      surface="onDark"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <FiSun size={16} /> : <FiMoon size={16} />}
    </IconButton>
  );

  const renderBudgetProgress = (): ReactElement | null => {
    if (!user) return null;
    return (
      <ProgressBar
        value={user.usage}
        max={user.budget}
        label={`${formatCost(user.usage)} / ${formatCost(user.budget)}`}
        variant="onDark"
        ariaLabel="Budget usage"
        className={styles.headerBudget}
      />
    );
  };

  const renderUserMenu = (): ReactElement | null => {
    if (!user) return null;
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={styles.userTrigger} aria-label="User menu">
              <FiUser size={15} className={styles.userIcon} />
              <span className={styles.username}>{user.username}</span>
              <FiChevronDown size={13} className={styles.chevron} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8}>
            <div className={styles.menuHeader}>
              <span className={styles.menuUsername}>{user.username}</span>
              <span className={styles.menuEmail}>{user.email}</span>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => setProfileOpen(true)}>
              <span className={styles.menuItemRow}>
                <FiUser size={14} />
                Profile
              </span>
            </DropdownMenuItem>
            {/* TODO: enable when implemented */}
            {/* <DropdownMenuItem disabled title="Coming soon">
              <span className={styles.menuItemRow}>
                <FiSettings size={14} />
                Settings
              </span>
            </DropdownMenuItem> */}
            {user.is_superuser && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => { window.location.href = `${baseUrl}/admin`; }}>
                  <span className={styles.menuItemRow}>
                    <FiShield size={14} />
                    Admin panel
                  </span>
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={signOut} className={styles.itemDanger}>
              <span className={styles.menuItemRow}>
                <FiLogOut size={14} />
                Sign out
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {profileOpen && (
          <Suspense fallback={null}>
            <ProfilePanelDialog open={profileOpen} onClose={() => setProfileOpen(false)} />
          </Suspense>
        )}
      </>
    );
  };

  return (
    <header className={styles.header}>
      <div className={styles.titleGroup}>{renderTitle()}</div>
      <div className={styles.actions}>
        {renderBudgetProgress()}
        {renderUserMenu()}
        {renderColorModeToggle()}
      </div>
    </header>
  );
};

export const Header = memo(HeaderComponent);
