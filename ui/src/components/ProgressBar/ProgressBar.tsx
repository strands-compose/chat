import type { ReactElement } from 'react';
import { memo } from 'react';
import { cn } from '@/services/utils';
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
  /** Visual variant - 'onDark' uses a semi-transparent track for dark backgrounds. */
  variant?: 'default' | 'onDark';
  /** Additional class applied to the root wrapper. */
  className?: string;
  /** Accessible label for the progressbar role. */
  ariaLabel?: string;
}

// ======================
// HELPERS
// ======================

const getFillColor = (pct: number): string => {
  if (pct >= 85) return 'var(--sc-status-danger)';
  if (pct >= 50) return 'var(--sc-status-warn)';
  return 'var(--sc-status-ok)';
};

// ======================
// COMPONENT
// ======================

const ProgressBarComponent = ({
  value,
  max,
  label,
  variant = 'default',
  className,
  ariaLabel,
}: ProgressBarProps): ReactElement => {
  // ======================
  // RENDER
  // ======================

  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  const fillColor = max > 0 ? getFillColor(pct) : 'var(--sc-border-secondary)';

  return (
    <div className={cn(styles.root, className)}>
      {label !== undefined && (
        <span className={cn(styles.label, variant === 'onDark' && styles.labelOnDark)}>
          {label}
        </span>
      )}
      <div
        className={cn(styles.track, variant === 'onDark' && styles.trackOnDark)}
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
