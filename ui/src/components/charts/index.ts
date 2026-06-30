/**
 * Public API for the charts package.
 *
 * Consumers import from `@/components/charts` — never from the individual
 * modules inside this folder. Internal helpers (toParamList, truncateLegendLabel,
 * etc.) are not re-exported here and remain package-private.
 */

// ── ECharts runtime + React wrapper ─────────────────────────────────────────
export { echarts, ReactECharts } from './echartsCore';
export type { ECOption } from './echartsCore';

// ── Axis / grid / legend / series builders ───────────────────────────────────
export {
  cssVar,
  readChartColors,
  axisDefaults,
  formatInt,
  costAxisLabel,
  intAxisLabel,
  buildGrid,
  buildLegend,
  buildLineSeries,
  buildTooltipBase,
  buildTimeTooltipFormatter,
  buildCategoryTooltipFormatter,
  SERIES_COLORS,
  VERTICAL_LEGEND_RIGHT_PAD,
} from './chartOptions';
export type {
  ChartColors,
  LegendPosition,
  LegendOptions,
  BuildLineSeriesOptions,
} from './chartOptions';

// ── Label formatting ─────────────────────────────────────────────────────────
export { formatBucketLabel } from './bucketLabels';
