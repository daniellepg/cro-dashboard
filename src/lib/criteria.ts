export const CRITERIA = [
  { key: "aboveFold", label: "Above the fold?" },
  { key: "noticed5s", label: "Noticed within 5s?" },
  { key: "addRemoveElement", label: "Adding / removing element?" },
  { key: "increaseMotivation", label: "Aims to increase motivation?" },
  { key: "highTraffic", label: "Running on high traffic page?" },
  { key: "userTesting", label: "Issue found via user testing?" },
  { key: "qualFeedback", label: "Issue found via qual. feedback?" },
  { key: "analytics", label: "Insights via analytics?" },
  { key: "heatmaps", label: "Supported by mouse / eye tracking / heat maps?" },
  { key: "easeImpl", label: "Ease of implementation?" },
] as const;

export type CriterionKey = (typeof CRITERIA)[number]["key"];

export function scoreOf(row: Record<CriterionKey, boolean>): number {
  return CRITERIA.reduce((n, c) => n + (row[c.key] ? 1 : 0), 0);
}
