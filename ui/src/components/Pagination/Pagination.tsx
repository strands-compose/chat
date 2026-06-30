/**
 * Pagination — page-navigation bar for tables and lists.
 *
 * Renders prev/next buttons, a compact page indicator, and an optional
 * page-size selector. Fully controlled: receives current state via props and
 * notifies the parent via callbacks. Carries no domain knowledge.
 */

import type { ReactElement } from 'react';
import { memo } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import styles from './Pagination.module.css';

// ======================
// TYPES
// ======================

export interface PaginationProps {
  /** Current 1-based page index. */
  page: number;
  /** Total number of pages. */
  totalPages: number;
  /** Total number of items across all pages. */
  totalItems: number;
  /** Number of items shown per page. */
  pageSize: number;
  /** Available page-size options. When omitted the selector is hidden. */
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

// ======================
// COMPONENT
// ======================

const PaginationComponent = ({
  page,
  totalPages,
  totalItems,
  pageSize,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
}: PaginationProps): ReactElement => {
  // ======================
  // RENDER FUNCTIONS
  // ======================

  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  const renderPageSizeSelector = (): ReactElement | null => {
    if (!pageSizeOptions || !onPageSizeChange) return null;
    return (
      <div className={styles.pageSizeGroup}>
        <span className={styles.label}>Rows per page</span>
        <select
          className={styles.pageSizeSelect}
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          aria-label="Rows per page"
        >
          {pageSizeOptions.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <div className={styles.root} role="navigation" aria-label="Pagination">
      {renderPageSizeSelector()}
      <span className={styles.info}>
        {start}-{end} of {totalItems}
      </span>
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.navBtn}
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          <FiChevronLeft size={15} />
        </button>
        <span className={styles.pageIndicator} aria-current="page">
          {page} / {totalPages}
        </span>
        <button
          type="button"
          className={styles.navBtn}
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
        >
          <FiChevronRight size={15} />
        </button>
      </div>
    </div>
  );
};

export const Pagination = memo(PaginationComponent);
