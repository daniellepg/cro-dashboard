# CRO Dashboard — Performance Golf Zone

Cover-page dashboard for the CRO team. Six tiles → six detail views.

## Tiles

| Tile | Source | Status |
|---|---|---|
| **Live Tests** | ClickUp · CRO Projects list · status = `live` | ✅ Wired |
| **Initialized Tests** | ClickUp · status = `initialized` | ✅ Wired |
| **Submit an Idea** | External ClickUp form | ✅ Wired |
| **WoW Data by Funnel** | Domo (top 8 funnels) | ⏳ Stub — needs Domo creds |
| **Key KPIs** | Domo + ClickUp (8 KPIs by month) | ⏳ Stub — needs Domo creds |
| **Testing Priorities** | ClickUp pipeline · toggle by funnel | ✅ Wired |

## Top 8 funnels

Physical: **357** (Shopify + CC), **RS1** (Shopify), **SF2** (Shopify), **SSP** (Shopify + CC)
Digital: **WPSS**, **OSSF**, **SSTS**, **PG1** (all CC)

## Deploy

1. **Import on Vercel** → https://vercel.com/new → pick `daniellepg/cro-dashboard` → Deploy.
2. **Add env vars** (Vercel project → Settings → Environment Variables):
   - `CLICKUP_TOKEN` — ClickUp personal token (Settings → Apps → API Token in ClickUp)
   - `DOMO_CLIENT_ID` and `DOMO_CLIENT_SECRET` — when ready for funnel data
3. **Redeploy** to pick up env vars.
4. **(Optional)** Settings → Deployment Protection → password-protect.

## Local dev

```bash
npm install
cp .env.example .env.local   # fill in CLICKUP_TOKEN
npm run dev
```

## Stack

Next.js 16 (App Router) · Tailwind v4 · ClickUp REST API · Domo API (pending)

## Where data comes from

- **ClickUp list:** Growth → CRO → CRO Projects (`901413548373`)
- **Funnel detection:** parsed from the task name (e.g. "357 Media…" → `357`)
- **Parent tasks only:** subtasks like `Pre-Launch QA | 357 …` are filtered out
