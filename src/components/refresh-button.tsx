"use client";

import { useTransition } from "react";
import { refreshClickUp } from "@/app/actions/clickup";

export function RefreshButton({ fetchedAt }: { fetchedAt: string }) {
  const [pending, startTransition] = useTransition();
  const time = new Date(fetchedAt).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="flex items-center gap-3 shrink-0">
      <span className="text-[11px] text-[#5a6478] whitespace-nowrap" suppressHydrationWarning>
        Updated {time}
      </span>
      <button
        onClick={() => startTransition(() => refreshClickUp())}
        disabled={pending}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md border border-white/10 bg-white/[0.03] text-sm font-medium text-[#f4f5f7] hover:border-[#FD3300]/50 hover:text-[#FD3300] disabled:opacity-60 disabled:cursor-wait transition-colors"
        title="Pull the latest from ClickUp"
      >
        <span className={pending ? "animate-spin inline-block" : "inline-block"}>↻</span>
        {pending ? "Refreshing…" : "Refresh"}
      </button>
    </div>
  );
}
