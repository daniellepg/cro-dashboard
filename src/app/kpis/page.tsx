const KPIS = [
  { key: "tests_launched", label: "Tests launched", source: "ClickUp (count of tests with start_date in month)" },
  { key: "winning_pct", label: "% of winning tests", source: "ClickUp (result custom field)" },
  { key: "estimated_impact", label: "Estimated $ impact (per test)", source: "Test log + Domo baseline revenue" },
  { key: "paid_within_kpi", label: "Paid funnels within KPI", source: "Domo (ROAS / CPA per funnel)" },
  { key: "pg1_shopify_lift", label: "% increase PG1 Shopify trials from testing", source: "Shopify trials + test attribution" },
  { key: "pg1_coc_lift", label: "% increase PG1 CoC trials from testing", source: "Checkout Champ trials + test attribution" },
  { key: "cvr_aov_top8", label: "CVR & AOV — top 8 funnels", source: "Domo · split by physical / digital" },
  { key: "rebuy_aov", label: "Re-Buy contribution to AOV", source: "Shopify Re-Buy app (post-migration)" },
];

function currentMonth() {
  const d = new Date();
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export default function KPIsPage() {
  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Key KPIs</h1>
          <p className="text-sm text-slate-400 mt-1">Monthly KPI board</p>
        </div>
        <div className="text-sm">
          <label className="text-slate-400 mr-2">Month</label>
          <select
            disabled
            className="rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-sm"
          >
            <option>{currentMonth()}</option>
          </select>
        </div>
      </div>

      <div className="rounded-lg border border-amber-400/40 bg-amber-400/10 p-4 text-sm mb-6">
        <div className="font-medium text-amber-300">Needs Domo + test log connection</div>
        <p className="text-amber-200/80 mt-1">
          Each tile below shows the metric definition + data source. Once the data sources are
          wired, values populate automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {KPIS.map((k) => (
          <div
            key={k.key}
            className="rounded-lg border border-slate-800 bg-slate-900/50 p-4 min-h-32"
          >
            <div className="text-xs uppercase tracking-wide text-slate-400">{k.label}</div>
            <div className="text-3xl font-semibold mt-2 text-slate-600">—</div>
            <div className="text-[11px] text-slate-500 mt-2 leading-snug">{k.source}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
