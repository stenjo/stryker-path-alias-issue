import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()], // This plugin breaks Stryker sandbox!
  test: {
    globals: true,
    include: [
      "shared/src/**/*.spec.ts",
      "with-alias/src/**/*.spec.ts"
    ]
  }
});
