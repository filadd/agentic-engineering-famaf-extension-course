import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: ["apps/{api,web}/vitest.config.ts"],
  },
});
