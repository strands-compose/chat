import { useCallback, useRef, useState } from 'react';
import type { MouseEvent as ReactMouseEvent, RefObject } from 'react';

interface SplitterApi {
  /** Left panel percentage (30 — 90). */
  leftPercent: number;
  /** Ref to attach to the bounding container that defines drag bounds. */
  containerRef: RefObject<HTMLDivElement | null>;
  /** mousedown handler for the splitter element. */
  onSplitterMouseDown: (e: ReactMouseEvent) => void;
}

const MIN_PERCENT = 30;
const MAX_PERCENT = 88;

/**
 * Drag-to-resize splitter state.
 * Container ref defines the bounds; splitter element calls onSplitterMouseDown.
 */
export function useSplitter(initialPercent = 60): SplitterApi {
  const [leftPercent, setLeftPercent] = useState(initialPercent);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const onSplitterMouseDown = useCallback((e: ReactMouseEvent): void => {
    e.preventDefault();
    isDraggingRef.current = true;

    const onMouseMove = (ev: globalThis.MouseEvent): void => {
      if (!isDraggingRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pct = ((ev.clientX - rect.left) / rect.width) * 100;
      setLeftPercent(Math.min(Math.max(pct, MIN_PERCENT), MAX_PERCENT));
    };

    const onMouseUp = (): void => {
      isDraggingRef.current = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, []);

  return { leftPercent, containerRef, onSplitterMouseDown };
}
