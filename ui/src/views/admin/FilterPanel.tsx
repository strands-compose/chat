/**
 * FilterPanel — filter bar for the admin analytics dashboard.
 *
 * Reads current filter state from AdminFiltersContext and writes back via
 * its setters. Loads available filter options once via getFilters(), showing
 * skeleton placeholders while loading.
 */

import type { ReactElement } from 'react';
import { memo, useMemo } from 'react';
import { DateRangePicker, MultiSelect, Skeleton } from '@/components';
import type { MultiSelectOption } from '@/components';
import { getFilters } from '@/services/adminApi';
import { useAsyncData } from '@/hooks';
import { useAdminFilters } from './hooks/useAdminFilters';
import styles from './FilterPanel.module.css';

// ======================
// COMPONENT
// ======================

const FilterPanelComponent = (): ReactElement => {
  // ======================
  // STATE, HOOKS & REFS
  // ======================

  const {
    dateRange,
    userIds,
    agentIds,
    groupIds,
    setDateRange,
    setUserIds,
    setAgentIds,
    setGroupIds,
  } = useAdminFilters();

  const { data: filters, isLoading, error } = useAsyncData(getFilters, []);

  const userOptions = useMemo<MultiSelectOption[]>(
    () => (filters?.users ?? []).map((u) => ({ value: u.id, label: u.username })),
    [filters],
  );
  const agentOptions = useMemo<MultiSelectOption[]>(
    () => (filters?.agents ?? []).map((a) => ({ value: a.id, label: a.name })),
    [filters],
  );
  const groupOptions = useMemo<MultiSelectOption[]>(
    () => (filters?.groups ?? []).map((g) => ({ value: g.id, label: g.name })),
    [filters],
  );

  // ======================
  // RENDER FUNCTIONS
  // ======================

  const renderBody = (): ReactElement => {
    if (error) {
      return <span className={styles.error}>{error.message}</span>;
    }
    if (isLoading) {
      return (
        <>
          <DateRangePicker from={dateRange.from} to={dateRange.to} onChange={setDateRange} />
          <div className={styles.selectWrap}><Skeleton height="2rem" /></div>
          <div className={styles.selectWrap}><Skeleton height="2rem" /></div>
          <div className={styles.selectWrap}><Skeleton height="2rem" /></div>
        </>
      );
    }
    return (
      <>
        <DateRangePicker from={dateRange.from} to={dateRange.to} onChange={setDateRange} />
        <div className={styles.selectWrap}>
          <MultiSelect label="Users" options={userOptions} value={userIds} onChange={setUserIds} filterable />
        </div>
        <div className={styles.selectWrap}>
          <MultiSelect label="Agents" options={agentOptions} value={agentIds} onChange={setAgentIds} filterable />
        </div>
        <div className={styles.selectWrap}>
          <MultiSelect label="Groups" options={groupOptions} value={groupIds} onChange={setGroupIds} filterable />
        </div>
      </>
    );
  };

  return <div className={styles.root}>{renderBody()}</div>;
};

export const FilterPanel = memo(FilterPanelComponent);
