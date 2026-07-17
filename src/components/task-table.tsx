import type { ClickUpTask } from "@/lib/clickup";
import { funnelFromName } from "@/lib/funnels";

function formatDate(ms?: string | null) {
  if (!ms) return "—";
  const d = new Date(Number(ms));
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function TaskTable({ tasks }: { tasks: ClickUpTask[] }) {
  const parents = tasks.filter((t) => !t.name.includes(" | "));

  if (parents.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-white/[0.1] p-12 text-center text-[#8b95a7]">
        No tasks in this status right now.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-white/[0.08]">
      <table className="w-full text-sm">
        <thead className="bg-white/[0.03] text-[#8b95a7] text-left">
          <tr>
            <th className="px-4 py-3 font-medium text-[10px] tracking-[0.18em] uppercase">Test</th>
            <th className="px-4 py-3 font-medium w-24 text-[10px] tracking-[0.18em] uppercase">Funnel</th>
            <th className="px-4 py-3 font-medium w-40 text-[10px] tracking-[0.18em] uppercase">Owner</th>
            <th className="px-4 py-3 font-medium w-28 text-[10px] tracking-[0.18em] uppercase">Due</th>
            <th className="px-4 py-3 font-medium w-12" />
          </tr>
        </thead>
        <tbody>
          {parents.map((t) => {
            const funnel = funnelFromName(t.name);
            return (
              <tr key={t.id} className="border-t border-white/[0.06] hover:bg-white/[0.02]">
                <td className="px-4 py-3 font-medium">{t.name}</td>
                <td className="px-4 py-3">
                  {funnel ? (
                    <span className="inline-block px-2 py-0.5 rounded border border-[#FD3300]/30 bg-[#FD3300]/10 text-[#FD3300] text-xs font-medium">
                      {funnel}
                    </span>
                  ) : (
                    <span className="text-[#5a6478] text-xs">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-[#8b95a7]">
                  {t.assignees?.[0]?.username ?? "—"}
                </td>
                <td className="px-4 py-3 text-[#8b95a7]">{formatDate(t.due_date)}</td>
                <td className="px-4 py-3">
                  <a
                    href={t.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#5a6478] hover:text-[#FD3300]"
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
