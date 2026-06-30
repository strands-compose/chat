/**
 * UsageChart — ECharts bar chart for the Usage Dashboard.
 *
 * Renders either:
 *  - a single-series cost bar chart (`chartMode === 'cost'`), bars filled
 *    with `--aws-orange`, or
 *  - a stacked two-series token bar chart (`chartMode === 'tokens'`), one
 *    series per token direction using distinct design-token colors.
 *
 * Chart colors are read at render time from CSS custom properties via
 * `getComputedStyle(document.documentElement)` so they update correctly when
 * the user toggles the theme. The component re-builds the ECharts option
 * object on every `useTheme()` change to ensure synchronisation.
 */

import type { ReactElement } from 'react';
import { memo, useMemo } from 'react';
import { useTheme } from '@/contexts';
import { Spinner } from '@/components';
import { echarts, ReactECharts } from '@/components/charts';
import type { ECOption } from '@/components/charts';
import {
  cssVar,
  readChartColors,
  axisDefaults,
  buildGrid,
  buildLegend,
  buildTooltipBase,
  buildTimeTooltipFormatter,
  costAxisLabel,
  intAxisLabel,
  formatBucketLabel,
} from '@/components/charts';
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

const UsageChartComponent = ({ data, chartMode, interval, isLoading }: UsageChartProps): ReactElement => {
  // Consume theme so the memoised option rebuilds on every theme toggle.
  const { isDark } = useTheme();

  const option = useMemo<ECOption>(() => {
    // Subscribe to theme changes so cssVar() reads updated values.
    void isDark;

    const colors = readChartColors();
    const axis = axisDefaults(colors);
    const isCost = chartMode === 'cost';

    // Input tokens: a muted blue-ish color derived from the theme.
    // Output tokens: the brand orange. Both remain legible on light and dark.
    const orange = cssVar('--aws-orange');
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

    // Tokens mode — stacked bar.
    return {
      tooltip: {
        ...buildTooltipBase(colors),
        formatter: buildTimeTooltipFormatter(colors, false),
      },
      legend: buildLegend({
        names: ['Input tokens', 'Output tokens'],
        colors,
      }),
      grid: buildGrid(true, 'horizontal', 0),
      xAxis: { type: 'category', data: labels, ...axis },
      yAxis: {
        type: 'value',
        ...axis,
        axisLabel: { ...axis.axisLabel, formatter: intAxisLabel },
      },
      series: [
        {
          name: 'Input tokens',
          type: 'bar',
          stack: 'tokens',
          data: data.map((b) => b.input_tokens),
          itemStyle: { color: inputColor },
        },
        {
          name: 'Output tokens',
          type: 'bar',
          stack: 'tokens',
          data: data.map((b) => b.output_tokens),
          itemStyle: { color: orange },
        },
      ],
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
