import { useAsyncData } from '@/hooks';
import { postTimeline } from '@/services/adminApi';
import type { Interval, TimelineOut } from '@/types/analytics';
import { useAdminFilters } from './useAdminFilters';

// ======================
// TYPES
// ======================

export interface UseTimelineDataResult {
  data: TimelineOut | null;
  isLoading: boolean;
  error: string | null;
}

// ======================
// HOOK
// ======================

/**
 * Fetch timeline data for the given chart configuration.
 *
 * Reads the shared date range and filter ids from AdminFiltersContext so the
 * chart component only needs to pass its own local controls (interval, metric,
 * stackBy). Re-fetches whenever any dependency changes; keeps the previous
 * result visible during loading (stale-while-reloading via useAsyncData).
 */
export const useTimelineData = (
  interval: Interval,
  metric: 'cost' | 'tokens' | 'hits',
  stackBy: 'none' | 'user' | 'agent' | 'group',
  maxSeries: number,
): UseTimelineDataResult => {
  const { dateRange, userIds, agentIds, groupIds } = useAdminFilters();

  const { data, isLoading, error } = useAsyncData<TimelineOut>(
    () => {
      const filters: { user_ids?: string[]; agent_ids?: string[]; group_ids?: string[] } = {};
      if (userIds.length > 0) filters.user_ids = userIds;
      if (agentIds.length > 0) filters.agent_ids = agentIds;
      if (groupIds.length > 0) filters.group_ids = groupIds;

      return postTimeline({
        from: dateRange.from.toISOString().slice(0, 10),
        to: dateRange.to.toISOString().slice(0, 10),
        interval,
        metric,
        stack_by: stackBy,
        filters: Object.keys(filters).length > 0 ? filters : undefined,
        max_series: maxSeries,
      });
    },
    [dateRange, userIds, agentIds, groupIds, interval, metric, stackBy, maxSeries],
  );

  return { data, isLoading, error: error?.message ?? null };
};
