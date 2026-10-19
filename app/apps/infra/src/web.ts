import * as Cloudflare from "alchemy/Cloudflare";
import * as Effect from "effect/Effect";

import { kurasuDomain } from "./domain.ts";

const rootDir = new URL("../../web", import.meta.url).pathname;

const baseProps = {
  rootDir,
  assets: { notFoundHandling: "single-page-application" },
  dev: { port: 5173 },
} as const;

// The web's own Worker: the TanStack Start SPA and its assets. It takes the
// custom domain only when deployed; under `alchemy dev` it is the Vite dev
// server.
export const Web = Cloudflare.Website.Vite(
  "Web",
  Effect.map(Effect.orDie(kurasuDomain), (domain) =>
    domain.deployed ? { ...baseProps, domain: domain.name } : baseProps,
  ),
);
