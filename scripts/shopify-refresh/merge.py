"""Merge rows pulled from Shopify (inbox/pull.txt) into the dashboard's data file.

Usage: python3 -I merge.py --since YYYY-MM-DD --until YYYY-MM-DD

Every date from --since to --until is REPLACED with what Shopify returned, so
re-pulling the last week picks up any late corrections. Exits non-zero (and
writes nothing) if the pull looks wrong, e.g. empty, missing days, bad rows.
"""
import argparse, datetime as dt, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, "..", "..", "src", "data", "shopify-funnels", "daily.json")
INBOX = os.path.join(HERE, "inbox", "pull.txt")
PAGES = [
    "/pages/sf2-driver-media-info-sc",
    "/pages/sf2-driver-media-product-sc",
    "/collections/drivers/products/sf2-driver",
    "/products/357-fairway-wood",
    "/products/rs1-putter",
]  # same order as open-report.js / read.js
DEV = {"D": "desktop", "M": "mobile", "T": "tablet", "O": "other"}



ap = argparse.ArgumentParser()
ap.add_argument("--since", required=True)
ap.add_argument("--until", required=True)
ap.add_argument("--allow-gaps", action="store_true", help="one-off backfills only: allow days with no rows")
a = ap.parse_args()

if not os.path.exists(INBOX):
    sys.exit("FAIL: no inbox/pull.txt — paste the read.js chunks there first")

new = []
# Chunks may have been pasted with line breaks between them; join, then split rows on ";".
for rec in "".join(open(INBOX).read().split()).split(";"):
    if not rec:
        continue
    m = re.match(r"(\d{4})(\d{2})(\d{2})\|(\d)\|([DMTO])\|(\d+),(\d+),(\d+),(\d+),(\d+)$", rec)
    if not m:
        sys.exit(f"FAIL: can't read row {rec[:80]!r}")
    day = f"{m[1]}-{m[2]}-{m[3]}"
    if not (a.since <= day <= a.until):
        sys.exit(f"FAIL: row dated {day} is outside {a.since}..{a.until}")
    n = list(map(int, m.groups()[5:]))
    new.append({"date": day, "page": PAGES[int(m[4])], "device": DEV[m[5]],
                "sessions": n[0], "pageviews": n[1], "atc": n[2], "checkout": n[3], "purchases": n[4]})

if not new:
    sys.exit("FAIL: pull was empty")
# Every day in the range should have traffic; a missing day means a partial pull.
want = {(dt.date.fromisoformat(a.since) + dt.timedelta(d)).isoformat()
        for d in range((dt.date.fromisoformat(a.until) - dt.date.fromisoformat(a.since)).days + 1)}
missing = sorted(want - {r["date"] for r in new})
if missing and not a.allow_gaps:
    sys.exit(f"FAIL: no rows for {len(missing)} day(s): {missing[:5]}")
dupes = len(new) - len({(r["date"], r["page"], r["device"]) for r in new})
if dupes:
    sys.exit(f"FAIL: {dupes} duplicate rows")

data = json.load(open(DATA))
kept = [r for r in data["rows"] if not (a.since <= r["date"] <= a.until)]
rows = sorted(kept + new, key=lambda r: (r["date"], r["page"], r["device"]))
data["rows"] = rows
data["firstDate"] = rows[0]["date"]
data["lastDate"] = rows[-1]["date"]
data["pulledAt"] = dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds")
with open(DATA, "w") as f:
    json.dump(data, f, separators=(",", ":"))
os.remove(INBOX)
print(f"OK: replaced {a.since}..{a.until} with {len(new)} rows; file now {data['firstDate']}..{data['lastDate']}, {len(rows)} rows")
