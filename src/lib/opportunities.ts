export type Confidence = "medium" | "low" | "gap";

export type Opportunity = {
  id: string;
  name: string;
  owner: string;
  confidence: Confidence;
  confidenceLabel: string;
  effort: string;
  investment: number | null;
  investmentNote: string;
  /** Incremental annual contribution profit. null = not yet sizeable. */
  cp: { low: number; base: number; high: number } | null;
  breakeven: string;
  why: string;
  risk: string;
  needs: string[];
};

export type OpportunityBaseline = {
  netSales: number;
  grossMargin: number;
  contributionMargin: number;
  paymentFee: number;
  aov: number;
  orders: number;
  window: string;
  source: string;
  builtOn: string;
};

export const BASELINE: OpportunityBaseline = {
  netSales: 16_496_097,
  grossMargin: 0.671,
  contributionMargin: 0.642,
  paymentFee: 0.029,
  aov: 246.14,
  orders: 71_382,
  window: "TTM 2025-09-21 → 2026-09-21",
  source: "Domo · PGZ | Shopify | ORDERS (b19daeb1)",
  builtOn: "2026-09-29",
};

export const OPPORTUNITIES: Opportunity[] = [
  {
    id: "LEADCAP",
    name: 'Lead capture — expand "Love Your Game" pop-up to paid',
    owner: "CRO + Paid Media",
    confidence: "medium",
    confidenceLabel: "Medium — capture value assumed",
    effort: "Low",
    investment: 12_000,
    investmentNote: "~40h build/QA + exclusion rules + Klaviyo flows",
    cp: { low: 326_859, base: 776_605, high: 1_341_101 },
    breakeven: "~3,000 net-new captures, or 1.5% of the paid pool converting at today's rate",
    why:
      "The pop-up serves 150K sessions/mo and produces 444 coded orders ($119,431 net sales). Paid is " +
      "another 750K sessions/mo — a 5x larger pool — and sees none of it. Two streams: direct code sales " +
      "(~$345K) scale with paid's converting sessions; email/SMS capture (~$432K) scales with all 750K.",
    risk:
      "Paid converts at 0.320% vs non-paid's 2.366% — 7.4x worse — so the direct-sales half only scales " +
      "0.68x despite the 5x pool. And paid is colder and more price-sensitive: if code redemption runs " +
      "above non-paid's 12.5%, the margin given to buyers who'd have converted anyway climbs from $59K/yr " +
      "to $141K/yr at 30% redemption. The capture half is the upside and the least verified number here.",
    needs: [
      "Klaviyo list size + revenue per subscriber per year — sets the $4.00/sub in the capture stream, the single biggest swing factor",
      "Expected pop-up capture rate on cold paid traffic (base assumes 2.0% vs the ~3% typical of warm traffic)",
      "Overlap between paid visitors and the existing list (base assumes 40%)",
      "Exclusion rules: suppress for existing subscribers and mid-funnel returning buyers, or redemption runs hot",
    ],
  },
  {
    id: "OWNED",
    name: "Owned channel expansion (Klaviyo + Attentive)",
    owner: "CRO + Lifecycle",
    confidence: "low",
    confidenceLabel: "Low",
    effort: "High",
    investment: 60_000,
    investmentNote: "Program, not a toggle — 2–3 quarters",
    cp: { low: 115_128, base: 290_255, high: 640_510 },
    breakeven: "+$93K owned revenue",
    why:
      "Klaviyo ($1.30M) + Attentive ($245K) = 8.8% of revenue. DR businesses of this shape usually run " +
      "20–30%. Owned revenue carries the full 64.2% contribution margin.",
    risk: "Long timeline, needs headcount, overlaps with lead capture — do not double-count.",
    needs: ["Lifecycle team capacity", "Current list size + send cadence"],
  },
  {
    id: "SHOPPING",
    name: "Shopping/PMax feed — lean into high-AOV SKUs",
    owner: "CRO + Paid Media (Christopher)",
    confidence: "medium",
    confidenceLabel: "Medium",
    effort: "Medium",
    investment: 6_000,
    investmentNote: "Feed rebuild + bundle landing pages",
    cp: { low: 73_014, base: 152_029, high: 278_452 },
    breakeven: "0.4% channel lift",
    why:
      "`shopping` runs a $341.86 AOV — the highest of any source on the site, 39% above site average, " +
      "on $2.46M/yr. The feed is not built to favour those SKUs.",
    risk: "Requires Paid Media partnership; feed changes can drop impression share.",
    needs: ["Feed ownership — who edits it", "Shopping spend + ROAS split from Christopher"],
  },
  {
    id: "SPI",
    name: "Shop Pay Installments — toggle on",
    owner: "CRO + Finance",
    confidence: "medium",
    confidenceLabel: "Medium",
    effort: "Trivial",
    investment: 0,
    investmentNote: "Toggle + ~8h badge placement",
    cp: { low: -41_409, base: 71_459, high: 240_759 },
    breakeven: "0.37% sales lift",
    why:
      "73% of revenue sits in the $250–999 band; 98.2% of revenue is SPI-eligible. Break-even is a 0.37% " +
      "lift and downside is capped at the fee delta.",
    risk: "Payment mix shift with no incremental orders. Not A/B testable — store-level setting.",
    needs: [
      "Confirm SPI fee + negotiated card rate in Shopify admin",
      "Current Shop Pay share (Admin → Analytics → Payments)",
    ],
  },
  {
    id: "DISCOUNT",
    name: "Discount depth optimization (top 15 codes)",
    owner: "CRO (Katherine)",
    confidence: "medium",
    confidenceLabel: "Medium",
    effort: "Low",
    investment: 2_000,
    investmentNote: "Intelligems depth tests",
    cp: { low: 7_898, base: 69_265, high: 138_214 },
    breakeven: "Holding volume at 1pp shallower depth",
    why:
      "You gave away $789,796 across the top 15 codes in TTM at 22.8% average depth. Every 1pp of depth " +
      "held back is ~$35K straight to contribution.",
    risk: "Volume may fall with depth — that is exactly what the test measures.",
    needs: ["Which codes are contractually locked (affiliate/partner) vs. testable"],
  },
  {
    id: "SHOPADS",
    name: "Shop Campaigns — turn on lapsed audiences",
    owner: "CRO + Paid Media (Christopher)",
    confidence: "medium",
    confidenceLabel: "Medium",
    effort: "Low",
    investment: 67_795,
    investmentNote: "Incremental ad spend (base case), self-funding",
    cp: { low: 16_037, base: 64_625, high: 156_150 },
    breakeven: "CAC below $195 at zero cannibalization",
    why:
      "The New-customer segment alone runs 3.48 ROAS / $87 CAC. Lapsed buyers historically convert at " +
      "lower CAC. Channel already returns ~35% contribution margin.",
    risk:
      "Cannibalization — paying to reacquire buyers Klaviyo/Attentive would win free. Base case assumes " +
      "35% cannibalized.",
    needs: [
      "Shop Campaigns audience options actually available in your admin",
      "Klaviyo repurchase rate for 90–365 day lapsed buyers (the cannibalization floor)",
    ],
  },
  {
    id: "SUB50",
    name: "Sub-$50 orders — threshold / bundle to lift AOV",
    owner: "CRO (Vanessa)",
    confidence: "medium",
    confidenceLabel: "Medium",
    effort: "Low",
    investment: 2_000,
    investmentNote: "Intelligems test, ~15h",
    cp: { low: 30_048, base: 60_097, high: 108_175 },
    breakeven: "Moving 1.2% of sub-$50 orders over the line",
    why:
      "11,924 orders/yr (16.7% of all orders) average $27 and deliver 1.8% of revenue. Mostly Digital, so " +
      "~90% margin. Crossing $50 also makes them SPI-eligible.",
    risk: "Threshold may just shift mix rather than add units.",
    needs: ["Confirm which SKUs dominate the sub-$50 band"],
  },
  {
    id: "SHOPAPP",
    name: "Shop App UI/UX optimization",
    owner: "CRO + Creative (Ogle)",
    confidence: "medium",
    confidenceLabel: "Medium",
    effort: "Medium",
    investment: 9_000,
    investmentNote: "~60h design/merchandising",
    cp: { low: 21_835, base: 52_670, high: 83_505 },
    breakeven: "1.5% channel sales lift",
    why:
      "Shop App is a $960K/yr run-rate channel built from zero since March, and its $298 AOV runs 21% " +
      "above site average. Nothing has been optimized yet.",
    risk:
      "Shopify controls the surface — you can only move imagery, titles, copy, reviews, Shop Cash offers. " +
      "The ceiling is real.",
    needs: ["Shop App CVR + session count (Shopify admin, not in Domo)"],
  },
  {
    id: "REBUY",
    name: "Re-Buy opt-in take rate (CC→Shopify migration)",
    owner: "CRO + Eng",
    confidence: "gap",
    confidenceLabel: "Needs inputs",
    effort: "Medium",
    investment: null,
    investmentNote: "Already funded inside the migration",
    cp: null,
    breakeven: "—",
    why:
      "Opt-in page design sets subscription take rate on the whole migrated base. A few points of take " +
      "rate on recurring revenue likely outweighs everything else on this board.",
    risk: "Timing — this lands during the migration, so attribution will be muddy either way.",
    needs: [
      "Forced-continuity base size + current continuity take rate",
      "Target opt-in take rate assumption from Finance",
      "Migration cutover date",
    ],
  },
];

export const NOTES: string[] = [
  "**Baseline is Domo only.** `PGZ | Shopify | ORDERS` (b19daeb1), TTM to 2026-09-21, test orders excluded. The 67.1% gross margin uses `ORDER_total_COGS`, populated for all 59,458 physical/supplement orders; the 11,924 Digital orders correctly carry no COGS.",
  "**The 2.9% payment fee is an assumption, not your data.** The ORDERS dataset has no gateway column, so your real blended rate and current Shop Pay share are unverified. Confirm both in Shopify admin — they move the SPI case more than any other input.",
  "**Source disagreement, Shop Campaigns.** Your Shopify screenshot reports 1,199 orders / $364,698 since Mar 17. Domo channel `3890849` reports 1,431 orders / $426,315 for the same window — a 19% gap explained by non-campaign Shop App orders inside the Domo channel. Use Shopify for campaign performance, Domo for total Shop App.",
  "**Love Your Game — reconciled.** On the same 30-day window Domo and Shopify agree within 3%: 550 vs 565 orders, $25,864 vs $26,521 discount, $159,444 vs $156,796 sales. Both sources are good here.",
  "**PG0019 — decayed to steady state, now measured against sessions.** Launched 2026-08-10; week 2 (Aug 24\u201330) spiked to 29.9 orders/day then settled at ~14.6/day. Current 30 days: Shopify reports 444 coded orders / $142,443 gross / $119,431 net sales; Domo reports 439 orders \u2014 agreement within 1.1%. The pop-up serves 150K sessions/mo; paid is a further 750K it never sees.",
  "**Do not sum blindly.** Lead capture and owned-channel expansion overlap heavily — lead capture feeds the list that owned channel monetises. Counting both at base case double-counts roughly $150K. Sub-$50 threshold work also partly overlaps with SPI eligibility.",
  "**Cannibalization is the shared risk.** SPI (payment mix shift), Shop Campaigns lapsed audiences (paying for buyers email would win free), and lead capture (discounting buyers who would convert anyway) all fail the same way: volume that looks incremental but isn't. Every base case already discounts for it.",
];

export const SEQUENCING =
  "The Checkout Champ → Shopify migration will contaminate before/after reads on anything launched during cutover. Land SPI and the Shop App work either side of it, not through it.";
