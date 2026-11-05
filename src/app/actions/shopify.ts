"use server";

import { fetchShopifyRange, type FunnelRow } from "@/lib/shopify-funnels";

export type ShopifyPullResult =
  | { ok: true; rows: FunnelRow[]; pulledAt: string }
  | { ok: false; error: string };

const ISO = /^\d{4}-\d{2}-\d{2}$/;

// Pull a date range live from Shopify (plus whatever prior period the caller
// asks for). Called by the "Update data" button on /shopify-funnels.
export async function pullShopifyRange(from: string, to: string): Promise<ShopifyPullResult> {
  if (!ISO.test(from) || !ISO.test(to) || from > to) {
    return { ok: false, error: "Pick a valid start and end date." };
  }
  // Keep a single click from fanning out into dozens of Shopify queries.
  const days = (Date.parse(to) - Date.parse(from)) / 86400000 + 1;
  if (days > 400) return { ok: false, error: "Range too long. Pick 400 days or fewer." };

  const token = process.env.SHOPIFY_ADMIN_TOKEN;
  if (!token) {
    return {
      ok: false,
      error:
        "Live updates aren't connected yet. Add SHOPIFY_ADMIN_TOKEN in Vercel (Shopify custom app with read_reports). Showing the saved snapshot until then.",
    };
  }
  try {
    const rows = await fetchShopifyRange(token, from, to, true);
    return { ok: true, rows, pulledAt: new Date().toISOString() };
  } catch (e) {
    return { ok: false, error: `Shopify pull failed: ${(e as Error).message.slice(0, 200)}` };
  }
}
