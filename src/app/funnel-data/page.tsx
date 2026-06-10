import { FUNNELS } from "@/lib/funnels";

export default function FunnelDataPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Week-over-Week Funnel Data</h1>
        <p className="text-sm text-slate-400 mt-1">From Domo · top 8 funnels</p>
      </div>

      <NeedsDomoBanner />

      <div className="mt-6 rounded-lg border border-slate-800 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-900/60 text-slate-400 text-left text-xs uppercase tracking-wide">
            <tr>
              <th className="px-4 py-2.5 font-medium">Funnel</th>
              <th className="px-4 py-2.5 font-medium">Platform</th>
              <th className="px-4 py-2.5 font-medium text-right">Sessions WoW</th>
              <th className="px-4 py-2.5 font-medium text-right">CVR WoW</th>
              <th className="px-4 py-2.5 font-medium text-right">AOV WoW</th>
              <th className="px-4 py-2.5 font-medium text-right">Revenue WoW</th>
            </tr>
          </thead>
          <tbody>
            {FUNNELS.flatMap((f) =>
              f.platforms.map((p) => (
                <tr key={`${f.code}-${p}`} className="border-t border-slate-800">
                  <td className="px-4 py-2.5 font-medium">{f.code}</td>
                  <td className="px-4 py-2.5 text-slate-400">{p}</td>
                  <td className="px-4 py-2.5 text-right text-slate-500">—</td>
                  <td className="px-4 py-2.5 text-right text-slate-500">—</td>
                  <td className="px-4 py-2.5 text-right text-slate-500">—</td>
                  <td className="px-4 py-2.5 text-right text-slate-500">—</td>
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
    <div className="rounded-lg border border-amber-400/40 bg-amber-400/10 p-4 text-sm">
      <div className="font-medium text-amber-300">Needs Domo connection</div>
      <p className="text-amber-200/80 mt-1">
        Add <code className="bg-slate-900/60 px-1 rounded">DOMO_CLIENT_ID</code> and{" "}
        <code className="bg-slate-900/60 px-1 rounded">DOMO_CLIENT_SECRET</code> as Vercel env vars,
        plus the DataSet ID for each funnel&apos;s WoW metric source. Then I&apos;ll wire the query
        and replace the placeholder rows.
      </p>
    </div>
  );
}
