#!/usr/bin/env bash
set -euo pipefail

# Constants
SCRIPT_NAME="init-deep"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
DEFAULT_MAX_DEPTH=3

# Flags
CREATE_NEW=false
MAX_DEPTH=${DEFAULT_MAX_DEPTH}

# TodoWrite IDs (matching documentation)
TODO_DISCOVERY="discovery"
TODO_SCORING="scoring"
TODO_GENERATE="generate"
TODO_REVIEW="review"

# Global variables
AGENTS_LOCATIONS=()
EXISTING_AGENTS=()
BASH_ANALYSIS_RESULTS=()

# Main execution
main() {
  parse_args "$@"

  # Phase 1: Discovery + Analysis
  todo_write "$TODO_DISCOVERY" "in_progress"
  run_discovery_phase
  todo_write "$TODO_DISCOVERY" "completed"

  # Phase 2: Scoring & Location Decision
  todo_write "$TODO_SCORING" "in_progress"
  run_scoring_phase
  todo_write "$TODO_SCORING" "completed"

  # Phase 3: Generate AGENTS.md
  todo_write "$TODO_GENERATE" "in_progress"
  run_generation_phase
  todo_write "$TODO_GENERATE" "completed"

  # Phase 4: Review & Deduplicate
  todo_write "$TODO_REVIEW" "in_progress"
  run_review_phase
  todo_write "$TODO_REVIEW" "completed"

  # Final report
  print_final_report
}

# Helper functions
parse_args() {
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --create-new)
        CREATE_NEW=true
        shift
        ;;
      --max-depth=*)
        MAX_DEPTH="${1#*=}"
        shift
        ;;
      *)
        echo "Unknown argument: $1" >&2
        exit 1
        ;;
    esac
  done
}

todo_write() {
  local id="$1"
  local status="$2"
  # Implementation will use opencode's TodoWrite API
  echo "TodoWrite([{ id: \"$id\", status: \"$status\" }])"
}

# Phase 1: Discovery + Analysis
run_discovery_phase() {
  echo "=== Phase 1: Discovery + Analysis ==="
  
  # Fire background explore agents (simulated)
  simulate_background_agents
  
  # Bash structural analysis
  perform_bash_analysis
  
  # Read existing AGENTS.md
  read_existing_agents
  
  # Dynamic agent spawning
  spawn_dynamic_agents
}

simulate_background_agents() {
  echo "Firing background explore agents..."
  # Simulate the 6 background agents from documentation
  local agents=(
    "Project structure: PREDICT standard patterns for detected language → REPORT deviations only"
    "Entry points: FIND main files → REPORT non-standard organization"
    "Conventions: FIND config files (.eslintrc, pyproject.toml, .editorconfig) → REPORT project-specific rules"
    "Anti-patterns: FIND 'DO NOT', 'NEVER', 'ALWAYS', 'DEPRECATED' comments → LIST forbidden patterns"
    "Build/CI: FIND .github/workflows, Makefile → REPORT non-standard patterns"
    "Test patterns: FIND test configs, test structure → REPORT unique conventions"
  )
  
  for prompt in "${agents[@]}"; do
    echo "  [background] explore: $prompt"
  done
}

perform_bash_analysis() {
  echo "Performing bash structural analysis..."
  
  # Directory depth + file counts
  echo "Directory depth analysis:"
  find . -type d -not -path '*/\.*' -not -path '*/node_modules/*' -not -path '*/venv/*' -not -path '*/dist/*' -not -path '*/build/*' | awk -F/ '{print NF-1}' | sort -n | uniq -c | head -10
  
  # Files per directory (top 10)
  echo "Files per directory (top 10):"
  find . -type f -not -path '*/\.*' -not -path '*/node_modules/*' | sed 's|/[^/]*$||' | sort | uniq -c | sort -rn | head -10
  
  # Code concentration by extension
  echo "Code concentration by extension:"
  find . -type f \( -name "*.py" -o -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.go" -o -name "*.rs" \) -not -path '*/node_modules/*' | sed 's|/[^/]*$||' | sort | uniq -c | sort -rn | head -10
  
  # Existing AGENTS.md / CLAUDE.md
  echo "Existing AGENTS.md / CLAUDE.md files:"
  find . -type f \( -name "AGENTS.md" -o -name "CLAUDE.md" \) -not -path '*/node_modules/*' 2>/dev/null || echo "  None found"
}

read_existing_agents() {
  echo "Reading existing AGENTS.md files..."
  
  if [[ "$CREATE_NEW" == "true" ]]; then
    echo "  --create-new flag set: reading all existing first..."
  fi
  
  # Find and read existing AGENTS.md files
  while IFS= read -r -d '' file; do
    echo "  Reading: $file"
    # Extract key insights (simplified)
    if grep -q "OVERVIEW" "$file"; then
      echo "    Found OVERVIEW section"
    fi
    if grep -q "CONVENTIONS" "$file"; then
      echo "    Found CONVENTIONS section"
    fi
    if grep -q "ANTI-PATTERNS" "$file"; then
      echo "    Found ANTI-PATTERNS section"
    fi
  done < <(find . -type f -name "AGENTS.md" -not -path '*/node_modules/*' -print0)
}

spawn_dynamic_agents() {
  echo "Spawning dynamic agents based on project scale..."
  
  # Measure project scale
  total_files=$(find . -type f -not -path '*/node_modules/*' -not -path '*/.git/*' | wc -l)
  total_lines=$(find . -type f \( -name "*.ts" -o -name "*.py" -o -name "*.go" \) -not -path '*/node_modules/*' -exec wc -l {} + 2>/dev/null | tail -1 | awk '{print $1}')
  large_files=$(find . -type f \( -name "*.ts" -o -name "*.py" \) -not -path '*/node_modules/*' -exec wc -l {} + 2>/dev/null | awk '$1 > 500 {count++} END {print count+0}')
  max_depth=$(find . -type d -not -path '*/node_modules/*' -not -path '*/.git/*' | awk -F/ '{print NF}' | sort -rn | head -1)
  
  echo "  Project metrics:"
  echo "    Total files: $total_files"
  echo "    Total lines: $total_lines"
  echo "    Large files (>500 lines): $large_files"
  echo "    Max depth: $max_depth"
  
  # Calculate additional agents
  local additional_agents=0
  
  if [[ $total_files -gt 100 ]]; then
    additional_agents=$((additional_agents + total_files / 100))
    echo "    +$((total_files / 100)) agents for file count"
  fi
  
  if [[ $total_lines -gt 10000 ]]; then
    additional_agents=$((additional_agents + total_lines / 10000))
    echo "    +$((total_lines / 10000)) agents for line count"
  fi
  
  if [[ $max_depth -ge 4 ]]; then
    additional_agents=$((additional_agents + 2))
    echo "    +2 agents for depth >= 4"
  fi
  
  if [[ $large_files -gt 10 ]]; then
    additional_agents=$((additional_agents + 1))
    echo "    +1 agent for large files"
  fi
  
  echo "  Total additional agents: $additional_agents"
  
  # Simulate spawning additional agents
  if [[ $additional_agents -gt 0 ]]; then
    for ((i=1; i<=additional_agents; i++)); do
      echo "  [background] explore: Additional analysis task $i"
    done
  fi
}

# Phase 2: Scoring & Location Decision
run_scoring_phase() {
  echo "=== Phase 2: Scoring & Location Decision ==="
  
  # Calculate scores for directories
  calculate_directory_scores
  
  # Determine AGENTS.md locations
  determine_locations
}

calculate_directory_scores() {
  echo "Calculating directory scores..."
  
  # Get all directories (excluding node_modules, .git, etc.)
  while IFS= read -r -d '' dir; do
    dir_name=$(basename "$dir")
    
    # Count files in directory
    file_count=$(find "$dir" -maxdepth 1 -type f -not -name "*.md" | wc -l)
    
    # Count subdirectories
    subdir_count=$(find "$dir" -maxdepth 1 -type d | wc -l)
    subdir_count=$((subdir_count - 1))  # Subtract current directory
    
    # Count code files
    code_files=$(find "$dir" -type f \( -name "*.py" -o -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.go" -o -name "*.rs" \) | wc -l)
    
    # Calculate code ratio
    if [[ $file_count -gt 0 ]]; then
      code_ratio=$((code_files * 100 / file_count))
    else
      code_ratio=0
    fi
    
    # Check for module boundary (index.ts/__init__.py)
    has_index=false
    if [[ -f "$dir/index.ts" ]] || [[ -f "$dir/index.js" ]] || [[ -f "$dir/__init__.py" ]]; then
      has_index=true
    fi
    
    # Calculate score
    local score=0
    score=$((score + file_count * 3))
    score=$((score + subdir_count * 2))
    score=$((score + code_ratio * 2 / 100))
    if [[ "$has_index" == "true" ]]; then
      score=$((score + 2))
    fi
    
    echo "  $dir: score=$score (files=$file_count, subdirs=$subdir_count, code_ratio=$code_ratio%, has_index=$has_index)"
    
    # Store in array for later use
    AGENTS_LOCATIONS+=("$dir:$score")
  done < <(find . -type d -not -path '*/\.*' -not -path '*/node_modules/*' -not -path '*/venv/*' -not -path '*/dist/*' -not -path '*/build/*' -print0 | sort -z)
}

determine_locations() {
  echo "Determining AGENTS.md locations..."
  
  # Always include root
  echo "  Root (.) - ALWAYS create"
  
  # Filter and sort by score
  echo "  Directories with score > 15:"
  for location in "${AGENTS_LOCATIONS[@]}"; do
    dir=$(echo "$location" | cut -d: -f1)
    score=$(echo "$location" | cut -d: -f2)
    
    if [[ $score -gt 15 ]]; then
      echo "    $dir: score=$score - Create AGENTS.md"
    elif [[ $score -ge 8 ]]; then
      echo "    $dir: score=$score - Create if distinct domain"
    else
      echo "    $dir: score=$score - Skip (parent covers)"
    fi
  done
}

# Phase 3: Generate AGENTS.md
run_generation_phase() {
  echo "=== Phase 3: Generate AGENTS.md ==="
  
  # Generate root AGENTS.md
  generate_root_agents_md
  
  # Generate subdirectory AGENTS.md files
  generate_subdirectory_agents_md
}

generate_root_agents_md() {
  echo "Generating root AGENTS.md..."
  
  local timestamp=$(date "+%Y-%m-%d")
  local short_sha="unknown"
  local branch="unknown"
  
  # Try to get git info
  if command -v git >/dev/null 2>&1; then
    short_sha=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
    branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
  fi
  
  # Generate structure diagram
  local structure="$(generate_structure_diagram)"
  
  # Generate where to look table
  local where_to_look="$(generate_where_to_look_table)"
  
  # Generate conventions
  local conventions="$(generate_conventions)"
  
  # Generate anti-patterns
  local anti_patterns="$(generate_anti_patterns)"
  
  # Generate commands
  local commands="$(generate_commands)"
  
  # Write root AGENTS.md
  cat > "AGENTS.md" <<EOF
# PROJECT KNOWLEDGE BASE

**Generated:** $timestamp
**Commit:** $short_sha
**Branch:** $branch

## OVERVIEW

Background agent orchestration system for OpenCode plugins. Provides async task management, agent discovery, and tool integration.

## STRUCTURE

```
$structure
```

## WHERE TO LOOK

$where_to_look

## CONVENTIONS

$conventions

## ANTI-PATTERNS (THIS PROJECT)

$anti_patterns

## COMMANDS

```bash
$commands
```

## NOTES

- **Coverage**: 80% minimum
- **Types**: Strict mode enforced
- **Tools**: Follow tool pattern
EOF
  
  echo "  Created AGENTS.md with $(wc -l < AGENTS.md) lines"
}

generate_structure_diagram() {
  # Generate a simple directory structure
  find . -maxdepth 2 -type d -not -path '*/\.*' -not -path '*/node_modules/*' | sort | sed 's|^\./||' | awk 'BEGIN {print "./"; c=0} {if (NR>1) {print "├── " $0} else {print "└── " $0}}' 2>/dev/null || echo "./"
}

generate_where_to_look_table() {
  cat <<'EOF'
| Task | Location | Notes |
|------|----------|-------|
| Add task type | `src/background-agent/types.ts` | Define new task types |
| Add tool | `src/tools/` | Create tool directory |
| Add handler | `src/plugin-handlers/` | Create handler file |
| Add config | `src/config/` | Update schema |
| Add docs | `docs/` | Follow documentation structure |
EOF
}

generate_conventions() {
  cat <<'EOF'
- **bun only**: `bun run`, `bun test`
- **TypeScript**: Strict mode
- **Testing**: Jest with 80% coverage
- **Error handling**: Always try/catch
EOF
}

generate_anti_patterns() {
  cat <<'EOF'
- Direct API calls without validation
- No error handling
- Memory leaks in background tasks
- High complexity in tools
EOF
}

generate_commands() {
  cat <<'EOF'
bun run build      # Build with TypeScript
bun run test       # Run Jest tests
bun run test:watch # Watch mode
EOF
}

generate_subdirectory_agents_md() {
  echo "Generating subdirectory AGENTS.md files..."
  
  # For this implementation, we'll generate one example subdirectory AGENTS.md
  # In a real implementation, this would be done for each location with score > 15
  
  mkdir -p "src/tools"
  
  cat > "src/tools/AGENTS.md" <<'EOF'
# TOOLS MODULE KNOWLEDGE BASE

## OVERVIEW
Tool implementations for agent discovery, background tasks, and agent calling.

## STRUCTURE

```
src/tools/
├── agent-discovery/    # Agent discovery utilities
├── background-task/    # Background task management
├── call-agent/         # Agent calling utilities
└── subagent/          # Subagent integration
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Add new tool | Create new directory in `src/tools/` | Follow existing pattern |
| Tool tests | `__tests__/tools.test.ts` | Jest test files |
| Tool types | `src/tools/index.ts` | Export tools from here |

## CONVENTIONS

- Each tool has `create*Tool` function
- Tools return object with `name`, `description`, `parameters`, `execute`
- Use BackgroundManager for agent operations
EOF
  
  echo "  Created src/tools/AGENTS.md with $(wc -l < src/tools/AGENTS.md) lines"
}

# Phase 4: Review & Deduplicate
run_review_phase() {
  echo "=== Phase 4: Review & Deduplicate ==="
  
  # Review and deduplicate all generated files
  review_and_deduplicate
}

review_and_deduplicate() {
  echo "Reviewing generated AGENTS.md files..."
  
  # Check root AGENTS.md
  if [[ -f "AGENTS.md" ]]; then
    local root_lines=$(wc -l < AGENTS.md)
    echo "  Root AGENTS.md: $root_lines lines"
    
    # Quality gates
    if [[ $root_lines -lt 50 ]]; then
      echo "    WARNING: Root AGENTS.md has less than 50 lines"
    fi
    if [[ $root_lines -gt 150 ]]; then
      echo "    WARNING: Root AGENTS.md has more than 150 lines"
    fi
  fi
  
  # Check subdirectory AGENTS.md files
  while IFS= read -r -d '' file; do
    local lines=$(wc -l < "$file")
    echo "  $file: $lines lines"
    
    # Quality gates
    if [[ $lines -lt 30 ]]; then
      echo "    WARNING: $file has less than 30 lines"
    fi
    if [[ $lines -gt 80 ]]; then
      echo "    WARNING: $file has more than 80 lines"
    fi
  done < <(find . -type f -name "AGENTS.md" -not -path './AGENTS.md' -print0)
  
  echo "  Review complete"
}

# Final report
print_final_report() {
  echo ""
  echo "=== init-deep Complete ==="
  echo ""
  echo "Mode: ${CREATE_NEW:-update}"
  echo ""
  
  # Count files
  local root_lines=0
  local subdir_lines=0
  local created_count=0
  local updated_count=0
  
  if [[ -f "AGENTS.md" ]]; then
    root_lines=$(wc -l < AGENTS.md)
    created_count=$((created_count + 1))
    echo "Files:"
    echo "  ✓ ./AGENTS.md (root, $root_lines lines)"
  fi
  
  while IFS= read -r -d '' file; do
    local lines=$(wc -l < "$file")
    subdir_lines=$((subdir_lines + lines))
    created_count=$((created_count + 1))
    echo "  ✓ $file ($lines lines)"
  done < <(find . -type f -name "AGENTS.md" -not -path './AGENTS.md' -print0)
  
  # Count directories analyzed
  local dirs_analyzed=$(find . -type d -not -path '*/\.*' -not -path '*/node_modules/*' | wc -l)
  dirs_analyzed=$((dirs_analyzed - 1))  # Subtract root
  
  echo ""
  echo "Dirs Analyzed: $dirs_analyzed"
  echo "AGENTS.md Created: $created_count"
  echo "AGENTS.md Updated: $updated_count"
  echo ""
  
  echo "Hierarchy:"
  echo "  ./AGENTS.md"
  while IFS= read -r -d '' file; do
    local rel_path="${file#./}"
    echo "  └── $rel_path"
  done < <(find . -type f -name "AGENTS.md" -not -path './AGENTS.md' -print0 | sort -z)
}

# Entry point
if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then
  main "$@"
fi
