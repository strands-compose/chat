import { useEffect, useRef, useState } from 'react';

interface WindowFileDropOptions {
  /** When false, listeners are detached and `isDragging` stays false. */
  enabled: boolean;
  /** Called with the dropped files once a file drop completes on the window. */
  onDrop: (files: File[]) => void;
}

interface WindowFileDropApi {
  /** True while one or more files are being dragged anywhere over the window. */
  isDragging: boolean;
}

/** True when a drag carries files (vs. text/elements). */
const dragHasFiles = (event: DragEvent): boolean =>
  !!event.dataTransfer && Array.from(event.dataTransfer.types).includes('Files');

/**
 * Track file drags over the entire window and surface dropped files.
 *
 * Uses a depth counter so nested `dragenter`/`dragleave` (fired as the cursor
 * crosses child elements) don't flicker `isDragging`. `dragover` is
 * default-prevented so the browser allows the drop instead of navigating to
 * the file. The latest `onDrop` is read through a ref so listeners are bound
 * once per `enabled` toggle rather than on every callback identity change.
 */
export function useWindowFileDrop({ enabled, onDrop }: WindowFileDropOptions): WindowFileDropApi {
  const [isDragging, setIsDragging] = useState(false);
  const depthRef = useRef(0);
  const onDropRef = useRef(onDrop);

  useEffect(() => {
    onDropRef.current = onDrop;
  }, [onDrop]);

  useEffect(() => {
    if (!enabled) {
      depthRef.current = 0;
      return;
    }
    // Fresh counter whenever listeners are (re)attached.
    depthRef.current = 0;

    const handleDragEnter = (event: DragEvent): void => {
      if (!dragHasFiles(event)) return;
      event.preventDefault();
      depthRef.current += 1;
      setIsDragging(true);
    };

    const handleDragOver = (event: DragEvent): void => {
      if (!dragHasFiles(event)) return;
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
    };

    const handleDragLeave = (event: DragEvent): void => {
      if (!dragHasFiles(event)) return;
      depthRef.current = Math.max(0, depthRef.current - 1);
      if (depthRef.current === 0) setIsDragging(false);
    };

    const handleDrop = (event: DragEvent): void => {
      if (!dragHasFiles(event)) return;
      event.preventDefault();
      depthRef.current = 0;
      setIsDragging(false);
      const files = Array.from(event.dataTransfer?.files ?? []);
      if (files.length > 0) onDropRef.current(files);
    };

    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', handleDrop);
    };
  }, [enabled]);

  // Masked with `enabled` so a drag left in flight when the hook is disabled
  // never surfaces; handlers reset the underlying state on dragleave/drop.
  return { isDragging: enabled && isDragging };
}
