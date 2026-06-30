/**
 * Cost badge — displays an inferred session cost in USD.
 *
 * Pure presentational primitive: receives cost via props, never touches the
 * store or services. Renders nothing until cost is available.
 */

import type { ReactElement } from 'react';
import { memo } from 'react';
import { formatCost } from '@/services/utils';
import styles from './CostBadge.module.css';

export interface CostBadgeProps {
  /** Total cost in USD. Badge is hidden when undefined. */
  cost?: number;
  /** Optional prefix label shown before the badge (e.g. "Total cost"). */
  label?: string;
}

const CostBadgeComponent = ({ cost, label }: CostBadgeProps): ReactElement | null => {
  // ======================
  // RENDER FUNCTIONS
  // ======================
  if (cost == null) return null;

  return (
    <div className={styles.root}>
      {label && <span className={styles.groupLabel}>{label}</span>}
      <span className={styles.badge}>{formatCost(cost)}</span>
    </div>
  );
};

export const CostBadge = memo(CostBadgeComponent);
