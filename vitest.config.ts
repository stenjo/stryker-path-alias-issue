import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
  plugins: [tsconfigPaths()], // This plugin breaks Stryker sandbox!
  test: {
    globals: true,
    include: [
      "shared/src/**/*.spec.ts",
      "with-alias/src/**/*.spec.ts"
    ],
    // Add explicit alias configuration like your project
    alias: {
      "@shared": path.resolve(__dirname, "./shared/src"),
    }
  }
});
