import { expect } from "@effect/vitest";
import { MailNotSent } from "@kurasu/contract/errors";
import * as Effect from "effect/Effect";
import * as Exit from "effect/Exit";
import * as Schema from "effect/Schema";

import { apiTest } from "./helpers/api-test.ts";
import { request } from "./helpers/http.ts";
import { login } from "./helpers/login.ts";
import { linkCodeFor } from "./helpers/mail.ts";

const { test, stack } = apiTest({
  name: "harness",
  allowedEmails: ["profe@kurasu.test", "ana@kurasu.test"],
});

test(
  "the stage starts with the migrations applied and the fixture loaded",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* login(url, "harness-ana-code");
    const me = yield* request(url, "GET", "/api/me", { cookie });

    expect(me.status).toBe(200);
    expect(me.body).toEqual({
      id: "01M58ZVRXKHK52RKZ9TT22RCCT",
      email: "ana@kurasu.test",
      name: "Ana",
      avatar: "fox",
      role: "student",
    });
  }),
);

test(
  "a requested link arrives as a local mail whose code opens a session",
  Effect.gen(function* () {
    const { url } = yield* stack;

    const requested = yield* request(url, "POST", "/api/auth/link", {
      body: { email: "profe@kurasu.test" },
    });

    expect(requested.status).toBe(204);

    const cookie = yield* login(url, yield* linkCodeFor("profe@kurasu.test"));
    const me = yield* request(url, "GET", "/api/me", { cookie });

    expect(me.body).toMatchObject({ email: "profe@kurasu.test", role: "teacher" });
  }),
);

test(
  "a link for an address outside the allowed list fails to send",
  Effect.gen(function* () {
    const { url } = yield* stack;

    const requested = yield* request(url, "POST", "/api/auth/link", {
      body: { email: "blocked@kurasu.test" },
    });

    expect(requested.status).toBe(502);
    expect(Exit.isSuccess(Schema.decodeUnknownExit(MailNotSent)(requested.body))).toBe(true);
  }),
);
