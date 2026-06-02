import { submitIdea } from "../actions";
import { CRITERIA } from "@/lib/criteria";

export default function SubmitPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold mb-2">Submit a CRO Idea</h1>
      <p className="text-slate-400 mb-6 text-sm">
        Score the hypothesis against the framework. Higher score = higher priority.
      </p>

      <form action={submitIdea} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1.5">Hypothesis</label>
          <textarea
            name="hypothesis"
            required
            rows={4}
            placeholder="If we [change X] on [page Y], then [metric Z] will [improve], because [reasoning]…"
            className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Submitted by (optional)</label>
          <input
            name="submittedBy"
            type="text"
            placeholder="Your name"
            className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:border-slate-500"
          />
        </div>

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium mb-2">Framework checklist</legend>
          {CRITERIA.map((c) => (
            <label
              key={c.key}
              className="flex items-center gap-3 p-2.5 rounded-md bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer"
            >
              <input
                type="checkbox"
                name={c.key}
                className="size-4 accent-amber-400"
              />
              <span className="text-sm">{c.label}</span>
            </label>
          ))}
        </fieldset>

        <button
          type="submit"
          className="rounded-md bg-amber-400 text-slate-950 font-medium px-4 py-2 text-sm hover:bg-amber-300"
        >
          Submit idea
        </button>
      </form>
    </div>
  );
}
