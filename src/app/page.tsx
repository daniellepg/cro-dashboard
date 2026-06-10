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
      eyebrow: "01",
      title: "Live Tests",
      subtitle: "Currently running",
      stat: liveCount,
    },
    {
      href: "/initialized-tests",
      eyebrow: "02",
      title: "Initialized Tests",
      subtitle: "Set up, not yet live",
      stat: initializedCount,
    },
    {
      href: FORM_URL,
      eyebrow: "03",
      title: "Submit an Idea",
      subtitle: "ClickUp intake form",
      stat: null,
      external: true,
    },
    {
      href: "/funnel-data",
      eyebrow: "04",
      title: "WoW Data by Funnel",
      subtitle: "Week-over-week · from Domo",
      stat: null,
    },
    {
      href: "/kpis",
      eyebrow: "05",
      title: "Key KPIs",
      subtitle: "Monthly KPI board",
      stat: null,
    },
    {
      href: "/priorities",
      eyebrow: "06",
      title: "Testing Priorities",
      subtitle: "Backlog by funnel",
      stat: null,
    },
  ];

  return (
    <div>
      <div className="mb-12">
        <div className="text-[10px] tracking-[0.3em] text-[#c9a55e] uppercase font-semibold mb-3">
          Conversion Rate Optimization
        </div>
        <h1 className="text-4xl font-semibold tracking-tight">CRO Command Center</h1>
        <p className="text-[#8b95a7] mt-2 max-w-xl">
          Live test pipeline, funnel performance, and the testing backlog — all in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {tiles.map((t) => {
          const inner = (
            <div className="group relative h-48 rounded-lg border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent p-6 transition-all hover:border-[#c9a55e]/40 hover:from-[#c9a55e]/[0.06]">
              <div className="flex items-start justify-between">
                <div className="text-[10px] tracking-[0.25em] text-[#5a6478] uppercase font-semibold">
                  {t.eyebrow}
                </div>
                {t.external && (
                  <span className="text-[10px] tracking-wider text-[#8b95a7] uppercase">
                    ↗ ClickUp
                  </span>
                )}
              </div>
              <div className="mt-3">
                <div className="text-lg font-medium">{t.title}</div>
                <div className="text-sm text-[#8b95a7] mt-0.5">{t.subtitle}</div>
              </div>
              {t.stat !== null && t.stat !== undefined && (
                <div className="absolute bottom-6 left-6">
                  <div className="text-5xl font-semibold tracking-tight text-[#c9a55e]">
                    {t.stat}
                  </div>
                </div>
              )}
              <div className="absolute bottom-6 right-6 text-[#5a6478] group-hover:text-[#c9a55e] transition-colors">
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
