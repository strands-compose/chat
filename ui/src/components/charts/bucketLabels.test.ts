import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { formatBucketLabel } from './bucketLabels';

describe('formatBucketLabel', () => {
  it.each([
    ['2026-06-23', 'daily', '23 Jun 2026'],
    ['2026-01-05', 'daily', '5 Jan 2026'],
    ['2026-12-31', 'daily', '31 Dec 2026'],
    ['2026-06-23', 'weekly', '23 Jun 2026'],
    ['2026-03-02', 'weekly', '2 Mar 2026'],
    ['2026-06', 'monthly', 'Jun 2026'],
    ['2026-01', 'monthly', 'Jan 2026'],
    ['2026-12', 'monthly', 'Dec 2026'],
  ] as const)('labels %s (%s) as %s', (key, interval, expected) => {
    expect(formatBucketLabel(key, interval)).toBe(expected);
  });

  it('drops the leading zero of the day but not the year', () => {
    expect(formatBucketLabel('2026-07-09', 'daily')).toBe('9 Jul 2026');
  });

  it('labels every valid daily key with day, month name and year, and monthly keys without a day', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2000, max: 2100 }),
        fc.integer({ min: 1, max: 12 }),
        fc.integer({ min: 1, max: 28 }),
        (year, month, day) => {
          const mm = String(month).padStart(2, '0');
          const dd = String(day).padStart(2, '0');
          expect(formatBucketLabel(`${year}-${mm}-${dd}`, 'daily')).toMatch(
            new RegExp(`^${day} [A-Z][a-z]{2} ${year}$`),
          );
          expect(formatBucketLabel(`${year}-${mm}`, 'monthly')).toMatch(
            new RegExp(`^[A-Z][a-z]{2} ${year}$`),
          );
        },
      ),
    );
  });
});
