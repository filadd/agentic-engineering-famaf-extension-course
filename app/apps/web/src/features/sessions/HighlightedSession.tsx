import type { Poll } from "@kurasu/contract/polls";
import type { SessionSummary } from "@kurasu/contract/sessions";

import { SkeletonOf } from "../../ui/SkeletonOf.tsx";
import { ActivePolls } from "../polls/ActivePolls.tsx";
import { pollExamples } from "../polls/poll-examples.ts";
import { EnterClassroomButton } from "./EnterClassroomButton.tsx";
import { sessionColor } from "./session-color.ts";
import { SessionLinks } from "./SessionLinks.tsx";

interface Props {
  session: SessionSummary;
  polls: ReadonlyArray<Poll> | undefined;
}

export const HighlightedSession = ({ session, polls }: Props) => (
  <section
    aria-label={session.title}
    className={`mt-6 rounded-[22px] p-[26px] text-card-ink max-[600px]:mt-[18px] max-[600px]:p-[18px] ${sessionColor(session.position)}`}
  >
    <h2 className="text-[30px] font-bold max-[600px]:text-2xl">{session.title}</h2>
    <SessionLinks sessionId={session.id} highlighted />
    <p className="mt-3 leading-[1.45]">{session.summary}</p>
    {polls == null ? (
      <SkeletonOf>
        <ActivePolls polls={[pollExamples[0]]} />
      </SkeletonOf>
    ) : (
      <ActivePolls polls={polls} />
    )}
    <EnterClassroomButton />
  </section>
);
