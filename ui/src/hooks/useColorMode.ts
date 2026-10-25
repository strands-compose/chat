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

/**
 * Write the mode to the document root. Must run before the React state update:
 * consumers read CSS tokens during render (e.g. chart options via
 * `getComputedStyle`), and an effect would run only after that render.
 */
const applyColorMode = (mode: ColorMode): void => {
  document.documentElement.dataset.theme = mode;
  document.documentElement.style.colorScheme = mode;
};

export function useColorMode(): { colorMode: ColorMode; toggle: () => void } {
  const [colorMode, setColorMode] = useState<ColorMode>(() => {
    const initial = getInitialColorMode();
    applyColorMode(initial);
    return initial;
  });

  useEffect(() => {
    const handleChange = (e: MediaQueryListEvent): void => {
      if (sessionStorage.getItem(SESSION_KEY)) return;
      const next: ColorMode = e.matches ? 'dark' : 'light';
      applyColorMode(next);
      setColorMode(next);
    };
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  const toggle = useCallback((): void => {
    const next: ColorMode = colorMode === 'dark' ? 'light' : 'dark';
    sessionStorage.setItem(SESSION_KEY, next);
    applyColorMode(next);
    setColorMode(next);
  }, [colorMode]);

  return { colorMode, toggle };
}
