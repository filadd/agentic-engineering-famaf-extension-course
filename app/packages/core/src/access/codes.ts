import type { Ulid } from "@kurasu/contract/ulid";
import * as Context from "effect/Context";
import type * as Effect from "effect/Effect";
import type * as Option from "effect/Option";

export interface NewCode {
  readonly id: Ulid;
  readonly code: string;
}

// The enrollment code and the magic link codes. Only one enrollment code is
// current: `ensureEnrollment` stores the candidate only when there is none and
// returns the current one, and `regenerateEnrollment` marks the current one as
// deleted and stores the next in one batch. A user has at most one link code,
// which never expires: `issueUserCode` replaces it, and `consumeUserCode`
// deletes it in a single statement, so only one of two concurrent uses wins.
export class Codes extends Context.Service<
  Codes,
  {
    readonly currentEnrollment: () => Effect.Effect<Option.Option<string>>;
    readonly ensureEnrollment: (candidate: NewCode) => Effect.Effect<string>;
    readonly regenerateEnrollment: (next: NewCode) => Effect.Effect<string>;
    readonly issueUserCode: (userId: Ulid, code: NewCode) => Effect.Effect<void>;
    readonly consumeUserCode: (code: string) => Effect.Effect<Option.Option<Ulid>>;
  }
>()("kurasu/Codes") {}
