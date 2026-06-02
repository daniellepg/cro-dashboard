"use client";

import { useTransition } from "react";
import { CRITERIA, type CriterionKey } from "@/lib/criteria";
import { toggleCriterion, updateIdeaStatus, deleteIdea } from "@/app/actions";

type Idea = Record<CriterionKey, boolean> & {
  id: number;
  hypothesis: string;
  submittedBy: string | null;
  score: number;
};

export function IdeaRow({ idea }: { idea: Idea }) {
  const [pending, startTransition] = useTransition();

  return (
    <tr className="border-t border-slate-800 hover:bg-slate-900/50">
      <td className="px-3 py-2">
        <span className="inline-flex items-center justify-center size-8 rounded-full bg-amber-400 text-slate-950 font-semibold text-sm">
          {idea.score}
        </span>
      </td>
      <td className="px-3 py-2">
        <div className="font-medium">{idea.hypothesis}</div>
        {idea.submittedBy && (
          <div className="text-xs text-slate-500 mt-0.5">by {idea.submittedBy}</div>
        )}
      </td>
      {CRITERIA.map((c) => (
        <td key={c.key} className="px-1 py-2 text-center">
          <input
            type="checkbox"
            disabled={pending}
            checked={idea[c.key]}
            onChange={(e) =>
              startTransition(() =>
                toggleCriterion(idea.id, c.key, e.target.checked),
              )
            }
            className="size-4 accent-amber-400"
          />
        </td>
      ))}
      <td className="px-3 py-2 text-right">
        <div className="flex justify-end gap-1">
          <button
            disabled={pending}
            onClick={() =>
              startTransition(() => updateIdeaStatus(idea.id, "in_progress"))
            }
            className="text-xs px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
          >
            Promote
          </button>
          <button
            disabled={pending}
            onClick={() => {
              if (confirm("Delete this idea?")) {
                startTransition(() => deleteIdea(idea.id));
              }
            }}
            className="text-xs px-2 py-1 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500/30"
          >
            ✕
          </button>
        </div>
      </td>
    </tr>
  );
}
