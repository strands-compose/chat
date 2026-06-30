/**
 * DateRangePicker - sidebar + two-month calendar grid.
 *
 * Presets (Week to date, Month to date, Last 7/14/30 days) appear on the left
 * and close the popover immediately. The two-month calendar accepts a click-
 * click range selection: first click sets the start, second click sets the end.
 * Future dates are disabled. Built entirely on Radix Popover + a hand-rolled
 * calendar grid — no external calendar library.
 */

import type { ReactElement } from 'react';
import { memo, useState } from 'react';
import * as RadixPopover from '@radix-ui/react-popover';
import { FiCalendar, FiChevronDown, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { cn } from '@/services/utils';
import styles from './DateRangePicker.module.css';

// ======================
// DATE HELPERS
// ======================

const today = (): Date => {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
};

const startOfDay = (d: Date): Date => {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  return r;
};

const addMonths = (d: Date, n: number): Date =>
  new Date(d.getFullYear(), d.getMonth() + n, 1);

const isSameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

/** All calendar cells for a month (including leading/trailing nulls for alignment). */
const buildMonth = (year: number, month: number): (Date | null)[] => {
  const cells: (Date | null)[] = [];
  const first = new Date(year, month, 1);
  const startDow = first.getDay(); // 0 = Sunday
  for (let i = 0; i < startDow; i++) cells.push(null);
  const days = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= days; d++) cells.push(new Date(year, month, d));
  return cells;
};

const MONTHS = ['January','February','March','April','May','June',
                 'July','August','September','October','November','December'];
const DOW_HEADERS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

/** Short label used in the trigger button. */
const fmtShort = (d: Date): string =>
  d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

// ======================
// PRESETS
// ======================

interface Preset { label: string; resolve: () => { from: Date; to: Date } }

const daysAgo = (n: number): Date => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
};

const monthsAgo = (n: number): Date => {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  d.setHours(0, 0, 0, 0);
  return d;
};

const PRESETS: Preset[] = [
  {
    label: 'Week to date',
    resolve: () => {
      const d = new Date();
      const mon = new Date(d);
      mon.setDate(d.getDate() - ((d.getDay() + 6) % 7));
      mon.setHours(0, 0, 0, 0);
      return { from: mon, to: today() };
    },
  },
  {
    label: 'Month to date',
    resolve: () => ({
      from: new Date(new Date().getFullYear(), new Date().getMonth(), 1, 0, 0, 0, 0),
      to: today(),
    }),
  },
  { label: 'Last 7 days',   resolve: () => ({ from: daysAgo(6),      to: today() }) },
  { label: 'Last 14 days',  resolve: () => ({ from: daysAgo(13),     to: today() }) },
  { label: 'Last 30 days',  resolve: () => ({ from: daysAgo(29),     to: today() }) },
  { label: 'Last 3 months', resolve: () => ({ from: monthsAgo(3),    to: today() }) },
  { label: 'Last 6 months', resolve: () => ({ from: monthsAgo(6),    to: today() }) },
  { label: 'Last year',     resolve: () => ({ from: monthsAgo(12),   to: today() }) },
];

// ======================
// MONTH GRID
// ======================

interface MonthGridProps {
  year: number;
  month: number;
  rangeStart: Date | null;
  rangeEnd: Date | null;
  hovered: Date | null;
  onDayClick: (d: Date) => void;
  onDayHover: (d: Date | null) => void;
}

const MonthGrid = ({
  year, month, rangeStart, rangeEnd, hovered, onDayClick, onDayHover,
}: MonthGridProps): ReactElement => {
  const cells = buildMonth(year, month);
  const now = new Date();
  now.setHours(23, 59, 59, 999);

  // For hover preview: if one end is picked and user hovers a date, show preview range.
  const previewEnd = rangeStart && !rangeEnd && hovered ? hovered : null;
  const effEnd = rangeEnd ?? previewEnd;

  const inRange = (d: Date): boolean => {
    if (!rangeStart || !effEnd) return false;
    const lo = rangeStart <= effEnd ? rangeStart : effEnd;
    const hi = rangeStart <= effEnd ? effEnd : rangeStart;
    return d > lo && d < hi;
  };

  const isStart = (d: Date): boolean =>
    !!rangeStart && isSameDay(d, rangeStart <= (effEnd ?? rangeStart) ? rangeStart : (effEnd ?? rangeStart));

  const isEnd = (d: Date): boolean =>
    !!effEnd && isSameDay(d, rangeStart && rangeStart <= effEnd ? effEnd : (rangeStart ?? effEnd));

  return (
    <div className={styles.monthGrid}>
      <p className={styles.monthLabel}>{MONTHS[month]} {year}</p>
      <div className={styles.dowRow}>
        {DOW_HEADERS.map((h) => <span key={h} className={styles.dowCell}>{h}</span>)}
      </div>
      <div className={styles.daysGrid}>
        {cells.map((d, i) => {
          if (!d) return <div key={`e-${i}`} className={styles.dayEmpty} />;
          const isFuture = d > now;
          const start = isStart(d);
          const end = isEnd(d);
          const mid = inRange(d);
          return (
            <div
              key={d.toISOString()}
              className={cn(styles.dayCell, mid && styles.dayCellInRange, start && styles.dayCellStart, end && styles.dayCellEnd)}
            >
              <button
                type="button"
                className={cn(styles.dayBtn, (start || end) && styles.dayBtnSelected)}
                disabled={isFuture}
                onClick={() => onDayClick(d)}
                onMouseEnter={() => onDayHover(d)}
                onMouseLeave={() => onDayHover(null)}
              >
                {d.getDate()}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ======================
// ROOT COMPONENT
// ======================

interface DateRangePickerProps {
  from: Date;
  to: Date;
  onChange: (range: { from: Date; to: Date }) => void;
}

const DateRangePickerComponent = ({ from, to, onChange }: DateRangePickerProps): ReactElement => {
  const [open, setOpen] = useState(false);
  /** Cursor = month shown on the LEFT calendar (right shows cursor+1). */
  const [cursor, setCursor] = useState<Date>(() => new Date(from.getFullYear(), from.getMonth() - 1, 1));
  /** Pending first click before the range is complete. */
  const [picking, setPicking] = useState<Date | null>(null);
  const [hovered, setHovered] = useState<Date | null>(null);

  const rangeStart = picking ?? from;
  const rangeEnd = picking ? null : to;

  const leftYear  = cursor.getFullYear();
  const leftMonth = cursor.getMonth();
  const rightDate = addMonths(cursor, 1);

  // ======================
  // HANDLERS
  // ======================
  const handleDayClick = (d: Date): void => {
    if (!picking) {
      setPicking(startOfDay(d));
    } else {
      const a = picking;
      const b = startOfDay(d);
      const from2 = a <= b ? a : b;
      const to2   = a <= b ? new Date(b.getFullYear(), b.getMonth(), b.getDate(), 23, 59, 59, 999)
                           : new Date(a.getFullYear(), a.getMonth(), a.getDate(), 23, 59, 59, 999);
      onChange({ from: from2, to: to2 });
      setPicking(null);
      setOpen(false);
    }
  };

  const handlePreset = (preset: Preset): void => {
    onChange(preset.resolve());
    setPicking(null);
    setOpen(false);
  };

  const handleOpenChange = (next: boolean): void => {
    setOpen(next);
    if (!next) { setPicking(null); setHovered(null); }
    else setCursor(new Date(from.getFullYear(), from.getMonth() - 1, 1));
  };

  // ======================
  // RENDER
  // ======================
  return (
    <RadixPopover.Root open={open} onOpenChange={handleOpenChange}>
      <RadixPopover.Trigger asChild>
        <button type="button" className={styles.trigger}>
          <FiCalendar size={14} className={styles.triggerIcon} />
          <span>{fmtShort(from)} - {fmtShort(to)}</span>
          <FiChevronDown size={13} className={styles.triggerChevron} />
        </button>
      </RadixPopover.Trigger>

      <RadixPopover.Portal>
        <RadixPopover.Content className={styles.popover} align="start" sideOffset={6}>
          <div className={styles.panel}>

            {/* Preset sidebar */}
            <ul className={styles.presets}>
              {PRESETS.map((p) => (
                <li key={p.label}>
                  <button type="button" className={styles.presetBtn} onClick={() => handlePreset(p)}>
                    {p.label}
                  </button>
                </li>
              ))}
            </ul>

            {/* Calendar area */}
            <div className={styles.calendarArea}>
              <div className={styles.navRow}>
                <button type="button" className={styles.navBtn} onClick={() => setCursor(addMonths(cursor, -1))} aria-label="Previous month">
                  <FiChevronLeft size={16} />
                </button>
                <button type="button" className={styles.navBtn} onClick={() => setCursor(addMonths(cursor, 1))} aria-label="Next month">
                  <FiChevronRight size={16} />
                </button>
              </div>
              <div className={styles.months}>
                <MonthGrid
                  year={leftYear} month={leftMonth}
                  rangeStart={rangeStart} rangeEnd={rangeEnd}
                  hovered={hovered}
                  onDayClick={handleDayClick} onDayHover={setHovered}
                />
                <MonthGrid
                  year={rightDate.getFullYear()} month={rightDate.getMonth()}
                  rangeStart={rangeStart} rangeEnd={rangeEnd}
                  hovered={hovered}
                  onDayClick={handleDayClick} onDayHover={setHovered}
                />
              </div>
              {picking && (
                <p className={styles.hint}>Click a second date to complete the range.</p>
              )}
            </div>
          </div>
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  );
};

export const DateRangePicker = memo(DateRangePickerComponent);
