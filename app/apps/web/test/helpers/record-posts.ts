import { http } from "msw";

import { noContent, url } from "./api.ts";
import { server } from "./server.ts";

// Records the JSON bodies POSTed to a path and answers 204.
export const recordPosts = (path: string) => {
  const calls: Array<unknown> = [];

  server.use(
    http.post(url(path), async ({ request }) => {
      calls.push(await request.json());

      return noContent();
    }),
  );

  return { calls };
};
