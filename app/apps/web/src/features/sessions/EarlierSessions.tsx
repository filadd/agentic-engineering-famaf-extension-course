import type { SessionSummary } from "@kurasu/contract/sessions";
import { useState } from "react";

import { Icon } from "../../ui/Icon.tsx";
import { SkeletonOf } from "../../ui/SkeletonOf.tsx";
import { RailNode } from "./RailNode.tsx";
import { SessionCard } from "./SessionCard.tsx";
import { SessionLinks } from "./SessionLinks.tsx";
import { SessionRail } from "./SessionRail.tsx";

interface Props {
  sessions: ReadonlyArray<SessionSummary>;
  loading?: boolean;
}

export const EarlierSessions = ({ sessions, loading = false }: Props) => {
  const [openId, setOpenId] = useState<string | null>(null);

  const rail = (
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

  return (
    <section aria-label="Sesiones anteriores">
      <h2 className="mt-7 text-lg font-bold max-[600px]:mt-6 max-[600px]:text-[17px]">
        Sesiones anteriores
      </h2>
      {loading ? <SkeletonOf>{rail}</SkeletonOf> : rail}
    </section>
  );
};
