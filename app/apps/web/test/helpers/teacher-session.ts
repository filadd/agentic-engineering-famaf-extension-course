import type { ChangelogEntry } from "@kurasu/contract/changelog";
import type { Person } from "@kurasu/contract/classroom";
import type { Material } from "@kurasu/contract/materials";
import type { AdminPoll } from "@kurasu/contract/polls";
import type { AdminQuestion } from "@kurasu/contract/questions";
import type { RaisedHand } from "@kurasu/contract/raised-hands";
import type { Session } from "@kurasu/contract/sessions";
import { http, HttpResponse } from "msw";

import { teacher } from "../fixtures/people.ts";
import { getJson, url } from "./api.ts";
import { changelogStore } from "./changelog-store.ts";
import { classroomSocket } from "./classroom-socket.ts";
import { sessionStore } from "./session-store.ts";

interface Options {
  sessions: ReadonlyArray<Session>;
  materials?: ReadonlyArray<Material>;
  files?: Readonly<Record<string, string>>;
  polls?: ReadonlyArray<AdminPoll>;
  questions?: ReadonlyArray<AdminQuestion>;
  hands?: ReadonlyArray<RaisedHand>;
  people?: ReadonlyArray<Person>;
  changelog?: ReadonlyArray<ChangelogEntry>;
}

// Everything the teacher's session page asks for as it opens.
export const teacherSession = ({
  sessions,
  materials = [],
  files = {},
  polls = [],
  questions = [],
  hands = [],
  people = [teacher],
  changelog = [],
}: Options) => {
  const store = sessionStore(sessions);
  const entries = changelogStore(changelog);
  const socket = classroomSocket({ people });

  const handlers = [
    getJson("/me", teacher),
    ...store.handlers,
    getJson("/admin/materials", materials),
    http.get(url("/materials/:id/file"), ({ params }) =>
      HttpResponse.text(files[String(params["id"])] ?? ""),
    ),
    getJson("/admin/polls", polls),
    getJson("/admin/questions", questions),
    getJson("/admin/raised-hands", hands),
    ...entries.handlers,
    socket.handler,
  ];

  return { handlers, store, socket, changelog: entries };
};
