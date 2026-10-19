import { http, HttpResponse } from "msw";

import { url } from "./api.ts";

type Method = "get" | "post" | "patch" | "put" | "delete";

// An answer no endpoint declares, so the screen gets an untyped failure, as
// with a server that breaks.
export const failingRoute = (method: Method, path: string, status = 500) =>
  http[method](url(path), () => HttpResponse.json({}, { status }));
