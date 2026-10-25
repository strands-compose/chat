/**
 * One-line preview of a tool's arguments for the collapsed tool card:
 * the first `key: value` pair of an object input, a string input as is, or
 * "no arguments" when there is nothing to show.
 */
export function toolInputPreview(input: unknown): string {
  if (input == null || input === '') return 'no arguments';

  let data: unknown = input;
  if (typeof input === 'string') {
    try {
      data = JSON.parse(input);
    } catch {
      return input;
    }
  }

  if (typeof data !== 'object' || data === null) return String(data);

  const entries = Object.entries(data as Record<string, unknown>);
  if (entries.length === 0) return 'no arguments';

  const [key, value] = entries[0];
  const shown = typeof value === 'string' ? value : JSON.stringify(value);
  return `${key}: ${shown}`;
}
