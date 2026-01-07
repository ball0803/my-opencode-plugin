import type { DiscoveryResult, GenerationLocation, ScoredDirectory, ScoringResult } from "./types.ts";
import { SCORE_THRESHOLDS, SCORING_WEIGHTS } from "./constants.ts";

export async function runScoringPhase(
  discoveryResult: DiscoveryResult
): Promise<ScoringResult> {
  const { structure, backgroundResults, scaleMetrics } = discoveryResult;

  // Calculate directory scores
  const scoredDirs: ScoredDirectory[] = [];
  for (const dir of structure) {
    const score = calculateDirectoryScore(dir, structure, backgroundResults);
    
    // Get directory stats
    const fileCount = countFilesInDir(dir, structure);
    const subdirCount = countSubdirsInDir(dir, structure);
    const codeRatio = calculateCodeRatio(dir, structure);
    const hasIndex = checkModuleBoundary(dir);

    scoredDirs.push({
      path: dir,
      score,
      fileCount,
      subdirCount,
      codeRatio,
      hasIndex
    });
  }

  // Determine locations
  const locations: GenerationLocation[] = [];
  locations.push({ path: ".", type: "root" });

  for (const dir of scoredDirs) {
    if (dir.score > SCORE_THRESHOLDS.HIGH) {
      locations.push({
        path: dir.path,
        type: "subdirectory",
        score: dir.score,
        reason: "high complexity"
      });
    } else if (dir.score >= SCORE_THRESHOLDS.MEDIUM) {
      locations.push({
        path: dir.path,
        type: "subdirectory",
        score: dir.score,
        reason: "distinct domain"
      });
    }
  }

  // Calculate statistics
  const totalScore = scoredDirs.reduce((sum, dir) => sum + dir.score, 0);
  const averageScore = scoredDirs.length > 0 ? totalScore / scoredDirs.length : 0;
  const highScoreCount = scoredDirs.filter(d => d.score >= 80).length;
  const mediumScoreCount = scoredDirs.filter(d => d.score >= 50 && d.score < 80).length;
  const lowScoreCount = scoredDirs.filter(d => d.score < 50).length;

  return {
    directories: scoredDirs,
    totalScore,
    averageScore,
    highScoreCount,
    mediumScoreCount,
    lowScoreCount
  };
}

function calculateDirectoryScore(
  dir: string,
  allDirs: string[],
  backgroundResults: any[]
): number {
  const fileCount = countFilesInDir(dir, allDirs);
  const subdirCount = countSubdirsInDir(dir, allDirs);
  const codeRatio = calculateCodeRatio(dir, allDirs);
  const hasIndex = checkModuleBoundary(dir);

  let score = 0;

  // File count (3x)
  score += fileCount * SCORING_WEIGHTS.FILE_COUNT;

  // Subdir count (2x)
  score += subdirCount * SCORING_WEIGHTS.SUBDIR_COUNT;

  // Code ratio (2x)
  score += Math.round(codeRatio * SCORING_WEIGHTS.CODE_RATIO);

  // Module boundary (2x)
  if (hasIndex) {
    score += SCORING_WEIGHTS.MODULE_BOUNDARY;
  }

  // Background analysis findings (1x)
  const backgroundBonus = getBackgroundAnalysisBonus(dir, backgroundResults);
  score += backgroundBonus * SCORING_WEIGHTS.UNIQUE_PATTERNS;

  return score;
}

function countFilesInDir(dir: string, allDirs: string[]): number {
  return allDirs.filter(d => d.startsWith(dir + "/") || d === dir).length;
}

function countSubdirsInDir(dir: string, allDirs: string[]): number {
  const subdirs = new Set<string>();
  for (const d of allDirs) {
    if (d.startsWith(dir + "/")) {
      const parts = d.split("/");
      if (parts.length > 2) {
        const subdir = parts.slice(0, parts.length - 1).join("/");
        subdirs.add(subdir);
      }
    }
  }
  return subdirs.size;
}

function calculateCodeRatio(dir: string, allDirs: string[]): number {
  const codeFiles = allDirs.filter(d => {
    const ext = d.split(".").pop()?.toLowerCase();
    return ["ts", "tsx", "js", "py", "go", "rs"].includes(ext || "");
  });
  
  const totalFiles = allDirs.length;
  return totalFiles > 0 ? (codeFiles.length / totalFiles) * 100 : 0;
}

function checkModuleBoundary(dir: string): boolean {
  // Check for index.ts, index.js, __init__.py
  const indexFiles = ["index.ts", "index.js", "__init__.py"];
  for (const file of indexFiles) {
    if (dir === ".") {
      // Root directory check
      return false;
    }
    // In a real implementation, we would check if these files exist
    // For now, return false as we don't have file system access
  }
  return false;
}

function getBackgroundAnalysisBonus(dir: string, results: any[]): number {
  // Analyze background results for unique patterns
  // This would check if the directory has unique conventions, configs, etc.
  return 0;
}