import type { ReactElement } from 'react';
import { memo } from 'react';
import { cn } from '@/services/utils';
import styles from './Skeleton.module.css';

// ======================
// TYPES
// ======================

export interface SkeletonProps {
  /** Explicit width. Defaults to 100% of its container. */
  width?: string;
  /** Explicit height. Defaults to 1rem. */
  height?: string;
  /** Border radius. Defaults to 6px. */
  radius?: string;
  /** Additional class for the root element. */
  className?: string;
}

// ======================
// COMPONENT
// ======================

const SkeletonComponent = ({
  width,
  height = '1rem',
  radius = '6px',
  className,
}: SkeletonProps): ReactElement => (
  <div
    className={cn(styles.skeleton, className)}
    style={{ width, height, borderRadius: radius }}
    aria-hidden="true"
  />
);

export const Skeleton = memo(SkeletonComponent);
