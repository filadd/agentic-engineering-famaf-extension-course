import { defineConfig } from "vitest/config";

// Each file deploys its own local stage in `beforeAll`, which takes a while.
// `sequence.hooks: "list"` keeps `afterAll(destroy)` from hanging under dev mode
// (alchemy issue #2118). More than a few stages starting at once overload the
// local runtime and every file times out, so at most four files run together.
export default defineConfig({
  test: {
    include: ["test/**/*.test.ts"],
    sequence: { hooks: "list" },
    maxWorkers: 4,
    testTimeout: 60_000,
    hookTimeout: 300_000,
  },
});
