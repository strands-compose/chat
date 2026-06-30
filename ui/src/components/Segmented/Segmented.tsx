import type { ReactElement } from 'react';
import { memo } from 'react';
import { cn } from '@/services/utils';
import styles from './Segmented.module.css';

interface SegmentedProps<T extends string> {
  options: { value: T; label: string }[];
  active: T;
  onSelect: (value: T) => void;
  label: string;
}

function SegmentedComponent<T extends string>(props: SegmentedProps<T>): ReactElement {
  const { options, active, onSelect, label } = props;

  return (
    <div className={styles.root} role="group" aria-label={label}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={cn(styles.segment, opt.value === active && styles.segmentActive)}
          aria-pressed={opt.value === active}
          onClick={() => onSelect(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export const Segmented = memo(SegmentedComponent) as typeof SegmentedComponent;
