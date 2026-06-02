"use client";

import { useTransition } from "react";
import { updateTest, updateIdeaStatus } from "@/app/actions";

type TestRowData = {
  id: number;
  ideaId: number | null;
  name: string;
  platform: string | null;
  variants: string | null;
  startDate: string | null;
  endDate: string | null;
  result: "win" | "loss" | "inconclusive" | null;
  liftPct: string | null;
  learnings: string | null;
};

export function TestRow({ test }: { test: TestRowData }) {
  const [pending, startTransition] = useTransition();

  const inputCls =
    "w-full bg-transparent border-0 px-2 py-1 text-sm focus:outline-none focus:bg-slate-800 rounded";

  return (
    <tr className="border-t border-slate-800">
      <td>
        <input
          defaultValue={test.name}
          disabled={pending}
          onBlur={(e) =>
            e.target.value !== test.name &&
            startTransition(() => updateTest(test.id, { name: e.target.value }))
          }
          className={inputCls}
        />
      </td>
      <td>
        <input
          defaultValue={test.platform ?? ""}
          placeholder="—"
          disabled={pending}
          onBlur={(e) =>
            startTransition(() => updateTest(test.id, { platform: e.target.value }))
          }
          className={inputCls}
        />
      </td>
      <td>
        <input
          defaultValue={test.variants ?? ""}
          placeholder="A / B"
          disabled={pending}
          onBlur={(e) =>
            startTransition(() => updateTest(test.id, { variants: e.target.value }))
          }
          className={inputCls}
        />
      </td>
      <td>
        <input
          type="date"
          defaultValue={test.startDate ?? ""}
          disabled={pending}
          onBlur={(e) =>
            startTransition(() => updateTest(test.id, { startDate: e.target.value || null }))
          }
          className={inputCls}
        />
      </td>
      <td>
        <input
          type="date"
          defaultValue={test.endDate ?? ""}
          disabled={pending}
          onBlur={(e) =>
            startTransition(() => updateTest(test.id, { endDate: e.target.value || null }))
          }
          className={inputCls}
        />
      </td>
      <td className="px-3 py-2">
        <button
          disabled={pending || !test.ideaId}
          onClick={() => {
            if (test.ideaId)
              startTransition(() => updateIdeaStatus(test.ideaId!, "complete"));
          }}
          className="text-xs px-2 py-1 rounded bg-amber-400/20 text-amber-300 hover:bg-amber-400/30"
        >
          Mark complete
        </button>
      </td>
    </tr>
  );
}
