import type { ReactElement } from 'react';
import { memo } from 'react';
import type { SummaryOut } from '@/types/analytics';
import { postSummary } from '@/services/adminApi';
import { Skeleton } from '@/components';
import { useAsyncData } from '@/hooks';
import { formatInt } from '@/components/charts';
import { useAdminFilters } from './hooks/useAdminFilters';
import styles from './KpiTiles.module.css';

// ======================
// HELPERS
// ======================

const formatDate = (d: Date): string => {
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// ======================
// COMPONENT
// ======================

const KpiTilesComponent = (): ReactElement => {
  // ======================
  // STATE, HOOKS & REFS
  // ======================

  const { dateRange, userIds, agentIds, groupIds } = useAdminFilters();

  const { data, isLoading, error } = useAsyncData<SummaryOut>(
    () =>
      postSummary({
        from: formatDate(dateRange.from),
        to: formatDate(dateRange.to),
        filters: {
          user_ids: userIds.length > 0 ? userIds : null,
          agent_ids: agentIds.length > 0 ? agentIds : null,
          group_ids: groupIds.length > 0 ? groupIds : null,
        },
      }),
    [dateRange, userIds, agentIds, groupIds],
  );

  // ======================
  // RENDER FUNCTIONS
  // ======================

  if (error) {
    return <div className={styles.error}>{error.message}</div>;
  }

  const renderValue = (value: string): ReactElement => (
    <div className={styles.tileValue}>
      {isLoading ? <Skeleton width="5rem" height="1.5rem" /> : value}
    </div>
  );

  return (
    <div className={styles.grid}>
      <div className={styles.tile}>
        <p className={styles.tileLabel}>Total Cost</p>
        {renderValue(data ? `$${data.total_cost.toFixed(2)}` : '$0.00')}
      </div>
      <div className={styles.tile}>
        <p className={styles.tileLabel}>Input Tokens</p>
        {renderValue(data ? formatInt(data.input_tokens) : '0')}
      </div>
      <div className={styles.tile}>
        <p className={styles.tileLabel}>Output Tokens</p>
        {renderValue(data ? formatInt(data.output_tokens) : '0')}
      </div>
      <div className={styles.tile}>
        <p className={styles.tileLabel}>Hits</p>
        {renderValue(data ? formatInt(data.hits) : '0')}
      </div>
      <div className={styles.tile}>
        <p className={styles.tileLabel}>Active Users</p>
        {renderValue(data ? formatInt(data.active_users) : '0')}
      </div>
    </div>
  );
};

export const KpiTiles = memo(KpiTilesComponent);
