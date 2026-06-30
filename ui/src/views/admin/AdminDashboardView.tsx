import type { ReactElement } from 'react';
import { memo } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { IconButton } from '@/components';
import { useTheme } from '@/contexts';
import { AdminFiltersProvider } from './contexts/AdminFiltersContext';
import { FilterPanel } from './FilterPanel';
import { KpiTiles } from './KpiTiles';
import { TimelineChart } from './TimelineChart';
import { BreakdownChart } from './BreakdownChart';
import { BudgetTable } from './BudgetTable';
import styles from './AdminDashboardView.module.css';

// ======================
// COMPONENT
// ======================

const AdminDashboardViewComponent = (): ReactElement => {
  const { toggle, isDark } = useTheme();

  const header = (
    <div className={styles.titleRoot}>
      <div className={styles.titleRow}>
        <h1 className={styles.title}>Usage Analytics</h1>
        <IconButton
          onClick={toggle}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <FiSun size={16} /> : <FiMoon size={16} />}
        </IconButton>
      </div>
      <div className={styles.subtitle}>
        Monitor costs, token usage, and agent activity across your organization.
        Filter by date, user, agent, or group to drill down.
      </div>
      <FilterPanel />
    </div>
  );

  const content = (
    <div className={styles.shell}>
      <KpiTiles />
      <TimelineChart />
      <div className={styles.breakdownLayout}>
        <div className={styles.breakdownChart}>
          <BreakdownChart />
        </div>
        <div className={styles.budgetPanel}>
          <BudgetTable />
        </div>
      </div>
    </div>
  );

  return (
    <AdminFiltersProvider>
      <div className={styles.root}>
        {header}
        {content}
      </div>
    </AdminFiltersProvider>
  )
};

export const AdminDashboardView = memo(AdminDashboardViewComponent);
