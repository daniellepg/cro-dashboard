import { FUNNELS } from "@/lib/funnels";

export default function FunnelDataPage() {
  return (
    <div>
      <div className="mb-8">
        <div className="text-[10px] tracking-[0.3em] text-[#c9a55e] uppercase font-semibold mb-2">
          04 · Performance
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">Week-over-Week Funnel Data</h1>
        <p className="text-sm text-[#8b95a7] mt-1.5">From Domo · top 8 funnels</p>
      </div>

      <NeedsDomoBanner />

      <div className="mt-6 rounded-lg border border-white/[0.08] overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-white/[0.03] text-[#8b95a7] text-left text-[10px] tracking-[0.18em] uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Funnel</th>
              <th className="px-4 py-3 font-medium">Platform</th>
              <th className="px-4 py-3 font-medium text-right">Sessions WoW</th>
              <th className="px-4 py-3 font-medium text-right">CVR WoW</th>
              <th className="px-4 py-3 font-medium text-right">AOV WoW</th>
              <th className="px-4 py-3 font-medium text-right">Revenue WoW</th>
            </tr>
          </thead>
          <tbody>
            {FUNNELS.flatMap((f) =>
              f.platforms.map((p) => (
                <tr key={`${f.code}-${p}`} className="border-t border-white/[0.06]">
                  <td className="px-4 py-3 font-medium">{f.code}</td>
                  <td className="px-4 py-3 text-[#8b95a7]">{p}</td>
                  <td className="px-4 py-3 text-right text-[#5a6478]">—</td>
                  <td className="px-4 py-3 text-right text-[#5a6478]">—</td>
                  <td className="px-4 py-3 text-right text-[#5a6478]">—</td>
                  <td className="px-4 py-3 text-right text-[#5a6478]">—</td>
                </tr>
              )),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NeedsDomoBanner() {
  return (
    <div className="rounded-lg border border-[#c9a55e]/30 bg-[#c9a55e]/[0.06] p-4 text-sm">
      <div className="font-medium text-[#c9a55e]">Needs Domo connection</div>
      <p className="text-[#c9a55e]/80 mt-1">
        Add <code className="bg-white/5 px-1 rounded">DOMO_CLIENT_ID</code> and{" "}
        <code className="bg-white/5 px-1 rounded">DOMO_CLIENT_SECRET</code> as Vercel env vars,
        plus the DataSet ID per funnel. Rows will populate automatically.
      </p>
    </div>
  );
}
