export default function ScorecardsPage() {
  return (
    <div>
      <div className="mb-8">
        <div className="text-[10px] tracking-[0.3em] text-[#c9a55e] uppercase font-semibold mb-2">
          Testing · Scorecards
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">Test Scorecards</h1>
        <p className="text-sm text-[#8b95a7] mt-1.5">
          Per-test results: ship / kill / iterate / inconclusive
        </p>
      </div>

      <div className="rounded-lg border border-[#c9a55e]/30 bg-[#c9a55e]/[0.06] p-4 text-sm">
        <div className="font-medium text-[#c9a55e]">Coming soon</div>
        <p className="text-[#c9a55e]/80 mt-1">
          This page will surface scorecards from ClickUp&apos;s &ldquo;Analytics – Scorecard&rdquo;
          subtasks. Tell me how you want each scorecard rendered (decision verdict, lift %,
          guardrails, learnings) and I&apos;ll wire it up.
        </p>
      </div>
    </div>
  );
}
