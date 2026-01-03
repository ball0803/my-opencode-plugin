const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function discoverProject(rootDir, options = {}) {
  const {
    maxDepth = 5,
    verbose = false,
    workers = 4
  } = options;

  const result = {
    rootDir,
    directories: [],
    files: [],
    existingAgentsFiles: [],
    stats: {
      totalDirectories: 0,
      totalFiles: 0,
      depth: 0,
      maxFilesInDir: 0
    }
  };

  // Find all directories up to maxDepth
  const directories = findDirectories(rootDir, maxDepth);
  result.directories = directories;
  result.stats.totalDirectories = directories.length;

  // Find all files
  const files = findFiles(rootDir, maxDepth);
  result.files = files;
  result.stats.totalFiles = files.length;

  // Find existing AGENTS.md files
  const agentsFiles = findAgentsFiles(rootDir, maxDepth);
  result.existingAgentsFiles = agentsFiles;

  // Calculate stats
  result.stats.depth = maxDepth;
  result.stats.maxFilesInDir = calculateMaxFilesInDir(directories, files);

  if (verbose) {
    console.log(`Discovered ${result.stats.totalDirectories} directories`);
    console.log(`Discovered ${result.stats.totalFiles} files`);
    console.log(`Found ${result.existingAgentsFiles.length} existing AGENTS.md files`);
  }

  return result;
}

function findDirectories(rootDir, maxDepth) {
  const directories = [];
  
  function traverse(dir, depth = 0) {
    if (depth > maxDepth) return;
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const fullPath = path.join(dir, entry.name);
        directories.push({
          path: fullPath,
          name: entry.name,
          depth,
          relativePath: path.relative(rootDir, fullPath)
        });
        traverse(fullPath, depth + 1);
      }
    }
  }
  
  traverse(rootDir);
  return directories;
}

function findFiles(rootDir, maxDepth) {
  const files = [];
  
  function traverse(dir, depth = 0) {
    if (depth > maxDepth) return;
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.isFile()) {
        const fullPath = path.join(dir, entry.name);
        files.push({
          path: fullPath,
          name: entry.name,
          ext: path.extname(entry.name),
          depth,
          relativePath: path.relative(rootDir, fullPath)
        });
      } else if (entry.isDirectory()) {
        traverse(path.join(dir, entry.name), depth + 1);
      }
    }
  }
  
  traverse(rootDir);
  return files;
}

function findAgentsFiles(rootDir, maxDepth) {
  const agentsFiles = [];
  
  function traverse(dir, depth = 0) {
    if (depth > maxDepth) return;
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.isFile() && entry.name === 'AGENTS.md') {
        const fullPath = path.join(dir, entry.name);
        agentsFiles.push({
          path: fullPath,
          relativePath: path.relative(rootDir, fullPath),
          content: fs.readFileSync(fullPath, 'utf8')
        });
      } else if (entry.isDirectory()) {
        traverse(path.join(dir, entry.name), depth + 1);
      }
    }
  }
  
  traverse(rootDir);
  return agentsFiles;
}

function calculateMaxFilesInDir(directories, files) {
  const dirFileCount = {};
  
  for (const file of files) {
    const dir = path.dirname(file.path);
    dirFileCount[dir] = (dirFileCount[dir] || 0) + 1;
  }
  
  return Math.max(...Object.values(dirFileCount), 0);
}

module.exports = { discoverProject };
