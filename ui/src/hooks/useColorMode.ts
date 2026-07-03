import { useCallback, useEffect, useState } from 'react';

export type ColorMode = 'dark' | 'light';

const SESSION_KEY = 'strands_chat_color_mode';

/**
 * Evaluate `prefers-color-scheme` against the top-level window to handle iframes.
 * Inside a same-origin iframe, the local window's media query can resolve against
 * the embedder's color-scheme rather than the OS preference.
 */
const preferenceWindow: Window = (() => {
  try {
    void window.top?.location.href;
    return window.top ?? window;
  } catch {
    return window;
  }
})();

const mq = preferenceWindow.matchMedia('(prefers-color-scheme: dark)');

const getInitialColorMode = (): ColorMode => {
  const session = sessionStorage.getItem(SESSION_KEY);
  if (session === 'dark' || session === 'light') return session;
  return mq.matches ? 'dark' : 'light';
};

export function useColorMode(): { colorMode: ColorMode; toggle: () => void } {
  const [colorMode, setColorMode] = useState<ColorMode>(getInitialColorMode);

  useEffect(() => {
    document.documentElement.dataset.theme = colorMode;
    document.documentElement.style.colorScheme = colorMode;
  }, [colorMode]);

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
