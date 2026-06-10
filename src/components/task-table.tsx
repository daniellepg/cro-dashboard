import type { ClickUpTask } from "@/lib/clickup";
import { funnelFromName } from "@/lib/funnels";

function formatDate(ms?: string | null) {
  if (!ms) return "—";
  const d = new Date(Number(ms));
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function TaskTable({ tasks }: { tasks: ClickUpTask[] }) {
  // Only show parent tasks (subtasks have " | " in their name pattern: "Step | TestName")
  const parents = tasks.filter((t) => !t.name.includes(" | "));

  if (parents.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-700 p-12 text-center text-slate-400">
        No tasks in this status right now.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-800">
      <table className="w-full text-sm">
        <thead className="bg-slate-900/60 text-slate-400 text-left">
          <tr>
            <th className="px-4 py-2.5 font-medium">Test</th>
            <th className="px-4 py-2.5 font-medium w-24">Funnel</th>
            <th className="px-4 py-2.5 font-medium w-40">Owner</th>
            <th className="px-4 py-2.5 font-medium w-28">Due</th>
            <th className="px-4 py-2.5 font-medium w-12" />
          </tr>
        </thead>
        <tbody>
          {parents.map((t) => {
            const funnel = funnelFromName(t.name);
            return (
              <tr key={t.id} className="border-t border-slate-800 hover:bg-slate-900/40">
                <td className="px-4 py-2.5 font-medium">{t.name}</td>
                <td className="px-4 py-2.5">
                  {funnel ? (
                    <span className="inline-block px-2 py-0.5 rounded bg-slate-800 text-xs">
                      {funnel}
                    </span>
                  ) : (
                    <span className="text-slate-500 text-xs">—</span>
                  )}
                </td>
                <td className="px-4 py-2.5 text-slate-300">
                  {t.assignees?.[0]?.username ?? "—"}
                </td>
                <td className="px-4 py-2.5 text-slate-300">{formatDate(t.due_date)}</td>
                <td className="px-4 py-2.5">
                  <a
                    href={t.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-amber-300"
                    title="Open in ClickUp"
                  >
                    ↗
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
