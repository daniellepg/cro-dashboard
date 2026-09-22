"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BASELINE,
  OPPORTUNITIES,
  NOTES,
  SEQUENCING,
  type Opportunity,
} from "@/lib/opportunities";

type SortKey = "cp" | "roi" | "inv";

const DOT: Record<Opportunity["confidence"], string> = {
  medium: "bg-emerald-400",
  low: "bg-amber-400",
  gap: "bg-[#FD3300]",
};

function usd(v: number | null, signed = false) {
  if (v === null) return "—";
  const sign = v < 0 ? "-" : signed && v > 0 ? "+" : "";
  return `${sign}$${Math.abs(Math.round(v)).toLocaleString()}`;
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="text-[10px] tracking-[0.3em] text-[#FD3300] uppercase font-semibold whitespace-nowrap">
        {label}
      </div>
      <div className="flex-1 h-px bg-white/[0.06]" />
    </div>
  );
}

function Stat({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-lg border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent p-4">
      <div className="text-[10px] tracking-[0.18em] text-[#8b95a7] uppercase font-semibold">
        {label}
      </div>
      <div className="text-2xl font-semibold tracking-tight mt-1.5 tabular-nums">{value}</div>
      <div className="text-[11px] text-[#5a6478] mt-0.5">{note}</div>
    </div>
  );
}

/** Renders **bold** segments inside a note string. */
function Note({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} className="text-[#f4f5f7] font-semibold">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

function Row({
  o,
  rank,
  open,
  onToggle,
}: {
  o: Opportunity;
  rank: number;
  open: boolean;
  onToggle: () => void;
}) {
  const bps = o.cp ? Math.round((o.cp.base / BASELINE.netSales) * 10000) : null;
  const roi =
    o.cp === null || o.investment === null
      ? "—"
      : o.investment === 0
        ? "∞"
        : `${Math.round(o.cp.base / o.investment)}×`;

  return (
    <>
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="w-full text-left grid grid-cols-[28px_1fr_auto] md:grid-cols-[32px_minmax(0,1fr)_110px_170px_70px_60px_20px] gap-3 items-start px-4 py-4 hover:bg-white/[0.02] transition-colors border-b border-white/[0.06]"
      >
        <div className="text-xs text-[#5a6478] tabular-nums pt-1">{rank}</div>

        <div className="min-w-0">
          <div className="flex items-start gap-2">
            <span className={`mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full ${DOT[o.confidence]}`} />
            <div className="min-w-0">
              <div className="text-sm font-medium leading-snug">{o.name}</div>
              <div className="text-[11px] text-[#8b95a7] mt-0.5">{o.owner}</div>
            </div>
          </div>
          {/* mobile-only numbers */}
          <div className="md:hidden mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] tabular-nums pl-3.5">
            <span className="text-[#8b95a7]">
              inv <span className="text-[#f4f5f7]">{usd(o.investment)}</span>
            </span>
            <span className="text-[#8b95a7]">
              CP{" "}
              <span className={o.cp && o.cp.base < 0 ? "text-[#FD3300]" : "text-emerald-400"}>
                {o.cp ? usd(o.cp.base) : "needs inputs"}
              </span>
            </span>
            {bps !== null && <span className="text-[#8b95a7]">{bps} bps</span>}
          </div>
        </div>

        <div className="hidden md:block text-right text-xs tabular-nums pt-0.5">
          <div className="text-[#8b95a7]">{usd(o.investment)}</div>
          <div className="text-[10px] text-[#5a6478] mt-0.5">{o.effort}</div>
        </div>

        <div className="hidden md:block text-right text-sm tabular-nums pt-0.5">
          {o.cp ? (
            <>
              <div className={o.cp.base < 0 ? "text-[#FD3300]" : "text-emerald-400"}>
                {usd(o.cp.base)}
              </div>
              <div className="text-[10px] text-[#5a6478] mt-0.5">
                {usd(o.cp.low)} → {usd(o.cp.high)}
              </div>
            </>
          ) : (
            <div className="text-[#FD3300] text-xs uppercase tracking-wider">Needs inputs</div>
          )}
        </div>

        <div className="hidden md:block text-right text-xs text-[#8b95a7] tabular-nums pt-1">
          {bps !== null ? `${bps} bps` : "—"}
        </div>
        <div className="hidden md:block text-right text-xs text-[#8b95a7] tabular-nums pt-1">
          {roi}
        </div>
        <div className="text-right text-[#5a6478] text-sm pt-0.5 md:pt-1">{open ? "⌄" : "›"}</div>
      </button>

      {open && (
        <div className="grid md:grid-cols-3 gap-6 px-4 md:px-8 py-6 bg-white/[0.02] border-b border-white/[0.06]">
          <div>
            <h4 className="text-[10px] tracking-[0.2em] text-[#8b95a7] uppercase font-semibold mb-2">
              Why it&rsquo;s worth doing
            </h4>
            <p className="text-[13px] leading-relaxed text-[#cbd2dd]">{o.why}</p>
            <h4 className="text-[10px] tracking-[0.2em] text-[#8b95a7] uppercase font-semibold mt-5 mb-2">
              Break-even
            </h4>
            <p className="text-[13px] text-[#f4f5f7] tabular-nums">{o.breakeven}</p>
            <h4 className="text-[10px] tracking-[0.2em] text-[#8b95a7] uppercase font-semibold mt-5 mb-2">
              Investment
            </h4>
            <p className="text-[13px] text-[#cbd2dd]">{o.investmentNote}</p>
          </div>
          <div>
            <h4 className="text-[10px] tracking-[0.2em] text-[#8b95a7] uppercase font-semibold mb-2">
              Risk / what could kill it
            </h4>
            <p className="text-[13px] leading-relaxed text-[#ff8b6b]">{o.risk}</p>
          </div>
          <div>
            <h4 className="text-[10px] tracking-[0.2em] text-[#8b95a7] uppercase font-semibold mb-2">
              What I need from you
            </h4>
            <ul className="space-y-2">
              {o.needs.map((n) => (
                <li key={n} className="text-[13px] leading-relaxed text-[#cbd2dd] flex gap-2">
                  <span className="text-[#5a6478] shrink-0">·</span>
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

export default function OpportunitiesPage() {
  const [sort, setSort] = useState<SortKey>("cp");
  const [open, setOpen] = useState<string | null>(null);

  const sized = OPPORTUNITIES.filter((o) => o.cp !== null);
  const totals = useMemo(() => {
    const base = sized.reduce((s, o) => s + o.cp!.base, 0);
    const low = sized.reduce((s, o) => s + o.cp!.low, 0);
    const high = sized.reduce((s, o) => s + o.cp!.high, 0);
    const inv = sized.reduce((s, o) => s + (o.investment ?? 0), 0);
    return { base, low, high, inv, bps: Math.round((base / BASELINE.netSales) * 10000) };
  }, [sized]);

  const rows = useMemo(() => {
    const score = (o: Opportunity) => {
      if (o.cp === null) return sort === "inv" ? Number.POSITIVE_INFINITY : -1;
      if (sort === "cp") return o.cp.base;
      if (sort === "inv") return o.investment ?? 0;
      return o.investment === 0 ? Number.MAX_SAFE_INTEGER : o.cp.base / (o.investment || 1);
    };
    return [...OPPORTUNITIES].sort((a, b) =>
      sort === "inv" ? score(a) - score(b) : score(b) - score(a)
    );
  }, [sort]);

  return (
    <div>
      <Link
        href="/"
        className="text-[11px] text-[#8b95a7] hover:text-[#FD3300] transition-colors uppercase tracking-[0.15em]"
      >
        ← Command Center
      </Link>

      <div className="mt-5 mb-8">
        <h1 className="text-4xl font-semibold tracking-tight">Opportunity Analysis</h1>
        <p className="text-[#8b95a7] mt-2 max-w-2xl leading-relaxed">
          Nine Shopify-side opportunities ranked by{" "}
          <strong className="text-[#f4f5f7] font-semibold">
            incremental annual contribution profit
          </strong>{" "}
          — net sales less COGS, payment fees and any ad spend the opportunity requires. Ranges are
          low / base / high. Click a row for the case, the risk, and what&rsquo;s still missing.
        </p>
        <p className="text-[11px] text-[#5a6478] mt-3 tabular-nums">
          {BASELINE.source} · {BASELINE.window} · built {BASELINE.builtOn}
        </p>
      </div>

      <section className="mb-8">
        <SectionHeader label="Baseline" />
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <Stat label="Net Sales TTM" value={usd(BASELINE.netSales)} note="ex-tax, Shopify only" />
          <Stat
            label="Gross Margin"
            value={`${(BASELINE.grossMargin * 100).toFixed(1)}%`}
            note="after full COGS"
          />
          <Stat
            label="Contribution Margin"
            value={`${(BASELINE.contributionMargin * 100).toFixed(1)}%`}
            note={`after ${(BASELINE.paymentFee * 100).toFixed(1)}% payment fees`}
          />
          <Stat
            label="AOV"
            value={`$${BASELINE.aov.toFixed(2)}`}
            note={`${BASELINE.orders.toLocaleString()} orders`}
          />
          <Stat label="Opportunities" value="9" note="8 sized · 1 blocked" />
        </div>
      </section>

      <section className="mb-8">
        <div className="rounded-lg border border-[#FD3300]/25 bg-gradient-to-b from-[#FD3300]/[0.07] to-transparent p-6 grid sm:grid-cols-3 gap-6">
          <div>
            <div className="text-[10px] tracking-[0.2em] text-[#8b95a7] uppercase font-semibold">
              Total sized contribution profit
            </div>
            <div className="text-3xl font-semibold tracking-tight mt-1.5 tabular-nums">
              {usd(totals.base)}
            </div>
            <div className="text-[11px] text-[#8b95a7] mt-1 tabular-nums">
              range {usd(totals.low)} → {usd(totals.high)}
            </div>
          </div>
          <div>
            <div className="text-[10px] tracking-[0.2em] text-[#8b95a7] uppercase font-semibold">
              Total investment
            </div>
            <div className="text-3xl font-semibold tracking-tight mt-1.5 tabular-nums">
              {usd(totals.inv)}
            </div>
            <div className="text-[11px] text-[#8b95a7] mt-1 tabular-nums">
              {Math.round(totals.base / totals.inv)}× blended return
            </div>
          </div>
          <div>
            <div className="text-[10px] tracking-[0.2em] text-[#8b95a7] uppercase font-semibold">
              Lift to contribution margin
            </div>
            <div className="text-3xl font-semibold tracking-tight mt-1.5 tabular-nums text-[#FD3300]">
              +{totals.bps} bps
            </div>
            <div className="text-[11px] text-[#8b95a7] mt-1 tabular-nums">
              {(BASELINE.contributionMargin * 100).toFixed(1)}% →{" "}
              {(BASELINE.contributionMargin * 100 + totals.bps / 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <SectionHeader label="Ranked" />
          <div className="flex gap-2 shrink-0">
            {(
              [
                ["cp", "Contribution $"],
                ["roi", "ROI"],
                ["inv", "Lowest investment"],
              ] as [SortKey, string][]
            ).map(([k, label]) => (
              <button
                key={k}
                onClick={() => setSort(k)}
                className={`text-[11px] font-semibold uppercase tracking-[0.1em] px-3 py-1.5 rounded transition-colors ${
                  sort === k
                    ? "bg-[#FD3300] text-white"
                    : "border border-white/[0.08] text-[#8b95a7] hover:text-[#f4f5f7]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-white/[0.08] overflow-hidden">
          <div className="hidden md:grid grid-cols-[32px_minmax(0,1fr)_110px_170px_70px_60px_20px] gap-3 px-4 py-3 bg-white/[0.03] border-b border-white/[0.06] text-[10px] tracking-[0.15em] text-[#8b95a7] uppercase font-semibold">
            <div>#</div>
            <div>Opportunity / Owner</div>
            <div className="text-right">Investment</div>
            <div className="text-right">Contribution / yr</div>
            <div className="text-right">CPM</div>
            <div className="text-right">ROI</div>
            <div />
          </div>
          {rows.map((o, i) => (
            <Row
              key={o.id}
              o={o}
              rank={i + 1}
              open={open === o.id}
              onToggle={() => setOpen(open === o.id ? null : o.id)}
            />
          ))}
        </div>

        <div className="flex flex-wrap gap-5 mt-4 text-[11px] text-[#8b95a7]">
          <span className="flex items-center gap-2">
            <i className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Medium confidence — grounded in your data
          </span>
          <span className="flex items-center gap-2">
            <i className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            Low confidence — benchmark-led
          </span>
          <span className="flex items-center gap-2">
            <i className="h-1.5 w-1.5 rounded-full bg-[#FD3300]" />
            Blocked — needs your inputs
          </span>
        </div>
      </section>

      <section>
        <SectionHeader label="Assumptions & Sources" />
        <div className="rounded-lg border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent p-6">
          <ul className="space-y-3">
            {NOTES.map((n, i) => (
              <li key={i} className="text-[13px] leading-relaxed text-[#cbd2dd] flex gap-2.5">
                <span className="text-[#5a6478] shrink-0">·</span>
                <span>
                  <Note text={n} />
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-5 pl-4 border-l-2 border-[#FD3300] text-[13px] leading-relaxed text-[#cbd2dd]">
            <strong className="text-[#f4f5f7] font-semibold">Sequencing note:</strong> {SEQUENCING}
          </div>
        </div>
      </section>
    </div>
  );
}
