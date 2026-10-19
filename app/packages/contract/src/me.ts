import * as Schema from "effect/Schema";
import { HttpApiEndpoint, HttpApiGroup } from "effect/http-api";

import { CurrentUserMiddleware } from "./middleware.ts";
import { Animal, Me, UserName } from "./user.ts";

export const ProfileInput = Schema.Struct({
  name: UserName,
  avatar: Animal,
});

export type ProfileInput = typeof ProfileInput.Type;

export class MeGroup extends HttpApiGroup.make("me")
  .add(
    HttpApiEndpoint.get("get", "/me", { success: Me }),
    HttpApiEndpoint.patch("update", "/me", { payload: ProfileInput, success: Me }),
  )
  .middleware(CurrentUserMiddleware) {}
