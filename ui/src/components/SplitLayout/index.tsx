/**
 * Split-pane layout: left fills available space, right slides in when open.
 *
 * Owns the splitter drag state via useSplitter. Children are rendered as
 * named slots (left / right) so the layout has zero coupling to chat or
 * workflow content.
 */

import type { ReactElement, ReactNode } from 'react';
import { memo } from 'react';
import { useSplitter } from '@/hooks';
import { cn } from '@/services/utils';
import styles from './SplitLayout.module.css';

interface SplitLayoutProps {
  /** When false, the right panel collapses to width 0 and the splitter hides. */
  rightOpen: boolean;
  left: ReactNode;
  right: ReactNode;
}

const SplitLayoutComponent = ({ rightOpen, left, right }: SplitLayoutProps): ReactElement => {
  const { leftPercent, containerRef, onSplitterMouseDown } = useSplitter();

  return (
    <div className={cn(styles.splitContainer, rightOpen && styles.splitOpen)} ref={containerRef}>
      <div
        className={styles.leftPanel}
        style={{ width: `${rightOpen ? leftPercent : 100}%` }}
      >
        {left}
      </div>

      <div
        className={cn(styles.splitter, rightOpen && styles.splitterOpen)}
        onMouseDown={rightOpen ? onSplitterMouseDown : undefined}
      />

      <div
        className={styles.rightPanel}
        style={{ width: rightOpen ? `${100 - leftPercent}%` : '0' }}
      >
        <div className={cn(styles.rightPanelInner, rightOpen && styles.rightPanelInnerVisible)}>
          {right}
        </div>
      </div>
    </div>
  );
};

export const SplitLayout = memo(SplitLayoutComponent);
