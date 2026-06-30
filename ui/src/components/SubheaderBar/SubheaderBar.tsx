/**
 * Shared subheader chrome: a bar surface with two slots.
 *
 * Domain-free presentational primitive. Each consumer supplies its own content
 * while the styling stays unified:
 *   - left:  leading content (title group, button group)
 *   - right: trailing inline content (status badge, token badges)
 */

import type { ReactElement, ReactNode } from 'react';
import { memo } from 'react';
import { cn } from '@/services/utils';
import styles from './SubheaderBar.module.css';

export interface SubheaderBarProps {
  /** Leading content, aligned to the start of the bar. */
  left?: ReactNode;
  /** Trailing inline content, aligned to the end of the bar. */
  right?: ReactNode;
  /** Optional class merged onto the bar surface for per-consumer styling. */
  className?: string;
}

// ======================
// RENDER
// ======================

const SubheaderBarComponent = ({ left, right, className }: SubheaderBarProps): ReactElement => (
  <div className={cn(styles.subheader, className)}>
    <div className={styles.subheaderLeft}>{left}</div>
    {right && <div className={styles.subheaderRight}>{right}</div>}
  </div>
);

export const SubheaderBar = memo(SubheaderBarComponent);
