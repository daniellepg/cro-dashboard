import { notFound } from "next/navigation";
import type { MbrData, FunnelRow, Theme, TestResult, KpiCard, PricingModelVersion, PricingModelAnalysis, CroScorecard } from "@/lib/mbr";
import { CroKpiGrid } from "@/components/cro-kpi-grid";

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

function DigitalFunnelComparisonTable({
  current,
  prior,
}: {
  current: FunnelRow[];
  prior: FunnelRow[];
}) {
  const priorMap = new Map(prior.map((r) => [r.funnel, r]));
  const currentMap = new Map(current.map((r) => [r.funnel, r]));

  type MergedRow = { funnel: string; curr: FunnelRow | null; prev: FunnelRow | null; tag: "new" | "prior-only" | null };

  const rows: MergedRow[] = [
    ...[...current]
      .sort((a, b) => b.revenue - a.revenue)
      .map((r) => ({ funnel: r.funnel, curr: r, prev: priorMap.get(r.funnel) ?? null, tag: priorMap.has(r.funnel) ? null : ("new" as const) })),
    ...[...prior]
      .filter((r) => !currentMap.has(r.funnel))
      .sort((a, b) => b.revenue - a.revenue)
      .map((r) => ({ funnel: r.funnel, curr: null, prev: r, tag: "prior-only" as const })),
  ];

  function pct(curr: number | null | undefined, prev: number | null | undefined): number | null {
    if (!curr || !prev) return null;
    return ((curr - prev) / prev) * 100;
  }

  function Delta({ val }: { val: number | null }) {
    if (val === null) return <span className="text-[#5a6478]">—</span>;
    const pos = val >= 0;
    return (
      <span className={pos ? "text-emerald-400 font-semibold" : "text-rose-400 font-semibold"}>
        {pos ? "+" : ""}
        {val.toFixed(1)}%
      </span>
    );
  }

  const headers = ["Funnel", "Rev '26", "Rev '25", "Rev Δ", "Sales '26", "Sales '25", "Sales Δ", "AOV '26", "AOV '25", "CVR '26", "CVR '25"];

  return (
    <div className="overflow-x-auto rounded-lg border border-white/[0.08]">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-white/[0.06]">
            {headers.map((h) => (
              <th key={h} className="px-3 py-3 text-left text-[10px] uppercase tracking-[0.15em] text-[#5a6478] font-medium whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
              <td className="px-3 py-3 font-medium uppercase tracking-wide text-[#f4f5f7] whitespace-nowrap">
                {r.funnel}
                {r.tag === "new" && (
                  <span className="ml-1.5 text-[9px] uppercase tracking-wider font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded px-1.5 py-0.5">
                    NEW
                  </span>
                )}
                {r.tag === "prior-only" && (
                  <span className="ml-1.5 text-[9px] uppercase tracking-wider font-semibold text-[#5a6478] bg-white/[0.04] border border-white/[0.08] rounded px-1.5 py-0.5">
                    2025
                  </span>
                )}
              </td>
              <td className="px-3 py-3 text-[#c9a55e] font-medium">{r.curr ? fmt.currency(r.curr.revenue) : "—"}</td>
              <td className="px-3 py-3 text-[#8b95a7]">{r.prev ? fmt.currency(r.prev.revenue) : "—"}</td>
              <td className="px-3 py-3"><Delta val={pct(r.curr?.revenue, r.prev?.revenue)} /></td>
              <td className="px-3 py-3 text-[#8b95a7]">{r.curr ? fmt.number(r.curr.fe_sales) : "—"}</td>
              <td className="px-3 py-3 text-[#8b95a7]">{r.prev ? fmt.number(r.prev.fe_sales) : "—"}</td>
              <td className="px-3 py-3"><Delta val={pct(r.curr?.fe_sales, r.prev?.fe_sales)} /></td>
              <td className="px-3 py-3 text-[#8b95a7]">{r.curr ? fmt.currency(r.curr.aov) : "—"}</td>
              <td className="px-3 py-3 text-[#8b95a7]">{r.prev ? fmt.currency(r.prev.aov) : "—"}</td>
              <td className="px-3 py-3 text-[#8b95a7]">{r.curr?.op_cvr ?? "—"}</td>
              <td className="px-3 py-3 text-[#8b95a7]">{r.prev?.op_cvr ?? "—"}</td>
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
            {["Exp ID", "Test", "Outcome", "Primary Metric", "Revenue Stat", "Stat Sig", ""].map((h) => (
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
              <td className="px-4 py-3">
                <a
                  href="https://pg-domo-analytics-kg.vercel.app/testing/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] uppercase tracking-widest text-[#5a6478] hover:text-[#c9a55e] transition-colors whitespace-nowrap"
                >
                  Scorecard ↗
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const VERSION_STYLES: Record<string, { badge: string; border: string; dot: string }> = {
  V0: { badge: "text-amber-500 bg-amber-500/10 border-amber-500/20", border: "border-amber-500/20", dot: "#f59e0b" },
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
  const projRows = [
    { label: "Orders",        v2: data.v2_if_implemented.orders.toLocaleString(),        v3: data.v3_actual.orders.toLocaleString(),        delta: "+1,265 (+14%)" },
    { label: "Gross Revenue", v2: data.v2_if_implemented.gross_revenue,                  v3: data.v3_actual.gross_revenue,                  delta: "+$268K (+9%)" },
    { label: "PG1 Trials",   v2: data.v2_if_implemented.pg1_trials.toLocaleString(),    v3: data.v3_actual.pg1_trials.toLocaleString(),    delta: "+2,581 (+48%)" },
    { label: "Net ROAS",     v2: data.v2_if_implemented.net_roas,                        v3: data.v3_actual.net_roas,                        delta: "+8pp" },
    { label: "Net Revenue",  v2: data.v2_if_implemented.net_revenue,                    v3: data.v3_actual.net_revenue,                    delta: "+$142K swing" },
  ];

  const VERDICT_STYLES: Record<string, { badge: string; border: string }> = {
    V1: { badge: "text-[#8b95a7] bg-white/[0.06] border-white/[0.08]", border: "border-white/[0.08]" },
    V2: { badge: "text-red-400 bg-red-400/10 border-red-400/20",       border: "border-red-400/20" },
    V3: { badge: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20", border: "border-emerald-400/30" },
  };

  return (
    <section id="pricing-model" className="space-y-10">
      <div>
        <SectionHeader label={data.headline} />
        <p className="text-xs text-[#5a6478] -mt-2">{data.sub}</p>
      </div>

      {/* Three version cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {data.versions.map((v) => <VersionCard key={v.version} v={v} />)}
      </div>

      {/* A/B test evidence */}
      {data.ab_test_evidence && (
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-[#5a6478] font-semibold mb-1">{data.ab_test_evidence.headline}</div>
          <p className="text-xs text-[#5a6478] mb-4 leading-relaxed">{data.ab_test_evidence.intro}</p>
          <div className="overflow-x-auto rounded-lg border border-white/[0.08]">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {["Test", "Funnel", "RPV Change", "AOV Change", "Membership Shift", "Outcome"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] uppercase tracking-[0.18em] text-[#5a6478] font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.ab_test_evidence.tests.map((t) => (
                  <tr key={t.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 font-mono text-[#5a6478]">{t.id}</td>
                    <td className="px-4 py-3 text-[#8b95a7]">{t.funnel}</td>
                    <td className="px-4 py-3 text-red-400 font-medium">{t.rpv_change}</td>
                    <td className="px-4 py-3 text-emerald-400">{t.aov_change}</td>
                    <td className="px-4 py-3 text-[#8b95a7]">{t.membership_shift ?? "—"}</td>
                    <td className="px-4 py-3"><OutcomeBadge outcome={t.verdict} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subscription LTV math */}
      {data.sub_ltv_math && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-[#5a6478] font-semibold mb-4">{data.sub_ltv_math.headline}</div>
            <div className="rounded-lg border border-white/[0.08] overflow-hidden">
              {data.sub_ltv_math.rows.map((r, i) => (
                <div key={i} className={`flex justify-between items-baseline px-4 py-2.5 gap-4 border-b border-white/[0.04] last:border-b-0 ${r.highlight ? "bg-red-400/[0.04]" : ""}`}>
                  <span className="text-[11px] text-[#5a6478] leading-snug">{r.label}</span>
                  <span className={`text-xs font-medium whitespace-nowrap ${r.highlight ? "text-red-400" : "text-[#f4f5f7]"}`}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-red-400/20 bg-red-400/[0.03] p-5 self-start">
            <div className="text-[10px] uppercase tracking-widest text-red-400 font-semibold mb-2">Why the math failed</div>
            <p className="text-xs text-[#8b95a7] leading-relaxed">{data.sub_ltv_math.conclusion}</p>
          </div>
        </div>
      )}

      {/* Paid media double penalty */}
      {data.paid_media_impact && (
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-[#5a6478] font-semibold mb-1">{data.paid_media_impact.headline}</div>
          <p className="text-xs text-[#5a6478] mb-4 leading-relaxed">{data.paid_media_impact.intro}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-[#5a6478] font-medium mb-2">Bid ceiling compression by test</div>
              <div className="overflow-x-auto rounded-lg border border-white/[0.08]">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      {["Test", "Control Max CPC", "Treatment Max CPC", "Drop"].map((h) => (
                        <th key={h} className="px-3 py-2.5 text-left text-[10px] uppercase tracking-[0.14em] text-[#5a6478] font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.paid_media_impact.bid_ceiling_rows.map((r) => (
                      <tr key={r.test} className="border-b border-white/[0.04]">
                        <td className="px-3 py-2.5 font-mono text-[10px] text-[#5a6478]">{r.test}</td>
                        <td className="px-3 py-2.5 text-emerald-400">{r.control_max_cpc}</td>
                        <td className="px-3 py-2.5 text-red-400">{r.treatment_max_cpc}</td>
                        <td className="px-3 py-2.5 text-red-400 font-medium">{r.drop_pct}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-[#5a6478] font-medium mb-2">V1 vs V2 period performance</div>
              <div className="overflow-x-auto rounded-lg border border-white/[0.08]">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      {["Metric", "V1", "V2"].map((h) => (
                        <th key={h} className="px-3 py-2.5 text-left text-[10px] uppercase tracking-[0.14em] text-[#5a6478] font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.paid_media_impact.period_rows.map((r) => (
                      <tr key={r.metric} className="border-b border-white/[0.04]">
                        <td className="px-3 py-2.5 text-[10px] text-[#5a6478]">{r.metric}</td>
                        <td className="px-3 py-2.5 text-[#8b95a7]">{r.v1}</td>
                        <td className={`px-3 py-2.5 font-medium ${r.good ? "text-emerald-400" : "text-red-400"}`}>{r.v2}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-amber-400/20 bg-amber-400/[0.03] p-4">
            <p className="text-xs text-[#8b95a7] leading-relaxed">{data.paid_media_impact.conclusion}</p>
          </div>
        </div>
      )}

      {/* V2 if implemented vs V3 actual */}
      <div>
        <div className="text-[10px] uppercase tracking-[0.22em] text-[#5a6478] font-semibold mb-1">{data.projection_headline}</div>
        <p className="text-xs text-[#5a6478] mb-4">{data.projection_sub}</p>
        <div className="overflow-x-auto rounded-lg border border-white/[0.08]">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="px-4 py-3 text-left text-[10px] uppercase tracking-[0.18em] text-[#5a6478] font-medium">KPI</th>
                <th className="px-4 py-3 text-left text-[10px] uppercase tracking-[0.18em] text-red-400/70 font-medium">V2 If Implemented</th>
                <th className="px-4 py-3 text-left text-[10px] uppercase tracking-[0.18em] text-emerald-400/70 font-medium">V3 Actual</th>
                <th className="px-4 py-3 text-left text-[10px] uppercase tracking-[0.18em] text-[#c9a55e]/70 font-medium">Delta</th>
              </tr>
            </thead>
            <tbody>
              {projRows.map((r) => (
                <tr key={r.label} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 text-[10px] uppercase tracking-[0.14em] text-[#5a6478]">{r.label}</td>
                  <td className="px-4 py-3 text-red-400">{r.v2}</td>
                  <td className="px-4 py-3 text-emerald-400 font-medium">{r.v3}</td>
                  <td className="px-4 py-3 text-[#c9a55e] font-medium">{r.delta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Path projection */}
      {data.path_projection && (() => {
        const v0Version = data.versions.find((v) => v.version === "V0");
        const nonV3 = data.path_projection!.scenarios.filter((s) => s.version !== "V3");
        const v3 = data.path_projection!.scenarios.find((s) => s.version === "V3");
        const renderScenarioCard = (s: (typeof data.path_projection)["scenarios"][number]) => {
          const st = VERDICT_STYLES[s.version] ?? VERDICT_STYLES.V1;
          return (
            <div key={s.version} className={`rounded-lg border ${st.border} bg-gradient-to-b from-white/[0.03] to-transparent p-5`}>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className={`text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded border ${st.badge}`}>{s.version}</span>
                {s.net_revenue_positive
                  ? <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">Profitable</span>
                  : <span className="text-[10px] text-red-400 font-semibold uppercase tracking-wider">Loss</span>
                }
              </div>
              <p className="text-[11px] text-[#8b95a7] mb-4 leading-snug">{s.label}</p>
              <div className="space-y-2 border-t border-white/[0.06] pt-3">
                {[
                  { label: "Orders", value: s.orders.toLocaleString() },
                  { label: "Gross Revenue", value: s.gross_revenue },
                  { label: "PG1 Trials", value: s.pg1_trials.toLocaleString(), gold: true },
                  { label: "Net ROAS", value: s.net_roas },
                  { label: "Net Revenue", value: s.net_revenue, colored: true, positive: s.net_revenue_positive },
                ].map(({ label, value, gold, colored, positive }) => (
                  <div key={label} className="flex justify-between items-baseline gap-2">
                    <span className="text-[10px] uppercase tracking-[0.12em] text-[#5a6478]">{label}</span>
                    <span className={`text-xs font-medium ${gold ? "text-[#c9a55e]" : colored ? (positive ? "text-emerald-400" : "text-red-400") : "text-[#f4f5f7]"}`}>{value}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/[0.06] pt-3 mt-3">
                <p className="text-[11px] text-[#5a6478] leading-relaxed italic">{s.note}</p>
              </div>
            </div>
          );
        };
        return (
          <div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-[#5a6478] font-semibold mb-1">{data.path_projection!.headline}</div>
            <p className="text-xs text-[#5a6478] mb-4 leading-relaxed">{data.path_projection!.sub}</p>
            {/* V1 / V2 scenario cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {nonV3.map((s) => renderScenarioCard(s))}
            </div>
            {/* V3 card + journey chart */}
            {v3 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {renderScenarioCard(v3)}
                <PricingJourneyChart versions={data.versions} />
              </div>
            )}
            <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/[0.03] p-5">
              <div className="text-[10px] uppercase tracking-widest text-emerald-400 font-semibold mb-2">Conclusion</div>
              <p className="text-xs text-[#8b95a7] leading-relaxed">{data.path_projection!.conclusion}</p>
            </div>
          </div>
        );
      })()}

      {/* Finding + Watch callouts */}
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

function PricingJourneyChart({ versions }: { versions: PricingModelVersion[] }) {
  // X positions for V0–V3
  const XS = [72, 182, 292, 390];
  const vColors = ["#5a6478", "#8b95a7", "#f87171", "#34d399"];

  // Extract numeric values per metric
  const roasVals  = versions.map((v) => parseFloat(v.net_roas));
  const cvrVals   = versions.map((v) => parseFloat(v.cvr));
  const aovVals   = versions.map((v) => parseFloat((v.aov ?? "$0").replace(/[$,]/g, "")));
  const trialVals = versions.map((v) => v.pg1_trials);

  function norm(vals: number[], rowTop: number, rowBot: number) {
    const mn = Math.min(...vals), mx = Math.max(...vals);
    return vals.map((v) => mn === mx ? (rowTop + rowBot) / 2 : rowBot - ((v - mn) / (mx - mn)) * (rowBot - rowTop));
  }

  // Row bands (top, bottom y)
  const ROWS = [
    { label: "Net ROAS", unit: "%",  vals: roasVals,  top: 18,  bot: 52,  fmt: (v: number) => `${v.toFixed(0)}%` },
    { label: "CVR",      unit: "%",  vals: cvrVals,   top: 68,  bot: 102, fmt: (v: number) => `${v.toFixed(2)}%` },
    { label: "AOV",      unit: "$",  vals: aovVals,   top: 118, bot: 152, fmt: (v: number) => `$${v.toFixed(0)}` },
    { label: "Trials",   unit: "",   vals: trialVals, top: 168, bot: 202, fmt: (v: number) => v >= 1000 ? `${(v/1000).toFixed(1)}K` : `${v}` },
  ];

  return (
    <div className="rounded-lg border border-emerald-400/20 bg-gradient-to-b from-white/[0.02] to-transparent p-4 flex flex-col gap-2">
      <div className="text-[10px] uppercase tracking-[0.22em] text-[#5a6478] font-semibold">Metrics by Pricing Era</div>
      <svg viewBox="0 0 430 230" xmlns="http://www.w3.org/2000/svg" className="w-full">

        {/* Version labels across top */}
        {versions.map((v, i) => (
          <text key={v.version} x={XS[i]} y="10" textAnchor="middle" fill={vColors[i]} fontSize="8.5" fontWeight="700" fontFamily="sans-serif">{v.version}</text>
        ))}

        {/* V0 "not viable" stripe */}
        <rect x="48" y="14" width="50" height="210" fill="#5a6478" opacity="0.04" />
        <text x="73" y="222" textAnchor="middle" fill="#5a6478" fontSize="7" fontFamily="sans-serif" opacity="0.5">baseline</text>

        {/* Row bands + sparklines */}
        {ROWS.map((row) => {
          const ys = norm(row.vals, row.top, row.bot);
          const linePts = XS.map((x, i) => `${x},${ys[i]}`).join(" ");
          return (
            <g key={row.label}>
              {/* subtle row band */}
              <rect x="48" y={row.top - 4} width="370" height={row.bot - row.top + 8} rx="3" fill="white" opacity="0.015" />
              {/* metric label */}
              <text x="44" y={(row.top + row.bot) / 2 + 3} textAnchor="end" fill="#5a6478" fontSize="7.5" fontFamily="sans-serif">{row.label}</text>
              {/* connecting line — dashed from V0, solid V1→V3 */}
              <polyline points={`${XS[0]},${ys[0]} ${XS[1]},${ys[1]}`} fill="none" stroke="#5a6478" strokeWidth="1" strokeDasharray="3 2" opacity="0.4" />
              <polyline points={`${XS[1]},${ys[1]} ${XS[2]},${ys[2]} ${XS[3]},${ys[3]}`} fill="none" stroke="#c9a55e" strokeWidth="1.5" opacity="0.6" />
              {/* dots + value labels */}
              {versions.map((v, i) => (
                <g key={v.version}>
                  <circle cx={XS[i]} cy={ys[i]} r="4" fill={vColors[i]} />
                  <text x={XS[i]} y={ys[i] - 7} textAnchor="middle" fill={vColors[i]} fontSize="7.5" fontFamily="monospace" fontWeight="600">{row.fmt(row.vals[i])}</text>
                </g>
              ))}
            </g>
          );
        })}

        {/* Golf cart above V3 column */}
        <g transform="translate(360, 14)">
          <rect x="0" y="0" width="46" height="6" rx="2" fill="#c9a55e" />
          <rect x="3" y="5" width="3" height="10" fill="#c9a55e" opacity="0.7" />
          <polygon points="37,5 43,5 40,15" fill="#c9a55e" opacity="0.25" />
          <line x1="37" y1="5" x2="40" y2="15" stroke="#c9a55e" strokeWidth="1" opacity="0.7" />
          <rect x="7" y="6" width="28" height="6" rx="1" fill="#2a3448" stroke="#c9a55e" strokeWidth="0.5" />
          <rect x="3" y="12" width="44" height="4" rx="1" fill="#1e2533" stroke="#c9a55e" strokeWidth="0.6" />
          <rect x="3" y="9" width="7" height="7" rx="1" fill="#1a2030" stroke="#c9a55e" strokeWidth="0.4" />
          <circle cx="12" cy="19" r="5" fill="#1e2533" stroke="#34d399" strokeWidth="1.6" />
          <circle cx="12" cy="19" r="1.8" fill="#34d399" />
          <circle cx="36" cy="19" r="5" fill="#1e2533" stroke="#34d399" strokeWidth="1.6" />
          <circle cx="36" cy="19" r="1.8" fill="#34d399" />
          <line x1="46" y1="18" x2="46" y2="1" stroke="#34d399" strokeWidth="1.2" />
          <polygon points="46,1 55,4.5 46,8" fill="#34d399" />
        </g>

        {/* Vertical dividers between versions */}
        {[127, 237].map((x) => (
          <line key={x} x1={x} y1="14" x2={x} y2="210" stroke="#2a3042" strokeWidth="0.5" strokeDasharray="2 3" opacity="0.4" />
        ))}
      </svg>
    </div>
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

      {/* CRO KPI Summary */}
      {mbr.cro_scorecard && (
        <section className="mb-8">
          <SectionHeader label="CRO KPIs" />
          <CroKpiGrid sc={mbr.cro_scorecard} />
        </section>
      )}

      {/* CRO Scorecard detail */}
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
        <DigitalFunnelComparisonTable
          current={mbr.physical_funnels_current}
          prior={mbr.physical_funnels_prior}
        />
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
        <DigitalFunnelComparisonTable
          current={mbr.digital_funnels_current}
          prior={mbr.digital_funnels_prior}
        />
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
