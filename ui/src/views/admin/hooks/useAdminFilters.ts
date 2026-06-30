import { createContext, useContext } from 'react';
import type { DateRange } from '@/types/analytics';

// ======================
// TYPES
// ======================

export interface AdminFiltersContextValue {
  dateRange: DateRange;
  userIds: string[];
  agentIds: string[];
  groupIds: string[];
  setDateRange: (range: DateRange) => void;
  setUserIds: (ids: string[]) => void;
  setAgentIds: (ids: string[]) => void;
  setGroupIds: (ids: string[]) => void;
}

// ======================
// CONTEXT
// ======================

export const AdminFiltersContext = createContext<AdminFiltersContextValue | null>(null);

// ======================
// HOOK
// ======================

/**
 * Read the shared admin analytics filter state (date range, user/agent/group ids).
 * Must be called inside an AdminFiltersProvider subtree.
 */
export const useAdminFilters = (): AdminFiltersContextValue => {
  const ctx = useContext(AdminFiltersContext);
  if (!ctx) throw new Error('useAdminFilters must be used inside AdminFiltersProvider');
  return ctx;
};
