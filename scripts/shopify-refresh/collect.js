// Step 2 (run ~8s after open-report.js): scroll the report table, collect every row,
// and add them to localStorage "pgf_rows". The table only renders ~35 rows at a time.
// Returns "COLLECTED <got> of <shopify total>" — the two numbers must match.
const cellsOf = () =>
  [...document.querySelectorAll('[role="row"]')].slice(1).map((r) =>
    [...r.querySelectorAll('[role="cell"],[role="gridcell"],[role="rowheader"]')].map((c) => c.innerText.trim()),
  );
const status = (document.body.innerText.match(/Valid query|Invalid[^\n]*/) || ["?"])[0];
const total = Number(((document.body.innerText.match(/([\d,]+) rows?/) || [])[1] || "0").replace(/,/g, ""));
let sc = document.querySelectorAll('[role="row"]')[1];
while (sc && !(sc.scrollHeight > sc.clientHeight + 5 && /(auto|scroll)/.test(getComputedStyle(sc).overflowY))) sc = sc.parentElement;
if (!sc) sc = document.scrollingElement;
const seen = new Map();
let last = -1, stall = 0;
sc.scrollTop = 0;
await new Promise((r) => setTimeout(r, 300));
for (let i = 0; i < 600; i++) {
  for (const r of cellsOf()) if (r.length >= 8) seen.set(r.slice(0, 3).join("|"), r.slice(0, 8));
  sc.scrollTop += sc.clientHeight * 0.8;
  await new Promise((r) => setTimeout(r, 150));
  if (sc.scrollTop === last) { if (++stall > 3) break; } else { stall = 0; last = sc.scrollTop; }
}
for (const r of cellsOf()) if (r.length >= 8) seen.set(r.slice(0, 3).join("|"), r.slice(0, 8));
const prev = JSON.parse(localStorage.getItem("pgf_rows") || "[]");
localStorage.setItem("pgf_rows", JSON.stringify(prev.concat([...seen.values()])));
`${status}; COLLECTED ${seen.size} of ${total}; stored total ${prev.length + seen.size}`;
