import type { ReactElement } from 'react';
import { memo } from 'react';
import { cn, usageColor } from '@/services/utils';
import styles from './ProgressBar.module.css';

// ======================
// TYPES
// ======================

export interface ProgressBarProps {
  /** Current value (numerator). */
  value: number;
  /** Maximum value (denominator). Must be > 0 to show a filled bar. */
  max: number;
  /** Optional label rendered before the bar. */
  label?: string;
  /** Additional class applied to the root wrapper. */
  className?: string;
  /** Accessible label for the progressbar role. */
  ariaLabel?: string;
}

// ======================
// COMPONENT
// ======================

const ProgressBarComponent = ({
  value,
  max,
  label,
  className,
  ariaLabel,
}: ProgressBarProps): ReactElement => {
  // ======================
  // RENDER
  // ======================

  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  const fillColor = max > 0 ? usageColor(pct) : 'var(--sc-border-secondary)';

  return (
    <div className={cn(styles.root, className)}>
      {label !== undefined && <span className={styles.label}>{label}</span>}
      <div
        className={styles.track}
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={ariaLabel}
      >
        <div
          className={styles.fill}
          style={{ width: `${pct}%`, backgroundColor: fillColor }}
        />
      </div>
    </div>
  );
};

export const ProgressBar = memo(ProgressBarComponent);
