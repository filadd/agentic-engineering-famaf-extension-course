import { defineConfig } from "vitest/config";

// Each file deploys its own local stage in `beforeAll`, which takes a while.
// `sequence.hooks: "list"` keeps `afterAll(destroy)` from hanging under dev mode
// (alchemy issue #2118).
export default defineConfig({
  test: {
    include: ["test/**/*.test.ts"],
    sequence: { hooks: "list" },
    testTimeout: 60_000,
    hookTimeout: 300_000,
  },
});
