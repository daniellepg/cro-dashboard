import Link from "next/link";
import { countTasksByStatus } from "@/lib/clickup";

export const dynamic = "force-dynamic";

const FORM_URL =
  "https://performancegolf.clickup.com/forms/9014714949/f/8cn38j5-44774/TVQNQP9X187JT2XIGE";

export default async function CoverPage() {
  const [liveCount, initializedCount] = await Promise.all([
    countTasksByStatus("live"),
    countTasksByStatus("initialized"),
  ]);

  const tiles = [
    {
      href: "/live-tests",
      title: "Live Tests",
      subtitle: "Currently running",
      stat: liveCount,
      accent: "from-emerald-500/30 to-emerald-500/5 border-emerald-500/40",
    },
    {
      href: "/initialized-tests",
      title: "Initialized Tests",
      subtitle: "Set up, not yet live",
      stat: initializedCount,
      accent: "from-sky-500/30 to-sky-500/5 border-sky-500/40",
    },
    {
      href: FORM_URL,
      title: "Submit an Idea",
      subtitle: "ClickUp intake form",
      stat: null,
      external: true,
      accent: "from-amber-400/30 to-amber-400/5 border-amber-400/40",
    },
    {
      href: "/funnel-data",
      title: "WoW Data by Funnel",
      subtitle: "Week-over-week, from Domo",
      stat: null,
      accent: "from-purple-500/30 to-purple-500/5 border-purple-500/40",
    },
    {
      href: "/kpis",
      title: "Key KPIs",
      subtitle: "Monthly KPI board",
      stat: null,
      accent: "from-rose-500/30 to-rose-500/5 border-rose-500/40",
    },
    {
      href: "/priorities",
      title: "Testing Priorities",
      subtitle: "Backlog by funnel",
      stat: null,
      accent: "from-teal-500/30 to-teal-500/5 border-teal-500/40",
    },
  ];

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">CRO Dashboard</h1>
        <p className="text-slate-400 mt-1">Performance Golf Zone — Conversion Rate Optimization</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tiles.map((t) => {
          const inner = (
            <div
              className={`group relative h-44 rounded-xl border bg-gradient-to-br ${t.accent} p-5 transition-transform hover:-translate-y-0.5 hover:shadow-lg`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-lg font-medium">{t.title}</div>
                  <div className="text-sm text-slate-400 mt-0.5">{t.subtitle}</div>
                </div>
                {t.external && (
                  <span className="text-xs text-slate-400">↗ ClickUp</span>
                )}
              </div>
              {t.stat !== null && t.stat !== undefined && (
                <div className="absolute bottom-5 left-5">
                  <div className="text-5xl font-semibold tracking-tight">{t.stat}</div>
                </div>
              )}
              <div className="absolute bottom-5 right-5 text-slate-400 group-hover:text-slate-100 transition-colors">
                →
              </div>
            </div>
          );

          return t.external ? (
            <a key={t.href} href={t.href} target="_blank" rel="noopener noreferrer">
              {inner}
            </a>
          ) : (
            <Link key={t.href} href={t.href}>
              {inner}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
