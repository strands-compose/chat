/**
 * Shared ECharts option builders.
 *
 * Centralises repeated axis, tooltip, grid, and legend configuration so each
 * chart only declares what is unique to it. All helpers read CSS custom
 * properties at call time, keeping them in sync with the active theme.
 *
 * Usage pattern inside a chart's useMemo:
 *
 *   void isDark; // subscribe to theme changes
 *   const colors = readChartColors();
 *   const axis = axisDefaults(colors);
 *   …
 */

import type { TooltipComponentFormatterCallbackParams } from 'echarts';

// ======================
// COLORS
// ======================

export interface ChartColors {
  axisLabel: string;
  axisLine: string;
  tooltipBg: string;
  tooltipBorder: string;
  tooltipText: string;
}

/** Read a CSS custom property value from the document root at call time. */
export const cssVar = (name: string): string =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/** Snapshot all shared chart colors from the current CSS custom properties. */
export const readChartColors = (): ChartColors => ({
  axisLabel: cssVar('--sc-text-tertiary'),
  axisLine: cssVar('--sc-border-secondary'),
  tooltipBg: cssVar('--sc-bg-secondary'),
  tooltipBorder: cssVar('--sc-border-primary'),
  tooltipText: cssVar('--sc-text-primary'),
});

// ======================
// AXIS
// ======================

/** Shared axis config: line colour, no ticks, label colour, split line. */
export const axisDefaults = (colors: ChartColors) => ({
  axisLine: { lineStyle: { color: colors.axisLine } },
  axisTick: { show: false },
  axisLabel: { color: colors.axisLabel, fontSize: 11 },
  splitLine: { lineStyle: { color: colors.axisLine } },
});

/** Formats an integer with locale-aware thousand separators (comma). */
export const formatInt = (v: number): string => Math.round(v).toLocaleString();

/** Axis value formatter for cost metrics — adds a "$" prefix. */
export const costAxisLabel = (v: number): string => `$${v.toFixed(2)}`;

/** Axis value formatter for integer metrics (tokens, hits). */
export const intAxisLabel = (v: number): string => formatInt(v);

// ======================
// GRID
// ======================

/** Legend position orientation type. */
export type LegendPosition = 'horizontal' | 'vertical';

/**
 * Right padding (px) reserved for a vertical legend.
 * Must stay in sync with the legend's own `right` offset + item widths.
 */
export const VERTICAL_LEGEND_RIGHT_PAD = 150;

/**
 * Standard chart grid.
 *
 * - Horizontal legend: reserves space at the top (top=30).
 * - Vertical legend: reserves space on the right (right=VERTICAL_LEGEND_RIGHT_PAD).
 * - No legend: compact defaults.
 */
export const buildGrid = (
  hasLegend: boolean,
  legendPosition: LegendPosition = 'horizontal',
  rightPad = 10,
  hasDataZoom = false
) => ({
  top: hasLegend && legendPosition === 'horizontal' ? 30 : 10,
  right: hasLegend && legendPosition === 'vertical' ? VERTICAL_LEGEND_RIGHT_PAD : rightPad,
  bottom: hasDataZoom ? 65 : 2,
  left: 10,
  containLabel: true,
});

// ======================
// LEGEND
// ======================

/** Maximum characters before a legend label is truncated with ellipsis. */
const LEGEND_LABEL_MAX_LEN = 15;

/** Truncates a string to maxLength, appending "…" if it was cut. */
const truncateLegendLabel = (value: string, maxLength = LEGEND_LABEL_MAX_LEN): string =>
  value.length > maxLength ? `${value.slice(0, maxLength)}…` : value;

export interface LegendOptions {
  names: string[];
  colors: ChartColors;
  position?: LegendPosition;
}

/**
 * Standard legend for named series.
 *
 * - `horizontal` (default): top-right inline; no scrolling needed.
 * - `vertical`: scrollable right-side panel, outside the plot area.
 *   Long labels are truncated to keep the panel width predictable.
 *   Pair with `buildGrid(hasLegend, 'vertical')` to reserve the matching space.
 */
export const buildLegend = ({
  names,
  colors,
  position = 'horizontal',
}: LegendOptions) => {
  const baseConfig = {
    data: names,
    textStyle: { color: colors.axisLabel, fontSize: 12 },
    icon: 'rect' as const,
    itemWidth: 10,
    itemHeight: 10,
  };

  if (position === 'vertical') {
    return {
      ...baseConfig,
      type: 'scroll' as const,
      orient: 'vertical' as const,
      right: 0,
      top: 0,
      itemGap: 10,
      formatter: (name: string) => truncateLegendLabel(name),
      tooltip: { show: true }, // Full name on hover
    };
  }

  // Horizontal legend: top-right, inline (default).
  return {
    ...baseConfig,
    top: 0,
    right: 0,
  };
};

// ======================
// SERIES
// ======================

/** Palette for multi-series charts. */
export const SERIES_COLORS = [
  '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de',
  '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc', '#5b8dee',
] as const;

// ======================
// LINE SERIES
// ======================

export interface BuildLineSeriesOptions {
  /** Series data values. */
  data: number[];
  /** Stroke and symbol colour. */
  lineColor: string;
  /** Area-fill base colour (opacity applied separately). */
  areaColor: string;
  /** Optional series name — required when the chart has a legend. */
  name?: string;
  /** Stroke width in pixels. Defaults to 2. */
  lineWidth?: number;
  /** Symbol (dot) size in pixels. Defaults to 6. */
  symbolSize?: number;
  /** Whether to smooth the line. Defaults to false. */
  smooth?: boolean;
  /** Whether to show symbols on data points. Defaults to false. */
  showSymbol?: boolean;
  /** Area fill opacity (0-1). Defaults to 0.15. */
  areaOpacity?: number;
}

/**
 * Build a standard ECharts line-series descriptor.
 *
 * Encapsulates the shared style decisions (stroke width, area fill,
 * hover emphasis) so each line chart only has to supply colour and data.
 */
export const buildLineSeries = ({
  data,
  lineColor,
  areaColor,
  name,
  lineWidth = 2,
  symbolSize = 6,
  smooth = false,
  showSymbol = false,
  areaOpacity = 0.15,
}: BuildLineSeriesOptions) => ({
  type: 'line' as const,
  ...(name !== undefined && { name }),
  data,
  smooth,
  showSymbol,
  symbolSize,
  itemStyle: { color: lineColor },
  lineStyle: { color: lineColor, width: lineWidth },
  areaStyle: { color: areaColor, opacity: areaOpacity },
  emphasis: {
    scale: false,
    itemStyle: { color: lineColor, borderColor: lineColor, borderWidth: 2 },
  },
});

// ======================
// TOOLTIP
// ======================

/** Base tooltip config (no formatter). Compose with a formatter per chart. */
export const buildTooltipBase = (colors: ChartColors) => ({
  trigger: 'axis' as const,
  backgroundColor: colors.tooltipBg,
  borderColor: colors.tooltipBorder,
  textStyle: { color: colors.tooltipText },
});

// Internal helper to normalise the variadic params ECharts passes to formatters.
type AnyParam = {
  name: string;
  seriesName: string;
  value: unknown;
  color: unknown;
};

const toParamList = (raw: TooltipComponentFormatterCallbackParams): AnyParam[] =>
  (Array.isArray(raw) ? raw : [raw]) as AnyParam[];

/**
 * Tooltip formatter for **time-axis** charts (x-axis = date category).
 *
 * Renders a date header (the x-axis label) above each series value.
 * Cost metrics are prefixed with "$"; all others use locale-formatted integers.
 */
export const buildTimeTooltipFormatter = (
  colors: ChartColors,
  isCost: boolean,
) => (raw: TooltipComponentFormatterCallbackParams): string => {
  const list = toParamList(raw);
  if (list.length === 0) return '';

  const date = list[0].name;
  const header = `<span style="color:${colors.axisLabel};font-size:11px">${date}</span>`;

  const rows = list.map((p) => {
    const val = Number(p.value);
    const valStr = isCost ? `${val.toFixed(2)}` : formatInt(val);
    if (list.length === 1) {
      return `<b style="color:${colors.tooltipText}">${valStr}</b>`;
    }
    return (
      `<span style="color:${String(p.color)}">● </span>` +
      `<span style="color:${colors.tooltipText}">${p.seriesName}: <b>${valStr}</b></span>`
    );
  });

  return `${header}<br/>${rows.join('<br/>')}`;
};

/**
 * Tooltip formatter for **category-axis** charts (y-axis = label, x = value).
 *
 * Renders the category label (e.g. a username) as a header above each series
 * value. Cost metrics are prefixed with "$".
 */
export const buildCategoryTooltipFormatter = (
  colors: ChartColors,
  isCost: boolean,
) => (raw: TooltipComponentFormatterCallbackParams): string => {
  const list = toParamList(raw);
  if (list.length === 0) return '';

  const category = list[0].name;
  const header = `<span style="color:${colors.axisLabel};font-size:11px">${category}</span>`;

  const rows = list.map((p) => {
    const val = Number(p.value);
    const valStr = isCost ? `${val.toFixed(2)}` : formatInt(val);
    if (list.length === 1) {
      return `<b style="color:${colors.tooltipText}">${valStr}</b>`;
    }
    return (
      `<span style="color:${String(p.color)}">● </span>` +
      `<span style="color:${colors.tooltipText}">${p.seriesName}: <b>${valStr}</b></span>`
    );
  });

  return `${header}<br/>${rows.join('<br/>')}`;
};
