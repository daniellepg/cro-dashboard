import {
  pgTable,
  serial,
  text,
  boolean,
  timestamp,
  integer,
  date,
  pgEnum,
} from "drizzle-orm/pg-core";

export const statusEnum = pgEnum("status", [
  "backlog",
  "in_progress",
  "complete",
  "archived",
]);

export const resultEnum = pgEnum("result", ["win", "loss", "inconclusive"]);

export const ideas = pgTable("ideas", {
  id: serial("id").primaryKey(),
  hypothesis: text("hypothesis").notNull(),
  submittedBy: text("submitted_by"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  status: statusEnum("status").default("backlog").notNull(),

  aboveFold: boolean("above_fold").default(false).notNull(),
  noticed5s: boolean("noticed_5s").default(false).notNull(),
  addRemoveElement: boolean("add_remove_element").default(false).notNull(),
  increaseMotivation: boolean("increase_motivation").default(false).notNull(),
  highTraffic: boolean("high_traffic").default(false).notNull(),
  userTesting: boolean("user_testing").default(false).notNull(),
  qualFeedback: boolean("qual_feedback").default(false).notNull(),
  analytics: boolean("analytics").default(false).notNull(),
  heatmaps: boolean("heatmaps").default(false).notNull(),
  easeImpl: boolean("ease_impl").default(false).notNull(),
});

export const tests = pgTable("tests", {
  id: serial("id").primaryKey(),
  ideaId: integer("idea_id").references(() => ideas.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  platform: text("platform"),
  variants: text("variants"),
  startDate: date("start_date"),
  endDate: date("end_date"),
  result: resultEnum("result"),
  liftPct: text("lift_pct"),
  learnings: text("learnings"),
});

export const recaps = pgTable("recaps", {
  id: serial("id").primaryKey(),
  month: text("month").notNull(),
  narrative: text("narrative"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
