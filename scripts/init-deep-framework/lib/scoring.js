function scoreDirectories(discoveryResult, scoringConfig = {}) {
  const {
    depthWeight = 0.3,
    fileCountWeight = 0.4,
    complexityWeight = 0.3,
    minScore = 0.5
  } = scoringConfig;

  const scoredDirectories = [];
  const fileCountByDir = calculateFileCountByDirectory(discoveryResult.files);
  const existingAgentsPaths = discoveryResult.existingAgentsFiles.map(f => f.path);

  for (const dir of discoveryResult.directories) {
    const fileCount = fileCountByDir[dir.path] || 0;
    const complexityScore = calculateComplexityScore(dir, discoveryResult.files);
    
    // Normalize scores
    const normalizedDepth = dir.depth / discoveryResult.stats.depth;
    const normalizedFileCount = fileCount / discoveryResult.stats.maxFilesInDir;
    
    // Calculate weighted score
    const depthScore = normalizedDepth * depthWeight;
    const fileCountScore = normalizedFileCount * fileCountWeight;
    const complexityScoreWeighted = complexityScore * complexityWeight;
    
    const totalScore = depthScore + fileCountScore + complexityScoreWeighted;
    
    // Only include directories that should have AGENTS.md
    if (totalScore >= minScore && !existingAgentsPaths.includes(dir.path)) {
      scoredDirectories.push({
        ...dir,
        score: totalScore,
        fileCount,
        complexityScore,
        shouldGenerate: true
      });
    }
  }

  // Sort by score (highest first)
  scoredDirectories.sort((a, b) => b.score - a.score);

  return {
    ...discoveryResult,
    scoredDirectories,
    scoringConfig
  };
}

function calculateFileCountByDirectory(files) {
  const fileCount = {};
  
  for (const file of files) {
    const dir = path.dirname(file.path);
    fileCount[dir] = (fileCount[dir] || 0) + 1;
  }
  
  return fileCount;
}

function calculateComplexityScore(directory, allFiles) {
  const dirFiles = allFiles.filter(file => 
    path.dirname(file.path) === directory.path
  );
  
  // Count different file types
  const extensions = new Set(dirFiles.map(f => f.ext));
  const extensionCount = extensions.size;
  
  // Count test files
  const testFiles = dirFiles.filter(f => 
    f.name.includes('.test.') || f.name.includes('.spec.')
  );
  
  // Calculate complexity score (0-1)
  const complexity = Math.min(
    0.3 + (extensionCount * 0.2) + (testFiles.length * 0.1),
    1.0
  );
  
  return complexity;
}

module.exports = { scoreDirectories };
