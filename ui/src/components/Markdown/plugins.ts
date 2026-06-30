/**
 * Shared remark / rehype plugin arrays for markdown rendering.
 *
 * Kept in their own module so the component file exports only components
 * (keeps React Fast Refresh happy).
 *
 * No `rehype-raw`: raw HTML embedded in model or tool output is intentionally
 * NOT parsed, so it renders as inert text. Re-enabling raw HTML without a
 * sanitizer (e.g. `rehype-sanitize`) would be an XSS vector, since the rendered
 * markdown includes attacker-influenceable agent/tool content.
 */

import remarkGfm from 'remark-gfm';

export const REMARK_PLUGINS = [remarkGfm];
export const REHYPE_PLUGINS = [];
