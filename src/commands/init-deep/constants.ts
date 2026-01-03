export const TODO_WRITE_IDS = {
  PHASE_1: "phase-1-discovery",
  PHASE_2: "phase-2-scoring",
  PHASE_3: "phase-3-generation",
  PHASE_4: "phase-4-review"
};

export const SCORING_WEIGHTS = {
  FILE_COUNT: 3,
  SUBDIR_COUNT: 2,
  CODE_RATIO: 2,
  MODULE_BOUNDARY: 2,
  UNIQUE_PATTERNS: 1
};

export const SCORE_THRESHOLDS = {
  ROOT: Infinity, // Always create root
  HIGH: 15, // Create AGENTS.md
  MEDIUM: 8, // Create if distinct domain
  LOW: 0 // Skip
};

export const SIZE_LIMITS = {
  ROOT_MIN: 50,
  ROOT_MAX: 150,
  SUBDIR_MIN: 30,
  SUBDIR_MAX: 80
};

export const DEFAULT_MAX_DEPTH = 3;

export const EXPLORE_PROMPTS = [
  "Project structure: PREDICT standard patterns for detected language → REPORT deviations only",
  "Entry points: FIND main files → REPORT non-standard organization",
  "Conventions: FIND config files (.eslintrc, pyproject.toml, .editorconfig) → REPORT project-specific rules",
  "Anti-patterns: FIND 'DO NOT', 'NEVER', 'ALWAYS', 'DEPRECATED' comments → LIST forbidden patterns",
  "Build/CI: FIND .github/workflows, Makefile → REPORT non-standard patterns",
  "Test patterns: FIND test configs, test structure → REPORT unique conventions"
];