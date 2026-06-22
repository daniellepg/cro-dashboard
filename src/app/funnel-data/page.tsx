export default function FunnelDataPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <div className="text-[10px] tracking-[0.3em] text-[#c9a55e] uppercase font-semibold mb-2">
          04 · Performance
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">Week-over-Week Funnel Data</h1>
        <p className="text-sm text-[#8b95a7] mt-1.5">From Domo · top 8 funnels</p>
      </div>

      <div className="flex-1 rounded-lg border border-white/[0.08] overflow-hidden" style={{ minHeight: "80vh" }}>
        <iframe
          src="https://pg-domo-analytics-kg-git-main-kegreenpgs-projects.vercel.app/"
          className="w-full h-full"
          style={{ minHeight: "80vh", border: "none" }}
          title="Week-over-Week Funnel Data"
        />
      </div>
    </div>
  );
}
