import Link from "next/link";
import { getShopifyFunnelData, SHOPIFY_FUNNELS } from "@/lib/shopify-funnels";
import { ShopifyFunnelBoard } from "@/components/shopify-funnel-board";

// Re-fetch from Shopify at most every 6 hours (only matters once SHOPIFY_ADMIN_TOKEN is set).
export const revalidate = 21600;

export default async function ShopifyFunnelsPage() {
  const data = await getShopifyFunnelData();

  return (
    <div>
      <Link href="/" className="text-[10px] tracking-[0.3em] text-[#8b95a7] uppercase font-semibold">
        ← Command Center
      </Link>
      <div className="mt-4 mb-4">
        <div className="text-[10px] tracking-[0.3em] text-[#FD3300] uppercase font-semibold mb-2">
          Data · Shopify
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">Shopify Funnel Drop-off</h1>
        <p className="text-sm text-[#8b95a7] mt-1.5 max-w-3xl">
          357 · SF2 · RS1 — sessions to add-to-cart to checkout to purchase, by landing page.
        </p>
      </div>

      <div className="rounded-md border border-white/[0.08] bg-white/[0.02] px-4 py-3 mb-6 text-[12px] text-[#8b95a7] space-y-1">
        <div>
          <span className="text-[#f4f5f7] font-semibold">Source:</span> {data.source}.{" "}
          <span className={data.live ? "text-emerald-400" : "text-amber-400"}>
            {data.live ? "Live — refreshes daily." : `Snapshot pulled from Shopify admin, data through ${data.lastDate}.`}
          </span>
        </div>
        <div>
          Sessions are credited to the page they <span className="text-[#f4f5f7]">landed on</span>. The three SF2
          pages are separate entry points, not sequential steps. Page views = all pages viewed in sessions that
          landed there. Purchases = sessions that completed checkout (not order count). Will not exactly match Domo
          order counts.
        </div>
        {data.note && <div className="text-amber-400">{data.note}</div>}
      </div>

      <ShopifyFunnelBoard
        funnels={SHOPIFY_FUNNELS}
        rows={data.rows}
        firstDate={data.firstDate}
        lastDate={data.lastDate}
      />
    </div>
  );
}
