/**
 * Public API for the charts package.
 *
 * Consumers import from `@/components/charts` — never from the individual
 * modules inside this folder. Internal helpers (toParamList, truncateLegendLabel,
 * etc.) are not re-exported here and remain package-private.
 */

// ── Label formatting ─────────────────────────────────────────────────────────
export { formatBucketLabel } from './bucketLabels';
export type {
  BuildLineSeriesOptions,
  ChartColors,
  LegendOptions,
  LegendPosition,
} from './chartOptions';

// ── Axis / grid / legend / series builders ───────────────────────────────────
export {
  axisDefaults,
  buildCategoryTooltipFormatter,
  buildGrid,
  buildLegend,
  buildLineSeries,
  buildTimeTooltipFormatter,
  buildTooltipBase,
  costAxisLabel,
  cssVar,
  formatInt,
  intAxisLabel,
  readChartColors,
  SERIES_COLORS,
  VERTICAL_LEGEND_RIGHT_PAD,
} from './chartOptions';
export type { ECOption } from './echartsCore';
// ── ECharts runtime + React wrapper ─────────────────────────────────────────
export { echarts, ReactECharts } from './echartsCore';
