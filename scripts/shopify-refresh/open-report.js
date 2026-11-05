// Step 1 (run in the Shopify admin tab): open the ShopifyQL report for one date range.
// Replace __SINCE__ and __UNTIL__ (YYYY-MM-DD) before running. Keep ranges <= 31 days
// (~15 rows/day, and the report shows at most 1000 rows).
// Pages here must match SHOPIFY_FUNNELS in src/lib/shopify-funnels.ts.
const pages = [
  "/pages/sf2-driver-media-info-sc",
  "/pages/sf2-driver-media-product-sc",
  "/collections/drivers/products/sf2-driver",
  "/products/357-fairway-wood",
  "/products/rs1-putter",
];
const q = [
  "FROM sessions",
  "SHOW sessions, pageviews, sessions_with_cart_additions, sessions_that_reached_checkout, sessions_that_completed_checkout",
  "WHERE human_or_bot_session = 'human' AND landing_page_path IN (" + pages.map((p) => `'${p}'`).join(", ") + ")",
  "GROUP BY day, landing_page_path, session_device_type",
  "SINCE __SINCE__ UNTIL __UNTIL__",
  "ORDER BY day ASC",
  "LIMIT 1000",
].join("\n");
location.href = "/store/performancegolf/analytics/reports/conversion_rate_breakdown?ql=" + encodeURIComponent(q);
"opening __SINCE__ to __UNTIL__";
