/**
 * App-wide static configuration: context object, consumer hook, and provider.
 */

import { createContext, useContext, useMemo } from 'react';
import type { ReactElement, ReactNode } from 'react';

export interface AppConfig {
  /** Custom app title. `null` means "use the default branding". */
  title: string | null;
  /**
   * URL prefix the app is mounted under (e.g. "/ai/chat").
   * Empty string means the app is at the root.
   */
  baseUrl: string;
}

export const AppConfigContext = createContext<AppConfig>({ title: null, baseUrl: '' });

/** Read the app-wide static config. */
export const useAppConfig = (): AppConfig => useContext(AppConfigContext);

interface AppConfigProviderProps {
  children: ReactNode;
  /** Explicit config. When omitted, falls back to defaults. */
  config?: Partial<AppConfig>;
}

const AppConfigProviderComponent = ({
  children,
  config,
}: AppConfigProviderProps): ReactElement => {
  const value = useMemo<AppConfig>(
    () => ({
      title: config?.title ?? null,
      baseUrl: config?.baseUrl ?? '',
    }),
    [config?.title, config?.baseUrl],
  );

  return <AppConfigContext.Provider value={value}>{children}</AppConfigContext.Provider>;
};

export const AppConfigProvider = AppConfigProviderComponent;
