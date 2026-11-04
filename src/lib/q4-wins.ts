/**
 * Q4 2026 running revenue tracker for the CRO initiatives.
 * One entry per initiative per month. Update `revenue`/`orders`/`asOf` as the month progresses;
 * leave a month `null` until it starts. Revenue only — no contribution profit here.
 */

export type MonthKey = "2026-10" | "2026-11" | "2026-12";

export type MonthActual = {
  revenue: number;
  orders: number | null;
  /** Last day included, ET (YYYY-MM-DD). */
  asOf: string;
};

export type Initiative = {
  id: string;
  name: string;
  /** How revenue is attributed to this initiative. */
  definition: string;
  source: string;
  status: "live" | "pending";
  pendingNote?: string;
  months: Record<MonthKey, MonthActual | null>;
};

export const MONTHS: { key: MonthKey; label: string }[] = [
  { key: "2026-10", label: "October" },
  { key: "2026-11", label: "November" },
  { key: "2026-12", label: "December" },
];

/** Shipped winners. Add a row each time a scorecard says WIN · IMPLEMENT. */
export type WinningTest = {
  id: string;
  name: string;
  platform: "Intelligems (Shopify)" | "Convert (CC)";
  /** Scorecard est. monthly value, gross revenue. */
  monthlyValue: number;
  range: [number, number];
  /** First full day the winner is live at 100% (YYYY-MM-DD). */
  liveFrom: string;
  /** Optional test period before rollout, when only `share` of traffic saw the winner. */
  testPhase?: { from: string; share: number };
};

export const WINNING_TESTS: WinningTest[] = [
  {
    id: "PG0056",
    name: "RS1 Putter — Back In Stock Urgency",
    platform: "Intelligems (Shopify)",
    monthlyValue: 203_000,
    range: [61_000, 358_000],
    liveFrom: "2026-10-08", // confirmed by Danielle
    testPhase: { from: "2026-09-29", share: 0.5 }, // 50/50 split until rollout
  },
];

/** Through-date for testing estimates; bump on each refresh. */
export const TESTING_AS_OF = "2026-10-15";

const DAY = 86_400_000;
const d = (s: string) => Date.parse(s + "T00:00:00Z");

function testingMonths(): Record<MonthKey, MonthActual | null> {
  const out = {} as Record<MonthKey, MonthActual | null>;
  for (const { key } of MONTHS) {
    const [y, mo] = key.split("-").map(Number);
    const start = Date.UTC(y, mo - 1, 1);
    const end = Date.UTC(y, mo, 1); // exclusive
    const daysInMonth = (end - start) / DAY;
    const asOf = Math.min(end - DAY, d(TESTING_AS_OF));
    if (asOf < start) { out[key] = null; continue; }
    let revenue = 0;
    // Days in [lo, hi] inclusive that fall inside this month up to asOf.
    const span = (lo: number, hi: number) =>
      Math.max(0, (Math.min(hi, asOf) - Math.max(lo, start)) / DAY + 1);
    for (const t of WINNING_TESTS) {
      const live = d(t.liveFrom);
      let days = span(live, asOf);
      if (t.testPhase) days += span(d(t.testPhase.from), live - DAY) * t.testPhase.share;
      revenue += (t.monthlyValue * days) / daysInMonth;
    }
    out[key] = { revenue, orders: null, asOf: new Date(asOf).toISOString().slice(0, 10) };
  }
  return out;
}

export const INITIATIVES: Initiative[] = [
  {
    id: "LEADCAP",
    name: 'Lead capture — "Love Your Game" pop-up (PG0019)',
    definition:
      "Shopify orders using code LOVEYOURGAME15, not cancelled. Revenue = ORDER_subtotal_price (after discount, ex-tax, ex-shipping, before refunds).",
    source: "Domo · PGZ | Shopify | ORDERS (b19daeb1)",
    status: "live",
    months: {
      "2026-10": { revenue: 38_064.35, orders: 123, asOf: "2026-10-15" },
      "2026-11": null,
      "2026-12": null,
    },
  },
  {
    id: "QUIZ",
    name: "Quiz (PGQUIZ15)",
    definition:
      "Shopify orders using code PGQUIZ15, not cancelled. Revenue = ORDER_subtotal_price (after discount, ex-tax, ex-shipping, before refunds). First coded order 2026-08-12.",
    source: "Domo · PGZ | Shopify | ORDERS (b19daeb1)",
    status: "live",
    months: {
      "2026-10": { revenue: 12_573.15, orders: 41, asOf: "2026-10-15" },
      "2026-11": null,
      "2026-12": null,
    },
  },
  {
    id: "TESTING",
    name: "Testing (shipped A/B winners)",
    definition:
      "Sum of each winning test's scorecard est. monthly value, prorated by days live in the month (test-period days at 50/50 count at half).  An estimate, not measured revenue.",
    source: "Win scorecards (est. monthly value)",
    status: "live",
    months: testingMonths(),
  },
  {
    id: "REBUY",
    name: "Re-Buy",
    definition: "Rebuy-attributed sales as reported in the Re-Buy app dashboard.",
    source: "Re-Buy app dashboard (manual entry)",
    status: "live",
    months: {
      "2026-10": { revenue: 12_020.22, orders: 161, asOf: "2026-10-15" },
      "2026-11": null,
      "2026-12": null,
    },
  },
];
