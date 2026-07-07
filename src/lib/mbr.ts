export type KpiCard = {
  label: string;
  sub?: string;
  current: string;
  prior: string;
  change: string;
  direction: "up" | "down" | "neutral";
  good: boolean;
};

export type FunnelRow = {
  funnel: string;
  fe_sales: number;
  revenue: number;
  aov: number;
  visitors?: number | null;
  op_cvr?: string | null;
};

export type TestResult = {
  id: string;
  name: string;
  outcome: "WIN" | "LOSS" | "MIXED" | "FLAT" | "IN_PROGRESS";
  primary_metric?: string;
  revenue_stat?: string;
  stat_sig?: string;
};

export type Theme = {
  number: number;
  title: string;
  outcome: "WIN" | "LOSS" | "MIXED" | "FLAT";
  narrative: string;
  takeaway: string;
};

export type MbrData = {
  month: string;
  comparison_month: string;
  headline: string;
  headline_kpis: KpiCard[];
  sales_yoy: {
    total: { current: number; prior: number; change: string; direction: "up" | "down" };
    physical: { current: number; prior: number; change: string; direction: "up" | "down" };
    digital: { current: number; prior: number; change: string; direction: "up" | "down" };
  };
  physical_rollup: {
    total_revenue: string;
    prior_revenue: string;
    revenue_change: string;
    fe_sales: number;
    prior_fe_sales: number;
    aov: string;
    prior_aov: string;
    aov_change: string;
  };
  physical_funnels_current: FunnelRow[];
  physical_funnels_prior: FunnelRow[];
  physical_takeaways: string[];
  digital_rollup: {
    total_revenue: string;
    prior_revenue: string;
    revenue_change: string;
    fe_sales: number;
    prior_fe_sales: number;
    aov: string;
    prior_aov: string;
    aov_change: string;
  };
  digital_funnels_current: FunnelRow[];
  digital_funnels_prior: FunnelRow[];
  digital_takeaways: string[];
  goals: {
    tests_launched: number;
    win_rate: string;
    coc_aov: string;
    rebuy_aov: string;
  };
  actual: {
    tests_launched: number;
    win_rate: string;
    coc_aov: string;
    rebuy_aov: string;
  };
  tests_concluded: TestResult[];
  tests_in_progress: {
    id: string;
    name: string;
    key_kpi: string;
    next_steps: string;
  }[];
  themes: Theme[];
  triumphs: string[];
  challenges: string[];
  generated_at: string;
  data_source: string;
};
