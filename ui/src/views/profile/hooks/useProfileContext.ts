import { createContext, useContext } from 'react';
import type { ChartMode, DateRange, Interval, MeUsagePoint } from '@/types/analytics';

// ======================
// TYPES
// ======================

export interface ProfileContextValue {
  // ── Preferences ──
  interval: Interval;
  chartMode: ChartMode;
  dateRange: DateRange;
  setInterval: (value: Interval) => void;
  setChartMode: (value: ChartMode) => void;
  setDateRange: (range: DateRange) => void;

  // ── Usage dashboard data ──
  usagePoints: MeUsagePoint[];
  isUsageLoading: boolean;

  // ── Current-month data (AccountForm sparkline) ──
  currentMonthPoints: MeUsagePoint[];
  isCurrentMonthLoading: boolean;
}

// ======================
// CONTEXT
// ======================

export const ProfileContext = createContext<ProfileContextValue | null>(null);

// ======================
// HOOK
// ======================

/**
 * Read the profile panel state (usage preferences + cached fetch data).
 * Must be called inside a ProfileProvider subtree.
 */
export const useProfileContext = (): ProfileContextValue => {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfileContext must be used inside ProfileProvider');
  return ctx;
};
