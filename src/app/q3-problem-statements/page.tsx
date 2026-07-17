"use client";

import { useEffect, useRef, useState } from "react";

const TILES = ["RS1", "SF2", "357", "PG1", "SSP", "Little Legends"];
const ROW_COUNT = 5;
const STORAGE_KEY = "q3-problem-statements-v1";

type Grid = string[][];

// col order: RS1, SF2, 357, PG1, SSP, Little Legends
const DEFAULT_GRID: Grid = [
  [
    "RS1 is paused through mid-to-late August due to inventory. No testing until stock returns — focus shifts to reactivation CVR once traffic resumes.",
    "Visitors aren't converting because they don't understand what SF2 teaches or who it's for — the page lacks specificity about the outcome, leading to drop-off before the CTA.",
    "CVR dropped after the price increase and hasn't recovered — we don't know if the issue is price anchoring, perceived value, or page framing.",
    "We're leaving subscription attach revenue on the table because every method we've tried hurts initial CVR — we need an offer structure that captures subs without eroding trial volume.",
    "SSP has chronically low CVR and we don't have a clear hypothesis for why — we need session replay + funnel data to identify the biggest drop-off point before writing a testable hypothesis.",
    "We haven't aligned on the primary KPI for Little Legends — is it program sign-ups, product purchase, or email capture? The problem statement depends on that decision.",
  ],
  [
    "Once RS1 restocks, we expect a CVR dip from a gap in traffic warmth — we need a reactivation angle (urgency, scarcity, updated social proof) to recover baseline quickly.",
    "The SF2 offer is being evaluated too early — prospects don't have enough context about the transformation before they hit the price, causing sticker shock and abandonment.",
    "We're not communicating the value delta between the old and new price — there's no anchor, no justification, and no risk reversal strong enough to overcome the price sensitivity.",
    "Trial-to-paid conversion is our biggest leverage point — too many users start a trial and don't convert, and we don't know if that's an onboarding gap, billing friction, or perceived value problem.",
    "We don't know what SSP's best-converting traffic source looks like — the funnel may be attracting the wrong audience, which no page test will fix.",
    "Little Legends has no established baseline — we need a measurement plan before testing so we know what a win actually looks like.",
  ],
  [
    "RS1's creative and messaging may go stale during the stock pause — we risk re-launching into a cold audience with outdated hooks if we don't plan a creative refresh now.",
    "SF2 doesn't surface enough proof from people like the buyer — testimonials are generic and don't address the specific transformation a senior golfer is looking for.",
    "The 357 page doesn't have a strong enough risk reversal to offset price sensitivity — the guarantee or trial structure needs to do more work.",
    "The V3 pricing model is working but we haven't optimized the page around it yet — there's likely CVR upside in how we present the offer, not just the price itself.",
    "SSP's above-the-fold doesn't clearly communicate who it's for or what problem it solves — visitors have to read too far before they self-select.",
    "Little Legends has no social proof from parents or junior players — without credibility signals, price sensitivity will be high regardless of the offer.",
  ],
  [
    "",
    "",
    "",
    "",
    "",
    "",
  ],
  [
    "",
    "",
    "",
    "",
    "",
    "",
  ],
];

function emptyGrid(): Grid {
  return DEFAULT_GRID.map((row) => [...row]);
}

export default function Q3ProblemStatementsPage() {
  const [grid, setGrid] = useState<Grid>(emptyGrid);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Grid;
        const merged = emptyGrid().map((row, r) =>
          row.map((_, c) => parsed[r]?.[c] ?? "")
        );
        setGrid(merged);
      }
    } catch {
      // corrupted — start fresh
    }
  }, []);

  function handleChange(row: number, col: number, value: string) {
    setGrid((prev) => {
      const next = prev.map((r) => [...r]);
      next[row][col] = value;
      return next;
    });

    setSaveState("saving");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      setGrid((latest) => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(latest));
        } catch {
          // storage full
        }
        setSaveState("saved");
        setTimeout(() => setSaveState("idle"), 2000);
        return latest;
      });
    }, 600);
  }

  function handleClear() {
    if (!confirm("Clear all problem statements? This cannot be undone.")) return;
    const fresh = emptyGrid();
    setGrid(fresh);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    setSaveState("saved");
    setTimeout(() => setSaveState("idle"), 2000);
  }

  return (
    <div>
      <div className="mb-8">
        <div className="text-[10px] tracking-[0.3em] text-[#FD3300] uppercase font-semibold mb-2">
          Q3 · Strategy
        </div>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Q3 Problem Statements</h1>
            <p className="text-sm text-[#8b95a7] mt-1.5">
              One problem statement per funnel — the foundation for Q3 test planning.
            </p>
          </div>
          <div className="flex items-center gap-4 pb-1">
            {saveState !== "idle" && (
              <span className={`text-[11px] font-medium transition-opacity ${saveState === "saved" ? "text-emerald-400" : "text-[#5a6478]"}`}>
                {saveState === "saving" ? "Saving…" : "Saved"}
              </span>
            )}
            <button
              onClick={handleClear}
              className="text-[11px] uppercase tracking-widest text-[#5a6478] hover:text-red-400 transition-colors"
            >
              Clear all
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-white/[0.08]">
        <table className="w-full border-collapse" style={{ tableLayout: "fixed" }}>
          <thead>
            <tr>
              {TILES.map((tile) => (
                <th
                  key={tile}
                  className="border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-center text-xs font-semibold tracking-widest text-[#FD3300] uppercase"
                >
                  {tile}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: ROW_COUNT }).map((_, rowIdx) => (
              <tr key={rowIdx}>
                {TILES.map((tile, colIdx) => (
                  <td
                    key={tile}
                    className="border border-white/[0.08] p-0 align-top"
                    style={{ height: "160px" }}
                  >
                    <textarea
                      value={grid[rowIdx][colIdx]}
                      onChange={(e) => handleChange(rowIdx, colIdx, e.target.value)}
                      className="h-full w-full resize-none bg-transparent px-3 py-2.5 text-sm text-[#8b95a7] placeholder-[#3a4150] outline-none focus:bg-white/[0.03] focus:text-white transition-colors"
                      placeholder="Enter problem statement…"
                      aria-label={`${tile} problem statement ${rowIdx + 1}`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-[10px] text-[#3a4150]">
        Auto-saved to this browser · clears if you clear browser data
      </p>
    </div>
  );
}
