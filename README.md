# Stryker + vite-tsconfig-paths Incompatibility Issue

This repository demonstrates a compatibility issue between Stryker mutation testing and the `vite-tsconfig-paths` plugin when using TypeScript path aliases in a monorepo setup.

## Problem Description

When using Stryker with Vitest and the `vite-tsconfig-paths` plugin for TypeScript path alias resolution in a monorepo, mutation testing **may fail** for code that uses path aliases to import from other workspaces, depending on the specific configuration.

### Current Status

⚠️ **Note**: This issue may be intermittent or configuration-dependent. Initial testing shows:

-   ✅ Simple monorepo structures may work
-   ❌ Complex multi-workspace structures with cross-workspace imports may fail
-   The failure typically manifests as "Failed to load url" errors in Stryker's sandbox

If you can reproduce this reliably, please contribute your findings!

### Error (When It Occurs)

```text
Error: Failed to load url /private/var/folders/.../stryker-tmp/sandbox1234567/src/with-alias/math.ts (resolved id: /private/var/folders/.../stryker-tmp/sandbox1234567/src/with-alias/math.ts) in /private/var/folders/.../stryker-tmp/sandbox1234567/src/with-alias/math.ts. Does the file exist?
```

## Repository Structure

```
stryker-path-alias-issue/
├── shared/                     # ✅ WORKS - uses relative imports
│   ├── src/
│   │   ├── math.ts
│   │   └── math.spec.ts
│   └── tsconfig.json
│
├── with-alias/                 # ❌ FAILS - uses path aliases
│   ├── src/
│   │   ├── calculator.ts      # imports from '@shared/math'
│   │   └── calculator.spec.ts
│   └── tsconfig.json
│
├── vitest.config.ts            # Has vite-tsconfig-paths plugin
├── stryker.config.json
└── tsconfig.json               # Defines path aliases
```

## Reproduction Steps

1. **Install dependencies:**

    ```bash
    npm install
    ```

2. **Run tests (all pass):**

    ```bash
    npm test
    ```

3. **Run mutation testing on shared folder (works):**

    ```bash
    npm run stryker:shared
    ```

4. **Run mutation testing on with-alias folder (fails):**
    ```bash
    npm run stryker:alias
    ```

## Root Cause

The `vite-tsconfig-paths` plugin breaks Stryker's sandbox path resolution:

1. **Shared folder** uses simple relative imports: `import { add } from './math'` ✅
2. **With-alias folder** uses path aliases: `import { add } from '@shared/math'` ❌

When Stryker creates a sandbox (temporary directory), the `vite-tsconfig-paths` plugin cannot correctly resolve path aliases because:

-   The plugin expects paths to be resolved relative to the original `tsconfig.json`
-   Stryker's sandbox creates a different directory structure
-   Path resolution fails with "Failed to load url" errors

## Workaround

The only current workaround is to avoid using path aliases and use relative imports instead, which defeats the purpose of having path aliases in a monorepo.

## Environment

-   Node.js: v22.15.0
-   Stryker: 9.2.0
-   Vitest: 4.0.6
-   vite-tsconfig-paths: 5.1.4
-   TypeScript: 5.7.2

## Related Issues

This issue affects any monorepo using:

-   Stryker mutation testing
-   Vitest as test runner
-   Vite with vite-tsconfig-paths plugin
-   TypeScript path aliases

## Expected Behavior

Stryker should be able to mutation test code that uses TypeScript path aliases, just as it does with relative imports.

## Actual Behavior

Stryker crashes with "Failed to load url" errors when processing files that import using path aliases.
