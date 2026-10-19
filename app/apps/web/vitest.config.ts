import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [viteReact()],
  test: {
    name: "web",
    environment: "happy-dom",
    environmentOptions: {
      happyDOM: { url: "http://localhost:5173" },
    },
    include: ["test/**/*.test.tsx"],
    setupFiles: ["test/setup.ts"],
  },
});
