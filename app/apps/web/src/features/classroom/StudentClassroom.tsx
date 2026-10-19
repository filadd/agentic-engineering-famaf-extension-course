import { useNavigate } from "@tanstack/react-router";
import * as Predicate from "effect/Predicate";
import { useEffect } from "react";

import { Badge } from "../../ui/Badge.tsx";
import { Icon } from "../../ui/Icon.tsx";
import { HandIndicator } from "../hands/HandIndicator.tsx";
import { useRaisedHands } from "../hands/useRaisedHands.ts";
import { StudentMaterialList } from "../materials/StudentMaterialList.tsx";
import { AppHeader } from "../me/AppHeader.tsx";
import { BackButton } from "../me/BackButton.tsx";
import { useMe } from "../me/useMe.ts";
import { StudentPollsTab } from "../polls/StudentPollsTab.tsx";
import { usePolls } from "../polls/usePolls.ts";
import { StudentQuestions } from "../questions/StudentQuestions.tsx";
import { useSession } from "../sessions/useSession.ts";
import { ClassroomPanel } from "./ClassroomPanel.tsx";
import { StudentSlides } from "./StudentSlides.tsx";
import { useClassroom } from "./useClassroom.ts";

interface Props {
  sessionId: string;
}

export const StudentClassroom = ({ sessionId }: Props) => {
  const navigate = useNavigate();
  const me = useMe();
  const session = useSession(sessionId);
  const hands = useRaisedHands(sessionId);
  const activePolls = usePolls({ sessionId, status: "active" });
  const classroom = useClassroom(sessionId);

  // A disabled or deleted session answers 404: the student goes back home.
  useEffect(() => {
    if (Predicate.isTagged(session.error, "SessionNotFound")) {
      void navigate({ to: "/" });
    }
  }, [navigate, session.error]);

  const unvoted = (activePolls.data ?? []).filter((poll) => poll.myResponse == null).length;
  const pollsBadge = <Badge count={unvoted} label={`${unvoted} encuestas sin votar`} />;

  return (
    <main className="flex h-dvh flex-col overflow-hidden">
      <div className="px-8 pt-[26px] pb-1.5 max-[600px]:px-3.5 max-[600px]:pt-3.5 max-[600px]:pb-1">
        <AppHeader
          leading={<BackButton to="/" label="Volver a las sesiones" />}
          title={session.data?.title ?? ""}
        />
      </div>
      {classroom.reconnecting ? (
        <div
          role="status"
          className="mx-8 mt-2.5 flex items-center gap-2 rounded-xl bg-peach px-3.5 py-2 text-sm text-coal max-[600px]:mx-3.5"
        >
          <Icon name="wifi-off" size={18} />
          Se cortó la conexión. Reconectando…
        </div>
      ) : null}
      <div className="flex min-h-0 flex-1 max-[600px]:flex-col">
        <div className="flex min-w-0 flex-1 flex-col px-8 pt-3.5 pb-[22px] max-[600px]:flex-none max-[600px]:px-3.5 max-[600px]:pt-2 max-[600px]:pb-2.5">
          {session.data == null ? null : (
            <StudentSlides session={session.data} teacherPresent={classroom.teacherPresent} />
          )}
        </div>
        <ClassroomPanel
          people={classroom.people}
          meId={me.data?.id}
          hideable
          railBadge={pollsBadge}
          renderHand={(person) =>
            (hands.data ?? []).some((hand) => hand.userId === person.id) ? <HandIndicator /> : null
          }
          tabs={[
            {
              id: "polls",
              label: "Encuestas",
              icon: "chart-bar",
              badge: pollsBadge,
              content: <StudentPollsTab sessionId={sessionId} />,
            },
            {
              id: "questions",
              label: "Preguntas",
              icon: "chat-messages",
              content: <StudentQuestions sessionId={sessionId} readOnly={false} />,
            },
            {
              id: "material",
              label: "Material",
              icon: "download",
              content: <StudentMaterialList sessionId={sessionId} />,
            },
          ]}
        />
      </div>
    </main>
  );
};
