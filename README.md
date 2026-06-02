# CRO Dashboard

A Vercel-hosted, Airtable-style CRO test management dashboard for Performance Golf Zone.

Pages:
- **Prioritized** (`/`) — backlog ranked by the 10-criterion framework score
- **In Progress** (`/in-progress`) — tests currently running, inline-editable
- **Monthly Recap** (`/recap`) — auto-stats from closed tests + your narrative
- **Submit Idea** (`/submit`) — public form, scores against the framework

Stack: Next.js 16, Vercel Postgres (Neon), Drizzle ORM, Tailwind v4.

## Deploy (one-time)

1. **Import on Vercel**
   - Go to https://vercel.com/new → import `daniellepg/cro-dashboard`.
   - Framework is auto-detected (Next.js). Click **Deploy** (the first build will fail because there's no DB yet — that's fine).
2. **Add a Postgres database**
   - In the new project: **Storage → Create Database → Neon (Vercel Postgres)**.
   - Vercel auto-injects `POSTGRES_URL` and friends as env vars.
3. **Run the schema migration**
   - Pull env locally: `vercel env pull .env.local` (or copy `POSTGRES_URL` from Vercel → Settings → Environment Variables into `.env.local`).
   - Run: `npm install && npm run db:push`
4. **Redeploy** — Vercel project → Deployments → ⋯ → Redeploy.
5. **(Optional) Password-protect** — Vercel project → Settings → **Deployment Protection** → enable password.

## Local dev

```bash
npm install
cp .env.example .env.local   # fill POSTGRES_URL
npm run db:push              # apply schema
npm run dev
```

## Framework scoring

Each idea is scored 0–10 by checking which of these apply:

1. Above the fold?
2. Noticed within 5s?
3. Adding / removing element?
4. Aims to increase motivation?
5. Running on high-traffic page?
6. Issue found via user testing?
7. Issue found via qual. feedback?
8. Insights via analytics?
9. Supported by mouse / eye tracking / heat maps?
10. Ease of implementation?

Higher score = higher priority.
