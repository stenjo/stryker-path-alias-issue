# Quick Start

## 1. Push to GitHub

```bash
cd /tmp/stryker-path-alias-issue
git remote add origin https://github.com/stenjo/stryker-path-alias-issue.git
git push -u origin main
```

## 2. Test the Reproduction

```bash
# Clone on another machine
git clone https://github.com/stenjo/stryker-path-alias-issue.git
cd stryker-path-alias-issue

# Install dependencies
npm install

# Run tests - should pass
npm test

# Run Stryker on relative imports - should work
npm run stryker:shared

# Run Stryker on path aliases - should fail
npm run stryker:alias
```

## 3. Report the Issue

Create an issue at: https://github.com/stryker-mutator/stryker-js/issues

Use the template from `PUSH_INSTRUCTIONS.md`

## What You'll See

### ✅ npm test
All 17 tests pass

### ✅ npm run stryker:shared
Mutation testing completes successfully

### ❌ npm run stryker:alias
Error: Failed to load url .../calculator.ts

This demonstrates the incompatibility between Stryker and vite-tsconfig-paths!
