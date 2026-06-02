"use client";

import { useState, useTransition } from "react";
import { saveRecap } from "@/app/actions";

export function RecapEditor({
  month,
  initialNarrative,
}: {
  month: string;
  initialNarrative: string;
}) {
  const [narrative, setNarrative] = useState(initialNarrative);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  return (
    <div>
      <textarea
        value={narrative}
        onChange={(e) => {
          setNarrative(e.target.value);
          setSaved(false);
        }}
        rows={10}
        placeholder="What did we learn this month? What's next?"
        className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:border-slate-500"
      />
      <div className="mt-2 flex items-center gap-3">
        <button
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              await saveRecap(month, narrative);
              setSaved(true);
            })
          }
          className="rounded-md bg-amber-400 text-slate-950 font-medium px-4 py-1.5 text-sm hover:bg-amber-300 disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save narrative"}
        </button>
        {saved && <span className="text-sm text-emerald-400">Saved.</span>}
      </div>
    </div>
  );
}
