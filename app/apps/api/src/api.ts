import { AdminUsersGroup } from "@kurasu/contract/admin-users";
import { AuthGroup } from "@kurasu/contract/auth";
import { AdminMaterialsGroup, MaterialsGroup } from "@kurasu/contract/materials";
import { MeGroup } from "@kurasu/contract/me";
import { AdminPollsGroup, PollsGroup } from "@kurasu/contract/polls";
import { AdminQuestionsGroup, QuestionsGroup } from "@kurasu/contract/questions";
import { AdminRaisedHandsGroup, RaisedHandsGroup } from "@kurasu/contract/raised-hands";
import { AdminSessionsGroup, SessionsGroup } from "@kurasu/contract/sessions";
import { HttpApi } from "effect/http-api";

// The groups the Worker serves. It grows group by group until it equals
// KurasuApi from @kurasu/contract.
export class ServedApi extends HttpApi.make("kurasu")
  .add(AuthGroup)
  .add(MeGroup)
  .add(AdminUsersGroup)
  .add(SessionsGroup)
  .add(AdminSessionsGroup)
  .add(PollsGroup)
  .add(AdminPollsGroup)
  .add(MaterialsGroup)
  .add(AdminMaterialsGroup)
  .add(QuestionsGroup)
  .add(AdminQuestionsGroup)
  .add(RaisedHandsGroup)
  .add(AdminRaisedHandsGroup)
  .prefix("/api") {}
