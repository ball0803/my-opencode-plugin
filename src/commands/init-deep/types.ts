import type { BackgroundTask } from "../../features/background-agent/types.ts";

export interface DiscoveryResult {
  structure: string[];
  existingAgents: ExistingAgent[];
  backgroundResults: BackgroundTask[];
  scaleMetrics: ScaleMetrics;
  createNew: boolean;
  maxDepth: number;
  projectName: string;
}

export interface ExistingAgent {
  path: string;
  content: string;
  hasOverview: boolean;
  hasConventions: boolean;
  hasAntiPatterns: boolean;
}

export interface ScaleMetrics {
  totalFiles: number;
  totalLines: number;
  largeFiles: number;
  maxDepth: number;
}

export interface ScoredDirectory {
  path: string;
  score: number;
  fileCount: number;
  subdirCount: number;
  codeRatio: number;
  hasIndex: boolean;
}

export interface GenerationLocation {
  path: string;
  type: "root" | "subdirectory";
  score?: number;
  reason?: string;
}

export interface GenerationResult {
  success: boolean;
  duration: number;
  error?: string;
  highScoreResults: Phase3Result[];
  mediumScoreResults: Phase3Result[];
  lowScoreResults: Phase3Result[];
  totalFilesGenerated: number;
}

export interface Phase3Result {
  path: string;
  success: boolean;
  fileSize?: number;
  error?: string;
}

export interface ScoringResult {
  directories: ScoredDirectory[];
  totalScore: number;
  averageScore: number;
  highScoreCount: number;
  mediumScoreCount: number;
  lowScoreCount: number;
}

export interface ReviewResult {
  success: boolean;
  duration: number;
  error?: string;
  results: Phase4Result[];
  totalFilesReviewed: number;
  validFiles: number;
  invalidFiles: number;
}

export interface Phase4Result {
  path: string;
  valid: boolean;
  issues: string[];
  fileSize: number;
}

export interface ValidationResult {
  filePath: string;
  lines: number;
  warnings: string[];
}

export interface ReviewResult {
  filesCreated: number;
  filesValidated: number;
  validationResults: ValidationResult[];
}

export interface FinalReport {
  mode: "update" | "create-new";
  dirsAnalyzed: number;
  agentsCreated: number;
  agentsUpdated: number;
  hierarchy: string[];
  warnings: string[];
}