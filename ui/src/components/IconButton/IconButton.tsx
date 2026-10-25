import type { ButtonHTMLAttributes, ReactElement, ReactNode } from 'react';
import { memo } from 'react';
import { cn } from '@/services/utils';
import styles from './IconButton.module.css';

export type IconButtonSize = 'sm' | 'md' | 'lg';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** The icon to render. */
  children: ReactNode;
  /** Square dimension: `'sm'` 28px, `'md'` 32px (default), `'lg'` 36px. */
  size?: IconButtonSize;
  /** Highlight as the active/selected control (accent tint). */
  isActive?: boolean;
}

const IconButtonComponent = ({
  children,
  size = 'md',
  isActive = false,
  type = 'button',
  className,
  ...rest
}: IconButtonProps): ReactElement => {
  // ======================
  // RENDER
  // ======================
  const classes = cn(styles.iconButton, styles[size], isActive && styles.active, className);

  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
};

export const IconButton = memo(IconButtonComponent);
