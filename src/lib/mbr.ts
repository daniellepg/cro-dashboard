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

export type PricingModelVersion = {
  version: string;
  label: string;
  date_range: string;
  description: string;
  cvr: string;
  aov: string;
  pg1_trials: number;
  trials_per_100_orders: string;
  net_roas: string;
  ad_spend: string;
  cpa: string;
  net_revenue: string;
  net_revenue_positive: boolean;
};

export type PricingModelAnalysis = {
  headline: string;
  sub: string;
  versions: PricingModelVersion[];
  projection_headline: string;
  projection_sub: string;
  v2_if_implemented: {
    orders: number;
    gross_revenue: string;
    pg1_trials: number;
    net_roas: string;
    net_revenue: string;
  };
  v3_actual: {
    orders: number;
    gross_revenue: string;
    pg1_trials: number;
    net_roas: string;
    net_revenue: string;
  };
  callout_positive: string;
  callout_watch: string;
};

export type FunnelKpiRow = {
  funnel: string;
  net_roas: string | null;
  within_kpi: boolean | null;
};

export type EstimatedImpactRow = {
  test_id: string;
  name: string;
  outcome: string;
  cvr_lift: string | null;
  monthly_orders: number | null;
  aov: string | null;
  estimated_monthly_impact: string | null;
};

export type TopFunnelCvrAov = {
  funnel: string;
  cvr: string | null;
  aov: string;
  cvr_note: string | null;
};

export type CroScorecard = {
  tests_launched: { goal: number; actual: number };
  win_rate: { goal: string; actual: string; detail: string };
  funnels_within_kpi: { kpi: string; rows: FunnelKpiRow[] };
  pg1_shopify_trials: { value: string | null; note: string };
  pg1_coc_trials: { value: string | null; note: string };
  estimated_test_impact: EstimatedImpactRow[];
  top_funnel_cvr_aov: TopFunnelCvrAov[];
  rebuy_aov_contribution: { value: string | null; note: string };
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
  cro_scorecard?: CroScorecard;
  pricing_model_analysis?: PricingModelAnalysis;
  generated_at: string;
  data_source: string;
};
