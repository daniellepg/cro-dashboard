"use client";

import { useMemo, useState } from "react";
import type { FunnelDef, FunnelRow } from "@/lib/shopify-funnels";

type DeviceFilter = "all" | "desktop" | "mobile";

type Totals = { sessions: number; pageviews: number; atc: number; checkout: number; purchases: number };

const ZERO: Totals = { sessions: 0, pageviews: 0, atc: 0, checkout: 0, purchases: 0 };

function addDays(iso: string, n: number) {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string) {
  return Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86400000) + 1;
}

function sum(rows: FunnelRow[], paths: string[], from: string, to: string, device: DeviceFilter): Totals {
  const t = { ...ZERO };
  for (const r of rows) {
    if (r.date < from || r.date > to) continue;
    if (!paths.includes(r.page)) continue;
    if (device !== "all" && r.device !== device) continue;
    t.sessions += r.sessions;
    t.pageviews += r.pageviews;
    t.atc += r.atc;
    t.checkout += r.checkout;
    t.purchases += r.purchases;
  }
  return t;
}

const pct = (n: number, d: number) => (d > 0 ? n / d : null);
const fmtPct = (v: number | null, digits = 2) => (v === null ? "—" : `${(v * 100).toFixed(digits)}%`);
const fmtNum = (v: number) => v.toLocaleString();

// Relative change vs prior period, e.g. +12.3%
function Delta({ cur, prev, isRate }: { cur: number | null; prev: number | null; isRate?: boolean }) {
  if (cur === null || prev === null || prev === 0) return <span className="text-[#5a6478]">—</span>;
  const change = (cur - prev) / prev;
  const up = change >= 0;
  return (
    <span className={up ? "text-emerald-400" : "text-rose-400"} title={isRate ? "Relative change in rate" : undefined}>
      {up ? "▲" : "▼"} {Math.abs(change * 100).toFixed(1)}%
    </span>
  );
}

function Toggle<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex rounded-md border border-white/[0.08] p-0.5 bg-white/[0.02]">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] rounded transition-colors ${
            value === o.value ? "bg-[#FD3300] text-white" : "text-[#8b95a7] hover:text-white"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// Horizontal drop-off bars: Sessions → ATC → Checkout → Purchase
function DropoffBars({ t }: { t: Totals }) {
  const steps = [
    { label: "Sessions", v: t.sessions },
    { label: "Added to cart", v: t.atc },
    { label: "Reached checkout", v: t.checkout },
    { label: "Purchased", v: t.purchases },
  ];
  const max = Math.max(t.sessions, 1);
  return (
    <div className="space-y-2">
      {steps.map((s, i) => {
        const prev = i > 0 ? steps[i - 1].v : null;
        const stepRate = prev !== null ? pct(s.v, prev) : null;
        return (
          <div key={s.label} className="grid grid-cols-[120px_1fr_150px] items-center gap-3 text-xs">
            <div className="text-[#8b95a7]">{s.label}</div>
            <div className="h-5 rounded bg-white/[0.04] overflow-hidden">
              <div
                className="h-full rounded bg-[#FD3300]"
                style={{ width: `${Math.max((s.v / max) * 100, s.v > 0 ? 0.6 : 0)}%`, opacity: 1 - i * 0.18 }}
              />
            </div>
            <div className="tabular-nums text-right">
              <span className="font-semibold">{fmtNum(s.v)}</span>
              {stepRate !== null && (
                <span className="text-[#5a6478] ml-2" title="Share of the previous step that made it here">
                  {fmtPct(stepRate, 1)} · drop {fmtPct(1 - (stepRate ?? 0), 1)}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

type Line = { key: string; label: string; url?: string; paths: string[]; bold?: boolean };

function MetricsTable({
  lines,
  rows,
  from,
  to,
  pFrom,
  pTo,
  device,
}: {
  lines: Line[];
  rows: FunnelRow[];
  from: string;
  to: string;
  pFrom: string;
  pTo: string;
  device: DeviceFilter;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[10px] tracking-[0.14em] text-[#8b95a7] uppercase">
            <th className="py-2 pr-3 font-semibold">Landing page</th>
            <th className="py-2 px-3 font-semibold text-right">Sessions</th>
            <th className="py-2 px-3 font-semibold text-right">Page views</th>
            <th className="py-2 px-3 font-semibold text-right">Add to cart</th>
            <th className="py-2 px-3 font-semibold text-right">ATC rate</th>
            <th className="py-2 px-3 font-semibold text-right">Sessions w/ checkout</th>
            <th className="py-2 px-3 font-semibold text-right">Purchases</th>
            <th className="py-2 pl-3 font-semibold text-right">CVR</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((l) => {
            const c = sum(rows, l.paths, from, to, device);
            const p = sum(rows, l.paths, pFrom, pTo, device);
            const atcR = pct(c.atc, c.sessions);
            const cvr = pct(c.purchases, c.sessions);
            return (
              <tr key={l.key} className={`border-t border-white/[0.06] align-top ${l.bold ? "font-semibold" : ""}`}>
                <td className="py-2.5 pr-3">
                  {l.url ? (
                    <a href={l.url} target="_blank" rel="noopener noreferrer" className="hover:text-[#FD3300]">
                      {l.label} <span className="text-[#5a6478]">↗</span>
                    </a>
                  ) : (
                    l.label
                  )}
                </td>
                {[
                  [c.sessions, p.sessions],
                  [c.pageviews, p.pageviews],
                  [c.atc, p.atc],
                ].map(([cv, pv], i) => (
                  <td key={i} className="py-2.5 px-3 text-right tabular-nums">
                    <div>{fmtNum(cv)}</div>
                    <div className="text-[10px]"><Delta cur={cv} prev={pv} /></div>
                  </td>
                ))}
                <td className="py-2.5 px-3 text-right tabular-nums">
                  <div>{fmtPct(atcR)}</div>
                  <div className="text-[10px]"><Delta cur={atcR} prev={pct(p.atc, p.sessions)} isRate /></div>
                </td>
                {[
                  [c.checkout, p.checkout],
                  [c.purchases, p.purchases],
                ].map(([cv, pv], i) => (
                  <td key={i} className="py-2.5 px-3 text-right tabular-nums">
                    <div>{fmtNum(cv)}</div>
                    <div className="text-[10px]"><Delta cur={cv} prev={pv} /></div>
                  </td>
                ))}
                <td className="py-2.5 pl-3 text-right tabular-nums">
                  <div className="text-[#FD3300] font-semibold">{fmtPct(cvr)}</div>
                  <div className="text-[10px]"><Delta cur={cvr} prev={pct(p.purchases, p.sessions)} isRate /></div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const PRESETS = [
  { days: 7, label: "7D" },
  { days: 14, label: "14D" },
  { days: 30, label: "30D" },
  { days: 90, label: "90D" },
] as const;

export function ShopifyFunnelBoard({
  funnels,
  rows,
  firstDate,
  lastDate,
}: {
  funnels: FunnelDef[];
  rows: FunnelRow[];
  firstDate: string;
  lastDate: string;
}) {
  const [device, setDevice] = useState<DeviceFilter>("all");
  const [to, setTo] = useState(lastDate);
  const [from, setFrom] = useState(addDays(lastDate, -6));

  const span = daysBetween(from, to);
  const pTo = addDays(from, -1);
  const pFrom = addDays(pTo, -(span - 1));
  const hasPrior = pFrom >= firstDate;

  const activePreset = to === lastDate ? PRESETS.find((p) => addDays(lastDate, -(p.days - 1)) === from)?.days : undefined;

  const cards = useMemo(
    () =>
      funnels.map((f) => {
        const paths = f.pages.map((p) => p.path);
        const lines: Line[] =
          f.pages.length > 1
            ? [
                ...f.pages.map((p) => ({ key: p.path, label: p.label, url: p.url, paths: [p.path] })),
                { key: `${f.code}-all`, label: `${f.code} total`, paths, bold: true },
              ]
            : f.pages.map((p) => ({ key: p.path, label: p.label, url: p.url, paths: [p.path] }));
        return { f, paths, lines };
      }),
    [funnels],
  );

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-6 sticky top-[57px] z-[5] bg-[#0a0e14]/95 backdrop-blur py-3 -mx-1 px-1">
        <Toggle
          value={device}
          onChange={setDevice}
          options={[
            { value: "all", label: "All devices" },
            { value: "desktop", label: "Desktop" },
            { value: "mobile", label: "Mobile" },
          ]}
        />
        <div className="inline-flex rounded-md border border-white/[0.08] p-0.5 bg-white/[0.02]">
          {PRESETS.map((p) => (
            <button
              key={p.days}
              type="button"
              onClick={() => {
                setTo(lastDate);
                setFrom(addDays(lastDate, -(p.days - 1)));
              }}
              className={`px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] rounded transition-colors ${
                activePreset === p.days ? "bg-[#FD3300] text-white" : "text-[#8b95a7] hover:text-white"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs text-[#8b95a7]">
          <input
            type="date"
            value={from}
            min={firstDate}
            max={to}
            onChange={(e) => e.target.value && setFrom(e.target.value)}
            className="bg-white/[0.03] border border-white/[0.08] rounded px-2 py-1.5 text-[#f4f5f7] [color-scheme:dark]"
          />
          <span>to</span>
          <input
            type="date"
            value={to}
            min={from}
            max={lastDate}
            onChange={(e) => e.target.value && setTo(e.target.value)}
            className="bg-white/[0.03] border border-white/[0.08] rounded px-2 py-1.5 text-[#f4f5f7] [color-scheme:dark]"
          />
        </div>
        <div className="text-[11px] text-[#5a6478]">
          {hasPrior ? `▲▼ vs ${pFrom} – ${pTo}` : "No prior period in data for comparison"}
        </div>
      </div>

      <div className="space-y-6">
        {cards.map(({ f, paths, lines }) => {
          const t = sum(rows, paths, from, to, device);
          return (
            <section
              key={f.code}
              className="rounded-lg border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent p-5"
            >
              <div className="flex items-baseline justify-between mb-4">
                <div>
                  <div className="text-[10px] tracking-[0.3em] text-[#FD3300] uppercase font-semibold">{f.code}</div>
                  <h2 className="text-xl font-semibold tracking-tight">{f.name}</h2>
                </div>
                <div className="text-right">
                  <div className="text-[10px] tracking-[0.18em] text-[#8b95a7] uppercase font-semibold">CVR</div>
                  <div className="text-2xl font-semibold tabular-nums">{fmtPct(pct(t.purchases, t.sessions))}</div>
                </div>
              </div>
              <DropoffBars t={t} />
              <div className="mt-5">
                <MetricsTable
                  lines={lines}
                  rows={rows}
                  from={from}
                  to={to}
                  pFrom={hasPrior ? pFrom : "9999-99-99"}
                  pTo={hasPrior ? pTo : "0000-00-00"}
                  device={device}
                />
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
