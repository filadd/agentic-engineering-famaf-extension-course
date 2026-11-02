import type { Poll } from "@kurasu/contract/polls";
import type { Question } from "@kurasu/contract/questions";
import type { SessionSummary } from "@kurasu/contract/sessions";

import { ActivePolls } from "../polls/ActivePolls.tsx";
import { FeaturedQuestionsCard } from "../questions/FeaturedQuestionsCard.tsx";
import { EnterClassroomButton } from "./EnterClassroomButton.tsx";
import { sessionColor } from "./session-color.ts";
import { SessionLinks } from "./SessionLinks.tsx";

interface Props {
  session: SessionSummary;
  polls: ReadonlyArray<Poll>;
  questions?: ReadonlyArray<Question> | undefined;
}

export const FeaturedSession = ({ session, polls, questions }: Props) => (
  <section
    aria-label={session.title}
    className={`skeleton-block mt-6 rounded-[22px] p-[26px] text-card-ink max-[600px]:mt-[18px] max-[600px]:p-[18px] ${sessionColor(session.position)}`}
  >
    <h2 className="text-[30px] font-bold max-[600px]:text-2xl">{session.title}</h2>
    <SessionLinks sessionId={session.id} featured />
    <p className="mt-3 leading-[1.45]">{session.summary}</p>
    {questions == null ? null : (
      <FeaturedQuestionsCard sessionId={session.id} questions={questions} />
    )}
    <ActivePolls polls={polls} />
    <EnterClassroomButton />
  </section>
);
