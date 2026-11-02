import type { SessionSummary } from "@kurasu/contract/sessions";
import { useEffect, useRef, useState } from "react";

import { EnterClassroomButton } from "./EnterClassroomButton.tsx";
import { railLook } from "./rail-look.ts";
import { SessionCard } from "./SessionCard.tsx";
import { SessionLinks } from "./SessionLinks.tsx";
import { SessionRail } from "./SessionRail.tsx";
import { SessionRailNode } from "./SessionRailNode.tsx";

interface Props {
  sessions: ReadonlyArray<SessionSummary>;
  featuredPosition?: number | undefined;
  initialOpenId?: string | undefined;
}

// A link to one of the sessions, such as the one of an announcement mail, opens
// its card and brings it to the middle of the screen. An id that is not among
// them opens nothing.
export const AllSessions = ({ sessions, featuredPosition, initialOpenId }: Props) => {
  const [openId, setOpenId] = useState<string | null>(initialOpenId ?? null);

  const linkedCard = useRef<HTMLElement>(null);

  useEffect(() => {
    linkedCard.current?.scrollIntoView({ block: "center" });
  }, []);

  return (
    <SessionRail
      sessions={sessions}
      openId={openId}
      onOpen={setOpenId}
      renderNode={(session) => <SessionRailNode look={railLook(session, featuredPosition)} />}
      renderCard={(session, state) => (
        <SessionCard
          ref={session.id === initialOpenId ? linkedCard : undefined}
          session={session}
          open={state.open}
          onToggle={state.onToggle}
          body={
            <div>
              <SessionLinks sessionId={session.id} featured={session.featured} />
              <p className="mt-3 leading-[1.45]">{session.summary}</p>
              {session.featured ? <EnterClassroomButton /> : null}
            </div>
          }
        />
      )}
    />
  );
};
