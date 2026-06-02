import { db, tests, ideas, recaps } from "@/lib/db";
import { and, eq, gte, lte, isNotNull } from "drizzle-orm";
import { RecapEditor } from "@/components/recap-editor";

export const dynamic = "force-dynamic";

function defaultMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default async function RecapPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month: monthParam } = await searchParams;
  const month = monthParam ?? defaultMonth();
  const [year, mo] = month.split("-").map(Number);
  const start = `${year}-${String(mo).padStart(2, "0")}-01`;
  const endDate = new Date(year, mo, 0);
  const end = `${year}-${String(mo).padStart(2, "0")}-${String(endDate.getDate()).padStart(2, "0")}`;

  const closed = await db
    .select({
      id: tests.id,
      name: tests.name,
      platform: tests.platform,
      result: tests.result,
      liftPct: tests.liftPct,
      learnings: tests.learnings,
      endDate: tests.endDate,
    })
    .from(tests)
    .leftJoin(ideas, eq(tests.ideaId, ideas.id))
    .where(
      and(
        eq(ideas.status, "complete"),
        isNotNull(tests.endDate),
        gte(tests.endDate, start),
        lte(tests.endDate, end),
      ),
    );

  const wins = closed.filter((t) => t.result === "win").length;
  const losses = closed.filter((t) => t.result === "loss").length;
  const inconclusive = closed.filter((t) => t.result === "inconclusive").length;

  const existing = await db.select().from(recaps).where(eq(recaps.month, month));
  const narrative = existing[0]?.narrative ?? "";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Monthly CRO Recap</h1>
        <form className="flex items-center gap-2">
          <label className="text-sm text-slate-400">Month</label>
          <input
            type="month"
            name="month"
            defaultValue={month}
            className="rounded-md bg-slate-900 border border-slate-700 px-2 py-1 text-sm"
          />
          <button
            type="submit"
            className="text-sm px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700"
          >
            Go
          </button>
        </form>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-8">
        <Stat label="Tests closed" value={closed.length} />
        <Stat label="Wins" value={wins} color="text-emerald-400" />
        <Stat label="Losses" value={losses} color="text-rose-400" />
        <Stat label="Inconclusive" value={inconclusive} color="text-slate-400" />
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-medium mb-3">Closed tests</h2>
        {closed.length === 0 ? (
          <p className="text-slate-500 text-sm">No tests closed in {month}.</p>
        ) : (
          <ul className="space-y-2">
            {closed.map((t) => (
              <li
                key={t.id}
                className="rounded-md border border-slate-800 bg-slate-900 p-3"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="font-medium">{t.name}</div>
                  <ResultBadge result={t.result} />
                </div>
                {t.learnings && (
                  <p className="text-sm text-slate-400 mt-1.5">{t.learnings}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h2 className="text-lg font-medium mb-3">Narrative</h2>
        <RecapEditor month={month} initialNarrative={narrative} />
      </div>
    </div>
  );
}

function Stat({ label, value, color = "text-slate-100" }: { label: string; value: number; color?: string }) {
  return (
    <div className="rounded-md border border-slate-800 bg-slate-900 p-4">
      <div className="text-xs text-slate-400 uppercase tracking-wide">{label}</div>
      <div className={`text-3xl font-semibold mt-1 ${color}`}>{value}</div>
    </div>
  );
}

function ResultBadge({ result }: { result: string | null }) {
  if (!result) return <span className="text-xs text-slate-500">—</span>;
  const styles: Record<string, string> = {
    win: "bg-emerald-500/20 text-emerald-300",
    loss: "bg-rose-500/20 text-rose-300",
    inconclusive: "bg-slate-500/20 text-slate-300",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded ${styles[result]}`}>{result}</span>
  );
}
