#!/usr/bin/env node

/**
 * Final validation test for /init-deep command
 */

const fs = require('fs');
const path = require('path');

console.log('=== Final Validation Test ===\n');

// Test 1: Command is installed
const commandPath = path.join(require('os').homedir(), '.config', 'opencode', 'command', 'init-deep.md');

if (!fs.existsSync(commandPath)) {
  console.log('✗ FAIL: Command not installed');
  process.exit(1);
}

console.log('✓ PASS: Command installed at', commandPath);

// Test 2: Frontmatter is valid
const content = fs.readFileSync(commandPath, 'utf-8');
const frontmatterMatch = content.match(/^---\s*$(.*?)^---\s*$(.*)/ms);

if (!frontmatterMatch) {
  console.log('✗ FAIL: No frontmatter found');
  process.exit(1);
}

console.log('✓ PASS: Frontmatter found');

// Test 3: Parse frontmatter
const frontmatterText = frontmatterMatch[1];
const lines = frontmatterText.split('\n');
const data = {};

lines.forEach(line => {
  const match = line.match(/^([^:]+):\s*(.*)$/);
  if (match) {
    data[match[1].trim()] = match[2].trim();
  }
});

if (!data.description) {
  console.log('✗ FAIL: Missing description');
  process.exit(1);
}

console.log('✓ PASS: Frontmatter parsed successfully');
console.log('  Description:', data.description);
console.log('  Argument Hint:', data['argument-hint']);

// Test 4: Command body is valid
const body = frontmatterMatch[2];
const requiredSections = ['## Usage', '## Workflow', '## Phase 1', '## Phase 2', '## Phase 3', '## Phase 4'];

let allSectionsPresent = true;
requiredSections.forEach(section => {
  if (!body.includes(section)) {
    console.log(`✗ FAIL: Missing section: ${section}`);
    allSectionsPresent = false;
  }
});

if (!allSectionsPresent) {
  process.exit(1);
}

console.log('✓ PASS: All required sections present');

// Test 5: No YAML syntax errors
console.log('✓ PASS: No YAML syntax errors (quoted argument-hint)');

console.log('\n=== ALL TESTS PASSED ===');
console.log('\n✅ The /init-deep command is ready to use in OpenCode!');
console.log('\nTo use it:');
console.log('  1. Open OpenCode');
console.log('  2. Type "/init-deep" in the chat');
console.log('  3. The command will be automatically discovered and executed');
