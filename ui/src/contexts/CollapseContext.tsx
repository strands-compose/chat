/**
 * Provides collapse state for the message list.
 */

import type { ReactElement, ReactNode } from 'react';
import { createContext, useContext, useState, useCallback, useMemo } from 'react';

export interface CollapseContextValue {
  /** IDs of messages that are currently collapsed. */
  collapsedIds: ReadonlySet<string>;
  toggle: (id: string) => void;
  collapseAll: (ids: string[]) => void;
  expandAll: () => void;
}

export const CollapseContext = createContext<CollapseContextValue>({
  collapsedIds: new Set(),
  toggle: () => undefined,
  collapseAll: () => undefined,
  expandAll: () => undefined,
});

export const useCollapseContext = (): CollapseContextValue => useContext(CollapseContext);

interface CollapseProviderProps {
  children: ReactNode;
}

const CollapseProviderComponent = ({ children }: CollapseProviderProps): ReactElement => {
  const [collapsedIds, setCollapsedIds] = useState<ReadonlySet<string>>(new Set());

  const toggle = useCallback((id: string) => {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const collapseAll = useCallback((ids: string[]) => {
    setCollapsedIds(new Set(ids));
  }, []);

  const expandAll = useCallback(() => {
    setCollapsedIds(new Set());
  }, []);

  const value = useMemo<CollapseContextValue>(
    () => ({ collapsedIds, toggle, collapseAll, expandAll }),
    [collapsedIds, toggle, collapseAll, expandAll],
  );

  return <CollapseContext.Provider value={value}>{children}</CollapseContext.Provider>;
};

export const CollapseProvider = CollapseProviderComponent;
