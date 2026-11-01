/**
 * Usage pill — cost and total token count in one compact pill.
 *
 * Pure presentational primitive. Clicking the token total opens a popover that
 * splits it into input, output, cache read and cache write tokens, plus the
 * sum; a cache row shows only when its count is above zero. The cost hides when
 * undefined, the token total when it is zero, and the pill when both hide.
 * The only tooltip is the caller's `title`, so nested tooltips never compete.
 */

import type { ReactElement } from 'react';
import { memo } from 'react';
import * as RadixPopover from '@radix-ui/react-popover';
import { LuChevronDown, LuCircleDollarSign } from 'react-icons/lu';
import { cn, formatCost, formatTokenCount } from '@/services/utils';
import styles from './UsagePill.module.css';

// ======================
// TYPES
// ======================

export interface UsagePillProps {
  /** Total cost in USD. */
  cost?: number;
  inputTokens?: number;
  outputTokens?: number;
  /** Prompt-cache read tokens; listed only when greater than zero. */
  cacheReadTokens?: number;
  /** Prompt-cache write tokens; listed only when greater than zero. */
  cacheWriteTokens?: number;
  /** `'sm'` 30px, `'md'` 32px (default). */
  size?: 'sm' | 'md';
  /** Accessible name and tooltip, e.g. "Session usage". */
  title?: string;
}

interface BreakdownRow {
  label: string;
  value: number;
}

// ======================
// COMPONENT
// ======================

const UsagePillComponent = ({
  cost,
  inputTokens,
  outputTokens,
  cacheReadTokens,
  cacheWriteTokens,
  size = 'md',
  title,
}: UsagePillProps): ReactElement | null => {
  const rows: BreakdownRow[] = [
    { label: 'Input tokens', value: inputTokens ?? 0 },
    { label: 'Output tokens', value: outputTokens ?? 0 },
  ];
  if (cacheReadTokens) rows.push({ label: 'Cache read tokens', value: cacheReadTokens });
  if (cacheWriteTokens) rows.push({ label: 'Cache write tokens', value: cacheWriteTokens });
  const total = rows.reduce((sum, row) => sum + row.value, 0);
  const hasTokens = total > 0;
  if (cost == null && !hasTokens) return null;

  // ======================
  // RENDER FUNCTIONS
  // ======================
  const renderCost = (): ReactElement | null => {
    if (cost == null) return null;
    return (
      <>
        <span className={styles.group}>
          <LuCircleDollarSign size={15} className={styles.icon} aria-hidden="true" />
          {formatCost(cost)}
        </span>
        {hasTokens && <span className={styles.divider} />}
      </>
    );
  };

  const renderRow = (row: BreakdownRow): ReactElement => (
    <div key={row.label} className={styles.row}>
      <span className={styles.rowLabel}>{row.label}</span>
      <span className={styles.rowValue}>{formatTokenCount(row.value)}</span>
    </div>
  );

  const renderTokens = (): ReactElement | null => {
    if (!hasTokens) return null;
    return (
      <RadixPopover.Root>
        <RadixPopover.Trigger asChild>
          <button type="button" className={styles.tokenButton}>
            <span className={styles.label}>Tokens</span>
            {formatTokenCount(total)}
            <LuChevronDown size={13} className={styles.chevron} aria-hidden="true" />
          </button>
        </RadixPopover.Trigger>
        <RadixPopover.Portal>
          <RadixPopover.Content className={styles.popover} align="end" sideOffset={8}>
            {rows.map(renderRow)}
            <div className={styles.rowDivider} />
            <div className={cn(styles.row, styles.rowTotal)}>
              <span className={styles.rowLabel}>Total tokens</span>
              <span className={styles.rowValue}>{formatTokenCount(total)}</span>
            </div>
          </RadixPopover.Content>
        </RadixPopover.Portal>
      </RadixPopover.Root>
    );
  };

  return (
    <span className={cn(styles.pill, styles[size])} role="group" aria-label={title} title={title}>
      {renderCost()}
      {renderTokens()}
    </span>
  );
};

export const UsagePill = memo(UsagePillComponent);
