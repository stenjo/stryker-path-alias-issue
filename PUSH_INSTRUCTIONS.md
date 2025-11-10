# Push Instructions

The minimal reproduction repository has been created in `/tmp/stryker-path-alias-issue`.

## To push to GitHub:

```bash
cd /tmp/stryker-path-alias-issue

# Add your GitHub remote (if not already configured)
git remote add origin https://github.com/stenjo/stryker-path-alias-issue.git

# Push to GitHub
git push -u origin main
```

## What's Included

### Project Structure

```
stryker-path-alias-issue/
├── README.md                      # Overview of the issue
├── REPRODUCTION.md                # Detailed reproduction steps
├── package.json                   # Dependencies
├── tsconfig.json                  # Root config with path aliases
├── vitest.config.ts               # Vitest config with vite-tsconfig-paths
├── stryker.config.json            # Stryker configuration
├── .gitignore                     # Git ignore rules
│
├── shared/                        # ✅ WORKS with Stryker
│   ├── src/
│   │   ├── math.ts                # Simple math functions
│   │   └── math.spec.ts           # Tests using relative imports
│   └── tsconfig.json
│
└── with-alias/                    # ❌ FAILS with Stryker
    ├── src/
    │   ├── calculator.ts          # Calculator using @shared/* alias
    │   └── calculator.spec.ts     # Tests
    └── tsconfig.json
```

### Key Files

1. **shared/src/math.ts** - Uses relative imports (works)
2. **with-alias/src/calculator.ts** - Uses path alias `@shared/math` (fails)
3. **vitest.config.ts** - Contains the problematic `vite-tsconfig-paths` plugin
4. **README.md** - Comprehensive issue description
5. **REPRODUCTION.md** - Step-by-step reproduction guide

## After Pushing

Once pushed, you can share the repository URL with:

-   Stryker maintainers (https://github.com/stryker-mutator/stryker-js/issues)
-   Community forums
-   Stack Overflow questions

The repository URL will be: https://github.com/stenjo/stryker-path-alias-issue

## Next Steps

1. **Push the repository** (see commands above)
2. **Install dependencies** on another machine to verify:
    ```bash
    git clone https://github.com/stenjo/stryker-path-alias-issue.git
    cd stryker-path-alias-issue
    npm install
    ```
3. **Run the reproduction**:
    ```bash
    npm test                # All tests pass
    npm run stryker:shared  # Works (relative imports)
    npm run stryker:alias   # Fails (path aliases)
    ```
4. **Create GitHub issue** at https://github.com/stryker-mutator/stryker-js/issues with:
    - Link to this reproduction repo
    - Brief description
    - Expected vs actual behavior
    - Environment details

## Issue Template

When creating the GitHub issue, you can use this template:

**Title:** `Stryker sandbox fails with vite-tsconfig-paths plugin for TypeScript path aliases`

**Description:**

```
Stryker mutation testing fails when using the `vite-tsconfig-paths` plugin to resolve TypeScript path aliases in a monorepo setup.

**Reproduction:** https://github.com/stenjo/stryker-path-alias-issue

**Problem:**
- Code with relative imports works ✅
- Code with path aliases (@shared/*) fails ❌

**Error:**
Failed to load url .../stryker-tmp/sandbox.../file.ts

**Root Cause:**
The vite-tsconfig-paths plugin cannot resolve path aliases in Stryker's sandbox directory because the base path changes.

**Environment:**
- Stryker: 9.2.0
- Vitest: 4.0.6
- vite-tsconfig-paths: 5.1.4
- Node.js: 22.15.0

See the reproduction repo for full details and step-by-step instructions.
```
