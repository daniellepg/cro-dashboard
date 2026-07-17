"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────────────────────────
type PageRow = {
  id: string;
  product: string;
  platform: "CC" | "Shopify";
  tool: "Convert" | "Intelligems";
  pageType: string;
  label: string;
  weeklyVisitors: number | null; // null = needs manual entry
  cr: number;       // decimal (e.g. 0.02)
  aov: number;      // dollars
  dataSource: string;
};

// ── Static data ────────────────────────────────────────────────────────────
const INITIAL_ROWS: PageRow[] = [
  // RS1 Putter
  { id: "rs1-cc",     product: "RS1 Putter",        platform: "CC",      tool: "Convert",     pageType: "Salespage",      label: "RS1 Putter — Salespage",                weeklyVisitors: Math.round(138940 / 4.33), cr: 0.02, aov: 200, dataSource: "Mixpanel" },
  { id: "rs1-sh",     product: "RS1 Putter",        platform: "Shopify", tool: "Intelligems", pageType: "PDP",            label: "RS1 Putter — PDP",                      weeklyVisitors: null,                      cr: 0.03, aov: 200, dataSource: "⚠ Enter from Shopify Analytics" },
  // 357 Fairway Wood
  { id: "357-hyb",    product: "357 Fairway Wood",  platform: "CC",      tool: "Convert",     pageType: "Salespage",      label: "357 Fairway — Hybrid Salespage",        weeklyVisitors: Math.round(31730 / 4.33),  cr: 0.02, aov: 250, dataSource: "Mixpanel" },
  { id: "357-sp",     product: "357 Fairway Wood",  platform: "CC",      tool: "Convert",     pageType: "Salespage",      label: "357 Fairway — Salespage",               weeklyVisitors: Math.round(5866 / 4.33),   cr: 0.02, aov: 250, dataSource: "Mixpanel" },
  { id: "357-359-sp", product: "357 Fairway Wood",  platform: "CC",      tool: "Convert",     pageType: "Salespage",      label: "357-359 Fairway — Salespage",           weeklyVisitors: Math.round(232 / 4.33),    cr: 0.02, aov: 250, dataSource: "Mixpanel" },
  { id: "357-wmn",    product: "357 Fairway Wood",  platform: "CC",      tool: "Convert",     pageType: "Landing Page",   label: "357 Fairway — Women Member",            weeklyVisitors: Math.round(28 / 4.33),     cr: 0.02, aov: 250, dataSource: "Mixpanel" },
  { id: "357-pdp",    product: "357 Fairway Wood",  platform: "Shopify", tool: "Intelligems", pageType: "PDP",            label: "357 Fairway Wood — PDP",                weeklyVisitors: null,                      cr: 0.03, aov: 250, dataSource: "⚠ Enter from Shopify Analytics" },
  // 359 Fairway Hybrid
  { id: "359-pdp",    product: "359 Fairway Hybrid",platform: "Shopify", tool: "Intelligems", pageType: "PDP",            label: "359 Fairway Hybrid — PDP",              weeklyVisitors: null,                      cr: 0.03, aov: 250, dataSource: "⚠ Enter from Shopify Analytics" },
  // SF2 Driver
  { id: "sf2-info",   product: "SF2 Driver",        platform: "Shopify", tool: "Intelligems", pageType: "Salespage",      label: "SF2 Driver — Media Info SC",            weeklyVisitors: null,                      cr: 0.02, aov: 300, dataSource: "⚠ Enter from Shopify Analytics" },
  { id: "sf2-prod",   product: "SF2 Driver",        platform: "Shopify", tool: "Intelligems", pageType: "Salespage",      label: "SF2 Driver — Media Product SC",         weeklyVisitors: null,                      cr: 0.02, aov: 300, dataSource: "⚠ Enter from Shopify Analytics" },
  { id: "sf2-pdp",    product: "SF2 Driver",        platform: "Shopify", tool: "Intelligems", pageType: "Collection PDP", label: "SF2 Driver — Collection PDP",           weeklyVisitors: null,                      cr: 0.03, aov: 300, dataSource: "⚠ Enter from Shopify Analytics" },
  // Swing Smooth Pro
  { id: "ssp-vsc",    product: "Swing Smooth Pro",  platform: "CC",      tool: "Convert",     pageType: "Salespage",      label: "Swing Smooth Pro — Video SC",           weeklyVisitors: Math.round(2703 / 4.33),   cr: 0.02, aov: 150, dataSource: "Mixpanel" },
  { id: "ssp-vscb",   product: "Swing Smooth Pro",  platform: "CC",      tool: "Convert",     pageType: "Salespage",      label: "Swing Smooth Pro — Video SC-B",         weeklyVisitors: Math.round(432 / 4.33),    cr: 0.02, aov: 150, dataSource: "Mixpanel" },
  { id: "ssp-info",   product: "Swing Smooth Pro",  platform: "Shopify", tool: "Intelligems", pageType: "Salespage",      label: "Swing Smooth Pro — Media Info SC",      weeklyVisitors: null,                      cr: 0.02, aov: 150, dataSource: "⚠ Enter from Shopify Analytics" },
  { id: "ssp-pdp",    product: "Swing Smooth Pro",  platform: "Shopify", tool: "Intelligems", pageType: "PDP",            label: "Swing Smooth Pro — PDP",                weeklyVisitors: null,                      cr: 0.03, aov: 150, dataSource: "⚠ Enter from Shopify Analytics" },
  // ONE Wedges
  { id: "one1-col",   product: "ONE Wedges",        platform: "Shopify", tool: "Intelligems", pageType: "Collection PDP", label: "ONE 1 Wedge — Collection PDP",          weeklyVisitors: null,                      cr: 0.03, aov: 180, dataSource: "⚠ Enter from Shopify Analytics" },
  { id: "one1-pdp",   product: "ONE Wedges",        platform: "Shopify", tool: "Intelligems", pageType: "PDP",            label: "ONE 1 Wedge — PDP",                     weeklyVisitors: null,                      cr: 0.03, aov: 180, dataSource: "⚠ Enter from Shopify Analytics" },
  { id: "ones-pdp",   product: "ONE Wedges",        platform: "Shopify", tool: "Intelligems", pageType: "PDP",            label: "ONE S Wedge — PDP",                     weeklyVisitors: null,                      cr: 0.03, aov: 180, dataSource: "⚠ Enter from Shopify Analytics" },
  // Other
  { id: "clk-stk",   product: "Other",             platform: "CC",      tool: "Convert",     pageType: "Landing Page",   label: "Click Stick Micro Scripts",             weeklyVisitors: Math.round(2526 / 4.33),   cr: 0.02, aov: 100, dataSource: "Mixpanel" },
  { id: "bfcm",       product: "Other",             platform: "CC",      tool: "Convert",     pageType: "Landing Page",   label: "BFCM 2025 Physical",                    weeklyVisitors: null,                      cr: 0.02, aov: 200, dataSource: "⚠ Not in Mixpanel — enter manually" },
];

// ── Settings ───────────────────────────────────────────────────────────────
type Settings = {
  estLift: number;   // decimal
  weeks: number;
  vars: number;
  traffic: number;   // decimal
  sig: number;       // decimal (display only)
};

// ── Calculation ────────────────────────────────────────────────────────────
type Computed = {
  convsPerWeek: number | null;
  convPerVar: number | null;
  mde: number | null;
  testsPerYear: number;
  revenueEffect: number | null;
};

function compute(row: PageRow, s: Settings): Computed {
  const testsPerYear = Math.round(52 / s.weeks);
  if (row.weeklyVisitors === null || row.weeklyVisitors <= 0) {
    return { convsPerWeek: null, convPerVar: null, mde: null, testsPerYear, revenueEffect: null };
  }
  const convsPerWeek = row.weeklyVisitors * row.cr;
  const convPerVar = (convsPerWeek * s.weeks * s.traffic) / s.vars;
  const mde = convPerVar > 0 ? 2.124 / Math.sqrt(convPerVar) : null;
  const revenueEffect = convPerVar != null ? convPerVar * row.aov * s.estLift * testsPerYear : null;
  return { convsPerWeek, convPerVar, mde, testsPerYear, revenueEffect };
}

// ── MDE badge ─────────────────────────────────────────────────────────────
function MdeBadge({ mde }: { mde: number | null }) {
  if (mde === null) return <span className="text-[#5a6478]">—</span>;
  const pct = (mde * 100).toFixed(1) + "%";
  if (mde <= 0.10) return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/15 text-emerald-400">{pct}</span>;
  if (mde <= 0.20) return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-yellow-500/15 text-yellow-400">{pct}</span>;
  if (mde <= 0.50) return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-orange-500/15 text-orange-400">{pct}</span>;
  return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-red-500/15 text-red-400">{pct}</span>;
}

// ── Editable number cell ───────────────────────────────────────────────────
function EditCell({
  value, onChange, format = "number", placeholder = "—",
}: {
  value: number | null;
  onChange: (v: number | null) => void;
  format?: "number" | "pct" | "dollar";
  placeholder?: string;
}) {
  const display = value === null ? "" : format === "pct" ? (value * 100).toFixed(1) : String(value);
  return (
    <input
      type="number"
      value={display}
      placeholder={placeholder}
      onChange={(e) => {
        const raw = parseFloat(e.target.value);
        if (isNaN(raw)) { onChange(null); return; }
        onChange(format === "pct" ? raw / 100 : raw);
      }}
      className="w-full bg-transparent text-center text-[12px] text-[#FD3300] placeholder:text-[#5a6478] focus:outline-none focus:ring-1 focus:ring-[#FD3300]/40 rounded px-1 py-0.5"
    />
  );
}

function fmt$(n: number) {
  return "$" + Math.round(n).toLocaleString();
}
function fmtN(n: number) {
  return Math.round(n).toLocaleString();
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function BandwidthPage() {
  const [settings, setSettings] = useState<Settings>({
    estLift: 0.10,
    weeks: 2,
    vars: 2,
    traffic: 1.0,
    sig: 0.90,
  });

  const [rows, setRows] = useState<PageRow[]>(INITIAL_ROWS);

  function updateRow(id: string, patch: Partial<PageRow>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  const computed = useMemo(
    () => Object.fromEntries(rows.map((r) => [r.id, compute(r, settings)])),
    [rows, settings]
  );

  // Group rows by product
  const products = Array.from(new Set(rows.map((r) => r.product)));

  return (
    <div>
      {/* Back + title */}
      <div className="mb-8">
        <Link href="/" className="text-[11px] tracking-[0.2em] text-[#8b95a7] uppercase hover:text-[#FD3300] transition-colors">
          ← Command Center
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight mt-3">Test Bandwidth Calculator</h1>
        <p className="text-[#8b95a7] mt-1 text-sm max-w-2xl">
          MDE, capacity, and revenue impact per page. CC visitor counts from Mixpanel (last 30 days).
          Shopify pages need visit counts from Shopify Analytics — enter them in the Visitors column.
        </p>
      </div>

      {/* ── Global settings ── */}
      <div className="rounded-lg border border-white/[0.08] bg-[#121821] p-5 mb-8">
        <div className="text-[10px] tracking-[0.3em] text-[#FD3300] uppercase font-semibold mb-4">
          Global Settings
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[
            { label: "Est. Lift",    key: "estLift",  format: "pct"    as const, suffix: "%" },
            { label: "Weeks / Test", key: "weeks",    format: "number" as const, suffix: "" },
            { label: "# Variants",  key: "vars",     format: "number" as const, suffix: "" },
            { label: "Traffic %",   key: "traffic",  format: "pct"    as const, suffix: "%" },
            { label: "Sig Level",   key: "sig",      format: "pct"    as const, suffix: "%" },
          ].map(({ label, key, format }) => {
            const val = settings[key as keyof Settings];
            const display = format === "pct" ? (val * 100).toFixed(0) : String(val);
            return (
              <div key={key} className="flex flex-col gap-1">
                <div className="text-[10px] text-[#8b95a7] uppercase tracking-wider">{label}</div>
                <input
                  type="number"
                  value={display}
                  onChange={(e) => {
                    const raw = parseFloat(e.target.value);
                    if (isNaN(raw)) return;
                    setSettings((s) => ({ ...s, [key]: format === "pct" ? raw / 100 : raw }));
                  }}
                  className="w-full rounded border border-white/[0.08] bg-[#0a0e14] px-3 py-1.5 text-sm text-[#FD3300] focus:outline-none focus:ring-1 focus:ring-[#FD3300]/40"
                />
              </div>
            );
          })}
        </div>
        <p className="text-[11px] text-[#5a6478] mt-4">
          Stats model: 90% confidence, 80% power, 2-variant. MDE formula: 2.124 ÷ √(Conv/Var).
          Effect on Revenue = Conv/Var × AOV × Est. Lift × Tests/Year.
        </p>
      </div>

      {/* ── Legend ── */}
      <div className="flex flex-wrap gap-3 mb-6 text-[11px]">
        {[
          { color: "bg-emerald-500/15 text-emerald-400", label: "MDE ≤ 10% — Strong" },
          { color: "bg-yellow-500/15 text-yellow-400",   label: "MDE 10–20% — Workable" },
          { color: "bg-orange-500/15 text-orange-400",   label: "MDE 20–50% — Tight" },
          { color: "bg-red-500/15 text-red-400",         label: "MDE > 50% — Low traffic" },
        ].map(({ color, label }) => (
          <span key={label} className={`px-2 py-0.5 rounded font-semibold ${color}`}>{label}</span>
        ))}
        <span className="text-[#8b95a7] ml-2">Gold cells = your inputs</span>
      </div>

      {/* ── Table ── */}
      <div className="rounded-lg border border-white/[0.08] overflow-x-auto">
        <table className="w-full text-[12px] border-collapse">
          <thead>
            <tr className="border-b border-white/[0.08] text-[10px] tracking-widest text-[#8b95a7] uppercase">
              {["Page", "Tool", "Type", "Weekly Visitors", "CR %", "Conv/Wk", "Conv/Var", "MDE", "Tests/Yr", "AOV", "Revenue Effect"].map((h) => (
                <th key={h} className="px-3 py-3 text-left font-semibold whitespace-nowrap first:pl-5 last:pr-5">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const productRows = rows.filter((r) => r.product === product);
              return (
                <>
                  {/* Product group header */}
                  <tr key={`grp-${product}`} className="bg-white/[0.02] border-t border-white/[0.06]">
                    <td colSpan={11} className="px-5 py-2 text-[10px] tracking-[0.25em] text-[#FD3300] uppercase font-semibold">
                      /{product}/
                    </td>
                  </tr>

                  {productRows.map((row) => {
                    const c = computed[row.id];
                    const isCC = row.platform === "CC";
                    const needsVisitors = row.weeklyVisitors === null;
                    return (
                      <tr
                        key={row.id}
                        className={`border-t border-white/[0.04] hover:bg-white/[0.02] transition-colors ${isCC ? "" : "opacity-90"}`}
                      >
                        {/* Page label */}
                        <td className="pl-5 pr-3 py-2.5">
                          <div className="font-medium text-[#f4f5f7]">{row.label}</div>
                          {needsVisitors && (
                            <div className="text-[10px] text-[#5a6478] mt-0.5">{row.dataSource}</div>
                          )}
                          {!needsVisitors && (
                            <div className="text-[10px] text-[#5a6478] mt-0.5">Mixpanel · last 30d</div>
                          )}
                        </td>

                        {/* Tool badge */}
                        <td className="px-3 py-2.5 whitespace-nowrap">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${isCC ? "bg-blue-500/10 text-blue-400" : "bg-emerald-500/10 text-emerald-400"}`}>
                            {row.tool}
                          </span>
                        </td>

                        {/* Page type */}
                        <td className="px-3 py-2.5 text-[#8b95a7] whitespace-nowrap">{row.pageType}</td>

                        {/* Weekly visitors (editable if null) */}
                        <td className="px-3 py-2.5">
                          {needsVisitors ? (
                            <div className="border border-[#FD3300]/30 rounded bg-[#FD3300]/5 px-1">
                              <EditCell
                                value={row.weeklyVisitors}
                                onChange={(v) => updateRow(row.id, { weeklyVisitors: v })}
                                placeholder="Enter"
                              />
                            </div>
                          ) : (
                            <span className="text-[#f4f5f7] font-medium">{fmtN(row.weeklyVisitors!)}</span>
                          )}
                        </td>

                        {/* CR% (always editable) */}
                        <td className="px-3 py-2.5">
                          <div className="border border-[#FD3300]/30 rounded bg-[#FD3300]/5 px-1">
                            <EditCell
                              value={row.cr}
                              onChange={(v) => updateRow(row.id, { cr: v ?? 0 })}
                              format="pct"
                              placeholder="2.0"
                            />
                          </div>
                        </td>

                        {/* Conv/week (auto) */}
                        <td className="px-3 py-2.5 text-[#8b95a7]">
                          {c.convsPerWeek != null ? c.convsPerWeek.toFixed(1) : "—"}
                        </td>

                        {/* Conv/Var (auto) */}
                        <td className="px-3 py-2.5 text-[#8b95a7]">
                          {c.convPerVar != null ? c.convPerVar.toFixed(1) : "—"}
                        </td>

                        {/* MDE badge */}
                        <td className="px-3 py-2.5">
                          <MdeBadge mde={c.mde} />
                        </td>

                        {/* Tests/year (auto) */}
                        <td className="px-3 py-2.5 text-[#8b95a7]">{c.testsPerYear}</td>

                        {/* AOV (editable) */}
                        <td className="px-3 py-2.5">
                          <div className="border border-[#FD3300]/30 rounded bg-[#FD3300]/5 px-1">
                            <EditCell
                              value={row.aov}
                              onChange={(v) => updateRow(row.id, { aov: v ?? 0 })}
                              format="dollar"
                              placeholder="200"
                            />
                          </div>
                        </td>

                        {/* Revenue effect (auto) */}
                        <td className="pr-5 pl-3 py-2.5 font-semibold">
                          {c.revenueEffect != null ? (
                            <span className="text-[#FD3300]">{fmt$(c.revenueEffect)}</span>
                          ) : (
                            <span className="text-[#5a6478]">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-[11px] text-[#5a6478] space-y-1">
        <p>Source: Mixpanel · Production Environment · Last 30 days (pulled 2026-06-11). Mixpanel may run 5–10% off Domo — verify before presenting.</p>
        <p>Shopify pages (Intelligems) show no visitor count — pull from Shopify Analytics › Reports › Pages and enter in the Visitors column above.</p>
      </div>
    </div>
  );
}
