# Investigation Findings

## Testing Results

### Initial Testing

When testing the minimal reproduction, the issue **did not occur** as expected. Both commands completed successfully:

-   `npm run stryker:shared` ✅ Works
-   `npm run stryker:alias` ✅ Also works (unexpected!)

### Why The Issue May Not Reproduce

The original issue was observed in a production monorepo with the following characteristics:

1. **Complex workspace structure**:

    - Multiple workspaces (frontend, functions, shared)
    - TypeScript project references
    - Cross-workspace imports (frontend → shared)

2. **Specific configuration**:

    - Root `vitest.config.ts` with `tsconfigPaths()` plugin
    - Multiple `tsconfig.json` files with different path configurations
    - Workspace-specific aliases (`@/`, `@mmt/shared`)

3. **The actual working configuration**:

    ```json
    "mutate": ["shared/**/*.ts"]  // Only shared folder
    ```

    Frontend and functions folders were **excluded** from mutation testing, suggesting they couldn't be tested successfully.

### Possible Explanations

1. **Version-dependent**: The issue may have been fixed in recent versions of:

    - Stryker (9.2.0)
    - Vitest (4.0.6)
    - vite-tsconfig-paths (5.1.4)

2. **Configuration-dependent**: The issue may only occur with specific combinations of:

    - Multiple tsconfig.json files
    - Complex path alias configurations
    - Workspace references
    - Specific Vite plugins

3. **Sandbox structure**: The issue may only manifest when:
    - Files are deeply nested
    - Multiple levels of path resolution are needed
    - Circular dependencies exist

### Original Error Evidence

From the production codebase investigation:

-   `shared/` folder uses relative imports: `import { DomainPrimitive } from './DomainPrimitive'` ✅
-   `frontend/` uses path aliases: `import { UpdatedTime } from '@mmt/shared/...'` ❌
-   Stryker config explicitly mutates **only** `shared/**/*.ts`
-   User reported: "why does testing shared work while testing frontend and functions does not?"

This strongly suggests the issue exists but may require specific conditions to reproduce.

## Recommendations

### For Users Experiencing This Issue

If you're experiencing Stryker failures with vite-tsconfig-paths:

1. **Workaround**: Mutate only workspace folders that use relative imports:

    ```json
    "mutate": ["shared/**/*.ts"]
    ```

2. **Alternative**: Remove vite-tsconfig-paths and use relative imports

3. **Configuration**: Try adding explicit alias configuration in vitest.config.ts:
    ```typescript
    test: {
      alias: {
        "@shared": path.resolve(__dirname, "./shared/src")
      }
    }
    ```

### For Reproducing The Issue

To potentially trigger the issue, you may need:

1. **Multiple workspaces** with TypeScript project references
2. **Cross-workspace imports** using path aliases
3. **Nested folder structures**
4. **Multiple tsconfig.json files** with different path configurations
5. **Attempt to mutate files** that import from other workspaces

## Contributing

If you can reliably reproduce this issue, please:

1. Document your exact configuration
2. Note the versions of all dependencies
3. Share the error output
4. Contribute to this repository or create an issue at:
   https://github.com/stryker-mutator/stryker-js/issues

## Conclusion

While the minimal reproduction doesn't demonstrate the issue consistently, there is strong evidence from production use that the incompatibility exists under certain conditions. More investigation is needed to identify the exact trigger.
