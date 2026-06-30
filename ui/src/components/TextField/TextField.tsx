import type { InputHTMLAttributes, ReactElement } from 'react';
import { memo, useId } from 'react';
import { cn } from '@/services/utils';
import styles from './TextField.module.css';

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  /** Visible field label. */
  label?: string;
  /** Error message shown beneath the input. Presence also flags the field invalid. */
  error?: string;
}

const TextFieldComponent = ({
  label,
  error,
  className,
  ...rest
}: TextFieldProps): ReactElement => {
  // ======================
  // STATE, HOOKS & REFS
  // ======================
  const inputId = useId();
  const errorId = `${inputId}-error`;

  // ======================
  // RENDER
  // ======================
  const inputClasses = cn(styles.input, error && styles.invalid, className);

  return (
    <div className={styles.field}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={inputClasses}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...rest}
      />
      {error && (
        <span id={errorId} role="alert" className={styles.error}>
          {error}
        </span>
      )}
    </div>
  );
};

export const TextField = memo(TextFieldComponent);
