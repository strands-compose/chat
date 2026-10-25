/**
 * Small status pill used on subheader surfaces.
 *
 * One primitive covers every lifecycle/state label in the app:
 *   - running   — in-progress (pulsing dot, accent)
 *   - completed — finished successfully (check icon, green)
 *   - error     — failed (alert icon, red)
 *   - neutral   — informational tag, e.g. "Local" (grey)
 *
 * Styled purely through color-mode tokens so it adapts to light/dark.
 */

import type { ReactElement } from 'react';
import { memo } from 'react';
import { LuCircleAlert, LuCircleCheck } from 'react-icons/lu';
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
  // ======================
  // RENDER FUNCTIONS
  // ======================
  const renderLead = (): ReactElement | null => {
    if (showDot ?? variant === 'running') {
      return <span className={cn(styles.dot, variant === 'running' && styles.dotPulse)} />;
    }
    if (variant === 'completed') return <LuCircleCheck size={14} aria-hidden="true" />;
    if (variant === 'error') return <LuCircleAlert size={14} aria-hidden="true" />;
    return null;
  };

  return (
    <span className={cn(styles.badge, styles[variant])}>
      {renderLead()}
      {label}
    </span>
  );
};

export const StatusBadge = memo(StatusBadgeComponent);
