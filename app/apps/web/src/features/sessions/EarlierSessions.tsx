import type { SessionSummary } from "@kurasu/contract/sessions";
import { useEffect, useRef, useState } from "react";

import { Icon } from "../../ui/Icon.tsx";
import { RailNode } from "./RailNode.tsx";
import { SessionCard } from "./SessionCard.tsx";
import { SessionLinks } from "./SessionLinks.tsx";
import { SessionRail } from "./SessionRail.tsx";

interface Props {
  sessions: ReadonlyArray<SessionSummary>;
  initialOpenId?: string | undefined;
}

// A link to one of the earlier sessions, such as the one of an announcement
// mail, opens its card and brings it to the middle of the screen. An id that is
// not among them opens nothing.
export const EarlierSessions = ({ sessions, initialOpenId }: Props) => {
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
      renderNode={() => (
        <RailNode look="done">
          <Icon name="check" size={20} />
        </RailNode>
      )}
      renderCard={(session, state) => (
        <SessionCard
          ref={session.id === initialOpenId ? linkedCard : undefined}
          session={session}
          open={state.open}
          onToggle={state.onToggle}
          body={
            <div>
              <SessionLinks sessionId={session.id} highlighted={false} />
              <p className="mt-3 leading-[1.45]">{session.summary}</p>
            </div>
          }
        />
      )}
    />
  );
};
