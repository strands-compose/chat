/**
 * ProfileContext — dialog-scoped state for the Profile panel.
 *
 * Lives inside ProfilePanelDialog so its lifetime matches the open dialog.
 * Holds two categories of state:
 *
 *  1. User preferences (survive tab switches):
 *     - interval, chartMode, dateRange for the Usage tab
 *
 *  2. Cached fetch results (no re-fetch on tab switch):
 *     - usagePoints — main dashboard data, refetched when dateRange/interval changes
 *     - currentMonthPoints — AccountForm sparkline, fetched once per dialog open
 */

import type { ReactElement, ReactNode } from 'react';
import { memo, useCallback, useMemo, useState } from 'react';
import { fetchUserUsageSummary } from '@/services/api';
import { useAsyncData } from '@/hooks';
import { endOfCurrentMonth, startOfCurrentMonth, toDateParam } from '@/services/utils';
import type { ChartMode, DateRange, Interval } from '@/types/analytics';
import { ProfileContext } from '../hooks/useProfileContext';
import type { ProfileContextValue } from '../hooks/useProfileContext';

// ======================
// HELPERS
// ======================

const getDefaultDateRange = (): DateRange => ({
  from: startOfCurrentMonth(),
  to: endOfCurrentMonth(),
});

// ======================
// PROVIDER
// ======================

interface ProfileProviderProps {
  children: ReactNode;
}

const ProfileProviderComponent = ({ children }: ProfileProviderProps): ReactElement => {
  // ── Preferences ──
  const [interval, setIntervalState] = useState<Interval>('daily');
  const [chartMode, setChartModeState] = useState<ChartMode>('cost');
  const [dateRange, setDateRangeState] = useState<DateRange>(getDefaultDateRange);

  const setInterval = useCallback((v: Interval) => setIntervalState(v), []);
  const setChartMode = useCallback((v: ChartMode) => setChartModeState(v), []);
  const setDateRange = useCallback((r: DateRange) => setDateRangeState(r), []);

  // ── Usage dashboard data — refetches when dateRange or interval changes ──
  const { data: usageData, isLoading: isUsageLoading } = useAsyncData(
    () =>
      fetchUserUsageSummary(
        toDateParam(dateRange.from),
        toDateParam(dateRange.to),
        interval,
      ),
    [dateRange, interval],
  );

  // ── Current-month sparkline — fetched once per dialog open ──
  const { data: currentMonthData, isLoading: isCurrentMonthLoading } = useAsyncData(
    () =>
      fetchUserUsageSummary(
        toDateParam(startOfCurrentMonth()),
        toDateParam(endOfCurrentMonth()),
        'daily',
      ),
    [],
  );

  const value = useMemo<ProfileContextValue>(
    () => ({
      interval,
      chartMode,
      dateRange,
      setInterval,
      setChartMode,
      setDateRange,
      usagePoints: usageData?.points ?? [],
      isUsageLoading,
      currentMonthPoints: currentMonthData?.points ?? [],
      isCurrentMonthLoading,
    }),
    [
      interval, chartMode, dateRange,
      setInterval, setChartMode, setDateRange,
      usageData, isUsageLoading,
      currentMonthData, isCurrentMonthLoading,
    ],
  );

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

export const ProfileProvider = memo(ProfileProviderComponent);
