#!/usr/bin/env node

/**
 * Test script to validate the /init-deep command structure
 */

const fs = require('fs');
const path = require('path');

console.log('=== Testing /init-deep Command Structure ===\n');

// Test 1: File exists
console.log('Test 1: Command file exists');
const commandPath = '.opencode/command/init-deep.md';
if (fs.existsSync(commandPath)) {
  console.log('✓ PASS: File exists at', commandPath);
} else {
  console.log('✗ FAIL: File not found');
  process.exit(1);
}

// Test 2: File is readable
console.log('\nTest 2: File is readable');
try {
  const content = fs.readFileSync(commandPath, 'utf-8');
  console.log('✓ PASS: File is readable');
  console.log('  Size:', content.length, 'bytes');
} catch (e) {
  console.log('✗ FAIL: Cannot read file');
  process.exit(1);
}

// Test 3: Has proper frontmatter
console.log('\nTest 3: Has proper YAML frontmatter');
const content = fs.readFileSync(commandPath, 'utf-8');
const frontmatterMatch = content.match(/^---\s*$(.*?)^---\s*$(.*)/ms);
if (!frontmatterMatch) {
  console.log('✗ FAIL: No frontmatter found');
  process.exit(1);
}

console.log('✓ PASS: Frontmatter found');

const frontmatterText = frontmatterMatch[1];
const lines = frontmatterText.split('\n');
const data = {};
lines.forEach(line => {
  const match = line.match(/^([^:]+):\s*(.*)$/);
  if (match) {
    data[match[1].trim()] = match[2].trim();
  }
});

console.log('  Frontmatter fields:');
console.log('    - description:', data.description ? '✓' : '✗');
console.log('    - argument-hint:', data['argument-hint'] ? '✓' : '✗');

if (!data.description) {
  console.log('✗ FAIL: Missing description');
  process.exit(1);
}

// Test 4: Has proper structure
console.log('\nTest 4: Command has proper structure');
const body = frontmatterMatch[2];
const requiredSections = [
  '## Usage',
  '## Workflow',
  '## Phase 1',
  '## Phase 2',
  '## Phase 3',
  '## Phase 4',
  '## Final Report',
  '## Anti-Patterns'
];

let allSectionsPresent = true;
requiredSections.forEach(section => {
  const hasSection = body.includes(section);
  console.log(`  - ${section}: ${hasSection ? '✓' : '✗'}`);
  if (!hasSection) allSectionsPresent = false;
});

if (!allSectionsPresent) {
  console.log('✗ FAIL: Missing required sections');
  process.exit(1);
}

// Test 5: Uses correct tools
console.log('\nTest 5: Uses available tools');
const toolReferences = [
  { name: 'background_task', check: (b) => b.includes('background_task') },
  { name: 'background_output', check: (b) => b.includes('background_output') },
  { name: 'call_omo_agent', check: (b) => b.includes('call_omo_agent') || b.includes('background_task(agent="explore"') },
  { name: 'interactive_bash', check: (b) => b.includes('interactive_bash') || b.includes('```bash') }
];

let allToolsPresent = true;
toolReferences.forEach(tool => {
  const hasTool = tool.check(body);
  console.log(`  - ${tool.name}: ${hasTool ? '✓' : '✗'}`);
  if (!hasTool) allToolsPresent = false;
});

if (!allToolsPresent) {
  console.log('✗ FAIL: Missing required tool references');
  process.exit(1);
}

// Test 6: No LSP-specific features
console.log('\nTest 6: No LSP-specific features (adapted for my-opencode-plugin)');
const lspFeatures = [
  'lsp_document_symbols',
  'lsp_workspace_symbols',
  'lsp_find_references',
  'lsp_servers'
];

let noLSPFeatures = true;
lspFeatures.forEach(feature => {
  const hasFeature = body.includes(feature);
  console.log(`  - ${feature}: ${hasFeature ? '✗ (should not be present)' : '✓'}`);
  if (hasFeature) noLSPFeatures = false;
});

if (!noLSPFeatures) {
  console.log('✗ FAIL: Contains LSP-specific features');
  process.exit(1);
}

// Test 7: TodoWrite setup
console.log('\nTest 7: TodoWrite setup for tracking phases');
const hasTodoWrite = body.includes('TodoWrite(') && body.includes('discovery') && 
                      body.includes('scoring') && body.includes('generate') && 
                      body.includes('review');
console.log(`  - TodoWrite setup: ${hasTodoWrite ? '✓' : '✗'}`);

if (!hasTodoWrite) {
  console.log('✗ FAIL: Missing TodoWrite setup');
  process.exit(1);
}

console.log('\n=== All Tests Passed! ===');
console.log('\nCommand Summary:');
console.log('  Name: /init-deep');
console.log('  Description:', data.description);
console.log('  Argument Hint:', data['argument-hint']);
console.log('  Scope: opencode-project');
console.log('\nThe command is ready to be discovered and executed by OpenCode!');
