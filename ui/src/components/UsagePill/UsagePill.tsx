/**
 * Usage pill — cost and input/output token counts in one compact pill.
 *
 * Pure presentational primitive. Each part is omitted when its value is
 * undefined; nothing renders when all of them are.
 */

import type { ReactElement } from 'react';
import { memo } from 'react';
import { LuCircleDollarSign } from 'react-icons/lu';
import { cn, formatCost, formatTokenCount } from '@/services/utils';
import styles from './UsagePill.module.css';

export interface UsagePillProps {
  /** Total cost in USD. */
  cost?: number;
  inputTokens?: number;
  outputTokens?: number;
  /** `'sm'` 30px, `'md'` 32px (default). */
  size?: 'sm' | 'md';
  /** Tooltip, e.g. "Session usage". */
  title?: string;
}

const UsagePillComponent = ({
  cost,
  inputTokens,
  outputTokens,
  size = 'md',
  title,
}: UsagePillProps): ReactElement | null => {
  const hasTokens = inputTokens != null || outputTokens != null;
  if (cost == null && !hasTokens) return null;

  // ======================
  // RENDER FUNCTIONS
  // ======================
  const renderCost = (): ReactElement | null => {
    if (cost == null) return null;
    return (
      <>
        <span className={styles.group} title="Total cost">
          <LuCircleDollarSign size={15} className={styles.icon} aria-hidden="true" />
          {formatCost(cost)}
        </span>
        {hasTokens && <span className={styles.divider} />}
      </>
    );
  };

  const renderCount = (label: string, value: number | undefined): ReactElement | null => {
    if (value == null) return null;
    return (
      <span className={styles.group}>
        <span className={styles.label}>{label}</span>
        {formatTokenCount(value)}
      </span>
    );
  };

  return (
    <span className={cn(styles.pill, styles[size])} title={title}>
      {renderCost()}
      {renderCount('In', inputTokens)}
      {renderCount('Out', outputTokens)}
    </span>
  );
};

export const UsagePill = memo(UsagePillComponent);
