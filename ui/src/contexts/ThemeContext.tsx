/**
 * Theme context object and provider.
 */

import type { ReactElement, ReactNode } from 'react';
import { createContext, useContext, useMemo } from 'react';
import type { ColorMode } from '@/hooks/useColorMode';
import { useColorMode } from '@/hooks/useColorMode';

export interface ThemeContextValue {
  colorMode: ColorMode;
  toggle: () => void;
  isDark: boolean;
}

export const ThemeContext = createContext<ThemeContextValue>({
  colorMode: 'light',
  toggle: () => undefined,
  isDark: false,
});

/** Read the shared color mode and its toggle. */
export const useTheme = (): ThemeContextValue => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProviderComponent = ({ children }: ThemeProviderProps): ReactElement => {
  const { colorMode, toggle } = useColorMode();
  const value = useMemo<ThemeContextValue>(
    () => ({ colorMode, toggle, isDark: colorMode === 'dark' }),
    [colorMode, toggle],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const ThemeProvider = ThemeProviderComponent;
