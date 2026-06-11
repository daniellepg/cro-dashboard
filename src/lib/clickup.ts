// ClickUp API client (server-side)
// Requires CLICKUP_TOKEN env var (personal token starts with "pk_")

const WORKSPACE_ID = "9014714949";
const FOLDER_ID    = "90147276572"; // performancegolf.clickup.com/…/v/b/f/90147276572
const API = "https://api.clickup.com/api/v2";

export type ClickUpTask = {
  id: string;
  name: string;
  status: { status: string; color?: string };
  url: string;
  date_created?: string;
  date_updated?: string;
  date_done?: string | null;
  due_date?: string | null;
  assignees: Array<{ id: number; username: string; profilePicture?: string | null }>;
  priority?: { priority: string; color: string } | null;
  tags?: Array<{ name: string }>;
  custom_fields?: Array<{ id: string; name: string; value?: unknown }>;
};

type TaskFetchOpts = {
  statuses?: string[];
  includeClosed?: boolean;
  subtasks?: boolean;
};

export async function fetchTasks(opts: TaskFetchOpts = {}): Promise<ClickUpTask[]> {
  const token = process.env.CLICKUP_TOKEN;
  if (!token) {
    throw new Error(
      "CLICKUP_TOKEN env var is missing. Add a ClickUp personal token to Vercel project env.",
    );
  }

  const all: ClickUpTask[] = [];
  let page = 0;
  while (true) {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.append("folder_ids[]", FOLDER_ID);
    if (opts.subtasks ?? true) params.set("subtasks", "true");
    if (opts.includeClosed) params.set("include_closed", "true");
    (opts.statuses ?? []).forEach((s) => params.append("statuses[]", s));

    const url = `${API}/team/${WORKSPACE_ID}/task?${params.toString()}`;
    const res = await fetch(url, {
      headers: { Authorization: token, "Content-Type": "application/json" },
      next: { revalidate: 60 }, // 1-minute cache
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`ClickUp API ${res.status}: ${text}`);
    }

    const data = (await res.json()) as { tasks: ClickUpTask[] };
    all.push(...data.tasks);
    if (data.tasks.length < 100) break;
    page += 1;
    if (page > 20) break; // safety
  }
  return all;
}

export async function countTasksByStatus(status: string): Promise<number> {
  try {
    const tasks = await fetchTasks({ statuses: [status] });
    // Only count parent tasks (the actual test, not subtasks like "Pre-Launch QA | ...")
    return tasks.filter((t) => !t.name.includes(" | ")).length;
  } catch {
    return 0;
  }
}
