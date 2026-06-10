const KPIS = [
  { key: "tests_launched", label: "Tests launched", source: "ClickUp · tests with start_date in month" },
  { key: "winning_pct", label: "% of winning tests", source: "ClickUp · result custom field" },
  { key: "estimated_impact", label: "Est. $ impact per test", source: "Test log + Domo baseline" },
  { key: "paid_within_kpi", label: "Paid funnels within KPI", source: "Domo · ROAS / CPA per funnel" },
  { key: "pg1_shopify_lift", label: "% PG1 Shopify trial lift", source: "Shopify trials + test attribution" },
  { key: "pg1_coc_lift", label: "% PG1 CoC trial lift", source: "Checkout Champ trials + attribution" },
  { key: "cvr_aov_top8", label: "CVR & AOV — top 8 funnels", source: "Domo · physical + digital split" },
  { key: "rebuy_aov", label: "Re-Buy contribution to AOV", source: "Shopify Re-Buy (post-migration)" },
];

function currentMonth() {
  const d = new Date();
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export default function KPIsPage() {
  return (
    <div>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <div className="text-[10px] tracking-[0.3em] text-[#c9a55e] uppercase font-semibold mb-2">
            05 · Monthly Board
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">Key KPIs</h1>
        </div>
        <div className="text-sm">
          <label className="text-[#8b95a7] mr-2 text-xs uppercase tracking-wider">Month</label>
          <select
            disabled
            className="rounded-md bg-white/[0.04] border border-white/10 px-3 py-1.5 text-sm"
          >
            <option>{currentMonth()}</option>
          </select>
        </div>
      </div>

      <div className="rounded-lg border border-[#c9a55e]/30 bg-[#c9a55e]/[0.06] p-4 text-sm mb-8">
        <div className="font-medium text-[#c9a55e]">Needs Domo + test-log wiring</div>
        <p className="text-[#c9a55e]/80 mt-1">
          Each tile shows its metric definition + source. Values populate once data is connected.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {KPIS.map((k) => (
          <div
            key={k.key}
            className="rounded-lg border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent p-5 min-h-36"
          >
            <div className="text-[10px] uppercase tracking-[0.18em] text-[#8b95a7] leading-snug">
              {k.label}
            </div>
            <div className="text-4xl font-semibold mt-3 text-[#5a6478]">—</div>
            <div className="text-[10px] text-[#5a6478] mt-3 leading-snug">{k.source}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
