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
  builtOn: "2026-10-28 (rev 3 · lead capture on Oct MTD)",
};

export const OPPORTUNITIES: Opportunity[] = [
  {
    id: "LEADCAP",
    name: 'Lead capture — expand "Love Your Game" + quiz codes to paid',
    owner: "CRO + Paid Media",
    confidence: "low",
    confidenceLabel: "Low — conditional on paid redemption rising",
    effort: "Low",
    investment: 12_000,
    investmentNote: "~40h build/QA + exclusion rules + Klaviyo flows",
    cp: { low: 194_505, base: 469_813, high: 1_350_796 },
    breakeven: "~84 incremental coded orders/yr (~7/mo)",
    why:
      "Sized on October MTD actuals (Oct 1–27, Domo) for both lead-capture codes, LOVEYOURGAME15 + " +
      "PGQUIZ15: 320 coded orders, $100,610 net sales, $66,784 contribution after each order's own COGS " +
      "and 2.9% fees — $208.70 contribution and $53.44 discount per order. Paid already redeems: 184 coded " +
      "orders carry a cpc/paid UTM against 2,845 Media Buys orders, a 6.47% paid redemption rate. The row " +
      "values only orders ABOVE that rate. Annualized paid volume is 38,460 orders. Each incremental order " +
      "is worth $143.16: 75% treated as new buyers at full contribution, 25% as buyers who'd have converted " +
      "anyway, costing the discount. Low / base / high = paid redemption rising to 10% / 15% / 31% " +
      "(+1,359 / +3,282 / +9,435 orders/yr). 31% is the rate the earlier lead-funnel math required.",
    risk:
      "Paid redemption is moving the wrong way: 7.9% in Sep 1–27, 6.47% in Oct 1–27. LOVEYOURGAME15 fell " +
      "from 383 to 243 orders while PGQUIZ15 rose from 76 to 77, so the pop-up is fading and the quiz " +
      "code is holding. The 15% base case is a judgment call, not a measurement. October gross margin also " +
      "jumped ~5 pts across every channel, which may be a COGS data artifact; at September's per-order " +
      "economics the base case is ~$372K, not $470K.",
    needs: [
      "RUN THE TEST: pop-up on one paid campaign for two weeks. That measures the real paid redemption rate and replaces the 15% base-case judgment",
      "Check the pop-up's Klaviyo targeting: 58% of coded orders already carry a paid UTM. Retargeting returns, or does the pop-up already render on paid landing pages?",
      "Why LOVEYOURGAME15 fell 37% Sep → Oct: targeting, placement, or traffic mix change",
      "Confirm October COGS with the data team before quoting the base case",
      "Exclusion rules for existing subscribers and mid-funnel returning buyers, so redemption does not run hot on buyers already converting",
      "Klaviyo revenue per subscriber per year — downstream value on 144,000 leads/yr is NOT in this number",
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
  "**Lead capture \u2014 rev 3, October MTD, both codes.** LOVEYOURGAME15 (PG0019 pop-up, launched 2026-08-10) and PGQUIZ15 (first order 2026-08-12). Oct 1\u201327: 243 + 77 = 320 coded orders, $100,610 net sales, $66,784 contribution; 184 (58%) carry a paid UTM. Sep 1\u201327 was 383 + 76 = 459 orders, $76,685 contribution. Since launch: 1,149 orders, $327,702 net sales, $203,688 contribution. No order used both codes.",
  "**Do not sum blindly.** Lead capture is 38% of the sized total at base case. It overlaps heavily with owned-channel expansion, which monetises the same list; counting both at base case double-counts materially. Sub-$50 threshold work partly overlaps with SPI eligibility.",
  "**Cannibalization is the shared risk.** SPI (payment mix shift), Shop Campaigns lapsed audiences (paying for buyers email would win free), and lead capture (discounting buyers who would convert anyway) all fail the same way: volume that looks incremental but isn't. Every base case already discounts for it.",
];

export const SEQUENCING =
  "The Checkout Champ → Shopify migration will contaminate before/after reads on anything launched during cutover. Land SPI and the Shop App work either side of it, not through it.";
