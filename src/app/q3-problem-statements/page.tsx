"use client";

const TILES = ["RS1", "SF2", "357", "PG1", "SSP", "Little Legends"];
const ROW_COUNT = 5;

export default function Q3ProblemStatementsPage() {
  return (
    <div>
      <div className="mb-8">
        <div className="text-[10px] tracking-[0.3em] text-[#c9a55e] uppercase font-semibold mb-2">
          Q3 · Strategy
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">Q3 Problem Statements</h1>
        <p className="text-sm text-[#8b95a7] mt-1.5">
          One problem statement per funnel — the foundation for Q3 test planning.
        </p>
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
                {TILES.map((tile) => (
                  <td
                    key={tile}
                    className="border border-white/[0.08] p-0 align-top"
                    style={{ height: "88px" }}
                  >
                    <textarea
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
    </div>
  );
}
