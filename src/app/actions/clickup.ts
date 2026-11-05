"use server";

import { refresh, updateTag } from "next/cache";
import { CLICKUP_CACHE_TAG } from "@/lib/clickup";

// Throw away the cached ClickUp responses and re-render the page with fresh data.
export async function refreshClickUp() {
  updateTag(CLICKUP_CACHE_TAG);
  refresh();
}
