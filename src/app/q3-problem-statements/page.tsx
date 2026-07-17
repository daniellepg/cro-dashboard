"use client";

import { useEffect, useRef, useState } from "react";

const TILES = ["RS1", "SF2", "357", "PG1", "SSP", "Little Legends"];
const ROW_COUNT = 5;
const STORAGE_KEY = "q3-problem-statements-v1";

type Grid = string[][];

function emptyGrid(): Grid {
  return Array.from({ length: ROW_COUNT }, () => Array(TILES.length).fill(""));
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
        <div className="text-[10px] tracking-[0.3em] text-[#c9a55e] uppercase font-semibold mb-2">
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
                  className="border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-center text-xs font-semibold tracking-widest text-[#c9a55e] uppercase"
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
                    style={{ height: "88px" }}
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
