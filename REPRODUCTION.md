# Reproduction Steps

This document provides detailed steps to reproduce the Stryker + vite-tsconfig-paths incompatibility issue.

## Prerequisites

- Node.js v18 or higher
- npm or yarn

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Verify Tests Pass

First, verify that all tests pass with Vitest:

```bash
npm test
```

**Expected output:** All tests pass ✅

```
✓ shared/src/math.spec.ts (7 tests)
✓ with-alias/src/calculator.spec.ts (10 tests)

Test Files  2 passed (2)
     Tests  17 passed (17)
```

## Step 3: Run Mutation Testing on Shared Folder (Works)

Run Stryker on the `shared` folder, which uses **relative imports**:

```bash
npm run stryker:shared
```

**Expected output:** Mutation testing completes successfully ✅

```
Mutant tested: 20
Mutants killed: 15
Mutants survived: 5
Mutation score: 75.00%
```

The shared folder works because it uses simple relative imports:
```typescript
import { add, subtract } from "./math"; // ✅ Works
```

## Step 4: Run Mutation Testing on With-Alias Folder (Fails)

Run Stryker on the `with-alias` folder, which uses **path aliases**:

```bash
npm run stryker:alias
```

**Expected output:** Stryker crashes with path resolution errors ❌

```
Error: Failed to load url /private/var/folders/.../stryker-tmp/sandbox1234567/with-alias/src/calculator.ts
(resolved id: /private/var/folders/.../stryker-tmp/sandbox1234567/with-alias/src/calculator.ts)
in /private/var/folders/.../stryker-tmp/sandbox1234567/with-alias/src/calculator.ts.
Does the file exist?
```

The with-alias folder fails because it uses path aliases:
```typescript
import { add, subtract } from "@shared/math"; // ❌ Fails in Stryker sandbox
```

## Why It Fails

### The Problem

1. **Vitest configuration** (`vitest.config.ts`) includes the `vite-tsconfig-paths` plugin to resolve TypeScript path aliases
2. **Stryker** creates a temporary sandbox directory (e.g., `.stryker-tmp/sandbox1234567/`)
3. **vite-tsconfig-paths** plugin tries to resolve `@shared/math` based on the original `tsconfig.json` paths
4. **Path resolution fails** because the sandbox structure doesn't match the original project structure

### File Structure Comparison

**Original structure:**
```
project/
├── shared/src/math.ts
└── with-alias/src/calculator.ts (imports @shared/math)
```

**Stryker sandbox structure:**
```
.stryker-tmp/sandbox1234567/
├── shared/src/math.ts
└── with-alias/src/calculator.ts (still tries to import @shared/math)
```

The `vite-tsconfig-paths` plugin can't correctly resolve `@shared/*` paths in the sandbox because the base path has changed.

## Comparison: What Works vs What Fails

### ✅ Works: Relative Imports (shared folder)

```typescript
// shared/src/math.spec.ts
import { add } from "./math"; // Relative path - always works
```

**Stryker output:**
```
Mutant tested: 20/20
All mutants tested successfully
```

### ❌ Fails: Path Alias Imports (with-alias folder)

```typescript
// with-alias/src/calculator.ts
import { add } from "@shared/math"; // Path alias - fails in sandbox
```

**Stryker output:**
```
Error: Failed to load url .../with-alias/src/calculator.ts
```

## Configuration Files

### vitest.config.ts (The problematic plugin)

```typescript
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths"; // This breaks Stryker!

export default defineConfig({
  plugins: [tsconfigPaths()], // ❌ Causes sandbox path resolution issues
  test: {
    // ... test config
  }
});
```

### tsconfig.json (Path alias definitions)

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@shared/*": ["shared/src/*"] // Path alias definition
    }
  }
}
```

## Workaround

The only current workaround is to remove the `vite-tsconfig-paths` plugin from `vitest.config.ts` and use relative imports everywhere. However, this defeats the purpose of having path aliases in a monorepo.

**Modified vitest.config.ts (workaround):**
```typescript
import { defineConfig } from "vitest/config";
// import tsconfigPaths from "vite-tsconfig-paths"; // ❌ Remove this

export default defineConfig({
  // plugins: [tsconfigPaths()], // ❌ Remove this
  test: {
    // ... test config
  }
});
```

Then change all imports to use relative paths.

## Expected Fix

Stryker should either:
1. Support Vite plugins that perform path resolution in the sandbox environment
2. Provide configuration to disable specific Vite plugins during mutation testing
3. Document this incompatibility and provide guidance on monorepo setups

## Environment Details

```json
{
  "node": "v22.15.0",
  "@stryker-mutator/core": "^9.2.0",
  "@stryker-mutator/vitest-runner": "^9.2.0",
  "vitest": "^4.0.6",
  "vite": "^6.0.7",
  "vite-tsconfig-paths": "^5.1.4",
  "typescript": "^5.7.2"
}
```
