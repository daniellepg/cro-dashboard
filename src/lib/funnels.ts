// Top 8 funnels (physical + digital)
export const FUNNELS = [
  { code: "357", name: "357", platforms: ["Shopify", "Checkout Champ"], type: "physical" },
  { code: "RS1", name: "RS1", platforms: ["Shopify"], type: "physical" },
  { code: "SF2", name: "SF2", platforms: ["Shopify"], type: "physical" },
  { code: "SSP", name: "SSP", platforms: ["Shopify", "Checkout Champ"], type: "physical" },
  { code: "WPSS", name: "WPSS", platforms: ["Checkout Champ"], type: "digital" },
  { code: "OSSF", name: "OSSF", platforms: ["Checkout Champ"], type: "digital" },
  { code: "SSTS", name: "SSTS", platforms: ["Checkout Champ"], type: "digital" },
  { code: "PG1", name: "PG1", platforms: ["Checkout Champ"], type: "digital" },
] as const;

export type FunnelCode = (typeof FUNNELS)[number]["code"];

export type Bucket = FunnelCode | "CROSS" | "OTHER";

export const BUCKET_LABELS: Record<Bucket, string> = {
  ...(Object.fromEntries(FUNNELS.map((f) => [f.code, f.code])) as Record<FunnelCode, string>),
  CROSS: "Cross-funnel",
  OTHER: "Other",
};

const CODES = FUNNELS.map((f) => f.code) as readonly string[];

// Detect which funnel a test belongs to from the task name.
// Physical funnels beat digital ones (PG1 in a physical test name is usually
// a callout/cross-sell, e.g. "Remove PG1 mention from 357 LPs" is 357 work).
// Within the same type, the code mentioned FIRST wins
// (e.g. "SF2 CoC Upsell (If 357 OOS)" is an SF2 test).
export function funnelFromName(name: string): FunnelCode | null {
  const upper = name.toUpperCase();
  let best: { code: FunnelCode; rank: number; at: number } | null = null;
  for (const f of FUNNELS) {
    const m = new RegExp(`\\b${f.code}\\b`).exec(upper);
    if (!m) continue;
    const rank = f.type === "physical" ? 0 : 1;
    if (!best || rank < best.rank || (rank === best.rank && m.index < best.at)) {
      best = { code: f.code, rank, at: m.index };
    }
  }
  return best?.code ?? null;
}

// Read ClickUp's "Product Funnel(s)" labels field, e.g. "SF2 (SF2 Driver)" -> SF2.
// The API sends label values as option IDs, resolved via type_config.options.
const PRODUCT_FUNNEL_FIELD_ID = "ec01ece6-75af-4416-8bfe-b7b4702714a4";

type TaskLike = {
  name: string;
  custom_fields?: Array<{
    id: string;
    value?: unknown;
    type_config?: { options?: Array<{ id: string; label?: string; name?: string }> };
  }>;
};

export function funnelFromField(task: TaskLike): FunnelCode | null {
  const field = task.custom_fields?.find((f) => f.id === PRODUCT_FUNNEL_FIELD_ID);
  if (!field || !Array.isArray(field.value)) return null;
  const options = field.type_config?.options ?? [];
  for (const v of field.value as unknown[]) {
    const label =
      typeof v === "string"
        ? options.find((o) => o.id === v)?.label ?? options.find((o) => o.id === v)?.name
        : (v as { label?: string })?.label;
    const code = label?.trim().split(/\s+/)[0]?.toUpperCase();
    if (code && CODES.includes(code)) return code as FunnelCode;
  }
  return null;
}

// Work that spans funnels rather than living on one product's funnel.
const CROSS_FUNNEL_RE = /\b(cart|checkout|nav|taxonomy|quiz|bfcm|gwp|atc|site-?wide|pdps|shopify)\b/i;

// Order: ClickUp field -> first code in the name -> cross-funnel keywords -> Other
export function bucketForTask(task: TaskLike): Bucket {
  return (
    funnelFromField(task) ??
    funnelFromName(task.name) ??
    (CROSS_FUNNEL_RE.test(task.name) ? "CROSS" : "OTHER")
  );
}
