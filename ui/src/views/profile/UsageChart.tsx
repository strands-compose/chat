/**
 * UsageChart — ECharts bar chart for the Usage Dashboard.
 *
 * Renders either:
 *  - a single-series cost bar chart (`chartMode === 'cost'`), bars filled
 *    with `--sc-accent`, or
 *  - a stacked token bar chart (`chartMode === 'tokens'`), one series per
 *    token kind (input, output, and cache read / write when present) using
 *    distinct design-token colors.
 *
 * Chart colors are read at render time from CSS custom properties via
 * `getComputedStyle(document.documentElement)` so they update correctly when
 * the user toggles the theme. The component re-builds the ECharts option
 * object on every `useTheme()` change to ensure synchronisation.
 */

import type { ReactElement } from 'react';
import { memo, useMemo } from 'react';
import { Spinner } from '@/components';
import type { ECOption } from '@/components/charts';
import {
  axisDefaults,
  buildGrid,
  buildLegend,
  buildTimeTooltipFormatter,
  buildTooltipBase,
  costAxisLabel,
  cssVar,
  echarts,
  formatBucketLabel,
  intAxisLabel,
  ReactECharts,
  readChartColors,
} from '@/components/charts';
import { useTheme } from '@/contexts';
import type { ChartMode, Interval, MeUsagePoint } from '@/types/analytics';
import styles from './UsageChart.module.css';

// ======================
// TYPES
// ======================

interface UsageChartProps {
  data: MeUsagePoint[];
  chartMode: ChartMode;
  interval: Interval;
  isLoading: boolean;
}

// ======================
// COMPONENT
// ======================

const UsageChartComponent = ({
  data,
  chartMode,
  interval,
  isLoading,
}: UsageChartProps): ReactElement => {
  // Consume theme so the memoised option rebuilds on every theme toggle.
  const { isDark } = useTheme();

  const option = useMemo<ECOption>(() => {
    // Subscribe to theme changes so cssVar() reads updated values.
    void isDark;

    const colors = readChartColors();
    const axis = axisDefaults(colors);
    const isCost = chartMode === 'cost';

    // Input tokens: a muted blue-ish color derived from the theme.
    // Output tokens: the brand orange. Cache read / write: green / purple from
    // the data-viz palette. All remain legible on light and dark.
    const orange = cssVar('--sc-accent');
    const inputColor = cssVar('--sc-chart-primary');

    const labels = data.map((b) => formatBucketLabel(b.label, interval));

    if (isCost) {
      return {
        tooltip: {
          ...buildTooltipBase(colors),
          formatter: buildTimeTooltipFormatter(colors, true),
        },
        grid: buildGrid(false),
        xAxis: { type: 'category', data: labels, ...axis },
        yAxis: {
          type: 'value',
          ...axis,
          axisLabel: { ...axis.axisLabel, formatter: costAxisLabel },
        },
        series: [
          {
            name: 'Cost',
            type: 'bar',
            data: data.map((b) => b.cost),
            itemStyle: { color: orange },
          },
        ],
      };
    }

    // Tokens mode — stacked bar. The cache series are added only when the range
    // has cache tokens, so the legend never lists an empty series.
    const tokenSeries = [
      { name: 'Input tokens', values: data.map((b) => b.input_tokens), color: inputColor },
      { name: 'Output tokens', values: data.map((b) => b.output_tokens), color: orange },
    ];
    const cacheRead = data.map((b) => b.cache_read_input_tokens);
    const cacheWrite = data.map((b) => b.cache_write_input_tokens);
    if (cacheRead.some((v) => v > 0)) {
      tokenSeries.push({
        name: 'Cache read tokens',
        values: cacheRead,
        color: cssVar('--sc-agent-3'),
      });
    }
    if (cacheWrite.some((v) => v > 0)) {
      tokenSeries.push({
        name: 'Cache write tokens',
        values: cacheWrite,
        color: cssVar('--sc-agent-4'),
      });
    }

    return {
      tooltip: {
        ...buildTooltipBase(colors),
        formatter: buildTimeTooltipFormatter(colors, false),
      },
      legend: buildLegend({
        names: tokenSeries.map((s) => s.name),
        colors,
      }),
      grid: buildGrid(true, 'horizontal', 0),
      xAxis: { type: 'category', data: labels, ...axis },
      yAxis: {
        type: 'value',
        ...axis,
        axisLabel: { ...axis.axisLabel, formatter: intAxisLabel },
      },
      series: tokenSeries.map((s) => ({
        name: s.name,
        type: 'bar' as const,
        stack: 'tokens',
        data: s.values,
        itemStyle: { color: s.color },
      })),
    };
  }, [data, chartMode, interval, isDark]);

  // ======================
  // RENDER FUNCTIONS
  // ======================

  const renderEmpty = (): ReactElement => (
    <div className={styles.empty} role="status">
      No data for selected range
    </div>
  );

  if (isLoading) return <Spinner />;
  if (data.length === 0) return renderEmpty();

  return (
    <div className={styles.chart}>
      <ReactECharts
        echarts={echarts}
        option={option}
        style={{ height: '100%', width: '100%' }}
        notMerge
        lazyUpdate={false}
      />
    </div>
  );
};

export const UsageChart = memo(UsageChartComponent);
