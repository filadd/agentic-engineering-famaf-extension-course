import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as Schema from "effect/Schema";

import { TeacherClassroom } from "../../../features/classroom/TeacherClassroom.tsx";
import { useClassroom } from "../../../features/classroom/useClassroom.ts";
import { useAdminRaisedHands } from "../../../features/hands/useAdminRaisedHands.ts";
import { AppHeader } from "../../../features/me/AppHeader.tsx";
import { BackButton } from "../../../features/me/BackButton.tsx";
import { AdminPollsTab } from "../../../features/polls/AdminPollsTab.tsx";
import { useNewQuestions } from "../../../features/questions/useNewQuestions.ts";
import { ContentTab } from "../../../features/sessions/ContentTab.tsx";
import { sessionExamples } from "../../../features/sessions/session-examples.ts";
import { sessionTabOf } from "../../../features/sessions/session-tab.ts";
import { SessionTabs } from "../../../features/sessions/SessionTabs.tsx";
import { useAdminSession } from "../../../features/sessions/useAdminSession.ts";
import { useLocalUi } from "../../../helpers/local-ui/useLocalUi.ts";
import { SkeletonOf } from "../../../ui/SkeletonOf.tsx";

const SessionSearch = Schema.Struct({ tab: Schema.optional(Schema.String) });

// The teacher is present in the classroom from any tab of the session, so the
// Aula tab can show what arrives while they are elsewhere.
const AdminSessionRoute = () => {
  const { id } = Route.useParams();
  const search = Route.useSearch();
  const navigate = useNavigate();

  const session = useAdminSession(id);
  const classroom = useClassroom(id);
  const hands = useAdminRaisedHands(id);
  const [ui] = useLocalUi("kurasu:classroom");

  const tab = sessionTabOf(search.tab);
  const newQuestions = useNewQuestions(id, tab === "aula");
  const newInPanel = useNewQuestions(id, tab === "aula" && ui.tab === "questions");

  return (
    <main className="flex h-dvh flex-col overflow-hidden">
      <div className="px-8 pt-[26px] pb-1">
        <AppHeader
          leading={<BackButton to="/admin" label="Volver a las sesiones" />}
          title={
            session.data == null ? (
              <SkeletonOf>
                <span className="skeleton-block">{sessionExamples[0].title}</span>
              </SkeletonOf>
            ) : (
              session.data.title
            )
          }
        />
      </div>
      <SessionTabs
        tab={tab}
        onChange={(next) => void navigate({ to: ".", search: { tab: next } })}
        newQuestions={newQuestions}
        raisedHands={hands.data?.length ?? 0}
      />
      <div className="flex min-h-0 flex-1 flex-col">
        {tab === "aula" ? (
          <TeacherClassroom
            sessionId={id}
            session={session.data}
            people={classroom.people}
            newQuestions={newInPanel}
          />
        ) : (
          <div className="flex-1 overflow-auto pt-[18px] pr-8 pb-7 pl-[86px]">
            {tab === "contenido" ? (
              <ContentTab sessionId={id} session={session.data} />
            ) : (
              <AdminPollsTab sessionId={id} />
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export const Route = createFileRoute("/_app/admin/sesiones/$id")({
  validateSearch: Schema.toStandardSchemaV1(SessionSearch),
  component: AdminSessionRoute,
});
