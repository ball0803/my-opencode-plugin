# Remaining Issues After Fixing "Missing or Changed Exports"

## Summary

The "Missing or Changed Exports" issue (category B) has been significantly improved, but there are still some import path inconsistencies and missing function implementations that need to be addressed.

## Remaining Issues

### 1. HookName Import Path

**File**: `src/index.ts` (line 2)

**Current**:

```typescript
import type { HookName } from './config/schema.ts';
```

**Issue**: `HookName` is not exported from `schema.ts`

**Solution**: Import from `./config/index.ts` instead (which re-exports it)

**Fixed**:

```typescript
import type { HookName } from './config/index.ts';
```

---

### 2. Missing Session Functions

**File**: `src/index.ts` (line 3)

**Current**:

```typescript
import { getMainSessionID, setMainSession, log } from './shared';
```

**Issue**: `getMainSessionID` and `setMainSession` are not defined anywhere in the codebase

**Solution**: These functions need to be implemented or removed

**Options**:

1. Implement these functions in `src/shared/index.ts` or a new file
2. Remove these functions if they're not needed
3. Replace with existing session management from OpenCode API

---

### 3. Shared Module Import Path

**File**: `src/plugin-config.ts` (line 14)

**Current**:

```typescript
import { ... } from "./shared.ts";
```

**Issue**: `./shared.ts` doesn't exist

**Solution**: Import from `./shared/index.ts` instead

**Fixed**:

```typescript
import { ... } from "./shared/index.ts";
```

---

### 4. Config Module Import Path

**File**: `src/plugin-handlers/config-handler.ts` (line 6)

**Current**:

```typescript
import { ConfigLoader } from '../config.ts';
```

**Issue**: `../config.ts` doesn't exist

**Solution**: Import from `../config/index.ts` instead

**Fixed**:

```typescript
import { ConfigLoader } from '../config/index.ts';
```

---

## Verification Steps

After making these fixes, run:

```bash
npm run build
```

The "Missing or Changed Exports" errors should be resolved. Other errors (type mismatches, hook return types, etc.) are separate issues that need to be addressed independently.
