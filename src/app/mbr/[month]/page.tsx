import { notFound } from "next/navigation";
import type { MbrData, Theme, TestResult, KpiCard, PricingModelVersion, PricingModelAnalysis, CroScorecard } from "@/lib/mbr";

import jun2026 from "@/data/mbr/2026-06.json";

const DATA_MAP: Record<string, MbrData> = {
  "2026-06": jun2026 as MbrData,
};

export async function generateStaticParams() {
  return Object.keys(DATA_MAP).map((month) => ({ month }));
}

const fmt = {
  currency: (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n),
  number: (n: number) => new Intl.NumberFormat("en-US").format(n),
};

const OUTCOME_STYLES: Record<string, string> = {
  WIN: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  LOSS: "text-red-400 bg-red-400/10 border-red-400/20",
  MIXED: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  FLAT: "text-[#8b95a7] bg-white/[0.04] border-white/[0.08]",
  IN_PROGRESS: "text-blue-400 bg-blue-400/10 border-blue-400/20",
};

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="text-[10px] tracking-[0.3em] text-[#c9a55e] uppercase font-semibold whitespace-nowrap">
        {label}
      </div>
      <div className="flex-1 h-px bg-white/[0.06]" />
    </div>
  );
}

function KpiTile({ k }: { k: KpiCard }) {
  const changeColor = k.good ? "text-emerald-400" : "text-red-400";
  return (
    <div className="rounded-lg border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent p-4">
      <div className="text-[10px] uppercase tracking-[0.18em] text-[#8b95a7] leading-snug mb-1">{k.label}</div>
      {k.sub && <div className="text-[10px] text-[#5a6478] mb-2">{k.sub}</div>}
      <div className="text-2xl font-semibold tracking-tight text-[#f4f5f7]">{k.current}</div>
      <div className="flex items-center gap-2 mt-1.5">
        <span className={`text-xs font-medium ${changeColor}`}>{k.change}</span>
        <span className="text-[10px] text-[#5a6478]">vs {k.prior}</span>
      </div>
    </div>
  );
}

function OutcomeBadge({ outcome }: { outcome: string }) {
  return (
    <span className={`text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded border ${OUTCOME_STYLES[outcome] ?? OUTCOME_STYLES.FLAT}`}>
      {outcome.replace("_", " ")}
    </span>
  );
}

function ThemeCard({ t }: { t: Theme }) {
  return (
    <div className="rounded-lg border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#5a6478] font-mono">{String(t.number).padStart(2, "0")}</span>
          <h3 className="text-sm font-medium leading-snug">{t.title}</h3>
        </div>
        <OutcomeBadge outcome={t.outcome} />
      </div>
      <p className="text-xs text-[#8b95a7] leading-relaxed mb-3">{t.narrative}</p>
      <div className="border-t border-white/[0.06] pt-3">
        <span className="text-[10px] uppercase tracking-widest text-[#c9a55e] font-semibold">Takeaway </span>
        <span className="text-xs text-[#8b95a7]">{t.takeaway}</span>
      </div>
    </div>
  );
}

function CroScorecardSection({ sc }: { sc: CroScorecard }) {
  const testsAbove = sc.tests_launched.actual >= sc.tests_launched.goal;
  const winAbove   = parseFloat(sc.win_rate.actual) >= parseFloat(sc.win_rate.goal);
  const kpiRows    = sc.funnels_within_kpi.rows;
  const confirmed  = kpiRows.filter((r) => r.within_kpi === true).length;
  const total      = kpiRows.filter((r) => r.within_kpi !== null).length;

  return (
    <section>
      <SectionHeader label="CRO Scorecard" />

      {/* Big-3 goals */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {/* Tests launched */}
        <div className="rounded-lg border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent p-5">
          <div className="text-[10px] uppercase tracking-[0.22em] text-[#8b95a7] font-semibold mb-1">Tests Launched</div>
          <div className="text-[10px] text-[#5a6478] mb-3">Goal: {sc.tests_launched.goal}</div>
          <div className="text-3xl font-semibold tracking-tight text-[#f4f5f7]">{sc.tests_launched.actual}</div>
          <div className={`text-xs font-medium mt-1.5 ${testsAbove ? "text-emerald-400" : "text-red-400"}`}>
            {testsAbove ? `+${sc.tests_launched.actual - sc.tests_launched.goal} above goal` : `${sc.tests_launched.actual - sc.tests_launched.goal} below goal`}
          </div>
        </div>

        {/* Win rate */}
        <div className="rounded-lg border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent p-5">
          <div className="text-[10px] uppercase tracking-[0.22em] text-[#8b95a7] font-semibold mb-1">Win Rate</div>
          <div className="text-[10px] text-[#5a6478] mb-3">Goal: {sc.win_rate.goal}</div>
          <div className="text-3xl font-semibold tracking-tight text-[#f4f5f7]">{sc.win_rate.actual}</div>
          <div className={`text-xs font-medium mt-1.5 ${winAbove ? "text-emerald-400" : "text-red-400"}`}>
            {sc.win_rate.detail}
          </div>
        </div>

        {/* Funnels within KPI */}
        <div className="rounded-lg border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent p-5">
          <div className="text-[10px] uppercase tracking-[0.22em] text-[#8b95a7] font-semibold mb-1">Funnels Within KPI</div>
          <div className="text-[10px] text-[#5a6478] mb-3">KPI: {sc.funnels_within_kpi.kpi}</div>
          <div className="text-3xl font-semibold tracking-tight text-[#f4f5f7]">
            {confirmed} <span className="text-base text-[#5a6478] font-normal">/ {total} confirmed</span>
          </div>
          <div className="text-[10px] text-[#5a6478] mt-1.5">{kpiRows.filter((r) => r.within_kpi === null).length} funnels pending Ad Perf pull</div>
        </div>
      </div>

      {/* Funnel KPI table */}
      <div className="overflow-x-auto rounded-lg border border-white/[0.08] mb-6">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {["Funnel", "Net ROAS", `vs ${sc.funnels_within_kpi.kpi} target`].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[10px] uppercase tracking-[0.18em] text-[#5a6478] font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {kpiRows.map((r) => (
              <tr key={r.funnel} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-3 font-medium uppercase tracking-wide text-[#f4f5f7]">{r.funnel}</td>
                <td className="px-4 py-3 text-[#8b95a7]">{r.net_roas ?? "—"}</td>
                <td className="px-4 py-3">
                  {r.within_kpi === null
                    ? <span className="text-[10px] text-[#5a6478]">⚠ pending</span>
                    : r.within_kpi
                      ? <span className="text-emerald-400 text-[10px] font-semibold uppercase tracking-widest">✓ Within KPI</span>
                      : <span className="text-red-400 text-[10px] font-semibold uppercase tracking-widest">✗ Below KPI</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Top 6 funnel CVR & AOV */}
      <div className="mb-6">
        <div className="text-[10px] uppercase tracking-[0.22em] text-[#5a6478] font-semibold mb-3">CVR &amp; AOV — Top 6 Funnels</div>
        <div className="overflow-x-auto rounded-lg border border-white/[0.08]">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {["Funnel", "CVR", "CVR Type", "AOV"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] uppercase tracking-[0.18em] text-[#5a6478] font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sc.top_funnel_cvr_aov.map((r) => (
                <tr key={r.funnel} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-medium uppercase tracking-wide text-[#f4f5f7]">{r.funnel}</td>
                  <td className="px-4 py-3 text-[#8b95a7]">{r.cvr ?? "—"}</td>
                  <td className="px-4 py-3 text-[#5a6478] text-[10px]">{r.cvr_note ?? "—"}</td>
                  <td className="px-4 py-3 text-[#c9a55e] font-medium">{r.aov}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Estimated test impact */}
      <div className="mb-6">
        <div className="text-[10px] uppercase tracking-[0.22em] text-[#5a6478] font-semibold mb-3">Estimated Impact of Shipped Winners</div>
        <div className="overflow-x-auto rounded-lg border border-white/[0.08]">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {["Exp ID", "Test", "CVR Lift", "Monthly Orders", "AOV", "Est. Monthly Impact"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] uppercase tracking-[0.18em] text-[#5a6478] font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sc.estimated_test_impact.map((r) => (
                <tr key={r.test_id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-mono text-[#5a6478]">{r.test_id}</td>
                  <td className="px-4 py-3 text-[#f4f5f7]">{r.name}</td>
                  <td className="px-4 py-3 text-[#8b95a7]">{r.cvr_lift ?? <span className="text-[#5a6478] text-[10px]">⚠ pending</span>}</td>
                  <td className="px-4 py-3 text-[#8b95a7]">{r.monthly_orders != null ? fmt.number(r.monthly_orders) : <span className="text-[#5a6478] text-[10px]">⚠ pending</span>}</td>
                  <td className="px-4 py-3 text-[#8b95a7]">{r.aov ?? <span className="text-[#5a6478] text-[10px]">⚠ pending</span>}</td>
                  <td className="px-4 py-3 text-[#c9a55e] font-medium">{r.estimated_monthly_impact ?? <span className="text-[#5a6478] text-[10px]">⚠ pending</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[10px] text-[#5a6478] mt-2">Formula: CVR lift % × monthly orders × AOV = estimated incremental revenue · CVR lift estimated from RPV data — verify with Katherine&apos;s scorecard</p>
      </div>

      {/* Bottom row: Trials + Rebuy */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-4">
          <div className="text-[10px] uppercase tracking-[0.18em] text-[#8b95a7] font-semibold mb-2">PG1 Shopify Trials (Testing Impact)</div>
          <div className="text-lg font-semibold text-[#f4f5f7]">{sc.pg1_shopify_trials.value ?? "—"}</div>
          <p className="text-[10px] text-[#5a6478] mt-1.5 leading-relaxed">{sc.pg1_shopify_trials.note}</p>
        </div>
        <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-4">
          <div className="text-[10px] uppercase tracking-[0.18em] text-[#8b95a7] font-semibold mb-2">PG1 CoC Trials (Testing Impact)</div>
          <div className="text-lg font-semibold text-[#f4f5f7]">{sc.pg1_coc_trials.value ?? "—"}</div>
          <p className="text-[10px] text-[#5a6478] mt-1.5 leading-relaxed">{sc.pg1_coc_trials.note}</p>
        </div>
        <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-4">
          <div className="text-[10px] uppercase tracking-[0.18em] text-[#8b95a7] font-semibold mb-2">Rebuy Contribution to AOV</div>
          <div className="text-lg font-semibold text-[#f4f5f7]">{sc.rebuy_aov_contribution.value ?? "—"}</div>
          <p className="text-[10px] text-[#5a6478] mt-1.5 leading-relaxed">{sc.rebuy_aov_contribution.note}</p>
        </div>
      </div>
    </section>
  );
}

function FunnelTable({ rows }: { rows: MbrData["physical_funnels_current"] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-white/[0.08]">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-white/[0.06]">
            {["Funnel", "FE Sales", "Revenue", "AOV", "Visitors", "OP CVR"].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-[10px] uppercase tracking-[0.18em] text-[#5a6478] font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
              <td className="px-4 py-3 font-medium uppercase tracking-wide text-[#f4f5f7]">{r.funnel}</td>
              <td className="px-4 py-3 text-[#8b95a7]">{fmt.number(r.fe_sales)}</td>
              <td className="px-4 py-3 text-[#c9a55e] font-medium">{fmt.currency(r.revenue)}</td>
              <td className="px-4 py-3 text-[#8b95a7]">{fmt.currency(r.aov)}</td>
              <td className="px-4 py-3 text-[#8b95a7]">{r.visitors != null ? fmt.number(r.visitors) : "—"}</td>
              <td className="px-4 py-3 text-[#8b95a7]">{r.op_cvr ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TestsTable({ tests }: { tests: TestResult[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-white/[0.08]">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-white/[0.06]">
            {["Exp ID", "Test", "Outcome", "Primary Metric", "Revenue Stat", "Stat Sig"].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-[10px] uppercase tracking-[0.18em] text-[#5a6478] font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tests.map((t) => (
            <tr key={t.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
              <td className="px-4 py-3 font-mono text-[#5a6478]">{t.id}</td>
              <td className="px-4 py-3 text-[#f4f5f7] max-w-xs">{t.name}</td>
              <td className="px-4 py-3"><OutcomeBadge outcome={t.outcome} /></td>
              <td className="px-4 py-3 text-[#8b95a7]">{t.primary_metric ?? "—"}</td>
              <td className="px-4 py-3 text-[#8b95a7]">{t.revenue_stat ?? "—"}</td>
              <td className="px-4 py-3 text-[#8b95a7]">{t.stat_sig ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const VERSION_STYLES: Record<string, { badge: string; border: string; dot: string }> = {
  V1: { badge: "text-[#8b95a7] bg-white/[0.06] border-white/[0.08]", border: "border-white/[0.08]", dot: "#8b95a7" },
  V2: { badge: "text-red-400 bg-red-400/10 border-red-400/20", border: "border-red-400/20", dot: "#f87171" },
  V3: { badge: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20", border: "border-emerald-400/30", dot: "#34d399" },
};

function VersionCard({ v }: { v: PricingModelVersion }) {
  const s = VERSION_STYLES[v.version] ?? VERSION_STYLES.V1;
  const revenueColor = v.net_revenue_positive ? "text-emerald-400" : "text-red-400";
  return (
    <div className={`rounded-lg border ${s.border} bg-gradient-to-b from-white/[0.03] to-transparent p-5 flex flex-col gap-3`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className={`text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded border ${s.badge}`}>
            {v.version}
          </span>
          <p className="text-[11px] text-[#8b95a7] mt-1.5">{v.date_range}</p>
        </div>
      </div>
      <div>
        <div className="text-sm font-medium text-[#f4f5f7] leading-snug">{v.label}</div>
        <p className="text-xs text-[#5a6478] mt-1 leading-relaxed">{v.description}</p>
      </div>
      <div className="border-t border-white/[0.06] pt-3 space-y-2">
        {[
          { label: "CVR", value: v.cvr, color: v.version === "V2" ? "text-red-400" : v.version === "V3" ? "text-emerald-400" : "text-[#f4f5f7]" },
          { label: "AOV", value: v.aov, color: "text-[#f4f5f7]" },
          { label: "PG1 Trials", value: v.pg1_trials.toLocaleString(), color: "text-[#c9a55e]" },
          { label: "Trials / 100 Orders", value: v.trials_per_100_orders + "%", color: "text-[#c9a55e]" },
          { label: "Net ROAS", value: v.net_roas, color: v.version === "V3" ? "text-emerald-400" : v.version === "V2" ? "text-red-400" : "text-[#8b95a7]" },
          { label: "Ad Spend", value: v.ad_spend, color: "text-[#8b95a7]" },
          { label: "CPA", value: v.cpa, color: "text-[#8b95a7]" },
          { label: "Net Revenue", value: v.net_revenue, color: revenueColor },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex justify-between items-baseline gap-2">
            <span className="text-[10px] uppercase tracking-[0.14em] text-[#5a6478]">{label}</span>
            <span className={`text-xs font-medium ${color}`}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PricingModelSection({ data }: { data: PricingModelAnalysis }) {
  const projRows: { label: string; v2: string; v3: string }[] = [
    { label: "Orders", v2: data.v2_if_implemented.orders.toLocaleString(), v3: data.v3_actual.orders.toLocaleString() },
    { label: "Gross Revenue", v2: data.v2_if_implemented.gross_revenue, v3: data.v3_actual.gross_revenue },
    { label: "PG1 Trials", v2: data.v2_if_implemented.pg1_trials.toLocaleString(), v3: data.v3_actual.pg1_trials.toLocaleString() },
    { label: "Net ROAS", v2: data.v2_if_implemented.net_roas, v3: data.v3_actual.net_roas },
    { label: "Net Revenue", v2: data.v2_if_implemented.net_revenue, v3: data.v3_actual.net_revenue },
  ];

  return (
    <section>
      <SectionHeader label={data.headline} />
      <p className="text-xs text-[#5a6478] mb-6 -mt-2">{data.sub}</p>

      {/* Three version cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {data.versions.map((v) => <VersionCard key={v.version} v={v} />)}
      </div>

      {/* V2 if implemented projection */}
      <div className="mb-6">
        <div className="text-[10px] uppercase tracking-[0.22em] text-[#5a6478] font-semibold mb-1">{data.projection_headline}</div>
        <p className="text-xs text-[#5a6478] mb-4">{data.projection_sub}</p>
        <div className="overflow-x-auto rounded-lg border border-white/[0.08]">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="px-4 py-3 text-left text-[10px] uppercase tracking-[0.18em] text-[#5a6478] font-medium">KPI</th>
                <th className="px-4 py-3 text-left text-[10px] uppercase tracking-[0.18em] text-red-400/70 font-medium">V2 If Implemented (projected)</th>
                <th className="px-4 py-3 text-left text-[10px] uppercase tracking-[0.18em] text-emerald-400/70 font-medium">V3 Actual</th>
                <th className="px-4 py-3 text-left text-[10px] uppercase tracking-[0.18em] text-[#5a6478] font-medium">Delta</th>
              </tr>
            </thead>
            <tbody>
              {projRows.map((r, i) => {
                const deltas: Record<string, string> = {
                  "Orders": "+1,265 (+14%)",
                  "Gross Revenue": "+$268K (+9%)",
                  "PG1 Trials": "+2,581 (+48%)",
                  "Net ROAS": "+8pp",
                  "Net Revenue": "+$142K swing",
                };
                return (
                  <tr key={r.label} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 text-[10px] uppercase tracking-[0.14em] text-[#5a6478]">{r.label}</td>
                    <td className="px-4 py-3 text-red-400">{r.v2}</td>
                    <td className="px-4 py-3 text-emerald-400 font-medium">{r.v3}</td>
                    <td className="px-4 py-3 text-[#c9a55e] font-medium">{deltas[r.label] ?? "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Callouts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/[0.03] p-5">
          <div className="text-[10px] uppercase tracking-widest text-emerald-400 font-semibold mb-2">Finding</div>
          <p className="text-xs text-[#8b95a7] leading-relaxed">{data.callout_positive}</p>
        </div>
        <div className="rounded-lg border border-amber-400/20 bg-amber-400/[0.03] p-5">
          <div className="text-[10px] uppercase tracking-widest text-amber-400 font-semibold mb-2">Watch</div>
          <p className="text-xs text-[#8b95a7] leading-relaxed">{data.callout_watch}</p>
        </div>
      </div>
    </section>
  );
}

export default async function MbrDetailPage({ params }: { params: Promise<{ month: string }> }) {
  const { month } = await params;
  const mbr = DATA_MAP[month];
  if (!mbr) notFound();

  const wins = mbr.tests_concluded.filter((t) => t.outcome === "WIN").length;
  const total = mbr.tests_concluded.length;

  return (
    <div className="space-y-12 pb-16">

      {/* Header */}
      <div>
        <div className="text-[10px] tracking-[0.3em] text-[#c9a55e] uppercase font-semibold mb-2">
          Monthly Business Review
        </div>
        <div className="flex items-end justify-between gap-4">
          <h1 className="text-3xl font-semibold tracking-tight">
            {mbr.month}
            <span className="text-[#5a6478] font-normal"> vs {mbr.comparison_month}</span>
          </h1>
          <div className="text-[10px] text-[#5a6478] tracking-wider uppercase text-right">
            Source: {mbr.data_source}
          </div>
        </div>
        <p className="text-sm text-[#8b95a7] mt-2 max-w-3xl leading-relaxed">{mbr.headline}</p>
      </div>

      {/* CRO Scorecard */}
      {mbr.cro_scorecard && <CroScorecardSection sc={mbr.cro_scorecard} />}

      {/* Headline KPIs */}
      <section>
        <SectionHeader label="Paid Media Performance" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {mbr.headline_kpis.map((k) => (
            <KpiTile key={k.label} k={k} />
          ))}
        </div>
      </section>

      {/* Sales YoY */}
      <section>
        <SectionHeader label="Sales Year-over-Year" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(["total", "physical", "digital"] as const).map((key) => {
            const s = mbr.sales_yoy[key];
            const isUp = s.direction === "up";
            return (
              <div key={key} className="rounded-lg border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent p-5">
                <div className="text-[10px] uppercase tracking-[0.22em] text-[#8b95a7] font-semibold mb-3">
                  {key === "total" ? "Total Sales" : key === "physical" ? "Physical Sales" : "Digital Sales"}
                </div>
                <div className="text-3xl font-semibold tracking-tight text-[#f4f5f7]">{fmt.number(s.current)}</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-sm font-medium ${isUp ? "text-emerald-400" : "text-red-400"}`}>{s.change}</span>
                  <span className="text-xs text-[#5a6478]">vs {fmt.number(s.prior)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Physical Products */}
      <section>
        <SectionHeader label="Physical Products" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {[
            { label: "Total Revenue", value: mbr.physical_rollup.total_revenue, change: mbr.physical_rollup.revenue_change },
            { label: "FE Sales", value: fmt.number(mbr.physical_rollup.fe_sales), change: `vs ${fmt.number(mbr.physical_rollup.prior_fe_sales)}` },
            { label: "Blended AOV", value: mbr.physical_rollup.aov, change: mbr.physical_rollup.aov_change },
            { label: "Prior Revenue", value: mbr.physical_rollup.prior_revenue, change: mbr.comparison_month },
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-4">
              <div className="text-[10px] uppercase tracking-[0.18em] text-[#5a6478] mb-1">{item.label}</div>
              <div className="text-xl font-semibold text-[#c9a55e]">{item.value}</div>
              <div className="text-[10px] text-[#5a6478] mt-1">{item.change}</div>
            </div>
          ))}
        </div>
        <div className="mb-2 text-[10px] uppercase tracking-[0.22em] text-[#5a6478] font-semibold">{mbr.month}</div>
        <FunnelTable rows={mbr.physical_funnels_current} />
        {mbr.physical_funnels_prior.length > 0 && (
          <div className="mt-4">
            <div className="mb-2 text-[10px] uppercase tracking-[0.22em] text-[#5a6478] font-semibold">{mbr.comparison_month}</div>
            <FunnelTable rows={mbr.physical_funnels_prior} />
          </div>
        )}
        <ul className="mt-4 space-y-2">
          {mbr.physical_takeaways.map((t, i) => (
            <li key={i} className="text-xs text-[#8b95a7] flex gap-2">
              <span className="text-[#c9a55e] mt-0.5">·</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Digital Products */}
      <section>
        <SectionHeader label="Digital Products" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {[
            { label: "Total Revenue", value: mbr.digital_rollup.total_revenue, change: mbr.digital_rollup.revenue_change },
            { label: "FE Sales", value: fmt.number(mbr.digital_rollup.fe_sales), change: `vs ${fmt.number(mbr.digital_rollup.prior_fe_sales)}` },
            { label: "Blended AOV", value: mbr.digital_rollup.aov, change: mbr.digital_rollup.aov_change },
            { label: "Prior Revenue", value: mbr.digital_rollup.prior_revenue, change: mbr.comparison_month },
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-4">
              <div className="text-[10px] uppercase tracking-[0.18em] text-[#5a6478] mb-1">{item.label}</div>
              <div className="text-xl font-semibold text-[#c9a55e]">{item.value}</div>
              <div className="text-[10px] text-[#5a6478] mt-1">{item.change}</div>
            </div>
          ))}
        </div>
        <div className="mb-2 text-[10px] uppercase tracking-[0.22em] text-[#5a6478] font-semibold">{mbr.month}</div>
        <FunnelTable rows={mbr.digital_funnels_current} />
        {mbr.digital_funnels_prior.length > 0 && (
          <div className="mt-4">
            <div className="mb-2 text-[10px] uppercase tracking-[0.22em] text-[#5a6478] font-semibold">{mbr.comparison_month}</div>
            <FunnelTable rows={mbr.digital_funnels_prior} />
          </div>
        )}
        <ul className="mt-4 space-y-2">
          {mbr.digital_takeaways.map((t, i) => (
            <li key={i} className="text-xs text-[#8b95a7] flex gap-2">
              <span className="text-[#c9a55e] mt-0.5">·</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Experimentation */}
      <section>
        <SectionHeader label="Experimentation" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Tests Launched", goal: String(mbr.goals.tests_launched), actual: String(mbr.actual.tests_launched) },
            { label: "Win Rate", goal: mbr.goals.win_rate, actual: mbr.actual.win_rate },
            { label: "CoC AOV", goal: mbr.goals.coc_aov, actual: mbr.actual.coc_aov },
            { label: "Rebuy AOV Contribution", goal: mbr.goals.rebuy_aov, actual: mbr.actual.rebuy_aov },
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-4">
              <div className="text-[10px] uppercase tracking-[0.18em] text-[#5a6478] mb-2">{item.label}</div>
              <div className="flex items-end gap-3">
                <div>
                  <div className="text-[10px] text-[#5a6478] mb-0.5">Goal</div>
                  <div className="text-base font-medium text-[#8b95a7]">{item.goal}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#5a6478] mb-0.5">Actual</div>
                  <div className="text-base font-semibold text-[#c9a55e]">{item.actual}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-2 text-[10px] uppercase tracking-[0.22em] text-[#5a6478] font-semibold">
          Tests Concluded — {total} reviewed · {wins} wins
        </div>
        <TestsTable tests={mbr.tests_concluded} />

        {mbr.tests_in_progress.length > 0 && (
          <div className="mt-5">
            <div className="mb-2 text-[10px] uppercase tracking-[0.22em] text-[#5a6478] font-semibold">Tests In Progress</div>
            <div className="rounded-lg border border-white/[0.08] divide-y divide-white/[0.04]">
              {mbr.tests_in_progress.map((t) => (
                <div key={t.id} className="px-4 py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] text-[#5a6478]">{t.id}</span>
                    <span className="text-xs text-[#f4f5f7]">{t.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] text-[#5a6478] whitespace-nowrap">
                    <span>KPI: {t.key_kpi}</span>
                    <span>{t.next_steps}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Pricing Model Analysis */}
      {mbr.pricing_model_analysis && (
        <PricingModelSection data={mbr.pricing_model_analysis} />
      )}

      {/* Themes */}
      {mbr.themes.length > 0 && (
        <section>
          <SectionHeader label="Themes & Takeaways" />
          <div className="space-y-3">
            {mbr.themes.map((t) => (
              <ThemeCard key={t.number} t={t} />
            ))}
          </div>
        </section>
      )}

      {/* Triumphs & Challenges */}
      {(mbr.triumphs.length > 0 || mbr.challenges.length > 0) && (
        <section>
          <SectionHeader label="Triumphs & Challenges" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/[0.03] p-5">
              <div className="text-[10px] uppercase tracking-widest text-emerald-400 font-semibold mb-3">Triumphs</div>
              <ul className="space-y-2">
                {mbr.triumphs.map((t, i) => (
                  <li key={i} className="text-xs text-[#8b95a7] flex gap-2">
                    <span className="text-emerald-400 mt-0.5">✓</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-red-400/20 bg-red-400/[0.03] p-5">
              <div className="text-[10px] uppercase tracking-widest text-red-400 font-semibold mb-3">Challenges</div>
              {mbr.challenges.length > 0 ? (
                <ul className="space-y-2">
                  {mbr.challenges.map((c, i) => (
                    <li key={i} className="text-xs text-[#8b95a7] flex gap-2">
                      <span className="text-red-400 mt-0.5">·</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-[#5a6478] italic">None logged this month.</p>
              )}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
