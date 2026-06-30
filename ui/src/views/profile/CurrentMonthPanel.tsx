/**
 * CurrentMonthPanel — budget progress bar and two compact daily line charts
 * for the current calendar month.
 *
 * Reads `user.budget` and `user.usage` directly from `useAuth()`. Receives
 * pre-bucketed `points` from the parent (server-side aggregation).
 *
 * Chart colors are read at render time from CSS custom properties so they
 * update automatically when the user toggles the color theme.
 */

import type { ReactElement } from 'react';
import { memo, useMemo } from 'react';
import { useAuth } from '@/contexts';
import { useTheme } from '@/contexts';
import { formatCost } from '@/services/utils';
import { Spinner, ProgressBar } from '@/components';
import {
  echarts,
  ReactECharts,
  cssVar,
  readChartColors,
  buildTooltipBase,
  buildTimeTooltipFormatter,
  buildLineSeries,
  formatBucketLabel,
} from '@/components/charts';
import type { ECOption } from '@/components/charts';
import type { MeUsagePoint } from '@/types/analytics';
import styles from './CurrentMonthPanel.module.css';

// ======================
// TYPES
// ======================

interface CurrentMonthPanelProps {
  /** Pre-bucketed usage points for the current month from the server. */
  points: MeUsagePoint[];
  isLoading: boolean;
}

// ======================
// HELPERS
// ======================

/** Build a minimal ECharts line chart option for a compact sparkline. */
function buildLineOption(
  xData: string[],
  yData: number[],
  lineColor: string,
  areaColor: string,
  isCost: boolean,
): ECOption {
  // Colors for axes — use tertiary tokens for the subtler panel style.
  const axisColor = cssVar('--sc-border-tertiary');
  const labelColor = cssVar('--sc-text-tertiary');
  const colors = {
    ...readChartColors(),
    axisLine: axisColor,
  };

  return {
    backgroundColor: 'transparent',
    grid: { left: 4, right: 4, top: 8, bottom: 5, containLabel: true },
    xAxis: {
      type: 'category',
      data: xData,
      axisLine: { lineStyle: { color: axisColor } },
      axisTick: { show: false },
      axisLabel: {
        fontSize: 10,
        color: labelColor,
        interval: 'auto',
        hideOverlap: true,
      },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        fontSize: 10,
        color: labelColor,
        ...(isCost && { formatter: (v: number) => `$${v.toFixed(2)}` }),
      },
      splitLine: { lineStyle: { color: axisColor, type: 'dashed' } },
      minInterval: 1,
    },
    series: [
      buildLineSeries({ data: yData, lineColor, areaColor }),
    ],
    tooltip: {
      ...buildTooltipBase(colors),
      formatter: buildTimeTooltipFormatter(colors, isCost),
    },
  };
}

// ======================
// COMPONENT
// ======================

const CurrentMonthPanelComponent = ({
  points,
  isLoading,
}: CurrentMonthPanelProps): ReactElement => {
  const { user } = useAuth();
  // Subscribe to theme changes so chart options are re-derived on toggle.
  const { isDark } = useTheme();

  const budget = user?.budget ?? null;
  const usage = user?.usage ?? 0;

  // Build x-axis labels — human-readable daily format ("23 Jun 2026")
  const xLabels = useMemo(
    () => points.map((p) => formatBucketLabel(p.label, 'daily')),
    [points],
  );

  const tokenSeries = useMemo(
    () => points.map((p) => p.input_tokens + p.output_tokens),
    [points],
  );

  const costSeries = useMemo(
    () => points.map((p) => p.cost),
    [points],
  );

  // Re-derive chart options whenever theme changes (isDark drives recalculation).
  const tokensOption = useMemo<ECOption>(
    () =>
      buildLineOption(
        xLabels,
        tokenSeries,
        cssVar('--aws-orange'),
        cssVar('--aws-orange'),
        false,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [xLabels, tokenSeries, isDark],
  );

  const costOption = useMemo<ECOption>(
    () => {
      const okColor = cssVar('--sc-status-ok');
      return buildLineOption(xLabels, costSeries, okColor, okColor, true);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [xLabels, costSeries, isDark],
  );

  const isEmpty = points.length === 0;

  // ======================
  // RENDER
  // ======================

  return (
    <div className={styles.container}>
      {/* ── Budget section ── */}
      <div className={styles.budgetSection}>
        <h4 className={styles.sectionTitle}>This Month Usage</h4>

        <div className={styles.spendRow}>
          <span className={styles.spendLabel}>
            {formatCost(usage)}
          </span>
          <span className={styles.budgetLabel}>
            {budget ? `/ ${formatCost(budget)}` : '/ no budget'}
          </span>
        </div>

        <ProgressBar
          value={usage}
          max={budget ?? 0}
          ariaLabel="Budget usage"
        />
      </div>

      {/* ── Daily tokens chart ── */}
      <div className={styles.chartSection}>
        <h4 className={styles.chartTitle}>Daily Tokens</h4>
        {isLoading ? (
          <Spinner />
        ) : isEmpty ? (
          <div className={styles.noData}>No data</div>
        ) : (
          <ReactECharts
            echarts={echarts}
            option={tokensOption}
            className={styles.chart}
            style={{ height: '100%', width: '100%' }}
            notMerge
          />
        )}
      </div>

      {/* ── Daily cost chart ── */}
      <div className={styles.chartSection}>
        <h4 className={styles.chartTitle}>Daily Cost</h4>
        {isLoading ? (
          <Spinner />
        ) : isEmpty ? (
          <div className={styles.noData}>No data</div>
        ) : (
          <ReactECharts
            echarts={echarts}
            option={costOption}
            className={styles.chart}
            style={{ height: '100%', width: '100%' }}
            notMerge
          />
        )}
      </div>
    </div>
  );
};

export const CurrentMonthPanel = memo(CurrentMonthPanelComponent);
