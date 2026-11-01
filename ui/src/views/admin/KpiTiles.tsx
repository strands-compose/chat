import type { ReactElement } from 'react';
import { memo } from 'react';
import type { SummaryOut } from '@/types/analytics';
import { postSummary } from '@/services/adminApi';
import { Skeleton } from '@/components';
import { useAsyncData } from '@/hooks';
import { formatInt } from '@/components/charts';
import { toDateParam } from '@/services/utils';
import { useAdminFilters } from './hooks/useAdminFilters';
import styles from './KpiTiles.module.css';

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
        from: toDateParam(dateRange.from),
        to: toDateParam(dateRange.to),
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

  const renderTile = (label: string, value: string): ReactElement => (
    <div className={styles.tile} role="group" aria-label={label}>
      <p className={styles.tileLabel}>{label}</p>
      {renderValue(value)}
    </div>
  );

  // The cache tiles always show, so the grid keeps its shape while data loads.
  return (
    <div className={styles.grid}>
      {renderTile('Total Cost', data ? `$${data.total_cost.toFixed(2)}` : '$0.00')}
      {renderTile('Input Tokens', formatInt(data?.input_tokens ?? 0))}
      {renderTile('Output Tokens', formatInt(data?.output_tokens ?? 0))}
      {renderTile('Cache Read Tokens', formatInt(data?.cache_read_input_tokens ?? 0))}
      {renderTile('Cache Write Tokens', formatInt(data?.cache_write_input_tokens ?? 0))}
      {renderTile('Hits', formatInt(data?.hits ?? 0))}
      {renderTile('Active Users', formatInt(data?.active_users ?? 0))}
    </div>
  );
};

export const KpiTiles = memo(KpiTilesComponent);
