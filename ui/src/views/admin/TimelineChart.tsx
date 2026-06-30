import type { ReactElement } from 'react';
import { memo, useState, useCallback, useMemo } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { useTheme } from '@/contexts';
import {
  Spinner,
  Segmented,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components';
import {
  echarts,
  ReactECharts,
  readChartColors,
  axisDefaults,
  buildGrid,
  buildLegend,
  buildTooltipBase,
  buildTimeTooltipFormatter,
  costAxisLabel,
  intAxisLabel,
  SERIES_COLORS,
  formatBucketLabel,
} from '@/components/charts';
import type { ECOption } from '@/components/charts';
import type { Interval, TimelineOut } from '@/types/analytics';
import { useTimelineData } from './hooks/useTimelineData';
import styles from './TimelineChart.module.css';

// ======================
// CONSTANTS
// ======================

const INTERVAL_OPTIONS: { value: Interval; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

const METRIC_OPTIONS: { value: 'cost' | 'tokens' | 'hits'; label: string }[] = [
  { value: 'cost', label: 'Cost' },
  { value: 'tokens', label: 'Tokens' },
  { value: 'hits', label: 'Hits' },
];

const STACK_BY_OPTIONS: { value: 'none' | 'user' | 'agent' | 'group'; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'user', label: 'User' },
  { value: 'agent', label: 'Agent' },
  { value: 'group', label: 'Group' },
];

const MAX_SERIES_OPTIONS = [5, 10, 15, 20, 25] as const;
type MaxSeries = (typeof MAX_SERIES_OPTIONS)[number];
const DEFAULT_MAX_SERIES: MaxSeries = 10;

// ======================
// HELPERS
// ======================

const isAllZero = (data: TimelineOut): boolean =>
  data.series.every((s) => s.data.every((v) => v === 0));

// ======================
// COMPONENT
// ======================

const TimelineChartComponent = (): ReactElement => {
  // ======================
  // STATE, HOOKS & REFS
  // ======================

  const [interval, setInterval] = useState<Interval>('daily');
  const [metric, setMetric] = useState<'cost' | 'tokens' | 'hits'>('cost');
  const [stackBy, setStackBy] = useState<'none' | 'user' | 'agent' | 'group'>('none');
  const [maxSeries, setMaxSeries] = useState<MaxSeries>(DEFAULT_MAX_SERIES);

  const { data, isLoading, error } = useTimelineData(interval, metric, stackBy, maxSeries);
  const { isDark } = useTheme();

  // ======================
  // HANDLERS
  // ======================

  const handleIntervalChange = useCallback((value: Interval) => setInterval(value), []);
  const handleMetricChange = useCallback((value: 'cost' | 'tokens' | 'hits') => setMetric(value), []);
  const handleStackByChange = useCallback((value: 'none' | 'user' | 'agent' | 'group') => setStackBy(value), []);

  // ======================
  // CHART OPTIONS
  // ======================

  const option = useMemo<ECOption | null>(() => {
    if (!data || data.series.length === 0 || isAllZero(data)) return null;

    void isDark; // Subscribe to theme so cssVar() reads updated values.

    const colors = readChartColors();
    const axis = axisDefaults(colors);
    const isCost = metric === 'cost';
    const hasLegend = data.series.length > 1;
    const labels = data.labels.map((l) => formatBucketLabel(l, interval));

    return {
      backgroundColor: 'transparent',
      tooltip: {
        ...buildTooltipBase(colors),
        formatter: buildTimeTooltipFormatter(colors, isCost),
      },
      legend: hasLegend
        ? buildLegend({
            names: data.series.map((s) => s.name),
            colors,
            position: 'vertical',
          })
        : undefined,
      grid: buildGrid(hasLegend, 'vertical', 10),
      xAxis: { type: 'category', data: labels, ...axis },
      yAxis: {
        type: 'value',
        ...axis,
        axisLabel: { ...axis.axisLabel, formatter: isCost ? costAxisLabel : intAxisLabel },
      },
      series: data.series.map((s, i) => ({
        name: s.name,
        type: 'bar' as const,
        data: s.data,
        itemStyle: { color: s.name === 'Other' ? colors.axisLabel : SERIES_COLORS[i % SERIES_COLORS.length] },
        ...(stackBy !== 'none' ? { stack: 'total' } : {}),
      })),
    } as ECOption;
  }, [data, interval, metric, stackBy, isDark]);

  // ======================
  // RENDER FUNCTIONS
  // ======================

  const renderControls = (): ReactElement => (
    <div className={styles.controls}>
      <span className={styles.chartTitle}>Usage Over Time</span>
      <div className={styles.spacer} />
      <Segmented options={INTERVAL_OPTIONS} active={interval} onSelect={handleIntervalChange} label="Interval" />
      <Segmented options={METRIC_OPTIONS} active={metric} onSelect={handleMetricChange} label="Metric" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button type="button" className={styles.stackTrigger}>
            <span>Stack by: {STACK_BY_OPTIONS.find((o) => o.value === stackBy)?.label ?? 'None'}</span>
            <FiChevronDown size={14} className={styles.stackChevron} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {STACK_BY_OPTIONS.map((opt) => (
            <DropdownMenuItem key={opt.value} isChecked={opt.value === stackBy} onSelect={() => handleStackByChange(opt.value)}>
              {opt.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {stackBy !== 'none' && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" className={styles.stackTrigger}>
              <span>Max groups: {maxSeries}</span>
              <FiChevronDown size={14} className={styles.stackChevron} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {MAX_SERIES_OPTIONS.map((n) => (
              <DropdownMenuItem key={n} isChecked={n === maxSeries} onSelect={() => setMaxSeries(n)}>
                {n}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );

  const renderChart = (): ReactElement | null => {
    if (error) return <div className={styles.error}>{error}</div>;
    if (!data || data.series.length === 0 || isAllZero(data)) {
      return isLoading ? null : <div className={styles.empty}>No data for selected range</div>;
    }
    if (!option) return null;
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

  return (
    <div className={styles.root}>
      {renderControls()}
      <div className={styles.chartWrapper}>
        {isLoading && <div className={styles.overlay}><Spinner /></div>}
        {renderChart()}
      </div>
    </div>
  );
};

export const TimelineChart = memo(TimelineChartComponent);
