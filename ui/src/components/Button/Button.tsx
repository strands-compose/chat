import type { ButtonHTMLAttributes, ReactElement, ReactNode } from 'react';
import { memo } from 'react';
import { cn } from '@/services/utils';
import styles from './Button.module.css';

export type ButtonVariant = 'outline' | 'ghost' | 'primary';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  /** Visual style. Defaults to `'ghost'`. */
  variant?: ButtonVariant;
  /** Stretch to fill the container width. */
  fullWidth?: boolean;
  /** Left-align content (for list-row style buttons). */
  alignStart?: boolean;
}

const ButtonComponent = ({
  children,
  variant = 'ghost',
  fullWidth = false,
  alignStart = false,
  type = 'button',
  className,
  ...rest
}: ButtonProps): ReactElement => {
  // ======================
  // RENDER
  // ======================
  const classes = cn(
    styles.button,
    styles[variant],
    fullWidth && styles.fullWidth,
    alignStart && styles.alignStart,
    className,
  );

  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
};

export const Button = memo(ButtonComponent);
