import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

interface AutoScrollApi {
  /** Attach to the scrollable container. */
  containerRef: RefObject<HTMLDivElement | null>;
  /** Attach a sentinel element at the bottom of the content. */
  endRef: RefObject<HTMLDivElement | null>;
}

/**
 * Auto-scroll the container to the bottom whenever the thread changes:
 * a new message is added, OR streaming starts/stops (the final commit can
 * change height after the last token). A ResizeObserver keeps it pinned while
 * content grows during streaming.
 *
 * Scrolls the container directly via scrollTop for reliability.
 */
export function useAutoScroll(
  messageOrder: string[],
  isStreamingTail: boolean,
): AutoScrollApi {
  const containerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // Scroll on message-list changes and on streaming start/finish.
  useEffect(() => {
    const id = setTimeout(() => {
      const el = containerRef.current;
      if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }, 100);
    return () => clearTimeout(id);
  }, [messageOrder, isStreamingTail]);

  // Keep pinned to the bottom while streaming, as content grows.
  useEffect(() => {
    if (!isStreamingTail) return;
    const el = containerRef.current;
    const content = endRef.current?.parentElement;
    if (!el || !content) return;
    const observer = new ResizeObserver(() => {
      el.scrollTop = el.scrollHeight;
    });
    observer.observe(content);
    return () => observer.disconnect();
  }, [isStreamingTail]);

  return { containerRef, endRef };
}
