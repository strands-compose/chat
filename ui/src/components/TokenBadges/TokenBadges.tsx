/**
 * Token usage strip — input / output token counts.
 *
 * Sits on themed surfaces (chat and workflow subheaders) and styles itself
 * purely through color-mode tokens. Renders nothing until at least one count
 * is available.
 */

import type { ReactElement } from 'react';
import { memo } from 'react';
import { formatTokenCount } from '@/services/utils';
import styles from './TokenBadges.module.css';

export interface TokenBadgesProps {
  inputTokens?: number;
  outputTokens?: number;
  /** Optional prefix label shown before the badges (e.g. "Total"). */
  label?: string;
}

const TokenBadgesComponent = ({ inputTokens, outputTokens, label }: TokenBadgesProps): ReactElement | null => {
  // ======================
  // RENDER FUNCTIONS
  // ======================
  if (inputTokens == null && outputTokens == null) return null;

  const renderBadge = (badgeLabel: string, value: number): ReactElement => (
    <span className={styles.badge}>
      <span className={styles.badgeLabel}>{badgeLabel}</span>
      {'\u00a0'}{formatTokenCount(value)}
    </span>
  );

  return (
    <div className={styles.root}>
      {label && <span className={styles.groupLabel}>{label}</span>}
      {inputTokens != null && renderBadge('In:', inputTokens)}
      {outputTokens != null && renderBadge('Out:', outputTokens)}
    </div>
  );
};

export const TokenBadges = memo(TokenBadgesComponent);
