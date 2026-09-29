import Link from "next/link";

export const metadata = {
  title: "Shop Pay Installments — Decision Memo",
};

function Col({
  tone,
  label,
  items,
}: {
  tone: "pro" | "con";
  label: string;
  items: { h: string; b: string }[];
}) {
  const accent = tone === "pro" ? "text-emerald-400" : "text-[#FD3300]";
  const rule = tone === "pro" ? "border-emerald-400/30" : "border-[#FD3300]/30";
  return (
    <div className={`border-t-2 ${rule} pt-4`}>
      <div className={`text-[10px] tracking-[0.25em] uppercase font-bold mb-4 ${accent}`}>
        {label}
      </div>
      <ul className="space-y-3.5">
        {items.map((i) => (
          <li key={i.h}>
            <div className="text-[13px] font-semibold leading-snug">{i.h}</div>
            <div className="text-[12px] text-[#8b95a7] leading-relaxed mt-0.5">{i.b}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const PROS = [
  {
    h: "Paid in full, upfront — Affirm carries the risk",
    b: "Full order value on your normal payout schedule, minus the fee. Affirm owns credit default, fraud liability and collections. You cannot lose money to a customer who stops paying.",
  },
  {
    h: "Your basket profile is close to ideal",
    b: "98.2% of revenue is eligible ($50+). 73% sits in the $250–999 band, where a $392 order becomes 4 × $98 — the range where financing changes a decision.",
  },
  {
    h: "Break-even is a 0.37% sales lift",
    b: "At 8% adoption the extra fees are $41,409/yr against a 64.2% contribution margin. Almost any real effect clears that bar.",
  },
  {
    h: "Zero investment, fully reversible",
    b: "A toggle in Shopify Payments. No build, no contract, no minimum. Switchable off any day if adoption or economics disappoint.",
  },
  {
    h: "Downside is capped and small",
    b: "Worst realistic case — full mix shift, zero incremental orders — costs $41K/yr, or 0.24% of revenue. Known before we start.",
  },
];

const CONS = [
  {
    h: "Cost scales with adoption, with no cap",
    b: "8% adoption costs $41K/yr; 25% costs $129K/yr and raises the bar to a 1.15% lift. High usage is not a win unless it is genuinely incremental — and a large 'Shop Pay volume' figure is the cost side, not the result.",
  },
  {
    h: "It cannot be A/B tested",
    b: "A store-level Shopify Payments setting. Intelligems cannot randomise it, so there is no holdout and no scorecard. We will not be able to prove it worked.",
  },
  {
    h: "We cannot currently track it",
    b: "The Domo Shopify ORDERS dataset has no payment-gateway column. Adoption will be invisible outside Shopify admin until the data team adds it — request this before go-live.",
  },
  {
    h: "Our audience is the wrong demographic",
    b: "BNPL adoption concentrates in ages 18–44 (Fed/CFPB survey data). Our buyers skew older and affluent. Expect adoption at the low end of published ranges.",
  },
  {
    h: "The badge may cheapen a premium product",
    b: "A payment plan on a $400 wedge can read downmarket to a buyer who can simply afford it. This risk sits on the on-site messaging, not the checkout option.",
  },
  {
    h: "It points away from the Re-Buy migration",
    b: "Installments do not work with subscriptions. The addressable pool shrinks as recurring revenue grows — do not model this as scaling with the business.",
  },
];

export default function ShopPayMemo() {
  return (
    <div className="max-w-5xl">
      <div className="print:hidden">
        <Link
          href="/opportunities"
          className="text-[11px] text-[#8b95a7] hover:text-[#FD3300] transition-colors uppercase tracking-[0.15em]"
        >
          ← Opportunity Analysis
        </Link>
      </div>

      <div className="mt-5 flex items-start justify-between gap-6 flex-wrap">
        <div>
          <div className="text-[10px] tracking-[0.25em] text-[#FD3300] uppercase font-bold">
            Decision Memo · CRO
          </div>
          <h1 className="text-3xl font-semibold tracking-tight mt-1.5">Shop Pay Installments</h1>
          <p className="text-[#8b95a7] text-sm mt-1">
            Shopify&rsquo;s buy-now-pay-later, powered by Affirm. Customer splits payment over six
            weeks; we are paid in full upfront.
          </p>
        </div>
        <div className="rounded-lg border border-[#FD3300]/30 bg-[#FD3300]/[0.07] px-5 py-3 min-w-[230px]">
          <div className="text-[10px] tracking-[0.2em] text-[#8b95a7] uppercase font-semibold">
            Recommendation
          </div>
          <div className="text-lg font-semibold mt-1 leading-snug">Turn it on. Hold the badge.</div>
          <div className="text-[11px] text-[#8b95a7] mt-1">Review adoption in 90 days.</div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-7">
        {[
          ["Investment", "$0", "toggle only"],
          ["Break-even", "0.37%", "sales lift"],
          ["Base case", "+$71,459", "contribution/yr"],
          ["Worst case", "−$41,409", "0.24% of revenue"],
        ].map(([l, v, n]) => (
          <div
            key={l}
            className="rounded-lg border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent p-3.5"
          >
            <div className="text-[9px] tracking-[0.18em] text-[#8b95a7] uppercase font-semibold">
              {l}
            </div>
            <div className="text-xl font-semibold tracking-tight mt-1 tabular-nums">{v}</div>
            <div className="text-[10px] text-[#5a6478] mt-0.5">{n}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-x-10 gap-y-7">
        <Col tone="pro" label="The case for" items={PROS} />
        <Col tone="con" label="The case against" items={CONS} />
      </div>

      <div className="mt-8 rounded-lg border border-white/[0.08] bg-white/[0.02] p-5">
        <div className="text-[10px] tracking-[0.25em] text-[#FD3300] uppercase font-bold mb-3">
          How to frame it
        </div>
        <p className="text-[13px] leading-relaxed text-[#cbd2dd]">
          This is a <strong className="text-[#f4f5f7]">margin decision with capped downside</strong>,
          not a conversion play. We should not attach a CVR forecast to it — a 0.37% lift is below
          what we can detect at our traffic, so promising a conversion number guarantees a quarter
          spent explaining why it did not appear. The honest pitch is: cheap, reversible, positive
          expected value, unprovable either way.
        </p>
        <p className="text-[13px] leading-relaxed text-[#cbd2dd] mt-3">
          <strong className="text-[#f4f5f7]">Holding the badge is deliberate.</strong> The checkout
          option is invisible until a customer wants it; the on-site &ldquo;4 payments of
          $98&rdquo; message is visible to everyone. Turning the option on while holding the
          messaging captures the option value with almost no brand exposure, and lets us decide on
          placement once we can see real adoption. Badge placement is then a proper Intelligems test
          we own.
        </p>
        <p className="text-[13px] leading-relaxed text-[#cbd2dd] mt-3">
          <strong className="text-[#f4f5f7]">Two things before go-live:</strong> confirm the
          Installments fee and our negotiated card rate in Shopify admin (the 3.0pp delta drives the
          entire cost side), and ask the data team to add{" "}
          <code className="text-[11px] bg-white/[0.06] px-1.5 py-0.5 rounded">
            payment_gateway_names
          </code>{" "}
          to the Domo Shopify ORDERS dataset so adoption is measurable from day one.
        </p>
        <p className="text-[13px] leading-relaxed text-[#cbd2dd] mt-3">
          <strong className="text-[#f4f5f7]">Sequencing:</strong> land this either side of the
          Checkout Champ → Shopify cutover, not through it, or the migration read gets contaminated.
        </p>
      </div>

      <div className="mt-6 text-[11px] text-[#5a6478] leading-relaxed border-t border-white/[0.06] pt-4">
        <strong className="text-[#8b95a7]">Sources.</strong> Revenue, margin, AOV and order-band mix
        from Domo <code>PGZ | Shopify | ORDERS</code> (b19daeb1), TTM to 2026-09-21, test orders
        excluded: $16,496,097 net sales, 67.1% gross margin, 64.2% contribution margin after payment
        fees. Demographic skew from Federal Reserve and CFPB BNPL survey data.{" "}
        <strong className="text-[#8b95a7]">Assumptions.</strong> Installments fee 5.9% + 30¢ vs card
        2.9% + 30¢ — a 3.0pp delta, <em>unverified</em>, and the single largest input. Adoption
        assumed at 8% of eligible revenue. Both require confirmation in Shopify admin before these
        figures are treated as final.
      </div>
    </div>
  );
}
