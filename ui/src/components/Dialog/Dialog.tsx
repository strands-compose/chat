import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactElement, ReactNode } from 'react';
import { memo, useCallback, useRef, useState } from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { FiMaximize2, FiMinimize2, FiX } from 'react-icons/fi';
import { cn } from '@/services/utils';
import styles from './Dialog.module.css';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  titleIcon?: ReactNode;
  children: ReactNode;
  /**
   * Accessible description for dialogs whose body has no descriptive text
   * (e.g. an image/PDF preview). Rendered visually hidden and linked via
   * `aria-describedby`. Omit when the body already renders an
   * `AlertDialog.Description`.
   */
  description?: string;
  /** Footer content (buttons). Omit for a dialog without a footer. */
  actions?: ReactNode;
  className?: string;
  /** Allow moving the dialog by dragging its header. Enables floating mode. */
  draggable?: boolean;
  /** Show a bottom-right grip to resize the dialog. Enables floating mode. */
  resizable?: boolean;
  /** Show a maximize/restore toggle in the header. Enables floating mode. */
  maximizable?: boolean;
  /** Initial floating width in px (capped to the viewport). Defaults to 1100. */
  initialWidth?: number;
  /** Initial floating height in px (capped to the viewport). Defaults to 820. */
  initialHeight?: number;
}

interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

const FLOATING_MARGIN = 16;
const FLOATING_MIN_WIDTH = 360;
const FLOATING_MIN_HEIGHT = 320;

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(value, Math.max(min, max)));

/** Centered starting rect, sized to the viewport. */
const buildInitialRect = (preferredWidth: number, preferredHeight: number): Rect => {
  const width = Math.min(preferredWidth, window.innerWidth - FLOATING_MARGIN * 2);
  const height = Math.min(preferredHeight, window.innerHeight - FLOATING_MARGIN * 2);
  return {
    width,
    height,
    left: Math.max(FLOATING_MARGIN, (window.innerWidth - width) / 2),
    top: Math.max(FLOATING_MARGIN, (window.innerHeight - height) / 2),
  };
};

const buildMaximizedRect = (): Rect => ({
  left: FLOATING_MARGIN,
  top: FLOATING_MARGIN,
  width: window.innerWidth - FLOATING_MARGIN * 2,
  height: window.innerHeight - FLOATING_MARGIN * 2,
});

const DialogComponent = ({
  open,
  onClose,
  title,
  titleIcon,
  children,
  description,
  actions,
  className,
  draggable = false,
  resizable = false,
  maximizable = false,
  initialWidth = 1100,
  initialHeight = 820,
}: DialogProps): ReactElement => {
  const floating = draggable || resizable || maximizable;

  // ======================
  // STATE, HOOKS & REFS
  // ======================
  const [rect, setRect] = useState<Rect>(() => buildInitialRect(initialWidth, initialHeight));
  const [maximized, setMaximized] = useState(false);
  const resizeRef = useRef<{ x: number; y: number; width: number; height: number } | null>(null);
  const moveRef = useRef<{ x: number; y: number; left: number; top: number } | null>(null);
  const restoreRef = useRef<Rect | null>(null);

  // ======================
  // HANDLERS
  // ======================
  const handleOpenChange = (next: boolean): void => {
    if (!next) onClose();
  };

  const handleMoveStart = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>): void => {
      // Header buttons keep their own click behaviour.
      if (!draggable || maximized || (e.target as HTMLElement).closest('button')) return;
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      moveRef.current = { x: e.clientX, y: e.clientY, left: rect.left, top: rect.top };
    },
    [draggable, maximized, rect],
  );

  const handleMoveMove = useCallback((e: ReactPointerEvent<HTMLDivElement>): void => {
    const start = moveRef.current;
    if (!start) return;
    setRect((current) => ({
      ...current,
      left: clamp(
        start.left + (e.clientX - start.x),
        FLOATING_MARGIN,
        window.innerWidth - current.width - FLOATING_MARGIN,
      ),
      top: clamp(
        start.top + (e.clientY - start.y),
        FLOATING_MARGIN,
        window.innerHeight - current.height - FLOATING_MARGIN,
      ),
    }));
  }, []);

  const handlePointerRelease = useCallback((e: ReactPointerEvent<HTMLDivElement>): void => {
    moveRef.current = null;
    resizeRef.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }, []);

  const handleResizeStart = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>): void => {
      e.preventDefault();
      e.stopPropagation();
      e.currentTarget.setPointerCapture(e.pointerId);
      resizeRef.current = { x: e.clientX, y: e.clientY, width: rect.width, height: rect.height };
    },
    [rect],
  );

  const handleResizeMove = useCallback((e: ReactPointerEvent<HTMLDivElement>): void => {
    const start = resizeRef.current;
    if (!start) return;
    setRect((current) => ({
      ...current,
      width: clamp(
        start.width + (e.clientX - start.x),
        FLOATING_MIN_WIDTH,
        window.innerWidth - current.left - FLOATING_MARGIN,
      ),
      height: clamp(
        start.height + (e.clientY - start.y),
        FLOATING_MIN_HEIGHT,
        window.innerHeight - current.top - FLOATING_MARGIN,
      ),
    }));
  }, []);

  const handleToggleMaximize = useCallback((): void => {
    if (maximized) {
      if (restoreRef.current) setRect(restoreRef.current);
      setMaximized(false);
      return;
    }
    restoreRef.current = rect;
    setRect(buildMaximizedRect());
    setMaximized(true);
  }, [maximized, rect]);

  // ======================
  // RENDER FUNCTIONS
  // ======================
  const renderHeader = (): ReactElement => (
    <div
      className={styles.header}
      style={floating && draggable ? { cursor: maximized ? 'default' : 'move' } : undefined}
      onPointerDown={floating && draggable ? handleMoveStart : undefined}
      onPointerMove={floating && draggable ? handleMoveMove : undefined}
      onPointerUp={floating && draggable ? handlePointerRelease : undefined}
    >
      <AlertDialog.Title className={styles.title} title={title}>
        {titleIcon && <span className={styles.titleIcon}>{titleIcon}</span>}
        <span className={styles.titleText}>{title}</span>
      </AlertDialog.Title>
      <div className={styles.headerActions}>
        {maximizable && (
          <button
            type="button"
            className={styles.iconBtn}
            onClick={handleToggleMaximize}
            aria-label={maximized ? 'Restore' : 'Maximize'}
            title={maximized ? 'Restore' : 'Maximize'}
          >
            {maximized ? <FiMinimize2 size={16} /> : <FiMaximize2 size={16} />}
          </button>
        )}
        <AlertDialog.Cancel asChild>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={onClose}
            aria-label="Close dialog"
          >
            <FiX size={18} />
          </button>
        </AlertDialog.Cancel>
      </div>
    </div>
  );

  const floatingStyle: CSSProperties | undefined = floating
    ? { left: rect.left, top: rect.top, width: rect.width, height: rect.height }
    : undefined;

  return (
    <AlertDialog.Root open={open} onOpenChange={handleOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className={styles.backdrop} />
        <AlertDialog.Content
          className={cn(styles.dialog, floating && styles.floating, className)}
          style={floatingStyle}
        >
          {renderHeader()}

          {description && (
            <AlertDialog.Description className={styles.srOnly}>
              {description}
            </AlertDialog.Description>
          )}

          <div className={cn(styles.body, floating && styles.bodyFill)}>{children}</div>

          {actions && <div className={styles.actions}>{actions}</div>}

          {resizable && !maximized && (
            <div
              className={styles.resizeHandle}
              onPointerDown={handleResizeStart}
              onPointerMove={handleResizeMove}
              onPointerUp={handlePointerRelease}
              role="presentation"
              aria-hidden="true"
            />
          )}
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};

export const Dialog = memo(DialogComponent);
