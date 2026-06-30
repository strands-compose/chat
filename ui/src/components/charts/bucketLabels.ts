import type { Interval } from '@/types/analytics';

// Month names used by formatBucketLabel — avoids locale dependency.
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Formats a bucket label key into a human-readable date string.
 *
 * - `daily`   `YYYY-MM-DD`  → `"23 Jun 2026"`
 * - `weekly`  `YYYY-MM-DD`  → `"23 Jun 2026"` (first day of the week)
 * - `monthly` `YYYY-MM`     → `"Jun 2026"`
 *
 * @param label - Raw bucket key (YYYY-MM-DD or YYYY-MM).
 * @param interval - The interval that generated the key.
 * @returns Formatted human-readable date string.
 */
export function formatBucketLabel(label: string, interval: Interval): string {
  if (interval === 'monthly') {
    const [year, month] = label.split('-');
    return `${MONTHS[parseInt(month, 10) - 1]} ${year}`;
  }
  // daily and weekly keys are both YYYY-MM-DD
  const [year, month, day] = label.split('-');
  return `${parseInt(day, 10)} ${MONTHS[parseInt(month, 10) - 1]} ${year}`;
}
