import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Under `alchemy dev` the API Worker listens on port 1337, and Vite forwards
// /api to it (the classroom WebSocket included), so the browser talks to a
// single origin as it does in production.
export default defineConfig({
  plugins: [tailwindcss(), tanstackStart({ spa: { enabled: true } }), viteReact()],
  server: {
    proxy: {
      "/api": { target: "http://localhost:1337", ws: true },
    },
  },
});
