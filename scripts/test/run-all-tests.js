#!/usr/bin/env node

/**
 * Test Runner Script
 * Executes all test scripts in the scripts/test directory
 */

const { execSync } = require('child_process');
const { readdirSync, statSync } = require('fs');
const path = require('path');

const TEST_DIR = path.join(__dirname, 'test');

function runTests() {
  console.log('\n=== Running All Tests ===\n');
  
  try {
    // Read all files in test directory
    const files = readdirSync(TEST_DIR);
    const testFiles = files.filter(file => 
      file.endsWith('.js') && 
      !file.includes('jest.config') &&
      !file.includes('run-all-tests')
    );
    
    if (testFiles.length === 0) {
      console.log('No test files found in scripts/test directory');
      return;
    }
    
    console.log(`Found ${testFiles.length} test file(s):`);
    testFiles.forEach(file => console.log(`  - ${file}`));
    console.log('');
    
    // Run each test file
    let passed = 0;
    let failed = 0;
    
    for (const file of testFiles) {
      const filePath = path.join(TEST_DIR, file);
      const testName = path.basename(file, '.js');
      
      console.log(`\n--- Running: ${testName} ---`);
      
      try {
        // Execute the test file
        execSync(`node ${filePath}`, { 
          cwd: TEST_DIR,
          stdio: 'inherit',
          encoding: 'utf-8'
        });
        console.log(`✅ ${testName} passed`);
        passed++;
      } catch (error) {
        console.log(`❌ ${testName} failed`);
        failed++;
      }
    }
    
    console.log('\n=== Test Summary ===');
    console.log(`Total: ${testFiles.length}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    
    if (failed === 0) {
      console.log('\n🎉 All tests passed!');
      process.exit(0);
    } else {
      console.log('\n⚠️  Some tests failed');
      process.exit(1);
    }
  } catch (error) {
    console.error('Error running tests:', error.message);
    process.exit(1);
  }
}

// Run tests if executed directly
if (require.main === module) {
  runTests();
}

module.exports = { runTests };
