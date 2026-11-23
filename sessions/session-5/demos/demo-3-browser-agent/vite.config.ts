import { defineConfig } from "vite";

export default defineConfig({
	server: {
		// Proxy Z.AI and OpenAI-compatible endpoints to avoid CORS during dev.
		// In production (or when the provider sends permissive CORS headers),
		// requests go directly from the browser — no server needed.
		proxy: {
			"/api/zai": {
				target: "https://api.z.ai",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api\/zai/, "/api"),
			},
			"/api/openai": {
				target: "https://api.openai.com",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api\/openai/, ""),
			},
		},
	},
});
