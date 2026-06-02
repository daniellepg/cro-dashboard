import { db, tests, ideas } from "@/lib/db";
import { eq } from "drizzle-orm";
import { TestRow } from "@/components/test-row";

export const dynamic = "force-dynamic";

export default async function InProgressPage() {
  const rows = await db
    .select({
      id: tests.id,
      ideaId: tests.ideaId,
      name: tests.name,
      platform: tests.platform,
      variants: tests.variants,
      startDate: tests.startDate,
      endDate: tests.endDate,
      result: tests.result,
      liftPct: tests.liftPct,
      learnings: tests.learnings,
      ideaStatus: ideas.status,
    })
    .from(tests)
    .leftJoin(ideas, eq(tests.ideaId, ideas.id));

  const inProgress = rows.filter((r) => r.ideaStatus === "in_progress");

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">Tests In Progress</h1>
      <p className="text-sm text-slate-400 mb-6">
        Click any cell to edit. Mark complete to move into the monthly recap.
      </p>

      {inProgress.length === 0 ? (
        <div className="rounded-md border border-dashed border-slate-700 p-12 text-center text-slate-400">
          No tests running. Promote an idea from the{" "}
          <a href="/" className="text-amber-400 underline">
            prioritized list
          </a>
          .
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border border-slate-800">
          <table className="w-full text-sm">
            <thead className="bg-slate-900 text-slate-400">
              <tr>
                <th className="text-left px-3 py-2">Name</th>
                <th className="text-left px-3 py-2 w-32">Platform</th>
                <th className="text-left px-3 py-2 w-40">Variants</th>
                <th className="text-left px-3 py-2 w-32">Start</th>
                <th className="text-left px-3 py-2 w-32">End</th>
                <th className="text-left px-3 py-2 w-32">Status</th>
              </tr>
            </thead>
            <tbody>
              {inProgress.map((t) => (
                <TestRow key={t.id} test={t} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
