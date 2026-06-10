import { fetchTasks } from "@/lib/clickup";
import { TaskTable } from "@/components/task-table";

export const dynamic = "force-dynamic";

export default async function LiveTestsPage() {
  let tasks: Awaited<ReturnType<typeof fetchTasks>> = [];
  let error: string | null = null;
  try {
    tasks = await fetchTasks({ statuses: ["live"] });
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Live Tests</h1>
        <p className="text-sm text-slate-400 mt-1">
          From ClickUp · CRO Projects list · status =&nbsp;
          <span className="font-mono text-emerald-400">live</span>
        </p>
      </div>
      {error ? (
        <ErrorBox message={error} />
      ) : (
        <TaskTable tasks={tasks} />
      )}
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 p-4">
      <div className="font-medium text-rose-300">Couldn&apos;t load from ClickUp</div>
      <pre className="text-xs text-rose-200/80 mt-2 whitespace-pre-wrap">{message}</pre>
      <p className="text-xs text-slate-400 mt-3">
        Set <code className="bg-slate-800 px-1 rounded">CLICKUP_TOKEN</code> in your Vercel project
        env vars (Settings → Environment Variables). Use a personal token from ClickUp → Settings →
        Apps.
      </p>
    </div>
  );
}
