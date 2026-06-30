/**
 * Spinner — centered half-donut spinner for loading states.
 *
 * Pure presentational primitive. Fills its parent container and centers
 * a single rotating ring — no domain knowledge, no state.
 */

import type { ReactElement } from 'react';
import { memo } from 'react';
import styles from './Spinner.module.css';

const SpinnerComponent = (): ReactElement => (
  <div className={styles.root} role="status" aria-label="Loading chart">
    <div className={styles.ring} />
  </div>
);

export const Spinner = memo(SpinnerComponent);
