# Scripts Directory

This directory contains various scripts organized by category:

## Directory Structure

```
scripts/
├── test/          # Test scripts
│   ├── run-all-tests.js  # Main test runner
│   ├── test_example_config.js
│   ├── test_agent_discovery.js
│   ├── test_mistral_task.js
│   ├── test_background_task.js
│   └── jest.config.js
├── verify/        # Verification scripts
│   └── verify_implementation.js
├── debug/         # Debug scripts
│   └── debug_merge.js
└── build/         # Build artifacts
    └── my-opencode-plugin-1.0.0.tgz
```

## Usage

### Running All Tests

```bash
node scripts/test/run-all-tests.js
```

This will execute all test scripts in the `test/` directory and provide a summary of results.

### Running Individual Tests

```bash
node scripts/test/test_example_config.js
node scripts/test/test_agent_discovery.js
node scripts/test/test_mistral_task.js
node scripts/test/test_background_task.js
```

### Running Verification Scripts

```bash
node scripts/verify/verify_implementation.js
```

### Running Debug Scripts

```bash
node scripts/debug/debug_merge.js
```

## Test Runner

The `run-all-tests.js` script:
- Automatically discovers all test files in the `test/` directory
- Executes them sequentially
- Provides a summary of passed/failed tests
- Returns appropriate exit codes (0 for success, 1 for failure)

## Adding New Scripts

When adding new scripts:
1. Place test scripts in `scripts/test/`
2. Place verification scripts in `scripts/verify/`
3. Place debug scripts in `scripts/debug/`
4. Place build artifacts in `scripts/build/`
5. Update this README if the script is important or requires special usage instructions
