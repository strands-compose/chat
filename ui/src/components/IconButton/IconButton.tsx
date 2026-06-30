import type { ButtonHTMLAttributes, ReactElement, ReactNode } from 'react';
import { memo } from 'react';
import { cn } from '@/services/utils';
import styles from './IconButton.module.css';

export type IconButtonSize = 'sm' | 'md';
export type IconButtonSurface = 'default' | 'onDark';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** The icon to render. */
  children: ReactNode;
  /** Square dimension. Defaults to `'md'` (32px). */
  size?: IconButtonSize;
  /** Surface the button sits on — `'onDark'` tunes hover for dark headers. */
  surface?: IconButtonSurface;
  /** Highlight as the active/selected control (brand-orange tint). */
  isActive?: boolean;
}

const IconButtonComponent = ({
  children,
  size = 'md',
  surface = 'default',
  isActive = false,
  type = 'button',
  className,
  ...rest
}: IconButtonProps): ReactElement => {
  // ======================
  // RENDER
  // ======================
  const classes = cn(
    styles.iconButton,
    styles[size],
    surface === 'onDark' && styles.onDark,
    isActive && styles.active,
    className,
  );

  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
};

export const IconButton = memo(IconButtonComponent);
