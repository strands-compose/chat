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
  buildCategoryTooltipFormatter,
  costAxisLabel,
  intAxisLabel,
  SERIES_COLORS,
} from '@/components/charts';
import type { ECOption } from '@/components/charts';
import { useBreakdownData } from './hooks/useBreakdownData';
import styles from './BreakdownChart.module.css';

// ======================
// TYPES
// ======================

type Category = 'user' | 'agent' | 'group';
type Metric = 'cost' | 'tokens' | 'hits';
type StackBy = 'none' | 'user' | 'agent' | 'group';
type TopN = 5 | 10 | 25 | 50 | 100;
type MaxSeries = 5 | 10 | 15 | 20 | 25;

// ======================
// CONSTANTS
// ======================

const CATEGORY_OPTIONS: { value: Category; label: string }[] = [
  { value: 'user', label: 'Users' },
  { value: 'agent', label: 'Agents' },
  { value: 'group', label: 'Groups' },
];

const METRIC_OPTIONS: { value: Metric; label: string }[] = [
  { value: 'cost', label: 'Cost' },
  { value: 'tokens', label: 'Tokens' },
  { value: 'hits', label: 'Hits' },
];

const STACK_BY_OPTIONS: { value: StackBy; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'user', label: 'User' },
  { value: 'agent', label: 'Agent' },
  { value: 'group', label: 'Group' },
];

const TOP_N_OPTIONS: TopN[] = [5, 10, 25, 50, 100];
const DEFAULT_MAX_ITEMS: TopN = 10;

const MAX_SERIES_OPTIONS: MaxSeries[] = [5, 10, 15, 20, 25];
const DEFAULT_MAX_SERIES: MaxSeries = 10;

// ======================
// COMPONENT
// ======================

const BreakdownChartComponent = (): ReactElement => {
  // ======================
  // STATE, HOOKS & REFS
  // ======================

  const [category, setCategory] = useState<Category>('user');
  const [metric, setMetric] = useState<Metric>('cost');
  const [stackBy, setStackBy] = useState<StackBy>('none');
  const [maxItems, setMaxItems] = useState<TopN>(DEFAULT_MAX_ITEMS);
  const [maxSeries, setMaxSeries] = useState<MaxSeries>(DEFAULT_MAX_SERIES);

  const { data, isLoading, error } = useBreakdownData(category, metric, stackBy, maxItems, maxSeries);
  const { isDark } = useTheme();

  // ======================
  // HANDLERS
  // ======================

  const handleCategoryChange = useCallback((value: Category) => setCategory(value), []);
  const handleMetricChange = useCallback((value: Metric) => setMetric(value), []);
  const handleStackByChange = useCallback((value: StackBy) => setStackBy(value), []);

  // ======================
  // CHART OPTIONS
  // ======================

  const option = useMemo<ECOption | null>(() => {
    if (!data || data.series.length === 0) return null;

    void isDark; // Subscribe to theme so cssVar() reads updated values.

    const colors = readChartColors();
    const axis = axisDefaults(colors);
    const isCost = metric === 'cost';
    const hasLegend = data.series.length > 1;

    return {
      backgroundColor: 'transparent',
      tooltip: {
        ...buildTooltipBase(colors),
        formatter: buildCategoryTooltipFormatter(colors, isCost),
      },
      legend: hasLegend
        ? buildLegend({
            names: data.series.map((s) => s.name),
            colors,
            position: 'vertical',
          })
        : undefined,
      grid: buildGrid(hasLegend, 'vertical'),
      xAxis: {
        type: 'value',
        ...axis,
        axisLabel: { ...axis.axisLabel, formatter: isCost ? costAxisLabel : intAxisLabel },
      },
      // ECharts renders category axes bottom-to-top, so reverse to show the
      // highest-value bar at the top of the chart.
      yAxis: { type: 'category', data: [...data.labels].reverse(), ...axis },
      series: data.series.map((s, i) => ({
        name: s.name,
        type: 'bar' as const,
        data: [...s.values].reverse(),
        itemStyle: { color: s.name === 'Other' ? colors.axisLabel : SERIES_COLORS[i % SERIES_COLORS.length] },
        ...(stackBy !== 'none' ? { stack: 'total' } : {}),
      })),
    } as ECOption;
  }, [data, metric, stackBy, isDark]);

  // ======================
  // RENDER FUNCTIONS
  // ======================

  const renderControls = (): ReactElement => (
    <div className={styles.controls}>
      <span className={styles.chartTitle}>Top Breakdown</span>
      <div className={styles.spacer} />
      <span className={styles.chartControl}>Select</span>
       <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button type="button" className={styles.stackTrigger}>
            <span>Top: {maxItems}</span>
            <FiChevronDown size={14} className={styles.stackChevron} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {TOP_N_OPTIONS.map((n) => (
            <DropdownMenuItem key={n} isChecked={n === maxItems} onSelect={() => setMaxItems(n)}>
              {n}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <span className={styles.chartControl}>of</span>
      <Segmented options={CATEGORY_OPTIONS} active={category} onSelect={handleCategoryChange} label="Category" />
      <span className={styles.chartControl}>by</span>
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

  const renderNote = (): ReactElement | null => {
    if (stackBy !== 'group' && category !== 'group') return null;
    return (
      <div className={styles.note}>
        Group totals may exceed the grand total because a single usage record can belong to multiple groups.
      </div>
    );
  };

  const renderChart = (): ReactElement | null => {
    if (error) return <div className={styles.error}>{error}</div>;
    if (!data || data.series.length === 0) {
      return isLoading ? null : <div className={styles.empty}>No data for selected range</div>;
    }
    if (!option) return null;
    return (
      <div className={styles.chart}>
        <ReactECharts echarts={echarts} option={option} style={{ height: '100%', width: '100%' }} notMerge lazyUpdate={false} />
      </div>
    );
  };

  return (
    <div className={styles.root}>
      {renderControls()}
      {renderNote()}
      <div className={styles.chartWrapper}>
        {isLoading && <div className={styles.overlay}><Spinner /></div>}
        {renderChart()}
      </div>
    </div>
  );
};

export const BreakdownChart = memo(BreakdownChartComponent);
