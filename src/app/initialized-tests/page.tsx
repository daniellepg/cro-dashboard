import { fetchTasks } from "@/lib/clickup";
import { TaskTable } from "@/components/task-table";

export const dynamic = "force-dynamic";

export default async function InitializedTestsPage() {
  let tasks: Awaited<ReturnType<typeof fetchTasks>> = [];
  let error: string | null = null;
  try {
    tasks = await fetchTasks({ statuses: ["initialized"] });
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Initialized Tests</h1>
        <p className="text-sm text-slate-400 mt-1">
          From ClickUp · CRO Projects list · status =&nbsp;
          <span className="font-mono text-sky-400">initialized</span>
        </p>
      </div>
      {error ? (
        <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 p-4">
          <div className="font-medium text-rose-300">Couldn&apos;t load from ClickUp</div>
          <pre className="text-xs text-rose-200/80 mt-2 whitespace-pre-wrap">{error}</pre>
        </div>
      ) : (
        <TaskTable tasks={tasks} />
      )}
    </div>
  );
}
