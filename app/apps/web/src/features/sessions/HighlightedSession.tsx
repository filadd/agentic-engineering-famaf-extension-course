import type { SessionSummary } from "@kurasu/contract/sessions";

import { ActivePolls } from "../polls/ActivePolls.tsx";
import { usePolls } from "../polls/usePolls.ts";
import { EnterClassroomButton } from "./EnterClassroomButton.tsx";
import { sessionColor } from "./session-color.ts";
import { SessionLinks } from "./SessionLinks.tsx";

interface Props {
  session: SessionSummary;
}

export const HighlightedSession = ({ session }: Props) => {
  const activePolls = usePolls({ status: "active" });

  return (
    <section
      aria-label={session.title}
      className={`mt-6 rounded-[22px] p-[26px] text-card-ink max-[600px]:mt-[18px] max-[600px]:p-[18px] ${sessionColor(session.position)}`}
    >
      <h2 className="text-[30px] font-bold max-[600px]:text-2xl">{session.title}</h2>
      <SessionLinks sessionId={session.id} highlighted />
      <p className="mt-3 leading-[1.45]">{session.summary}</p>
      <ActivePolls
        polls={(activePolls.data ?? []).filter((poll) => poll.sessionId === session.id)}
      />
      <EnterClassroomButton />
    </section>
  );
};
