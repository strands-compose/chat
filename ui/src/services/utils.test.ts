import { afterEach, describe, expect, it, vi } from 'vitest';
import fc from 'fast-check';
import {
  endOfCurrentMonth,
  formatAgentLabel,
  formatCost,
  formatFileSize,
  formatNextMonthReset,
  formatTokenCount,
  startOfCurrentMonth,
  toDateParam,
  usageColor,
  validateAttachments,
} from './utils';

const NBSP = '\u00a0';

afterEach(() => vi.useRealTimers());

/** Freeze "now" at a local date-time so month helpers are timezone independent. */
function freezeNow(year: number, monthIndex: number, day: number, hour = 12): void {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(year, monthIndex, day, hour));
}

describe('formatFileSize', () => {
  it.each([
    [0, '0.00 B'],
    [1023, '1023.00 B'],
    [1024, '1.00 KB'],
    [1_520_435, '1.45 MB'],
  ])('formats %d bytes as %s', (bytes, expected) => {
    expect(formatFileSize(bytes)).toBe(expected);
  });

  it('treats sizes that are not real byte counts as zero', () => {
    expect(formatFileSize(Number.NaN)).toBe('0.00 B');
    expect(formatFileSize(Number.POSITIVE_INFINITY)).toBe('0.00 B');
    expect(formatFileSize(-5)).toBe('0.00 B');
  });

  it('switches unit exactly at the KiB and MiB boundaries', () => {
    expect(formatFileSize(1024 * 1024 - 1)).toMatch(/ KB$/);
    expect(formatFileSize(1024 * 1024)).toBe('1.00 MB');
  });

  it('always returns a number with two decimals and a unit, for any double up to 2^53 bytes', () => {
    fc.assert(
      fc.property(fc.double({ min: -1e3, max: Number.MAX_SAFE_INTEGER, noNaN: false }), (bytes) => {
        expect(formatFileSize(bytes)).toMatch(/^\d+\.\d{2} (B|KB|MB)$/);
      }),
    );
  });
});

describe('formatCost', () => {
  it.each([
    [0, '$0.00'],
    [0.005, '$0.01'],
    [0.004, '$0.00'],
    [12.3, '$12.30'],
    [999.999, `$1${NBSP}000.00`],
    [1234.5, `$1${NBSP}234.50`],
    [1_234_567.891, `$1${NBSP}234${NBSP}567.89`],
  ])('formats %d as %s', (usd, expected) => {
    expect(formatCost(usd)).toBe(expected);
  });

  it('never throws, yields NaN text, or uses a comma separator, for any finite non-negative cost', () => {
    fc.assert(
      fc.property(fc.double({ min: 0, max: 1e12, noNaN: true }), (usd) => {
        const text = formatCost(usd);
        expect(text).toMatch(/^\$[\d\u00a0]+\.\d{2}$/);
      }),
    );
  });
});

describe('formatTokenCount', () => {
  it.each([
    [0, '0'],
    [999, '999'],
    [1000, `1${NBSP}000`],
    [32955, `32${NBSP}955`],
    [1_234_567, `1${NBSP}234${NBSP}567`],
  ])('formats %d as %s', (n, expected) => {
    expect(formatTokenCount(n)).toBe(expected);
  });

  it('keeps the digits of any non-negative integer and only inserts no-break spaces', () => {
    fc.assert(
      fc.property(fc.nat({ max: Number.MAX_SAFE_INTEGER }), (n) => {
        const text = formatTokenCount(n);
        expect(text).not.toContain('\u202f');
        expect(text.replace(new RegExp(NBSP, 'g'), '')).toBe(String(n));
      }),
    );
  });
});

describe('formatAgentLabel', () => {
  it.each([
    ['doc_expert', 'Doc Expert'],
    ['DOC EXPERT', 'Doc Expert'],
    ['  doc__expert  ', 'Doc Expert'],
    ['main', 'Main'],
    ['a_b_c', 'A B C'],
  ])('labels %j as %j', (name, expected) => {
    expect(formatAgentLabel(name)).toBe(expected);
  });

  it('returns an empty string for a missing or empty name', () => {
    expect(formatAgentLabel(undefined)).toBe('');
    expect(formatAgentLabel('')).toBe('');
  });

  it('is idempotent and never leaves underscores or double spaces', () => {
    fc.assert(
      fc.property(fc.string(), (name) => {
        const label = formatAgentLabel(name);
        expect(label).not.toContain('_');
        expect(label).not.toMatch(/\s{2,}/);
        expect(formatAgentLabel(label)).toBe(label);
      }),
    );
  });
});

describe('validateAttachments', () => {
  const MAX_FILE = 1000;
  const MAX_TOTAL = 2500;
  const file = (name: string, size: number) => ({ name, size });

  it('accepts no attachments', () => {
    expect(validateAttachments([], MAX_FILE, MAX_TOTAL)).toEqual({ ok: true });
  });

  it('accepts files exactly at the per-file and total limits', () => {
    const files = [file('a', MAX_FILE), file('b', MAX_FILE), file('c', 500)];
    expect(validateAttachments(files, MAX_FILE, MAX_TOTAL)).toEqual({ ok: true });
  });

  it('rejects the first file over the per-file limit and names it', () => {
    const result = validateAttachments(
      [file('small', 10), file('big.png', MAX_FILE + 1), file('bigger.png', MAX_FILE + 99)],
      MAX_FILE,
      MAX_TOTAL,
    );
    expect(result).toMatchObject({ ok: false, reason: 'per_file' });
    if (!result.ok) {
      expect(result.message).toContain('"big.png"');
      expect(result.message).not.toContain('bigger.png');
      expect(result.message).toContain(formatFileSize(MAX_FILE));
    }
  });

  it('rejects files that are each within the limit but together exceed the total', () => {
    const result = validateAttachments(
      [file('a', MAX_FILE), file('b', MAX_FILE), file('c', 501)],
      MAX_FILE,
      MAX_TOTAL,
    );
    expect(result).toMatchObject({ ok: false, reason: 'total' });
    if (!result.ok) expect(result.message).toContain(formatFileSize(MAX_TOTAL));
  });

  it('reports the per-file breach before the total breach when both apply', () => {
    const result = validateAttachments([file('huge', MAX_TOTAL + 1)], MAX_FILE, MAX_TOTAL);
    expect(result).toMatchObject({ ok: false, reason: 'per_file' });
  });

  it('is ok exactly when every file fits and the sum fits, for any sizes', () => {
    fc.assert(
      fc.property(
        fc.array(fc.nat({ max: 5000 }), { maxLength: 8 }),
        fc.nat({ max: 5000 }),
        fc.nat({ max: 20000 }),
        (sizes, maxFile, maxTotal) => {
          const files = sizes.map((size, i) => file(`f${i}`, size));
          const fits = sizes.every((s) => s <= maxFile) && sizes.reduce((a, b) => a + b, 0) <= maxTotal;
          expect(validateAttachments(files, maxFile, maxTotal).ok).toBe(fits);
        },
      ),
    );
  });
});

describe('month boundaries', () => {
  it.each([
    ['mid month', new Date(2026, 5, 15), new Date(2026, 5, 1), new Date(2026, 5, 30, 23, 59, 59, 999)],
    ['31-day month end', new Date(2026, 0, 31), new Date(2026, 0, 1), new Date(2026, 0, 31, 23, 59, 59, 999)],
    ['non-leap February', new Date(2026, 1, 10), new Date(2026, 1, 1), new Date(2026, 1, 28, 23, 59, 59, 999)],
    ['leap February', new Date(2028, 1, 10), new Date(2028, 1, 1), new Date(2028, 1, 29, 23, 59, 59, 999)],
    ['December year end', new Date(2026, 11, 31), new Date(2026, 11, 1), new Date(2026, 11, 31, 23, 59, 59, 999)],
    ['January year start', new Date(2027, 0, 1), new Date(2027, 0, 1), new Date(2027, 0, 31, 23, 59, 59, 999)],
  ])('%s', (_label, now, expectedStart, expectedEnd) => {
    vi.useFakeTimers();
    vi.setSystemTime(now);
    expect(startOfCurrentMonth()).toEqual(expectedStart);
    expect(endOfCurrentMonth()).toEqual(expectedEnd);
  });

  it('start of month is local midnight', () => {
    freezeNow(2026, 5, 15, 17);
    const start = startOfCurrentMonth();
    expect([start.getHours(), start.getMinutes(), start.getSeconds(), start.getMilliseconds()]).toEqual([0, 0, 0, 0]);
  });
});

describe('toDateParam', () => {
  it.each([
    [new Date(2026, 5, 28), '2026-06-28'],
    [new Date(2026, 0, 1), '2026-01-01'],
    [new Date(2026, 11, 31, 23, 59, 59, 999), '2026-12-31'],
    [new Date(2028, 1, 29), '2028-02-29'],
  ])('formats %s as %s using the local calendar date', (date, expected) => {
    expect(toDateParam(date)).toBe(expected);
  });

  it('round-trips any local calendar date', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1971, max: 2100 }),
        fc.integer({ min: 0, max: 11 }),
        fc.integer({ min: 1, max: 28 }),
        (year, month, day) => {
          const param = toDateParam(new Date(year, month, day, 23, 59));
          expect(param).toBe(
            `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
          );
        },
      ),
    );
  });
});

describe('formatNextMonthReset', () => {
  it.each([
    [new Date(2026, 5, 15), 'Jul 1'],
    [new Date(2026, 0, 31), 'Feb 1'],
    [new Date(2026, 11, 31), 'Jan 1'],
    [new Date(2026, 10, 1), 'Dec 1'],
  ])('from %s resets on %s', (now, expected) => {
    expect(formatNextMonthReset(now)).toBe(expected);
  });

  it('defaults to the current clock', () => {
    freezeNow(2026, 11, 20);
    expect(formatNextMonthReset()).toBe('Jan 1');
  });
});

describe('usageColor', () => {
  it.each([
    [0, 'var(--sc-status-ok)'],
    [49.99, 'var(--sc-status-ok)'],
    [50, 'var(--sc-status-warn)'],
    [84.99, 'var(--sc-status-warn)'],
    [85, 'var(--sc-status-danger)'],
    [100, 'var(--sc-status-danger)'],
    [250, 'var(--sc-status-danger)'],
  ])('%d%% maps to the matching status colour', (pct, expected) => {
    expect(usageColor(pct)).toBe(expected);
  });
});
