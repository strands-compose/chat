/**
 * Circular progress ring drawn around its children (e.g. an avatar).
 *
 * Uses the same ok / warn / danger thresholds as ProgressBar.
 */

import type { ReactElement, ReactNode } from 'react';
import { memo } from 'react';
import { usageColor } from '@/services/utils';
import styles from './ProgressRing.module.css';

export interface ProgressRingProps {
  value: number;
  max: number;
  /** Outer diameter in px. Defaults to 44. */
  size?: number;
  children: ReactNode;
  ariaLabel?: string;
}

const ProgressRingComponent = ({
  value,
  max,
  size = 44,
  children,
  ariaLabel,
}: ProgressRingProps): ReactElement => {
  // ======================
  // RENDER
  // ======================
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  const color = max > 0 ? usageColor(pct) : 'var(--sc-border-secondary)';

  return (
    <span
      className={styles.ring}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel}
      style={{
        width: size,
        height: size,
        background: `conic-gradient(${color} ${pct}%, var(--sc-bg-hover) 0)`,
      }}
    >
      <span className={styles.inner}>{children}</span>
    </span>
  );
};

export const ProgressRing = memo(ProgressRingComponent);
