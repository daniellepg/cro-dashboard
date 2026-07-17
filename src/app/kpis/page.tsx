import Link from "next/link";
import jun2026 from "@/data/mbr/2026-06.json";
import type { MbrData } from "@/lib/mbr";
import { CroKpiGrid } from "@/components/cro-kpi-grid";

const mbr = jun2026 as MbrData;
const sc  = mbr.cro_scorecard!;

export default function KPIsPage() {
  return (
    <div>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <div className="text-[10px] tracking-[0.3em] text-[#c9a55e] uppercase font-semibold mb-2">
            Monthly Board
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">CRO Key KPIs</h1>
          <p className="text-[#8b95a7] mt-1 text-sm">June 2026 · Source: MBR scorecard</p>
        </div>
        <Link href="/mbr/2026-06"
          className="text-xs text-[#c9a55e] hover:text-[#d6b572] transition-colors uppercase tracking-widest">
          View full MBR →
        </Link>
      </div>

      <CroKpiGrid sc={sc} />
    </div>
  );
}
