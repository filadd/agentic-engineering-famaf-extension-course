import type { EmailTaken } from "@kurasu/contract/errors";
import type { ProfileInput } from "@kurasu/contract/me";
import type { Ulid } from "@kurasu/contract/ulid";
import type { User } from "@kurasu/contract/user";
import * as Context from "effect/Context";
import type * as Effect from "effect/Effect";
import type * as Option from "effect/Option";

import type { NewCode } from "./codes.ts";

export interface NewUser {
  readonly id: Ulid;
  readonly email: string;
}

// Reads are bounded: the course has about 30 people and the list stops at 100.
// `create` and `register` store a student with access and no name or avatar;
// `register` also stores their first link code, in the same batch.
export class Users extends Context.Service<
  Users,
  {
    readonly findByEmail: (email: string) => Effect.Effect<Option.Option<User>>;
    readonly get: (id: Ulid) => Effect.Effect<Option.Option<User>>;
    readonly list: () => Effect.Effect<ReadonlyArray<User>>;
    readonly create: (user: NewUser) => Effect.Effect<User, EmailTaken>;
    readonly register: (user: NewUser, code: NewCode) => Effect.Effect<User, EmailTaken>;
    readonly setAccess: (id: Ulid, hasAccess: boolean) => Effect.Effect<Option.Option<User>>;
    readonly updateProfile: (id: Ulid, profile: ProfileInput) => Effect.Effect<Option.Option<User>>;
  }
>()("kurasu/Users") {}
