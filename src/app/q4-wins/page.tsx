import Link from "next/link";
import { INITIATIVES, MONTHS, WINNING_TESTS, type Initiative } from "@/lib/q4-wins";

function usd(v: number) {
  return `$${Math.round(v).toLocaleString()}`;
}

function q4Total(i: Initiative) {
  return MONTHS.reduce((sum, m) => sum + (i.months[m.key]?.revenue ?? 0), 0);
}

function Cell({ i, monthKey }: { i: Initiative; monthKey: (typeof MONTHS)[number]["key"] }) {
  const m = i.months[monthKey];
  if (i.status === "pending") return <span className="text-[#5a6478]">needs inputs</span>;
  if (!m) return <span className="text-[#5a6478]">—</span>;
  return (
    <div>
      <div className="tabular-nums font-semibold">{usd(m.revenue)}</div>
      <div className="text-[11px] text-[#5a6478]">
        {m.orders !== null ? `${m.orders.toLocaleString()} orders · ` : ""}thru {m.asOf.slice(5)}
      </div>
    </div>
  );
}

export default function Q4WinsPage() {
  const grand = INITIATIVES.reduce((s, i) => s + q4Total(i), 0);
  const asOf = INITIATIVES.flatMap((i) => MONTHS.map((m) => i.months[m.key]?.asOf))
    .filter(Boolean)
    .sort()
    .at(-1);

  return (
    <div>
      <Link href="/" className="text-[10px] tracking-[0.3em] text-[#8b95a7] uppercase font-semibold">
        ← Command Center
      </Link>
      <div className="mt-4 mb-6">
        <div className="text-[10px] tracking-[0.3em] text-[#FD3300] uppercase font-semibold mb-2">
          Strategy · Q4 2026
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">Q4 Wins</h1>
        <p className="text-sm text-[#8b95a7] mt-1.5">
          Running revenue from lead capture, quiz, testing and Re-Buy — month-to-date and Q4-to-date.
          Revenue only. Data through {asOf}.
        </p>
      </div>

      <div className="rounded-lg border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent p-4 mb-6 max-w-xs">
        <div className="text-[10px] tracking-[0.18em] text-[#8b95a7] uppercase font-semibold">
          Q4 to date · all initiatives
        </div>
        <div className="text-2xl font-semibold tracking-tight mt-1.5 tabular-nums">{usd(grand)}</div>
        <div className="text-[11px] text-[#5a6478] mt-0.5">Sources differ by row — see below</div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-white/[0.08]">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] tracking-[0.18em] text-[#8b95a7] uppercase">
              <th className="p-3 font-semibold">Initiative</th>
              {MONTHS.map((m) => (
                <th key={m.key} className="p-3 font-semibold">{m.label} MTD</th>
              ))}
              <th className="p-3 font-semibold">Q4 to date</th>
            </tr>
          </thead>
          <tbody>
            {INITIATIVES.map((i) => (
              <tr key={i.id} className="border-t border-white/[0.06] align-top">
                <td className="p-3">
                  <div className="font-semibold">{i.name}</div>
                  <div className="text-[11px] text-[#5a6478] mt-0.5">
                    {i.status === "pending" ? `Waiting on: ${i.pendingNote}` : i.source}
                  </div>
                </td>
                {MONTHS.map((m) => (
                  <td key={m.key} className="p-3">
                    <Cell i={i} monthKey={m.key} />
                  </td>
                ))}
                <td className="p-3 tabular-nums font-semibold">
                  {i.status === "pending" ? "—" : usd(q4Total(i))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 mb-3 text-[10px] tracking-[0.3em] text-[#FD3300] uppercase font-semibold">
        Winning tests counted
      </div>
      <div className="overflow-x-auto rounded-lg border border-white/[0.08]">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] tracking-[0.18em] text-[#8b95a7] uppercase">
              <th className="p-3 font-semibold">Test</th>
              <th className="p-3 font-semibold">Platform</th>
              <th className="p-3 font-semibold">Live from</th>
              <th className="p-3 font-semibold">Est. monthly value</th>
            </tr>
          </thead>
          <tbody>
            {WINNING_TESTS.map((t) => (
              <tr key={t.id} className="border-t border-white/[0.06]">
                <td className="p-3"><span className="font-semibold">{t.id}</span> · {t.name}</td>
                <td className="p-3 text-[#8b95a7]">{t.platform}</td>
                <td className="p-3 tabular-nums">
                  {t.liveFrom}
                  {t.testPhase && (
                    <div className="text-[11px] text-[#5a6478]">
                      {Math.round(t.testPhase.share * 100)}% from {t.testPhase.from}
                    </div>
                  )}
                </td>
                <td className="p-3 tabular-nums">
                  {usd(t.monthlyValue)}
                  <span className="text-[11px] text-[#5a6478]"> · range {usd(t.range[0])}–{usd(t.range[1])}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 space-y-2 text-[12px] text-[#8b95a7] max-w-3xl">
        {INITIATIVES.map((i) => (
          <p key={i.id}>
            <strong className="text-[#f4f5f7]">{i.name.split(" — ")[0]}:</strong> {i.definition}
          </p>
        ))}
        <p>
          <strong className="text-[#f4f5f7]">Don&apos;t over-read the total.</strong> Rows come from
          different systems and can overlap (e.g. a Re-Buy add-on on a LOVEYOURGAME15 order counts in
          both). Treat it as a directional roll-up, not booked incremental revenue.
        </p>
      </div>
    </div>
  );
}
