"use server";

import { db, ideas, tests, recaps } from "@/lib/db";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CRITERIA, type CriterionKey } from "@/lib/criteria";

function bool(form: FormData, key: string) {
  return form.get(key) === "on" || form.get(key) === "true";
}

export async function submitIdea(formData: FormData) {
  const hypothesis = String(formData.get("hypothesis") || "").trim();
  const submittedBy = String(formData.get("submittedBy") || "").trim() || null;
  if (!hypothesis) throw new Error("Hypothesis is required");

  const criteriaValues = Object.fromEntries(
    CRITERIA.map((c) => [c.key, bool(formData, c.key)]),
  ) as Record<CriterionKey, boolean>;

  await db.insert(ideas).values({
    hypothesis,
    submittedBy,
    ...criteriaValues,
  });

  revalidatePath("/");
  redirect("/");
}

export async function toggleCriterion(
  ideaId: number,
  key: CriterionKey,
  value: boolean,
) {
  await db.update(ideas).set({ [key]: value }).where(eq(ideas.id, ideaId));
  revalidatePath("/");
}

export async function updateIdeaStatus(
  ideaId: number,
  status: "backlog" | "in_progress" | "complete" | "archived",
) {
  await db.update(ideas).set({ status }).where(eq(ideas.id, ideaId));
  if (status === "in_progress") {
    const [idea] = await db.select().from(ideas).where(eq(ideas.id, ideaId));
    if (idea) {
      const existing = await db.select().from(tests).where(eq(tests.ideaId, ideaId));
      if (existing.length === 0) {
        await db.insert(tests).values({
          ideaId,
          name: idea.hypothesis.slice(0, 80),
        });
      }
    }
  }
  revalidatePath("/");
  revalidatePath("/in-progress");
}

export async function deleteIdea(ideaId: number) {
  await db.delete(ideas).where(eq(ideas.id, ideaId));
  revalidatePath("/");
  revalidatePath("/in-progress");
}

export async function updateTest(testId: number, patch: Partial<typeof tests.$inferInsert>) {
  await db.update(tests).set(patch).where(eq(tests.id, testId));
  revalidatePath("/in-progress");
  revalidatePath("/recap");
}

export async function saveRecap(month: string, narrative: string) {
  const existing = await db.select().from(recaps).where(eq(recaps.month, month));
  if (existing.length) {
    await db
      .update(recaps)
      .set({ narrative, updatedAt: new Date() })
      .where(eq(recaps.month, month));
  } else {
    await db.insert(recaps).values({ month, narrative });
  }
  revalidatePath("/recap");
}
