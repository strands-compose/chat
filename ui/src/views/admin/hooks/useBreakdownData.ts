import { useAsyncData } from '@/hooks';
import { postBreakdown } from '@/services/adminApi';
import type { BreakdownOut } from '@/types/analytics';
import { useAdminFilters } from './useAdminFilters';

// ======================
// TYPES
// ======================

export interface UseBreakdownDataResult {
  data: BreakdownOut | null;
  isLoading: boolean;
  error: string | null;
}

// ======================
// HOOK
// ======================

/**
 * Fetch breakdown data for the given chart configuration.
 *
 * Reads the shared date range and filter ids from AdminFiltersContext so the
 * chart component only needs to pass its own local controls (category, metric,
 * stackBy, maxItems). Re-fetches whenever any dependency changes; keeps the
 * previous result visible during loading (stale-while-reloading via useAsyncData).
 */
export const useBreakdownData = (
  category: 'user' | 'agent' | 'group',
  metric: 'cost' | 'tokens' | 'hits',
  stackBy: 'none' | 'user' | 'agent' | 'group',
  maxItems: number,
  maxSeries: number,
): UseBreakdownDataResult => {
  const { dateRange, userIds, agentIds, groupIds } = useAdminFilters();

  const { data, isLoading, error } = useAsyncData<BreakdownOut>(
    () => {
      const filters: { user_ids?: string[]; agent_ids?: string[]; group_ids?: string[] } = {};
      if (userIds.length > 0) filters.user_ids = userIds;
      if (agentIds.length > 0) filters.agent_ids = agentIds;
      if (groupIds.length > 0) filters.group_ids = groupIds;

      return postBreakdown({
        from: dateRange.from.toISOString().slice(0, 10),
        to: dateRange.to.toISOString().slice(0, 10),
        category,
        metric,
        stack_by: stackBy,
        filters: Object.keys(filters).length > 0 ? filters : undefined,
        max_items: maxItems,
        max_series: maxSeries,
      });
    },
    [dateRange, userIds, agentIds, groupIds, category, metric, stackBy, maxItems, maxSeries],
  );

  return { data, isLoading, error: error?.message ?? null };
};
