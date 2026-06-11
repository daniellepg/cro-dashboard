export const CRITERIA = [
  { key: "aboveFold",          label: "Above the fold?",                                     short: "Fold",    max: 1, type: "bool"  },
  { key: "noticed5s",          label: "Noticeable within 5 sec?",                            short: "5-sec",   max: 2, type: "bool2" },
  { key: "addRemoveElement",   label: "Adding or removing an element?",                      short: "+/− El",  max: 2, type: "bool2" },
  { key: "increaseMotivation", label: "Designed to increase user motivation?",               short: "Motiv",   max: 1, type: "bool"  },
  { key: "highTraffic",        label: "Running on high traffic page(s)?",                    short: "Traffic", max: 1, type: "bool"  },
  { key: "userTesting",        label: "Issue found via user testing?",                       short: "UX Test", max: 1, type: "bool"  },
  { key: "qualFeedback",       label: "Issue found via qual. feedback (surveys/polls/etc.)?",short: "Qual",    max: 1, type: "bool"  },
  { key: "analytics",          label: "Addressing insights found via digital analytics?",    short: "Data",    max: 1, type: "bool"  },
  { key: "heatmaps",           label: "Supported by mouse tracking / heatmaps / eye track?", short: "Heat",   max: 1, type: "bool"  },
  { key: "easeImpl",           label: "Ease of implementation?",                             short: "Ease",    max: 3, type: "ease"  },
] as const;

export type CriterionKey = (typeof CRITERIA)[number]["key"];

// Default blank row
export function blankRow(): PxlRow {
  return {
    aboveFold: false,
    noticed5s: false,
    addRemoveElement: false,
    increaseMotivation: false,
    highTraffic: false,
    userTesting: false,
    qualFeedback: false,
    analytics: false,
    heatmaps: false,
    easeImpl: 0,
    leadershipPriority: false,
  };
}

export type PxlRow = {
  aboveFold: boolean;
  noticed5s: boolean;
  addRemoveElement: boolean;
  increaseMotivation: boolean;
  highTraffic: boolean;
  userTesting: boolean;
  qualFeedback: boolean;
  analytics: boolean;
  heatmaps: boolean;
  easeImpl: 0 | 1 | 2 | 3;
  leadershipPriority: boolean;
};

// Max possible = 1+2+2+1+1+1+1+1+1+3 = 14
export const MAX_SCORE = 14;

export function scoreOf(row: PxlRow): number {
  return (
    (row.aboveFold          ? 1 : 0) +
    (row.noticed5s          ? 2 : 0) +
    (row.addRemoveElement   ? 2 : 0) +
    (row.increaseMotivation ? 1 : 0) +
    (row.highTraffic        ? 1 : 0) +
    (row.userTesting        ? 1 : 0) +
    (row.qualFeedback       ? 1 : 0) +
    (row.analytics          ? 1 : 0) +
    (row.heatmaps           ? 1 : 0) +
    row.easeImpl
  );
}
