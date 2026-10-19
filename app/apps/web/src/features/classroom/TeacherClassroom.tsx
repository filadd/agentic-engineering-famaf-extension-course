import type { Person } from "@kurasu/contract/classroom";
import type { Session } from "@kurasu/contract/sessions";

import { Badge } from "../../ui/Badge.tsx";
import { LowerHandButton } from "../hands/LowerHandButton.tsx";
import { useAdminRaisedHands } from "../hands/useAdminRaisedHands.ts";
import { useMe } from "../me/useMe.ts";
import { AdminPanelPolls } from "../polls/AdminPanelPolls.tsx";
import { AdminQuestions } from "../questions/AdminQuestions.tsx";
import { ClassroomPanel } from "./ClassroomPanel.tsx";
import { TeacherSlides } from "./TeacherSlides.tsx";

interface Props {
  session: Session;
  people: ReadonlyArray<Person>;
  newQuestions: number;
}

// The Aula tab of the teacher: the slide to drive and the panel, which never
// hides, with the polls, the questions and who is present.
export const TeacherClassroom = ({ session, people, newQuestions }: Props) => {
  const me = useMe();
  const hands = useAdminRaisedHands(session.id);

  const raised = hands.data ?? [];

  return (
    <div className="flex min-h-0 flex-1">
      <div className="flex min-w-0 flex-1 flex-col pt-3.5 pr-8 pb-[22px] pl-[86px]">
        <TeacherSlides session={session} />
      </div>
      <ClassroomPanel
        people={people}
        meId={me.data?.id}
        hideable={false}
        presenceBadge={<Badge count={raised.length} label={`${raised.length} manos levantadas`} />}
        renderHand={(person) =>
          raised.some((hand) => hand.user.id === person.id) ? (
            <LowerHandButton sessionId={session.id} userId={person.id} name={person.name} />
          ) : null
        }
        tabs={[
          {
            id: "polls",
            label: "Encuestas",
            icon: "chart-bar",
            content: <AdminPanelPolls sessionId={session.id} />,
          },
          {
            id: "questions",
            label: "Preguntas",
            icon: "chat-messages",
            badge: <Badge count={newQuestions} label={`${newQuestions} preguntas nuevas`} />,
            content: <AdminQuestions sessionId={session.id} />,
          },
        ]}
      />
    </div>
  );
};
