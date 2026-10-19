import { expect } from "@effect/vitest";
import * as Effect from "effect/Effect";

import { apiTest } from "./helpers/api-test.ts";
import { request } from "./helpers/http.ts";
import { cookieFor } from "./helpers/login.ts";

const { test, stack } = apiTest({ name: "sessions-disabled", allowedEmails: [] });

test(
  "with no enabled session the student's list is empty",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* cookieFor("01SDSTD0000000000000000000");
    const response = yield* request(url, "GET", "/api/sessions", { cookie });

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  }),
);
