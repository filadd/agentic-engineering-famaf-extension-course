import type { SessionSummary } from "@kurasu/contract/sessions";
import { useState } from "react";

import { Icon } from "../../ui/Icon.tsx";
import { RailNode } from "./RailNode.tsx";
import { SessionCard } from "./SessionCard.tsx";
import { SessionLinks } from "./SessionLinks.tsx";
import { SessionRail } from "./SessionRail.tsx";

interface Props {
  sessions: ReadonlyArray<SessionSummary>;
}

export const EarlierSessions = ({ sessions }: Props) => {
  const [openId, setOpenId] = useState<string | null>(null);

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
