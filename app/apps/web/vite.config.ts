import { IncomingMessage } from "node:http";

import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

// Under `alchemy dev`, the Cloudflare plugin that Website.Vite injects sends
// every WebSocket upgrade but Vite's HMR to the web's Worker, which answers the
// classroom socket with the SPA's 404 before the /api proxy gets to it. Vite
// registers the proxy's upgrade listener right after the `configureServer`
// hooks and before their post callbacks, so it is the last listener when this
// plugin's post callback runs; from then on, /api upgrades reach only it.
const apiUpgradesToProxy = (): Plugin => ({
  name: "kurasu:api-upgrades-to-proxy",
  apply: "serve",
  enforce: "pre",
  configureServer: (server) => () => {
    const { httpServer } = server;
    const proxyListener = httpServer?.listeners("upgrade").at(-1);

    if (httpServer == null || proxyListener == null) {
      return;
    }

    const emit = httpServer.emit.bind(httpServer);

    httpServer.emit = (event: string, ...args: Array<unknown>) => {
      const [request] = args;

      if (
        event === "upgrade" &&
        request instanceof IncomingMessage &&
        request.url?.startsWith("/api/") === true
      ) {
        proxyListener.apply(httpServer, args);

        return true;
      }

      return emit(event, ...args);
    };
  },
});

// Under `alchemy dev`, Vite forwards /api to the API Worker (the classroom
// WebSocket included), so the browser talks to a single origin as it does in
// production. The API Worker asks for port 1337 but takes the next free one
// when 1337 is busy; the stack passes the URL it ended up on as the
// `VITE_API_URL` entry of the web's env, which Alchemy hands to Vite as a
// `define` merged into this config before the plugins' `config` hooks run.
const apiProxy = (): Plugin => ({
  name: "kurasu:api-proxy",
  apply: "serve",
  config: ({ define }) => {
    const apiUrl: string | undefined = define?.["import.meta.env.VITE_API_URL"];

    return apiUrl == null
      ? {}
      : { server: { proxy: { "/api": { target: JSON.parse(apiUrl), ws: true } } } };
  },
});

export default defineConfig({
  plugins: [
    apiProxy(),
    apiUpgradesToProxy(),
    tailwindcss(),
    tanstackStart({ spa: { enabled: true, prerender: { outputPath: "/index" } } }),
    viteReact(),
  ],
});
