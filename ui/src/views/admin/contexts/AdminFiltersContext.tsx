import type { ReactElement, ReactNode } from 'react';
import { memo, useCallback, useMemo, useState } from 'react';
import type { DateRange } from '@/types/analytics';
import { AdminFiltersContext } from '../hooks/useAdminFilters';
import type { AdminFiltersContextValue } from '../hooks/useAdminFilters';

// ======================
// HELPERS
// ======================

/** Month to date in the user's local calendar, like the picker's presets. */
const getDefaultDateRange = (): DateRange => {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), 1);
  const to = new Date(now.getFullYear(), now.getMonth(), now.getDate());
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
