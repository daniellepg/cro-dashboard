"use client";

import { useState, useEffect, useCallback } from "react";
import type { ClickUpTask } from "@/lib/clickup";
import { FUNNELS, type FunnelCode } from "@/lib/funnels";
import { CRITERIA, blankRow, scoreOf, MAX_SCORE, type PxlRow, type CriterionKey } from "@/lib/criteria";

type ByFunnel = Record<FunnelCode | "OTHER", ClickUpTask[]>;

// ── Status pill ─────────────────────────────────────────────────────────────
const STATUS_COLORS: Record<string, string> = {
  backlog:      "bg-white/[0.06] text-[#8b95a7]",
  intake:       "bg-violet-500/15 text-violet-300",
  "cro dev":    "bg-[#FD3300]/15 text-[#FD3300]",
  "dev sprint": "bg-[#FD3300]/15 text-[#FD3300]",
  qa:           "bg-sky-500/15 text-sky-300",
  analytics:    "bg-emerald-500/15 text-emerald-300",
};

function StatusPill({ status }: { status: string }) {
  const cls = STATUS_COLORS[status] ?? "bg-white/[0.06] text-[#8b95a7]";
  return (
    <span className={`text-[9px] tracking-[0.15em] uppercase font-semibold px-1.5 py-0.5 rounded ${cls}`}>
      {status}
    </span>
  );
}

// ── Score bar ───────────────────────────────────────────────────────────────
function ScoreBar({ score }: { score: number }) {
  const pct = Math.round((score / MAX_SCORE) * 100);
  const color = pct >= 70 ? "bg-emerald-500" : pct >= 40 ? "bg-[#FD3300]" : "bg-white/20";
  return (
    <div className="flex items-center gap-2 min-w-[80px]">
      <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[11px] font-semibold tabular-nums text-[#f4f5f7]">{score}/{MAX_SCORE}</span>
    </div>
  );
}

// ── Ease selector (0-3) ──────────────────────────────────────────────────────
const EASE_LABELS: Record<number, string> = { 3: "<4h", 2: "≤8h", 1: "<2d", 0: ">2d" };

function EaseSelect({ value, onChange }: { value: 0|1|2|3; onChange: (v: 0|1|2|3) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value) as 0|1|2|3)}
      className="bg-transparent text-[11px] text-[#f4f5f7] text-center focus:outline-none cursor-pointer w-full"
    >
      {([3,2,1,0] as const).map((v) => (
        <option key={v} value={v} className="bg-[#121821]">{EASE_LABELS[v]} ({v})</option>
      ))}
    </select>
  );
}

// ── Bool / Bool2 cell ────────────────────────────────────────────────────────
function CriterionCell({
  criterion, value, onChange,
}: {
  criterion: (typeof CRITERIA)[number];
  value: boolean | 0|1|2|3;
  onChange: (v: boolean | 0|1|2|3) => void;
}) {
  if (criterion.type === "ease") {
    return (
      <td className="px-2 py-2 text-center border-r border-white/[0.04] last:border-r-0">
        <EaseSelect value={value as 0|1|2|3} onChange={onChange as (v:0|1|2|3)=>void} />
      </td>
    );
  }
  const checked = value as boolean;
  const pts = criterion.type === "bool2" ? 2 : 1;
  return (
    <td className="px-2 py-2 text-center border-r border-white/[0.04] last:border-r-0">
      <button
        onClick={() => onChange(!checked)}
        className={`w-6 h-6 rounded transition-colors text-[10px] font-bold ${
          checked
            ? "bg-[#FD3300] text-[#0a0e14]"
            : "bg-white/[0.06] text-[#5a6478] hover:bg-white/[0.12]"
        }`}
        title={`${criterion.label} — ${checked ? pts : 0}/${pts} pts`}
      >
        {checked ? "✓" : ""}
      </button>
    </td>
  );
}

// ── Leadership star ──────────────────────────────────────────────────────────
function LeadershipCell({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <td className="px-3 py-2 text-center border-r border-white/[0.04]">
      <button
        onClick={() => onChange(!value)}
        title="Mark as Priority for Leadership"
        className={`text-base transition-colors ${value ? "text-[#FD3300]" : "text-[#3a4050] hover:text-[#FD3300]/50"}`}
      >
        ★
      </button>
    </td>
  );
}

// ── Main board ───────────────────────────────────────────────────────────────
export function PrioritiesBoard({ byFunnel }: { byFunnel: ByFunnel }) {
  const allCodes: (FunnelCode | "OTHER" | "ALL")[] = ["ALL", ...FUNNELS.map((f) => f.code), "OTHER"];
  const [selected, setSelected] = useState<FunnelCode | "OTHER" | "ALL">("ALL");

  // PXL scores keyed by task ID, stored in localStorage
  const [scores, setScores] = useState<Record<string, PxlRow>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem("pxl-scores");
      if (raw) setScores(JSON.parse(raw));
    } catch {}
  }, []);

  const updateScore = useCallback(
    (taskId: string, patch: Partial<PxlRow>) => {
      setScores((prev) => {
        const next = { ...prev, [taskId]: { ...(prev[taskId] ?? blankRow()), ...patch } };
        try { localStorage.setItem("pxl-scores", JSON.stringify(next)); } catch {}
        return next;
      });
    },
    []
  );

  const counts: Record<string, number> = Object.fromEntries(
    Object.entries(byFunnel).map(([k, v]) => [k, v.length])
  );
  counts.ALL = Object.values(byFunnel).reduce((n, arr) => n + arr.length, 0);

  const visibleFunnels =
    selected === "ALL"
      ? (Object.keys(byFunnel) as (FunnelCode | "OTHER")[]).filter((k) => byFunnel[k].length > 0)
      : [selected as FunnelCode | "OTHER"];

  return (
    <div>
      {/* Funnel filter tabs */}
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
                  ? "bg-[#FD3300] text-[#0a0e14] border-[#FD3300]"
                  : "bg-white/[0.03] text-[#8b95a7] border-white/10 hover:border-[#FD3300]/40 hover:text-[#f4f5f7]"
              }`}
            >
              {code} <span className="opacity-60 ml-1">{n}</span>
            </button>
          );
        })}
      </div>

      {/* PXL legend */}
      <div className="rounded-lg border border-white/[0.08] bg-[#121821] px-5 py-3 mb-6 text-[11px] text-[#8b95a7] flex flex-wrap gap-x-6 gap-y-1">
        <span className="font-semibold text-[#FD3300] tracking-wider uppercase text-[10px]">PXL Scoring</span>
        {CRITERIA.map((c) => (
          <span key={c.key}><span className="text-[#f4f5f7]">{c.short}</span> = {c.max}pt{c.max !== 1 ? "s" : ""}</span>
        ))}
        <span><span className="text-[#f4f5f7]">★</span> = Leadership priority</span>
        <span className="ml-auto">Max: {MAX_SCORE} pts</span>
      </div>

      {/* Tables per funnel */}
      <div className="space-y-10">
        {visibleFunnels.map((code) => {
          const tasks = byFunnel[code];
          if (!tasks.length) return null;

          // Sort tasks by PXL score descending (unscored tasks last)
          const sorted = [...tasks].sort((a, b) => {
            const sa = scoreOf(scores[a.id] ?? blankRow());
            const sb = scoreOf(scores[b.id] ?? blankRow());
            return sb - sa;
          });

          return (
            <section key={code}>
              <h2 className="text-lg font-medium mb-3">
                {code}
                <span className="text-[#5a6478] text-sm ml-2">({tasks.length})</span>
              </h2>

              <div className="rounded-lg border border-white/[0.08] overflow-x-auto">
                <table className="w-full text-[11px] border-collapse">
                  <thead>
                    <tr className="bg-white/[0.02] border-b border-white/[0.08]">
                      {/* Fixed columns */}
                      <th className="px-4 py-2.5 text-left text-[10px] tracking-widest text-[#8b95a7] uppercase font-semibold border-r border-white/[0.06] min-w-[240px]">
                        Test
                      </th>
                      <th className="px-3 py-2.5 text-center text-[10px] tracking-widest text-[#8b95a7] uppercase font-semibold border-r border-white/[0.06] w-24">
                        Status
                      </th>
                      {/* PXL criteria */}
                      {CRITERIA.map((c) => (
                        <th
                          key={c.key}
                          className="px-2 py-2.5 text-center text-[10px] tracking-widest text-[#8b95a7] uppercase font-semibold border-r border-white/[0.04] w-14"
                          title={c.label}
                        >
                          {c.short}
                          {c.max > 1 && (
                            <span className="block text-[9px] text-[#5a6478] normal-case tracking-normal font-normal">
                              {c.type === "ease" ? "0–3" : `0/${c.max}`}
                            </span>
                          )}
                        </th>
                      ))}
                      {/* Leadership priority */}
                      <th className="px-3 py-2.5 text-center text-[10px] tracking-widest text-[#FD3300] uppercase font-semibold border-r border-white/[0.06] w-16"
                          title="Priority for Leadership">
                        ★ Lead
                      </th>
                      {/* Score */}
                      <th className="px-4 py-2.5 text-left text-[10px] tracking-widest text-[#8b95a7] uppercase font-semibold w-32">
                        Score
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((t) => {
                      const row = scores[t.id] ?? blankRow();
                      const score = scoreOf(row);
                      const isLeadership = row.leadershipPriority;

                      return (
                        <tr
                          key={t.id}
                          className={`border-t border-white/[0.06] transition-colors ${
                            isLeadership
                              ? "bg-[#FD3300]/[0.04] hover:bg-[#FD3300]/[0.07]"
                              : "hover:bg-white/[0.02]"
                          }`}
                        >
                          {/* Task name */}
                          <td className="px-4 py-2.5 border-r border-white/[0.06]">
                            <div className="flex items-center gap-2">
                              {isLeadership && (
                                <span className="text-[#FD3300] text-[10px]">★</span>
                              )}
                              <a
                                href={t.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-[12px] hover:text-[#FD3300] transition-colors"
                              >
                                {t.name}
                              </a>
                            </div>
                            {t.assignees?.[0]?.username && (
                              <div className="text-[#5a6478] text-[10px] mt-0.5 ml-4">
                                {t.assignees[0].username}
                              </div>
                            )}
                          </td>

                          {/* Status */}
                          <td className="px-3 py-2.5 text-center border-r border-white/[0.06]">
                            <StatusPill status={t.status.status} />
                          </td>

                          {/* PXL criteria cells */}
                          {CRITERIA.map((c) => (
                            <CriterionCell
                              key={c.key}
                              criterion={c}
                              value={row[c.key as CriterionKey]}
                              onChange={(v) => updateScore(t.id, { [c.key]: v } as Partial<PxlRow>)}
                            />
                          ))}

                          {/* Leadership priority */}
                          <LeadershipCell
                            value={row.leadershipPriority}
                            onChange={(v) => updateScore(t.id, { leadershipPriority: v })}
                          />

                          {/* Score bar */}
                          <td className="px-4 py-2.5">
                            <ScoreBar score={score} />
                          </td>
                        </tr>
                      );
                    })}
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
