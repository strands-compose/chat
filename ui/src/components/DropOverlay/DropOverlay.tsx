/**
 * Full-window drag-and-drop overlay.
 *
 * Dumb presentational primitive: a blurred, fixed backdrop with a centered
 * drop-zone card, portalled to `document.body` so it covers the whole window
 * regardless of where it's mounted. Visibility and copy are driven by props;
 * it owns no drag logic and knows nothing about the app's domain.
 */

import type { ReactElement, ReactNode } from 'react';
import { memo } from 'react';
import { createPortal } from 'react-dom';
import styles from './DropOverlay.module.css';

interface DropOverlayProps {
  /** Whether the overlay is shown. */
  visible: boolean;
  /** Primary line inside the drop zone. */
  title: string;
  /** Secondary line beneath the title. */
  subtitle?: string;
  /** Leading icon shown above the title. */
  icon?: ReactNode;
}

// ======================
// RENDER
// ======================

const DropOverlayComponent = ({ visible, title, subtitle, icon }: DropOverlayProps): ReactElement | null => {
  if (!visible) return null;

  return createPortal(
    <div className={styles.overlay} aria-hidden="true">
      <div className={styles.card}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <span className={styles.title}>{title}</span>
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      </div>
    </div>,
    document.body,
  );
};

export const DropOverlay = memo(DropOverlayComponent);
