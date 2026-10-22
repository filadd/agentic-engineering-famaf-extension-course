import type { EmailTaken } from "@kurasu/contract/errors";
import type { Ulid } from "@kurasu/contract/ulid";
import type { User } from "@kurasu/contract/user";
import * as Context from "effect/Context";
import type * as Effect from "effect/Effect";

import type { Repository } from "../repository.ts";
import type { NewCode } from "./codes.ts";

export interface NewUser {
  readonly id: Ulid;
  readonly email: string;
}

export type UserChange = Partial<Pick<User, "name" | "avatar" | "hasAccess">>;

// Reads are bounded: the course has about 30 people and the list stops at 100.
// `create` and `register` store a student with access and no name or avatar;
// `register` also stores their first link code, in the same batch.
export class Users extends Context.Service<
  Users,
  Pick<Repository<User, NewUser, UserChange>, "get" | "find" | "list" | "update"> & {
    readonly create: (user: NewUser) => Effect.Effect<User, EmailTaken>;
    readonly register: (user: NewUser, code: NewCode) => Effect.Effect<User, EmailTaken>;
  }
>()("kurasu/Users") {}
