import { fetchTasks } from "@/lib/clickup";
import { FUNNELS, funnelFromName, type FunnelCode } from "@/lib/funnels";
import { PrioritiesBoard } from "@/components/priorities-board";

export const dynamic = "force-dynamic";

const PIPELINE_STATUSES = ["initialized"];

export default async function PrioritiesPage() {
  let tasks: Awaited<ReturnType<typeof fetchTasks>> = [];
  let error: string | null = null;
  try {
    tasks = await fetchTasks({ statuses: PIPELINE_STATUSES });
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  const parents = tasks.filter((t) => !t.name.includes(" | "));

  const byFunnel: Record<FunnelCode | "OTHER", typeof parents> = Object.fromEntries(
    [...FUNNELS.map((f) => f.code), "OTHER"].map((c) => [c, [] as typeof parents]),
  ) as Record<FunnelCode | "OTHER", typeof parents>;

  for (const t of parents) {
    const code = funnelFromName(t.name);
    if (code) byFunnel[code].push(t);
    else byFunnel.OTHER.push(t);
  }

  return (
    <div>
      <div className="mb-8">
        <div className="text-[10px] tracking-[0.3em] text-[#c9a55e] uppercase font-semibold mb-2">
          06 · Backlog
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">Testing Priorities</h1>
        <p className="text-sm text-[#8b95a7] mt-1.5">
          Initialized tests, grouped by funnel · live from ClickUp · excludes backlog &amp; blocked
        </p>
      </div>
      {error ? (
        <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 p-4">
          <div className="font-medium text-rose-300">Couldn&apos;t load from ClickUp</div>
          <pre className="text-xs text-rose-200/80 mt-2 whitespace-pre-wrap">{error}</pre>
        </div>
      ) : (
        <PrioritiesBoard byFunnel={byFunnel} />
      )}
    </div>
  );
}
