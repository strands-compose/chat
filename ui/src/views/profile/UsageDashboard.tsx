/**
 * UsageDashboard — controls, chart, and data table for the usage tab.
 *
 * Left column: toolbar (date-range, interval, mode) + bar chart.
 * Right column: tabular breakdown of the server-provided points.
 *
 * All state and fetch logic live in ProfileContext so selections and data
 * survive tab switches without re-fetching.
 */

import type { ReactElement } from 'react';
import { memo, useMemo } from 'react';
import { CostBadge, DateRangePicker, Segmented, Spinner, TokenBadges } from '@/components';
import { formatBucketLabel } from '@/components/charts';
import { UsageChart } from './UsageChart';
import { useProfileContext } from './hooks/useProfileContext';
import type { ChartMode, Interval, MeUsagePoint } from '@/types/analytics';
import styles from './UsageDashboard.module.css';

// ======================
// CONSTANTS
// ======================

const INTERVALS: { value: Interval; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

const CHART_MODES: { value: ChartMode; label: string }[] = [
  { value: 'cost', label: 'Cost' },
  { value: 'tokens', label: 'Tokens' },
];

// ======================
// USAGE TABLE
// ======================

interface UsageTableProps {
  data: MeUsagePoint[];
  chartMode: ChartMode;
  interval: Interval;
  isLoading: boolean;
}

const UsageTableComponent = ({ data, chartMode, interval, isLoading }: UsageTableProps): ReactElement => {
  if (isLoading) {
    return <div className={styles.tableWrap}><Spinner /></div>;
  }

  if (data.length === 0) {
    return <div className={styles.tableEmpty}>No data for selected range</div>;
  }

  const renderTokensRows = (): ReactElement => (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.th}>Date</th>
          <th className={styles.thNum}>In</th>
          <th className={styles.thNum}>Out</th>
        </tr>
      </thead>
      <tbody>
        {data
          .filter((b) => b.input_tokens + b.output_tokens > 0)
          .map((b) => (
            <tr key={b.label} className={styles.tr}>
              <td className={styles.td}>{formatBucketLabel(b.label, interval)}</td>
              <td className={styles.tdNum}>{b.input_tokens.toLocaleString()}</td>
              <td className={styles.tdNum}>{b.output_tokens.toLocaleString()}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );

  const renderCostRows = (): ReactElement => (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.th}>Date</th>
          <th className={styles.thNum}>Cost</th>
        </tr>
      </thead>
      <tbody>
        {data
          .filter((b) => b.cost > 0)
          .map((b) => (
            <tr key={b.label} className={styles.tr}>
              <td className={styles.td}>{formatBucketLabel(b.label, interval)}</td>
              <td className={styles.tdNum}>${b.cost.toFixed(2)}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );

  return (
    <div className={styles.tableWrap}>
      {chartMode === 'tokens' ? renderTokensRows() : renderCostRows()}
    </div>
  );
};

const UsageTable = memo(UsageTableComponent);

// ======================
// COMPONENT
// ======================

const UsageDashboardComponent = (): ReactElement => {
  // ======================
  // STATE, HOOKS & REFS
  // ======================

  const {
    interval, setInterval,
    chartMode, setChartMode,
    dateRange, setDateRange,
    usagePoints: points,
    isUsageLoading: isLoading,
  } = useProfileContext();

  const totalCost = useMemo(
    () => points.reduce((sum, b) => sum + b.cost, 0),
    [points],
  );
  const totalInputTokens = useMemo(
    () => points.reduce((sum, b) => sum + b.input_tokens, 0),
    [points],
  );
  const totalOutputTokens = useMemo(
    () => points.reduce((sum, b) => sum + b.output_tokens, 0),
    [points],
  );

  // ======================
  // HANDLERS
  // ======================

  const handleRangeChange = (range: { from: Date; to: Date }): void => {
    const from = new Date(range.from);
    from.setHours(0, 0, 0, 0);
    const to = new Date(range.to);
    to.setHours(23, 59, 59, 999);
    setDateRange({ from, to });
  };

  // ======================
  // RENDER FUNCTIONS
  // ======================

  const renderToolbar = (): ReactElement => (
    <div className={styles.toolbar}>
      <span className={styles.datePickTitle}>Select timespan</span>
      <DateRangePicker from={dateRange.from} to={dateRange.to} onChange={handleRangeChange} />
      <div style={{ flexGrow: 1 }} />
      <Segmented options={INTERVALS} active={interval} onSelect={setInterval} label="Interval" />
      <Segmented options={CHART_MODES} active={chartMode} onSelect={setChartMode} label="Chart mode" />
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.body}>
        <div className={styles.chartColumn}>
          {renderToolbar()}
          <div className={styles.chartArea}>
            <UsageChart
              data={points}
              chartMode={chartMode}
              interval={interval}
              isLoading={isLoading}
            />
          </div>
        </div>

        <aside className={styles.tableColumn}>
          <div className={styles.tableSummary}>
            {chartMode === 'cost'
              ? <CostBadge cost={!isLoading ? totalCost : undefined} label="Total cost" />
              : <TokenBadges
                  inputTokens={!isLoading ? totalInputTokens : undefined}
                  outputTokens={!isLoading ? totalOutputTokens : undefined}
                  label="Total tokens"
                />
            }
          </div>
          <UsageTable
            data={points}
            chartMode={chartMode}
            interval={interval}
            isLoading={isLoading}
          />
        </aside>
      </div>
    </div>
  );
};

export const UsageDashboard = memo(UsageDashboardComponent);
