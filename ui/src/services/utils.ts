// Cross-cutting pure helpers with no React or domain dependencies.

/**
 * Join conditional class names into a single space-separated string.
 *
 * Lightweight `clsx` replacement for composing CSS-module classes. Falsy
 * values (`false`, `null`, `undefined`, `''`) are dropped.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Format a cost as a dollar string rounded to 2 decimal places.
 *
 * Thousands separator is a non-breaking space, decimal separator is a dot
 * (e.g. `1234.5` → `"$1 234.50"`). Uses `en-US` grouping, then swaps the
 * commas for non-breaking spaces.
 */
export function formatCost(usd: number): string {
  const formatted = usd
    .toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    .replace(/,/g, '\u00a0');
  return `$${formatted}`;
}

/**
 * Read a `<meta name="...">` tag's content attribute.
 *
 * Used by app entry points to receive backend-injected configuration (URL
 * prefix, title, login URL) without relying on `data-*` attributes or
 * environment variables.
 *
 * @param name - The meta tag name to look up.
 * @param fallback - Value returned when the tag is absent. Defaults to `''`.
 */
export function readMeta(name: string, fallback = ''): string {
  const meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  return meta?.content ?? fallback;
}

/**
 * Read the URL prefix the app is mounted under, injected by the backend into
 * the `app-base` meta tag. Returns an empty string when the app is at the root.
 */
export function readAppBase(): string {
  return readMeta('app-base');
}

/**
 * Format a raw byte count as a human-readable size string for display.
 *
 * Always renders exactly two decimal places. Non-finite inputs (`NaN`,
 * `Infinity`, `-Infinity`) and negative values are treated as `0` and render
 * `"0.00 B"`. Units switch at the binary boundaries: `B` below 1 KiB, `KB`
 * below 1 MiB, and `MB` at or above 1 MiB (e.g. `"567.43 KB"`, `"1.45 MB"`).
 */
export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '0.00 B';
  const KB = 1024;
  const MB = 1024 * 1024;
  if (bytes < KB) return `${bytes.toFixed(2)} B`;
  if (bytes < MB) return `${(bytes / KB).toFixed(2)} KB`;
  return `${(bytes / MB).toFixed(2)} MB`;
}

/**
 * Result of validating a set of attachments against the configured size
 * limits. On failure, `reason` identifies the breached limit and `message`
 * names it for display.
 */
export type AttachmentValidation =
  | { ok: true }
  | { ok: false; reason: 'per_file' | 'total'; message: string };

/**
 * Validate attachment sizes against the per-file and combined-total limits.
 *
 * Each file is checked against `maxFileBytes` first; the first file that
 * exceeds it fails with `reason: 'per_file'`. If every file is within the
 * per-file limit, the combined size is checked against `maxTotalBytes` and
 * fails with `reason: 'total'` when exceeded.
 */
export function validateAttachments(
  attachments: { name: string; size: number }[],
  maxFileBytes: number,
  maxTotalBytes: number,
): AttachmentValidation {
  for (const attachment of attachments) {
    if (attachment.size > maxFileBytes) {
      return {
        ok: false,
        reason: 'per_file',
        message: `"${attachment.name}" exceeds the per-file limit of ${formatFileSize(maxFileBytes)}.`,
      };
    }
  }

  const totalBytes = attachments.reduce((sum, attachment) => sum + attachment.size, 0);
  if (totalBytes > maxTotalBytes) {
    return {
      ok: false,
      reason: 'total',
      message: `Attachments exceed the combined limit of ${formatFileSize(maxTotalBytes)}.`,
    };
  }

  return { ok: true };
}

/**
 * Returns a Date set to the first day of the current month at local midnight.
 *
 * @returns Local-midnight Date for the first day of the current month.
 */
export function startOfCurrentMonth(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
}

/**
 * Returns a Date set to the last day of the current month at local end-of-day.
 *
 * @returns Local end-of-day Date for the last day of the current month.
 */
export function endOfCurrentMonth(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
}

/**
 * Format a `Date` as a `YYYY-MM-DD` string in local time.
 *
 * Used by API calls that accept a date-range parameter and expect a local
 * calendar date rather than a UTC instant.
 *
 * @param d - The date to format.
 * @returns ISO-format date string in local time, e.g. `"2026-06-28"`.
 */
export function toDateParam(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
