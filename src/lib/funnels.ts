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

// Detect which funnel a test belongs to from the task name
export function funnelFromName(name: string): FunnelCode | null {
  const upper = name.toUpperCase();
  for (const f of FUNNELS) {
    // Match the code as a whole word/code in the name
    const re = new RegExp(`\\b${f.code}\\b`);
    if (re.test(upper)) return f.code;
  }
  return null;
}
