import { useState, useEffect, useRef } from 'react';

export interface ContentReveal {
  /** The full text to render (parsed by ReactMarkdown once). */
  content: string;
  /** True while the one-shot reveal animation is active — apply a CSS class. */
  isRevealing: boolean;
}

/**
 * One-shot reveal animation for completed content.
 *
 * Does NOT type text out character by character. It returns the FULL text
 * immediately and sets `isRevealing = true` for a short duration so the caller
 * can apply a CSS reveal animation (fade-in / slide-up).
 *
 * For long content (> threshold chars) the reveal duration is shorter because
 * the user won't notice a subtle animation on large blocks.
 *
 * Pass `skipReveal = true` for restored history messages — they should appear
 * instantly with no animation so the action bar renders on the first paint.
 */
export const useContentReveal = (
  text: string,
  isComplete: boolean,
  skipReveal = false,
): ContentReveal => {
  const [isRevealing, setIsRevealing] = useState(false);
  const hasRevealedRef = useRef(false);

  useEffect(() => {
    // Already revealed once — just show text instantly.
    if (hasRevealedRef.current) return;

    // Skip animation for restored history messages.
    if (skipReveal) {
      hasRevealedRef.current = true;
      return;
    }

    // Not ready yet.
    if (!isComplete || !text) return;

    hasRevealedRef.current = true;

    // Short reveal duration; shorter for long content.
    const duration = text.length > 2000 ? 300 : 600;
    const timeout = setTimeout(() => {
      setIsRevealing(true);
      setTimeout(() => setIsRevealing(false), duration);
    }, 0);
    return () => clearTimeout(timeout);
  }, [text, isComplete, skipReveal]);

  if (!isComplete) {
    return { content: '', isRevealing: false };
  }
  return { content: text, isRevealing };
};
