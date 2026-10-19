import { useNavigate } from "@tanstack/react-router";
import * as Predicate from "effect/Predicate";
import { useEffect } from "react";

import { Badge } from "../../ui/Badge.tsx";
import { Icon } from "../../ui/Icon.tsx";
import { SkeletonOf } from "../../ui/SkeletonOf.tsx";
import { HandButton } from "../hands/HandButton.tsx";
import { HandIndicator } from "../hands/HandIndicator.tsx";
import { useRaisedHands } from "../hands/useRaisedHands.ts";
import { StudentMaterialList } from "../materials/StudentMaterialList.tsx";
import { AppHeader } from "../me/AppHeader.tsx";
import { BackButton } from "../me/BackButton.tsx";
import { useMe } from "../me/useMe.ts";
import { StudentPollsTab } from "../polls/StudentPollsTab.tsx";
import { usePolls } from "../polls/usePolls.ts";
import { StudentQuestions } from "../questions/StudentQuestions.tsx";
import { sessionExamples } from "../sessions/session-examples.ts";
import { useSession } from "../sessions/useSession.ts";
import { ClassroomLayout } from "./ClassroomLayout.tsx";
import { ClassroomPanel } from "./ClassroomPanel.tsx";
import { SlideStage } from "./SlideStage.tsx";
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
    <ClassroomLayout
      header={
        <AppHeader
          leading={<BackButton to="/" label="Volver a las sesiones" />}
          title={
            session.data == null ? (
              <SkeletonOf>
                <span>{sessionExamples[0].title}</span>
              </SkeletonOf>
            ) : (
              session.data.title
            )
          }
        />
      }
      notice={
        classroom.reconnecting ? (
          <div
            role="status"
            className="mx-8 mt-2.5 flex items-center gap-2 rounded-xl bg-peach px-3.5 py-2 text-sm text-coal max-[600px]:mx-3.5"
          >
            <Icon name="wifi-off" size={18} />
            Se cortó la conexión. Reconectando…
          </div>
        ) : null
      }
      stage={
        session.data == null ? (
          <SkeletonOf>
            <SlideStage
              html={null}
              position={{ slide: 1, step: 1 }}
              controls={
                <>
                  <span className="ml-auto" />
                  <HandButton sessionId={sessionId} />
                </>
              }
            />
          </SkeletonOf>
        ) : (
          <StudentSlides session={session.data} teacherPresent={classroom.teacherPresent} />
        )
      }
      panel={
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
      }
    />
  );
};
