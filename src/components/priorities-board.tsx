"use client";

import { useState } from "react";
import type { ClickUpTask } from "@/lib/clickup";
import { FUNNELS, type FunnelCode } from "@/lib/funnels";

type ByFunnel = Record<FunnelCode | "OTHER", ClickUpTask[]>;

const STATUS_COLORS: Record<string, string> = {
  backlog: "bg-slate-700/40 text-slate-200",
  intake: "bg-violet-500/20 text-violet-300",
  "cro dev": "bg-amber-500/20 text-amber-300",
  "dev sprint": "bg-amber-500/20 text-amber-300",
  qa: "bg-sky-500/20 text-sky-300",
  analytics: "bg-emerald-500/20 text-emerald-300",
};

function statusPill(status: string) {
  const cls = STATUS_COLORS[status] ?? "bg-slate-700/40 text-slate-200";
  return (
    <span className={`text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded ${cls}`}>
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
      {/* Funnel toggle pills */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {allCodes.map((code) => {
          const active = selected === code;
          const n = counts[code] ?? 0;
          return (
            <button
              key={code}
              onClick={() => setSelected(code)}
              className={`px-3 py-1.5 rounded-md text-sm border transition-colors ${
                active
                  ? "bg-amber-400 text-slate-950 border-amber-400 font-medium"
                  : "bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500"
              }`}
            >
              {code} <span className="opacity-60 ml-1">{n}</span>
            </button>
          );
        })}
      </div>

      {/* Funnel sections */}
      <div className="space-y-8">
        {visibleFunnels.map((code) => {
          const tasks = byFunnel[code];
          if (!tasks.length) return null;
          return (
            <section key={code}>
              <h2 className="text-lg font-medium mb-2">
                {code} <span className="text-slate-500 text-sm">({tasks.length})</span>
              </h2>
              <div className="rounded-lg border border-slate-800 overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    {tasks.map((t) => (
                      <tr key={t.id} className="border-t border-slate-800 hover:bg-slate-900/40">
                        <td className="px-4 py-2.5">
                          <a
                            href={t.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium hover:text-amber-300"
                          >
                            {t.name}
                          </a>
                        </td>
                        <td className="px-4 py-2.5 w-32 text-right">
                          {statusPill(t.status.status)}
                        </td>
                        <td className="px-4 py-2.5 w-40 text-slate-400 text-xs">
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
