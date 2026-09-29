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
    confidenceLabel: "Medium — downstream lead value unmeasured",
    effort: "Low",
    investment: 12_000,
    investmentNote: "~40h build/QA + exclusion rules + Klaviyo flows",
    cp: { low: 275_000, base: 546_732, high: 1_008_000 },
    breakeven: "~3,400 coded orders/yr, or 9% of the modelled paid redemption",
    why:
      "Measured, not assumed: 150K sessions produce 2,560 leads (1.707% capture) and 444 coded orders " +
      "(17.34% of leads) at $268.99 net sales each. Paid is a further 750K sessions seeing none of it. " +
      "Capture scales with sessions (12,800 leads/mo); redemption scales with conversion, so 388 coded " +
      "orders/mo. 691 of 695 coded buyers are FIRST-TIME customers — this acquires, it does not " +
      "discount the repeat base.",
    risk:
      "Redemption does not travel with the pop-up — it belongs to the traffic. Non-paid converts 2.417%, " +
      "paid 0.422%, so per-lead value drops from $20.38 to $3.56. Applying non-paid stats directly to " +
      "paid implies 70% of every paid order carrying the code, which is impossible. Unresolved: 244 of " +
      "434 coded orders already book to Media Buys — if the pop-up already fires on some paid traffic, " +
      "part of this is double-counted and the base halves.",
    needs: [
      "Does the pop-up fire on paid landing pages? Check the trigger rule — page targeting, UTM exclusions, audience conditions. This is the difference between $275K and $547K",
      "Klaviyo revenue per subscriber per year — 153,600 leads/yr of downstream value sits OUTSIDE the base case and is the whole high-case argument",
      "Overlap between paid visitors and the existing list",
      "Exclusion rules for existing subscribers and mid-funnel returning buyers",
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
  "**PG0019 \u2014 measured on sessions and leads.** Launched 2026-08-10; week 2 spiked to 29.9 orders/day then settled at ~14.6/day. Last 30 days: 150,000 sessions \u2192 2,560 leads (1.707%) \u2192 444 coded orders (17.34% of leads), $119,431 net sales. Shopify 444 vs Domo 439 \u2014 agreement within 1.1%. Since launch, 691 of 695 coded orders are first-time customers.",
  "**Do not sum blindly.** Lead capture and owned-channel expansion overlap heavily — lead capture feeds the list that owned channel monetises. Counting both at base case double-counts roughly $150K. Sub-$50 threshold work also partly overlaps with SPI eligibility.",
  "**Cannibalization is the shared risk.** SPI (payment mix shift), Shop Campaigns lapsed audiences (paying for buyers email would win free), and lead capture (discounting buyers who would convert anyway) all fail the same way: volume that looks incremental but isn't. Every base case already discounts for it.",
];

export const SEQUENCING =
  "The Checkout Champ → Shopify migration will contaminate before/after reads on anything launched during cutover. Land SPI and the Shop App work either side of it, not through it.";
