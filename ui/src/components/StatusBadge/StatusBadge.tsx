/**
 * Small status pill used on subheader surfaces.
 *
 * One primitive covers every lifecycle/state label in the app:
 *   - running   — in-progress (pulsing dot, brand orange)
 *   - completed — finished successfully (green)
 *   - error     — failed (red)
 *   - neutral   — informational tag, e.g. "Earlier message" (grey)
 *
 * Styled purely through color-mode tokens so it adapts to light/dark.
 */

import type { ReactElement } from 'react';
import { memo } from 'react';
import { cn } from '@/services/utils';
import styles from './StatusBadge.module.css';

export type StatusBadgeVariant = 'running' | 'completed' | 'error' | 'neutral';

export interface StatusBadgeProps {
  /** Visual + semantic variant. */
  variant: StatusBadgeVariant;
  /** Text shown inside the pill. */
  label: string;
  /** Force the leading dot on/off. Defaults to on for `running` only. */
  showDot?: boolean;
}

const StatusBadgeComponent = ({ variant, label, showDot }: StatusBadgeProps): ReactElement => {
  const withDot = showDot ?? variant === 'running';

  return (
    <span className={cn(styles.badge, styles[variant])}>
      {withDot && <span className={cn(styles.dot, variant === 'running' && styles.dotPulse)} />}
      {label}
    </span>
  );
};

export const StatusBadge = memo(StatusBadgeComponent);
