/**
 * Round avatar holding an icon or an initial.
 *
 * Domain-free: the caller passes the glyph and a tone. When `onClick` is set
 * the avatar renders as a button (e.g. to collapse a message). `spinning`
 * draws an accent ring around it to signal ongoing work.
 */

import type { ReactElement, ReactNode } from 'react';
import { memo } from 'react';
import { cn } from '@/services/utils';
import styles from './Avatar.module.css';

export type AvatarTone = 'neutral' | 'accent' | 'inverse';
export type AvatarSize = 'sm' | 'md' | 'lg';

export interface AvatarProps {
  /** Glyph shown inside the circle — an icon or a short initial. */
  icon: ReactNode;
  /** Colour treatment. Defaults to `'neutral'`. */
  tone?: AvatarTone;
  /** `'sm'` 26px, `'md'` 32px (default), `'lg'` 36px. */
  size?: AvatarSize;
  /** Draw a rotating accent ring around the avatar. */
  spinning?: boolean;
  /** Makes the avatar a button. */
  onClick?: () => void;
  title?: string;
  ariaLabel?: string;
  /** Forwarded as `aria-expanded` when the avatar is a button. */
  ariaExpanded?: boolean;
  className?: string;
}

const AvatarComponent = ({
  icon,
  tone = 'neutral',
  size = 'md',
  spinning = false,
  onClick,
  title,
  ariaLabel,
  ariaExpanded,
  className,
}: AvatarProps): ReactElement => {
  // ======================
  // RENDER
  // ======================
  const classes = cn(
    styles.avatar,
    styles[tone],
    styles[size],
    spinning && styles.spinning,
    onClick && styles.clickable,
    className,
  );

  if (onClick) {
    return (
      <button
        type="button"
        className={classes}
        onClick={onClick}
        title={title}
        aria-label={ariaLabel}
        aria-expanded={ariaExpanded}
      >
        {icon}
      </button>
    );
  }

  return (
    <span className={classes} title={title} aria-label={ariaLabel} role={ariaLabel ? 'img' : undefined}>
      {icon}
    </span>
  );
};

export const Avatar = memo(AvatarComponent);
