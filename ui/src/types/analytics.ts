export type ChartMode = 'cost' | 'tokens';

export type Interval = 'daily' | 'weekly' | 'monthly';

export interface DateRange {
  from: Date;
  to: Date;
}

export interface FiltersRequest {
  user_ids?: string[] | null;
  agent_ids?: string[] | null;
  group_ids?: string[] | null;
}

export interface UserRef {
  id: string;
  username: string;
}

export interface AgentRef {
  id: string;
  name: string;
}

export interface GroupRef {
  id: string;
  name: string;
}

export interface FiltersOut {
  users: UserRef[];
  agents: AgentRef[];
  groups: GroupRef[];
}

export interface SummaryRequest {
  from: string;
  to: string;
  filters?: FiltersRequest | null;
}

export interface SummaryOut {
  total_cost: number;
  input_tokens: number;
  output_tokens: number;
  hits: number;
  active_users: number;
}

export interface TimelineRequest {
  from: string;
  to: string;
  interval: Interval;
  metric: 'cost' | 'tokens' | 'hits';
  stack_by: 'none' | 'user' | 'agent' | 'group';
  filters?: FiltersRequest | null;
  max_series?: number;
}

export interface SeriesItem {
  name: string;
  data: number[];
}

export interface TimelineOut {
  interval: string;
  metric: string;
  labels: string[];
  series: SeriesItem[];
}

export interface BreakdownRequest {
  from: string;
  to: string;
  category: 'user' | 'agent' | 'group';
  stack_by: 'none' | 'user' | 'agent' | 'group';
  metric: 'cost' | 'tokens' | 'hits';
  filters?: FiltersRequest | null;
  max_items?: number;
  max_series?: number;
}

export interface BreakdownSeriesItem {
  name: string;
  values: number[];
}

export interface BreakdownOut {
  metric: string;
  category: string;
  labels: string[];
  series: BreakdownSeriesItem[];
}

export interface BudgetItemOut {
  user_id: string;
  username: string;
  spend: number;
  budget: number;
  pct_used: number;
  status: 'ok' | 'warn' | 'danger';
  is_over: boolean;
}

export interface MeUsagePoint {
  label: string;
  cost: number;
  input_tokens: number;
  output_tokens: number;
}

export interface MeUsageOut {
  interval: string;
  points: MeUsagePoint[];
}
