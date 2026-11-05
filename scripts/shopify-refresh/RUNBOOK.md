# Shopify funnel refresh — runbook

Refreshes `src/data/shopify-funnels/daily.json` (the data behind
`/shopify-funnels`) from Shopify admin, using Danielle's signed-in Chrome.
Run by the scheduled task **shopify-funnel-refresh** on weekday mornings.

Why this way: there is no Shopify API token yet. Once `SHOPIFY_ADMIN_TOKEN`
is set in Vercel, the page pulls live by itself and this job can be turned off.

## Steps

All paths are relative to `~/cro-dashboard/scripts/shopify-refresh/`.

1. **Dates.** `UNTIL` = yesterday (Eastern). `SINCE` = 7 days before UNTIL
   (8 days total). Re-pulling the last week picks up Shopify's late corrections.
2. **Open the report.** In Chrome (Claude in Chrome tools), open a new tab on
   `https://admin.shopify.com/store/performancegolf`. If it shows a login page,
   stop and report "Shopify admin is signed out" — never type a password.
   Then run `open-report.js` with `__SINCE__`/`__UNTIL__` replaced.
3. **Collect.** Wait ~8 seconds, then run `collect.js`. It must say
   `Valid query; COLLECTED N of N` with both numbers equal. If not, wait a few
   seconds and run `collect.js` again (it de-duplicates). If it still doesn't
   match, stop and report.
4. **Read out.** Run `read.js` with `__PART__` = 0, 1, 2, … until the result
   says `LAST`. Write the data line of each chunk (everything after the first
   line), in order, to `inbox/pull.txt`.
5. **Merge.** `python3 -I merge.py --since SINCE --until UNTIL`. It must print `OK:`.
   It refuses partial or malformed pulls; if it prints `FAIL:`, stop and report.
6. **Publish.** `./publish.sh`. It commits only `daily.json` and pushes, which
   makes Vercel redeploy. It prints `OK:`, `NOCHANGE:`, or `FAIL:` — on `FAIL:`
   report the message and do not try to work around it.
7. **Clean up.** Close the Chrome tab you opened.

## Rules

- Never navigate Chrome to `127.0.0.1`/`localhost` — the extension then blocks
  every call until that tab is closed.
- Never change anything in Shopify admin; this job only reads a report.
- Never commit or push anything except `daily.json` (publish.sh enforces this).

## Changing the funnels

The page list lives in four places, in the same order: `open-report.js`,
`read.js`, `merge.py` (`PAGES`), and `SHOPIFY_FUNNELS` in
`src/lib/shopify-funnels.ts`. Add new pages to the END of the lists so old
page numbers stay valid, then backfill with a longer `--since`.
