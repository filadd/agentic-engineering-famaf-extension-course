import type { Ulid } from "@kurasu/contract/ulid";
import * as Context from "effect/Context";
import type * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";

export class InvalidToken extends Schema.TaggedError<InvalidToken>()("InvalidToken", {}) {}

// The signed token in the session cookie. It lasts a week from the login and
// using the app does not renew it; `verify` fails on a bad signature or an
// expired token.
export class SessionTokens extends Context.Service<
  SessionTokens,
  {
    readonly sign: (userId: Ulid) => Effect.Effect<string>;
    readonly verify: (token: string) => Effect.Effect<Ulid, InvalidToken>;
  }
>()("kurasu/SessionTokens") {}
