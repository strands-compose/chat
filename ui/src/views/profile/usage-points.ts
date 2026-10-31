/**
 * Pure helpers over the per-user usage points shown in the profile dialog.
 */

import type { MeUsagePoint } from '@/types/analytics';

/** All tokens a point was billed for: input, output, and prompt-cache reads and writes. */
export const pointTotalTokens = (point: MeUsagePoint): number =>
  point.input_tokens +
  point.output_tokens +
  point.cache_read_input_tokens +
  point.cache_write_input_tokens;
