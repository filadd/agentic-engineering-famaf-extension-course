import { AdminUsersGroup } from "@kurasu/contract/admin-users";
import { AuthGroup } from "@kurasu/contract/auth";
import { MeGroup } from "@kurasu/contract/me";
import { HttpApi } from "effect/http-api";

// The groups the Worker serves. It grows group by group until it equals
// KurasuApi from @kurasu/contract.
export class ServedApi extends HttpApi.make("kurasu")
  .add(AuthGroup)
  .add(MeGroup)
  .add(AdminUsersGroup)
  .prefix("/api") {}
