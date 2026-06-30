import type { ReactElement } from 'react';
import { memo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { FiSearch, FiX } from 'react-icons/fi';
import type { BudgetItemOut } from '@/types/analytics';
import { getBudgets } from '@/services/adminApi';
import { Spinner, ProgressBar, Pagination } from '@/components';
import { useAsyncData } from '@/hooks';
import styles from './BudgetTable.module.css';

// ======================
// CONSTANTS
// ======================

const PAGE_SIZE_OPTIONS = [5, 10, 15, 25, 50];
const DEFAULT_PAGE_SIZE = 15;

// Stable empty reference so the table input identity is steady before load.
const EMPTY_ROWS: BudgetItemOut[] = [];

// ======================
// HELPERS
// ======================

const formatBudgetLabel = (item: BudgetItemOut): string => {
  if (item.budget === 0) return `$${item.spend.toFixed(2)} / no budget`;
  return `$${item.spend.toFixed(2)} / $${item.budget.toFixed(2)}`;
};

const STATUS_COLORS: Record<BudgetItemOut['status'], string> = {
  ok: 'var(--sc-status-ok)',
  warn: 'var(--sc-status-warn)',
  danger: 'var(--sc-status-danger)',
};

const STATUS_LABELS: Record<BudgetItemOut['status'], string> = {
  ok: 'LOW',
  warn: 'MEDIUM',
  danger: 'HIGH',
};

// Column model — only the username column participates in the text filter;
// the usage/status columns render custom cells and opt out of global filtering.
const COLUMNS: ColumnDef<BudgetItemOut>[] = [
  {
    accessorKey: 'username',
    header: 'Username',
    meta: { headerClassName: styles.thUser, cellClassName: styles.tdUser },
  },
  {
    id: 'usage',
    header: 'Usage',
    enableGlobalFilter: false,
    cell: ({ row }) => (
      <ProgressBar
        value={row.original.spend}
        max={row.original.budget}
        label={formatBudgetLabel(row.original)}
        ariaLabel={`${row.original.username} budget usage`}
      />
    ),
    meta: { headerClassName: styles.thUsage, cellClassName: styles.tdUsage },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    enableGlobalFilter: false,
    cell: ({ row }) => (
      <span style={{ color: STATUS_COLORS[row.original.status] }}>
        {STATUS_LABELS[row.original.status]}
      </span>
    ),
    meta: { headerClassName: styles.thStatus, cellClassName: styles.tdStatus },
  },
];

// ======================
// COMPONENT
// ======================

const BudgetTableComponent = (): ReactElement => {
  // ======================
  // STATE, HOOKS & REFS
  // ======================

  const { data, isLoading, error } = useAsyncData<BudgetItemOut[]>(getBudgets, []);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable<BudgetItemOut>({
    data: data ?? EMPTY_ROWS,
    columns: COLUMNS,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    getRowId: (row) => row.user_id,
    initialState: { pagination: { pageIndex: 0, pageSize: DEFAULT_PAGE_SIZE } },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const { pageIndex, pageSize } = table.getState().pagination;
  const filteredCount = table.getFilteredRowModel().rows.length;

  // ======================
  // RENDER FUNCTIONS
  // ======================

  const renderTitleRow = (): ReactElement => (
    <div className={styles.titleRow}>
      <h2 className={styles.title}>User Budgets</h2>
      <div className={styles.filterBox}>
        <FiSearch size={13} className={styles.filterIcon} />
        <input
          type="text"
          className={styles.filterInput}
          placeholder="Filter by username…"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          aria-label="Filter by username"
        />
        {globalFilter !== '' && (
          <button
            type="button"
            className={styles.filterClear}
            onClick={() => setGlobalFilter('')}
            aria-label="Clear filter"
          >
            <FiX size={13} />
          </button>
        )}
      </div>
    </div>
  );

  const renderLoading = (): ReactElement => (
    <div className={styles.loading}>
      <Spinner />
    </div>
  );

  const renderError = (): ReactElement => (
    <div className={styles.error}>{error?.message}</div>
  );

  const renderEmpty = (): ReactElement => (
    <div className={styles.empty}>No budget data available.</div>
  );

  const renderTable = (): ReactElement => {
    if (filteredCount === 0) {
      return <div className={styles.empty}>No users match</div>;
    }

    return (
      <>
        <div className={styles.tableRoot}>
          <table className={styles.table}>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          page={pageIndex + 1}
          totalPages={table.getPageCount()}
          totalItems={filteredCount}
          pageSize={pageSize}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          onPageChange={(next) => table.setPageIndex(next - 1)}
          onPageSizeChange={(next) => table.setPageSize(next)}
        />
      </>
    );
  };

  const renderContent = (): ReactElement | null => {
    if (isLoading) return renderLoading();
    if (error) return renderError();
    if (!data || data.length === 0) return renderEmpty();
    return renderTable();
  };

  return (
    <div className={styles.root}>
      {renderTitleRow()}
      {renderContent()}
    </div>
  );
};

export const BudgetTable = memo(BudgetTableComponent);
