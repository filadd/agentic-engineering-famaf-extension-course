import { HttpApi } from "effect/http-api";

import { AdminUsersGroup } from "./admin-users.ts";
import { AdminAnnouncementsGroup } from "./announcements.ts";
import { AuthGroup } from "./auth.ts";
import { AdminChangelogGroup } from "./changelog.ts";
import { ClassroomGroup } from "./classroom.ts";
import { AdminMaterialsGroup, MaterialsGroup } from "./materials.ts";
import { MeGroup } from "./me.ts";
import { AdminPollsGroup, PollsGroup } from "./polls.ts";
import { AdminQuestionsGroup, QuestionsGroup } from "./questions.ts";
import { AdminRaisedHandsGroup, RaisedHandsGroup } from "./raised-hands.ts";
import { AdminSessionsGroup, SessionsGroup } from "./sessions.ts";

export class KurasuApi extends HttpApi.make("kurasu")
  .add(AuthGroup)
  .add(MeGroup)
  .add(AdminUsersGroup)
  .add(SessionsGroup)
  .add(AdminSessionsGroup)
  .add(PollsGroup)
  .add(AdminPollsGroup)
  .add(MaterialsGroup)
  .add(AdminMaterialsGroup)
  .add(AdminChangelogGroup)
  .add(AdminAnnouncementsGroup)
  .add(QuestionsGroup)
  .add(AdminQuestionsGroup)
  .add(RaisedHandsGroup)
  .add(AdminRaisedHandsGroup)
  .add(ClassroomGroup)
  .prefix("/api") {}
