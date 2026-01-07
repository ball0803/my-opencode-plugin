# TypeScript Build Error Analysis

## Project Context

- **Module System**: ESM with `moduleResolution: node16` in tsconfig.json
- **Strict Mode**: Enabled (`strict: true`)
- **OpenCode Plugin API**: Version 1.1.3
- **Build Tool**: Bun with TypeScript compiler

## Error Categories and Root Causes

### A. Type Identity Conflict

**Example**: `AgentSession is not assignable to AgentSession`

**Files**:

- `src/index.ts:22`
- `src/background-agent/manager.ts:5`

**Root Cause**: There are two different `AgentSession` type definitions:

1. `src/background-agent/types.ts:59-63` - Has methods like `getStatus()`, `sendMessage()`
2. `src/core/types.ts:3-10` - Has methods like `callAgent()`, `getTaskStatus()`

**Why it happens**: TypeScript treats these as distinct types because they have different method signatures. The plugin imports `AgentSession` from `./background-agent/types` but the manager also expects this type, creating a conflict.

**Implication**: The missing properties suggest API drift where the type definition changed between versions or was duplicated during refactoring.

### B. Missing or Changed Exports

**Example**: `No exported member 'MessagesTransformHook'`

**Files**: `src/hooks/empty-message-sanitizer/index.ts:1`

**Root Cause**: The OpenCode plugin API (v1.1.3) doesn't export `MessagesTransformHook`. This hook type was likely removed or renamed in the API update.

**Why it happens**: The plugin was developed against an older version of the OpenCode plugin API that had this export, but the current version (1.1.3) doesn't include it.

**Example**: `Module '"./config/index.js"' has no exported member 'OhMyOpenCodeConfigSchema'`

**Files**: `src/plugin-config.ts:4-5`

**Root Cause**: `OhMyOpenCodeConfigSchema` is defined in `src/config/schema.ts` but not exported from `src/config/index.ts`.

**Why it happens**: The config module exports the `ConfigLoader` class but not the schema types, creating a mismatch between where types are defined and where they're expected to be imported from.

### C. Invalid Hook Return Types

**Example**: `Type '{ parts: [...] }' is not assignable to type 'undefined'`

**Files**:

- `src/hooks/empty-task-response-detector.ts:10-23`
- `src/hooks/ralph-loop/index.ts:71`
- `src/hooks/session-notification/index.ts:22`
- `src/hooks/edit-error-recovery/index.ts:13`

**Root Cause**: These hooks return objects with `parts` arrays, but the hook contract expects `undefined` or a different return type.

**Why it happens**: The hooks are trying to send messages via `ctx.client.session.message()` which returns a Promise, but the hook signature expects either `void` or `undefined`. The hooks are violating the type contract by attempting to return message structures.

### D. Implicit `any` Parameters

**Example**: `Parameter 'i' implicitly has an 'any' type`

**Files**: `src/plugin-config.ts:31`

**Root Cause**: Strict mode requires explicit types for all parameters.

**Why it happens**: The code uses `forEach` or similar array methods without typing the callback parameter. TypeScript's strict mode flags this as unsafe.

**Example**: `Parameter 't' implicitly has an 'any' type`

**Files**: `src/tools/subagent/tools.ts:263`

**Root Cause**: The `filter` callback parameter `t` is not explicitly typed.

**Why it happens**: Inline arrow functions in array methods need explicit parameter types in strict mode.

### E. Possibly Undefined Access

**Example**: `output.result is possibly undefined`

**Files**: `src/hooks/keyword-detector/index.ts:22`

**Root Cause**: The code accesses `output.result` without checking if it's undefined first.

**Why it happens**: The hook expects `output.result` to be a string, but the type definition allows it to be `undefined`. The code checks this conditionally but TypeScript's strict null checks flag the access.

### F. ESM / NodeNext Import Errors

**Example**: `Relative import paths need explicit file extensions`

**Files**: Throughout the codebase (100+ occurrences)

**Root Cause**: With `moduleResolution: node16`, TypeScript requires explicit file extensions in ESM imports.

**Why it happens**: The project uses ESM (`"type": "module"` in package.json) with NodeNext module resolution, which requires imports to specify extensions (`.js`, `.ts`, etc.) for relative imports.

**Example**: `An import path can only end with a '.ts' extension when 'allowImportingTsExtensions' is enabled`

**Files**:

- `src/plugin.ts`
- `src/hooks/ralph-loop/index.ts:3`

**Root Cause**: TypeScript doesn't allow importing `.ts` files directly in ESM mode unless `allowImportingTsExtensions` is enabled.

**Why it happens**: The code imports `.ts` files directly (e.g., `./hooks/index.ts`) instead of using the compiled `.js` files or enabling the TypeScript option.

### G. Missing Module Files

**Example**: `Cannot find module './background-task.js'`

**Files**: `src/tools/index.ts:3-7`

**Root Cause**: The tools index tries to import from directories without specifying the exact file.

**Why it happens**: The imports use directory paths (e.g., `./background-task`) without specifying the exact file to import from (e.g., `./background-task/index.js` or `./background-task/tools.js`).

### H. Bun-specific Test Import Issues

**Example**: `Cannot find module 'bun:test'`

**Files**: Test files (not shown in errors)

**Root Cause**: TypeScript can't resolve Bun's test globals.

**Why it happens**: Bun provides special test globals via `bun:test` protocol, but TypeScript's type checker doesn't understand this resolution mechanism unless configured properly.

## Cross-cutting Diagnosis

1. **OpenCode API Upgrade**: The plugin was developed against an older version of the OpenCode plugin API. Evidence:
   - Missing `MessagesTransformHook` export
   - Hook signature mismatches
   - Changed event handler signatures

2. **Partial ESM Migration**: The project is transitioning to ESM but hasn't completed the migration. Evidence:
   - Mixed `.ts` and `.js` imports
   - Missing file extensions in imports
   - `allowImportingTsExtensions` not enabled

3. **Mismatch Between Runtime and Type Checking**:
   - Bun runtime handles ESM and special imports differently than TypeScript's type checker
   - TypeScript's strict mode catches issues that Bun would handle at runtime

## Summary Checklist

### Blockers (Prevent Build)

- [ ] ESM import extension errors (100+ occurrences)
- [ ] Missing OpenCode API exports (`MessagesTransformHook`)
- [ ] Hook return type violations
- [ ] Missing module files (directory imports)
- [ ] Type identity conflicts (`AgentSession`)

### Follow-ups (Post-build Issues)

- [ ] Implicit `any` parameters (strict mode violations)
- [ ] Possibly undefined access (null safety)
- [ ] Bun test globals resolution
- [ ] Export mismatches between schema and config modules

### Root Causes

1. OpenCode plugin API version mismatch
2. Incomplete ESM migration
3. TypeScript strict mode violations
4. Duplicate/incompatible type definitions
5. Missing exports and improper module resolution
