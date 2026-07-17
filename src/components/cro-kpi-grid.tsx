import type { CroScorecard } from "@/lib/mbr";

const SCORECARD_URL = "https://pg-domo-analytics-kg.vercel.app/testing/";
const WOW_URL       = "https://pg-domo-analytics-kg.vercel.app/paid-media/";

const PATRICK_CLICKUP =
  "https://performancegolf.clickup.com/t/9014714949/86bajrhva?utm_source=email-notifications&utm_type=1&utm_field=assignee_add";

type TileProps = {
  label: string;
  value: string;
  goal?: string;
  detail?: string;
  status?: "above" | "below" | "pending" | "neutral";
  source: string;
  sourceHref?: string;
};

function Tile({ label, value, goal, detail, status, source, sourceHref }: TileProps) {
  const valueColor =
    status === "above"   ? "text-emerald-400" :
    status === "below"   ? "text-red-400"      :
    status === "pending" ? "text-[#5a6478]"    :
                           "text-[#c9a55e]";

  const badge =
    status === "above"   ? <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-widest">↑ Above goal</span> :
    status === "below"   ? <span className="text-[10px] font-semibold text-red-400 uppercase tracking-widest">↓ Below goal</span>    :
    status === "pending" ? <span className="text-[10px] text-[#5a6478] uppercase tracking-widest">⚠ Pending</span>                   :
    null;

  return (
    <div className="rounded-lg border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent p-5 flex flex-col gap-2 min-h-36">
      <div className="text-[10px] uppercase tracking-[0.18em] text-[#8b95a7] leading-snug">{label}</div>
      {goal && <div className="text-[10px] text-[#5a6478]">{goal}</div>}
      <div className={`text-3xl font-semibold tracking-tight ${valueColor}`}>{value}</div>
      {detail && <div className="text-[10px] text-[#8b95a7]">{detail}</div>}
      {badge}
      <div className="mt-auto pt-2 border-t border-white/[0.04]">
        {sourceHref ? (
          <a href={sourceHref} target="_blank" rel="noopener noreferrer"
            className="text-[10px] text-[#5a6478] hover:text-[#c9a55e] transition-colors leading-snug">
            {source} ↗
          </a>
        ) : (
          <div className="text-[10px] text-[#5a6478] leading-snug">{source}</div>
        )}
      </div>
    </div>
  );
}

export function CroKpiGrid({ sc }: { sc: CroScorecard }) {
  const confirmed = sc.funnels_within_kpi.rows.filter((r) => r.within_kpi === true).length;
  const total     = sc.funnels_within_kpi.rows.length;

  const tiles: TileProps[] = [
    {
      label: "Tests Launched",
      value: String(sc.tests_launched.actual),
      goal: `Goal: ${sc.tests_launched.goal}`,
      status: sc.tests_launched.actual >= sc.tests_launched.goal ? "above" : "below",
      source: "ClickUp · concluded tests in month",
    },
    {
      label: "% Winning Tests",
      value: sc.win_rate.actual,
      goal: `Goal: ${sc.win_rate.goal}`,
      detail: sc.win_rate.detail,
      status: parseFloat(sc.win_rate.actual) >= parseFloat(sc.win_rate.goal) ? "above" : "below",
      source: "Katherine's scorecard",
      sourceHref: SCORECARD_URL,
    },
    {
      label: "Est. $ Impact — Shipped Winners",
      value: "~$187K/mo",
      detail: "0546 (357 CoC Var B) · CVR lift est. from RPV data",
      status: "neutral",
      source: "Katherine's scorecard · verify CVR lift",
      sourceHref: SCORECARD_URL,
    },
    {
      label: "Paid Funnels Within KPI",
      value: `${confirmed} / ${total}`,
      goal: `KPI: ${sc.funnels_within_kpi.kpi}`,
      detail: sc.funnels_within_kpi.rows.map((r) => `${r.funnel} (${r.net_roas ?? "—"})`).join(" · "),
      status: confirmed === total ? "above" : "below",
      source: "DOMO · PGZ Ad Performance",
      sourceHref: WOW_URL,
    },
    {
      label: "PG1 Shopify Trial Lift (Testing)",
      value: sc.pg1_shopify_trials.value ?? "—",
      status: "pending",
      detail: sc.pg1_shopify_trials.note,
      source: "Testing dashboard",
      sourceHref: SCORECARD_URL,
    },
    {
      label: "PG1 CoC Trial Lift (Testing)",
      value: sc.pg1_coc_trials.value ?? "—",
      status: "pending",
      detail: sc.pg1_coc_trials.note,
      source: "Deprioritized — migrating off CoC",
    },
    {
      label: "CVR & AOV — Top 6 Funnels",
      value: "See below →",
      detail: sc.top_funnel_cvr_aov.map((r) => r.funnel).join(" · "),
      status: "neutral",
      source: "DOMO · Funnel Analytics",
      sourceHref: WOW_URL,
    },
    {
      label: "Rebuy Contribution to AOV",
      value: sc.rebuy_aov_contribution.value ?? "—",
      detail: sc.rebuy_aov_contribution.note,
      status: "neutral",
      source: "Rebuy dashboard · Jun 2026",
    },
  ];

  return (
    <div>
      {/* Patrick's automation note */}
      <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-4 mb-5 flex items-center justify-between gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-[#8b95a7] font-semibold mb-1">Automated Dashboard</div>
          <p className="text-xs text-[#5a6478]">
            Full DOMO-connected KPI dashboard in progress — built by Patrick. Values sourced from MBR until automation is live.
          </p>
        </div>
        <a
          href={PATRICK_CLICKUP}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-[10px] uppercase tracking-widest text-[#c9a55e] hover:text-[#d6b572] transition-colors whitespace-nowrap"
        >
          ClickUp task ↗
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {tiles.map((t) => (
          <Tile key={t.label} {...t} />
        ))}
      </div>
    </div>
  );
}
