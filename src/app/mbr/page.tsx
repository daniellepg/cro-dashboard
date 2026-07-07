import Link from "next/link";

type MbrMonth = {
  slug: string;
  label: string;
  subtitle: string;
  available: boolean;
};

const MONTHS: MbrMonth[] = [
  { slug: "2026-01", label: "January 2026",  subtitle: "Jan 2026 vs Jan 2025",  available: false },
  { slug: "2026-02", label: "February 2026", subtitle: "Feb 2026 vs Feb 2025",  available: false },
  { slug: "2026-03", label: "March 2026",    subtitle: "Mar 2026 vs Mar 2025",  available: false },
  { slug: "2026-04", label: "April 2026",    subtitle: "Apr 2026 vs Apr 2025",  available: false },
  { slug: "2026-05", label: "May 2026",      subtitle: "May 2026 vs May 2025",  available: false },
  { slug: "2026-06", label: "June 2026",     subtitle: "Jun 2026 vs Jun 2025",  available: true  },
];

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="text-[10px] tracking-[0.3em] text-[#c9a55e] uppercase font-semibold whitespace-nowrap">
        {label}
      </div>
      <div className="flex-1 h-px bg-white/[0.06]" />
    </div>
  );
}

function MbrTile({ m }: { m: MbrMonth }) {
  const inner = (
    <div className={`group relative h-44 rounded-lg border p-5 transition-all ${
      m.available
        ? "border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent hover:border-[#c9a55e]/40 hover:from-[#c9a55e]/[0.06]"
        : "border-white/[0.04] bg-white/[0.01] opacity-50 cursor-not-allowed"
    }`}>
      <div className="text-base font-medium text-[#f4f5f7]">{m.label}</div>
      <div className="text-xs text-[#8b95a7] mt-0.5">{m.subtitle}</div>
      <div className="absolute bottom-5 left-5">
        {m.available ? (
          <span className="text-[10px] uppercase tracking-[0.18em] text-emerald-400 font-semibold">Available</span>
        ) : (
          <span className="text-[10px] uppercase tracking-[0.18em] text-[#5a6478]">Not generated</span>
        )}
      </div>
      {m.available && (
        <div className="absolute bottom-5 right-5 text-[#5a6478] group-hover:text-[#c9a55e] transition-colors">→</div>
      )}
    </div>
  );

  return m.available ? (
    <Link href={`/mbr/${m.slug}`}>{inner}</Link>
  ) : (
    <div>{inner}</div>
  );
}

export default function MbrIndexPage() {
  return (
    <div>
      <div className="mb-10">
        <div className="text-[10px] tracking-[0.3em] text-[#c9a55e] uppercase font-semibold mb-3">
          Reporting
        </div>
        <h1 className="text-4xl font-semibold tracking-tight">Monthly Business Reviews</h1>
        <p className="text-[#8b95a7] mt-2 max-w-xl">
          Paid media performance, funnel breakdowns, and experimentation results — one report per month.
        </p>
      </div>

      <SectionHeader label="2026" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {MONTHS.map((m) => (
          <MbrTile key={m.slug} m={m} />
        ))}
      </div>
    </div>
  );
}
