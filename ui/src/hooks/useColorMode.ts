import { useCallback, useEffect, useState } from 'react';

export type ColorMode = 'dark' | 'light';

const SESSION_KEY = 'strands_chat_color_mode';
const mq = window.matchMedia('(prefers-color-scheme: dark)');

/**
 * Resolve initial mode:
 * 1. Session override (user explicitly toggled this session) — wins.
 * 2. Browser/OS preference via matchMedia — default, no storage needed.
 */
const getInitialColorMode = (): ColorMode => {
  const session = sessionStorage.getItem(SESSION_KEY);
  if (session === 'dark' || session === 'light') return session;
  return mq.matches ? 'dark' : 'light';
};

/**
 * Color mode hook.
 *
 * - Default: follows browser/OS `prefers-color-scheme` automatically.
 * - Toggle: writes a session-scoped override (clears on tab close).
 * - Live: if the user hasn't manually toggled this session, changing the OS
 *   preference while the app is open is reflected immediately.
 * - Sets `data-theme` on `<html>` and `color-scheme` for native controls.
 */
export function useColorMode(): { colorMode: ColorMode; toggle: () => void } {
  const [colorMode, setColorMode] = useState<ColorMode>(getInitialColorMode);

  // Apply theme to DOM whenever it changes.
  useEffect(() => {
    document.documentElement.dataset.theme = colorMode;
    document.documentElement.style.colorScheme = colorMode;
  }, [colorMode]);

  // Follow OS preference changes — but only when the user hasn't set a
  // session override (i.e. sessionStorage is empty).
  useEffect(() => {
    const handleChange = (e: MediaQueryListEvent): void => {
      if (sessionStorage.getItem(SESSION_KEY)) return;
      setColorMode(e.matches ? 'dark' : 'light');
    };
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  const toggle = useCallback((): void => {
    setColorMode((prev) => {
      const next: ColorMode = prev === 'dark' ? 'light' : 'dark';
      sessionStorage.setItem(SESSION_KEY, next);
      return next;
    });
  }, []);

  return { colorMode, toggle };
}
