import Link from "next/link";
import { countTasksByStatus } from "@/lib/clickup";

export const dynamic = "force-dynamic";

const FORM_URL =
  "https://performancegolf.clickup.com/forms/9014714949/f/8cn38j5-44774/TVQNQP9X187JT2XIGE";

type Tile = {
  href: string;
  title: string;
  subtitle: string;
  stat?: number | null;
  external?: boolean;
};

function TileCard({ t }: { t: Tile }) {
  const inner = (
    <div className="group relative h-44 rounded-lg border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent p-5 transition-all hover:border-[#c9a55e]/40 hover:from-[#c9a55e]/[0.06]">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-base font-medium">{t.title}</div>
          <div className="text-xs text-[#8b95a7] mt-0.5">{t.subtitle}</div>
        </div>
        {t.external && (
          <span className="text-[10px] tracking-wider text-[#8b95a7] uppercase">↗ ClickUp</span>
        )}
      </div>
      {t.stat !== null && t.stat !== undefined && (
        <div className="absolute bottom-5 left-5">
          <div className="text-4xl font-semibold tracking-tight text-[#c9a55e]">{t.stat}</div>
        </div>
      )}
      <div className="absolute bottom-5 right-5 text-[#5a6478] group-hover:text-[#c9a55e] transition-colors">
        →
      </div>
    </div>
  );
  return t.external ? (
    <a href={t.href} target="_blank" rel="noopener noreferrer">
      {inner}
    </a>
  ) : (
    <Link href={t.href}>{inner}</Link>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="text-[10px] tracking-[0.3em] text-[#c9a55e] uppercase font-semibold">
        {label}
      </div>
      <div className="flex-1 h-px bg-white/[0.06]" />
    </div>
  );
}

export default async function CoverPage() {
  const [liveCount, initializedCount] = await Promise.all([
    countTasksByStatus("live"),
    countTasksByStatus("initialized"),
  ]);

  const testing: Tile[] = [
    { href: "/live-tests", title: "Live Tests", subtitle: "Currently running", stat: liveCount },
    {
      href: "/initialized-tests",
      title: "Initialized Tests",
      subtitle: "Set up, not yet live",
      stat: initializedCount,
    },
    { href: "/priorities", title: "Testing Priorities", subtitle: "Backlog by funnel" },
    { href: "/scorecards", title: "Scorecards", subtitle: "Per-test readouts" },
    { href: "/bandwidth", title: "Test Bandwidth", subtitle: "MDE & capacity by page" },
  ];

  const data: Tile[] = [
    { href: "/funnel-data", title: "WoW Data by Funnel", subtitle: "Week-over-week · from Domo" },
    { href: "/kpis", title: "CRO Key KPIs", subtitle: "Monthly KPI board" },
  ];

  return (
    <div>
      {/* Header + top CTA */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <div className="text-[10px] tracking-[0.3em] text-[#c9a55e] uppercase font-semibold mb-3">
            Conversion Rate Optimization
          </div>
          <h1 className="text-4xl font-semibold tracking-tight">CRO Command Center</h1>
          <p className="text-[#8b95a7] mt-2 max-w-xl">
            Live test pipeline, funnel performance, and the testing backlog — all in one place.
          </p>
        </div>
        <a
          href={FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-[#c9a55e] text-[#0a0e14] font-semibold text-sm uppercase tracking-[0.15em] hover:bg-[#d6b572] transition-colors whitespace-nowrap shadow-lg shadow-[#c9a55e]/10"
        >
          + Submit a Test
        </a>
      </div>

      {/* Testing section */}
      <section className="mb-10">
        <SectionHeader label="Testing" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {testing.map((t) => (
            <TileCard key={t.href} t={t} />
          ))}
        </div>
      </section>

      {/* Data section */}
      <section>
        <SectionHeader label="Data" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {data.map((t) => (
            <TileCard key={t.href} t={t} />
          ))}
        </div>
      </section>
    </div>
  );
}
