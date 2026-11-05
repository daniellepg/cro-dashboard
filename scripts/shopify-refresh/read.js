// Step 3: read the collected rows back out in small chunks (the browser tool only
// returns ~1KB per call). Replace __PART__ with 0, 1, 2… and keep going until the
// result says "LAST". Each chunk is compact text: YYYYMMDD|page#|device|s,pv,atc,co,pu
// (page# is the index in the pages list in open-report.js). Paste every chunk,
// in order, into inbox/pull.txt — merge.py decodes it.
const pages = [
  "/pages/sf2-driver-media-info-sc",
  "/pages/sf2-driver-media-product-sc",
  "/collections/drivers/products/sf2-driver",
  "/products/357-fairway-wood",
  "/products/rs1-putter",
];
const M = { Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06", Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12" };
const rows = JSON.parse(localStorage.getItem("pgf_rows") || "[]");
const enc = rows.map((r) => {
  const m = r[0].match(/(\w{3}) (\d{1,2}), (\d{4})/);
  const p = pages.indexOf(r[1]);
  return `${m[3]}${M[m[1]]}${m[2].padStart(2, "0")}|${p < 0 ? "?" + r[1] : p}|${r[2][0]}|${r.slice(3, 8).map((x) => x.replace(/,/g, "") || "0").join(",")}`;
});
const text = enc.join(";");
const SIZE = 800, part = __PART__;
const chunk = text.slice(part * SIZE, (part + 1) * SIZE);
const lastPart = (part + 1) * SIZE >= text.length;
if (lastPart) localStorage.removeItem("pgf_rows");
`${lastPart ? "LAST" : "MORE"} part ${part} of ${Math.ceil(text.length / SIZE) - 1} (${rows.length} rows)\n${chunk}`;
