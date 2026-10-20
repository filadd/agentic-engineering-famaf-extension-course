import { http } from "msw";
import type { HttpHandler } from "msw";

import { url } from "./api.ts";

// Counts the GETs to each API path without answering them, so the handlers
// that answer can stay as they are.
export const requestCounter = (...paths: ReadonlyArray<string>) => {
  const counts = new Map<string, number>(paths.map((path) => [path, 0]));

  const handlers: Array<HttpHandler> = paths.map((path) =>
    http.get(url(path), () => {
      counts.set(path, (counts.get(path) ?? 0) + 1);
    }),
  );

  return {
    handlers,
    count: (path: string) => counts.get(path) ?? 0,
    reset: () => counts.forEach((_, path) => counts.set(path, 0)),
  };
};
