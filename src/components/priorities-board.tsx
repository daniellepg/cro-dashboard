"use client";

import { useState } from "react";
import type { ClickUpTask } from "@/lib/clickup";
import { FUNNELS, type FunnelCode } from "@/lib/funnels";

type ByFunnel = Record<FunnelCode | "OTHER", ClickUpTask[]>;

const STATUS_COLORS: Record<string, string> = {
  backlog: "bg-white/[0.06] text-[#8b95a7]",
  intake: "bg-violet-500/15 text-violet-300",
  "cro dev": "bg-[#c9a55e]/15 text-[#c9a55e]",
  "dev sprint": "bg-[#c9a55e]/15 text-[#c9a55e]",
  qa: "bg-sky-500/15 text-sky-300",
  analytics: "bg-emerald-500/15 text-emerald-300",
};

function statusPill(status: string) {
  const cls = STATUS_COLORS[status] ?? "bg-white/[0.06] text-[#8b95a7]";
  return (
    <span
      className={`text-[9px] tracking-[0.15em] uppercase font-semibold px-1.5 py-0.5 rounded ${cls}`}
    >
      {status}
    </span>
  );
}

export function PrioritiesBoard({ byFunnel }: { byFunnel: ByFunnel }) {
  const allCodes: (FunnelCode | "OTHER" | "ALL")[] = [
    "ALL",
    ...FUNNELS.map((f) => f.code),
    "OTHER",
  ];
  const [selected, setSelected] = useState<(FunnelCode | "OTHER" | "ALL")>("ALL");

  const counts: Record<string, number> = Object.fromEntries(
    Object.entries(byFunnel).map(([k, v]) => [k, v.length]),
  );
  counts.ALL = Object.values(byFunnel).reduce((n, arr) => n + arr.length, 0);

  const visibleFunnels =
    selected === "ALL"
      ? (Object.keys(byFunnel) as (FunnelCode | "OTHER")[]).filter((k) => byFunnel[k].length > 0)
      : [selected as FunnelCode | "OTHER"];

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-8">
        {allCodes.map((code) => {
          const active = selected === code;
          const n = counts[code] ?? 0;
          return (
            <button
              key={code}
              onClick={() => setSelected(code)}
              className={`px-3 py-1.5 rounded-md text-sm border transition-colors font-medium ${
                active
                  ? "bg-[#c9a55e] text-[#0a0e14] border-[#c9a55e]"
                  : "bg-white/[0.03] text-[#8b95a7] border-white/10 hover:border-[#c9a55e]/40 hover:text-[#f4f5f7]"
              }`}
            >
              {code} <span className="opacity-60 ml-1">{n}</span>
            </button>
          );
        })}
      </div>

      <div className="space-y-8">
        {visibleFunnels.map((code) => {
          const tasks = byFunnel[code];
          if (!tasks.length) return null;
          return (
            <section key={code}>
              <h2 className="text-lg font-medium mb-3">
                {code}
                <span className="text-[#5a6478] text-sm ml-2">({tasks.length})</span>
              </h2>
              <div className="rounded-lg border border-white/[0.08] overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    {tasks.map((t) => (
                      <tr
                        key={t.id}
                        className="border-t border-white/[0.06] hover:bg-white/[0.02]"
                      >
                        <td className="px-4 py-3">
                          <a
                            href={t.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium hover:text-[#c9a55e]"
                          >
                            {t.name}
                          </a>
                        </td>
                        <td className="px-4 py-3 w-32 text-right">
                          {statusPill(t.status.status)}
                        </td>
                        <td className="px-4 py-3 w-40 text-[#8b95a7] text-xs">
                          {t.assignees?.[0]?.username ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
