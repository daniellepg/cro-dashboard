// Shopify funnel drop-off data (physical funnels: 357, SF2, RS1).
//
// Source: Shopify Analytics, ShopifyQL `sessions` dataset, human sessions only.
// Grain:  day × landing page × device.
//
// Two ways to get data, tried in order:
//   1. LIVE  — if SHOPIFY_ADMIN_TOKEN is set, run ShopifyQL through the Admin
//              GraphQL API (needs a custom app with the `read_reports` scope).
//              The page revalidates daily, so this refreshes itself.
//   2. SNAPSHOT — src/data/shopify-funnels/daily.json, pulled from Shopify admin.
//
// Important: Shopify attributes a session to the page it LANDED on. A session
// that lands on the SF2 info page and then clicks through to the PDP is counted
// under the info page only. So each SF2 page is an entry point, not a step.

import snapshot from "@/data/shopify-funnels/daily.json";

export type Device = "desktop" | "mobile" | "tablet" | "other";

export type FunnelRow = {
  date: string; // YYYY-MM-DD
  page: string; // landing page path
  device: Device;
  sessions: number;
  pageviews: number;
  atc: number; // sessions with cart additions
  checkout: number; // sessions that reached checkout
  purchases: number; // sessions that completed checkout
};

export type FunnelPage = { path: string; label: string; url: string };
export type FunnelDef = { code: string; name: string; pages: FunnelPage[] };

const SHOP = "https://shop.performancegolf.com";

export const SHOPIFY_FUNNELS: FunnelDef[] = [
  {
    code: "357",
    name: "357 Fairway Wood",
    pages: [{ path: "/products/357-fairway-wood", label: "357 PDP", url: `${SHOP}/products/357-fairway-wood` }],
  },
  {
    code: "SF2",
    name: "SF2 Driver",
    pages: [
      { path: "/pages/sf2-driver-media-info-sc", label: "Info page", url: `${SHOP}/pages/sf2-driver-media-info-sc` },
      { path: "/pages/sf2-driver-media-product-sc", label: "Product page", url: `${SHOP}/pages/sf2-driver-media-product-sc` },
      { path: "/collections/drivers/products/sf2-driver", label: "PDP", url: `${SHOP}/collections/drivers/products/sf2-driver` },
    ],
  },
  {
    code: "RS1",
    name: "RS1 Putter",
    pages: [{ path: "/products/rs1-putter", label: "RS1 PDP", url: `${SHOP}/products/rs1-putter` }],
  },
];

const ALL_PATHS = SHOPIFY_FUNNELS.flatMap((f) => f.pages.map((p) => p.path));

export type FunnelData = {
  rows: FunnelRow[];
  live: boolean;
  source: string;
  firstDate: string;
  lastDate: string;
  note?: string;
};

// ---------- Live pull (Shopify Admin GraphQL → ShopifyQL) ----------

const SHOP_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN ?? "performancegolf.myshopify.com";
const API_VERSION = process.env.SHOPIFY_API_VERSION ?? "2025-10";

function isoDaysAgo(n: number) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

function num(v: unknown) {
  const n = typeof v === "number" ? v : Number(String(v ?? "0").replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function normDevice(v: unknown): Device {
  const s = String(v ?? "").toLowerCase();
  return s === "desktop" || s === "mobile" || s === "tablet" ? s : "other";
}

async function runShopifyQL(token: string, ql: string) {
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": token },
    body: JSON.stringify({
      query: `query($q: String!) { shopifyqlQuery(query: $q) { tableData { columns { name } rows } parseErrors } }`,
      variables: { q: ql },
    }),
    next: { revalidate: 60 * 60 * 6 }, // 6h cache
  });
  if (!res.ok) throw new Error(`Shopify API ${res.status}: ${await res.text()}`);
  const json = await res.json();
  const r = json?.data?.shopifyqlQuery;
  if (json.errors || r?.parseErrors?.length) {
    throw new Error(`ShopifyQL error: ${JSON.stringify(json.errors ?? r.parseErrors)}`);
  }
  const cols: string[] = (r?.tableData?.columns ?? []).map((c: { name: string }) => c.name);
  const rows: unknown[] = r?.tableData?.rows ?? [];
  // Rows can come back as objects keyed by column name or as positional arrays.
  return rows.map((row) =>
    Array.isArray(row) ? Object.fromEntries(cols.map((c, i) => [c, row[i]])) : (row as Record<string, unknown>),
  );
}

async function fetchLive(token: string): Promise<FunnelRow[]> {
  const pathList = ALL_PATHS.map((p) => `'${p}'`).join(", ");
  // ShopifyQL caps rows per query, so pull in 30-day windows.
  const windows: Array<[string, string]> = [];
  for (let start = 120; start > 0; start -= 30) {
    windows.push([isoDaysAgo(start), isoDaysAgo(Math.max(start - 29, 1))]);
  }
  const results = await Promise.all(
    windows.map(([since, until]) =>
      runShopifyQL(
        token,
        [
          "FROM sessions",
          "SHOW sessions, pageviews, sessions_with_cart_additions, sessions_that_reached_checkout, sessions_that_completed_checkout",
          `WHERE human_or_bot_session = 'human' AND landing_page_path IN (${pathList})`,
          "GROUP BY day, landing_page_path, session_device_type",
          `SINCE ${since} UNTIL ${until}`,
          "ORDER BY day ASC",
          "LIMIT 1000",
        ].join(" "),
      ),
    ),
  );
  return results.flat().map((r) => ({
    date: String(r.day).slice(0, 10),
    page: String(r.landing_page_path),
    device: normDevice(r.session_device_type),
    sessions: num(r.sessions),
    pageviews: num(r.pageviews),
    atc: num(r.sessions_with_cart_additions),
    checkout: num(r.sessions_that_reached_checkout),
    purchases: num(r.sessions_that_completed_checkout),
  }));
}

export async function getShopifyFunnelData(): Promise<FunnelData> {
  const snap = snapshot as { source: string; firstDate: string; lastDate: string; rows: FunnelRow[] };
  const token = process.env.SHOPIFY_ADMIN_TOKEN;
  if (token) {
    try {
      const rows = (await fetchLive(token)).filter((r) => r.date && r.page);
      if (rows.length) {
        const dates = rows.map((r) => r.date).sort();
        return { rows, live: true, source: snap.source, firstDate: dates[0], lastDate: dates.at(-1)! };
      }
    } catch (e) {
      return {
        rows: snap.rows,
        live: false,
        source: snap.source,
        firstDate: snap.firstDate,
        lastDate: snap.lastDate,
        note: `Live Shopify pull failed, showing snapshot. ${(e as Error).message.slice(0, 200)}`,
      };
    }
  }
  return { rows: snap.rows, live: false, source: snap.source, firstDate: snap.firstDate, lastDate: snap.lastDate };
}
