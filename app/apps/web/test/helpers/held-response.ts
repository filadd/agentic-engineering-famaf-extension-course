import { http } from "msw";

import { url } from "./api.ts";

type Method = "get" | "post" | "patch" | "put" | "delete";

// Holds every request to a path until the test releases it, so the test can
// look at the screen before the answer. Released without a response, the
// requests fall through to the handlers already in place.
export const heldResponse = (method: Method, path: string) => {
  const released = Promise.withResolvers<Response | undefined>();

  return {
    handler: http[method](url(path), () => released.promise),
    release: (response?: Response) => released.resolve(response),
  };
};
