import type { ReactElement, ReactNode } from 'react';
import { memo, useCallback, useMemo, useState } from 'react';
import type { DateRange } from '@/types/analytics';
import { AdminFiltersContext } from '../hooks/useAdminFilters';
import type { AdminFiltersContextValue } from '../hooks/useAdminFilters';

// ======================
// HELPERS
// ======================

const getDefaultDateRange = (): DateRange => {
  const now = new Date();
  const from = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const to = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  return { from, to };
};

// ======================
// PROVIDER
// ======================

interface AdminFiltersProviderProps {
  children: ReactNode;
}

const AdminFiltersProviderComponent = ({ children }: AdminFiltersProviderProps): ReactElement => {
  const [dateRange, setDateRangeState] = useState<DateRange>(getDefaultDateRange);
  const [userIds, setUserIdsState] = useState<string[]>([]);
  const [agentIds, setAgentIdsState] = useState<string[]>([]);
  const [groupIds, setGroupIdsState] = useState<string[]>([]);

  const setDateRange = useCallback((range: DateRange) => setDateRangeState(range), []);
  const setUserIds = useCallback((ids: string[]) => setUserIdsState(ids), []);
  const setAgentIds = useCallback((ids: string[]) => setAgentIdsState(ids), []);
  const setGroupIds = useCallback((ids: string[]) => setGroupIdsState(ids), []);

  const value = useMemo<AdminFiltersContextValue>(
    () => ({ dateRange, userIds, agentIds, groupIds, setDateRange, setUserIds, setAgentIds, setGroupIds }),
    [dateRange, userIds, agentIds, groupIds, setDateRange, setUserIds, setAgentIds, setGroupIds],
  );

  return (
    <AdminFiltersContext.Provider value={value}>
      {children}
    </AdminFiltersContext.Provider>
  );
};

export const AdminFiltersProvider = memo(AdminFiltersProviderComponent);
