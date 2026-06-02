import Link from "next/link";
import { db, ideas } from "@/lib/db";
import { eq } from "drizzle-orm";
import { CRITERIA, scoreOf, type CriterionKey } from "@/lib/criteria";
import { IdeaRow } from "@/components/idea-row";

export const dynamic = "force-dynamic";

export default async function PrioritizedPage() {
  const rows = await db.select().from(ideas).where(eq(ideas.status, "backlog"));

  const sorted = rows
    .map((r) => ({ ...r, score: scoreOf(r as unknown as Record<CriterionKey, boolean>) }))
    .sort((a, b) => b.score - a.score);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Prioritized Tests</h1>
          <p className="text-sm text-slate-400">
            Ranked by framework score (0–10). Toggle boxes inline.
          </p>
        </div>
        <Link
          href="/submit"
          className="rounded-md bg-amber-400 text-slate-950 font-medium px-4 py-2 text-sm hover:bg-amber-300"
        >
          + Submit Idea
        </Link>
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-md border border-dashed border-slate-700 p-12 text-center text-slate-400">
          No ideas yet. <Link href="/submit" className="text-amber-400 underline">Submit one</Link>.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border border-slate-800">
          <table className="w-full text-sm">
            <thead className="bg-slate-900 text-slate-400">
              <tr>
                <th className="text-left px-3 py-2 w-12">Score</th>
                <th className="text-left px-3 py-2">Hypothesis</th>
                {CRITERIA.map((c) => (
                  <th
                    key={c.key}
                    title={c.label}
                    className="px-1 py-2 text-center w-10"
                  >
                    <div className="text-[10px] font-medium leading-tight">
                      {c.label.replace("?", "").split(" ").slice(0, 2).join(" ")}
                    </div>
                  </th>
                ))}
                <th className="text-right px-3 py-2 w-32">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((row) => (
                <IdeaRow key={row.id} idea={row} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
