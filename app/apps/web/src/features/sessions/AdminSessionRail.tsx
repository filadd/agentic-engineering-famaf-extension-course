import type { SessionSummary } from "@kurasu/contract/sessions";
import { useState } from "react";

import { Icon } from "../../ui/Icon.tsx";
import { DragHandle } from "./DragHandle.tsx";
import { EnabledLabel } from "./EnabledLabel.tsx";
import { moveTo } from "./move-to.ts";
import { NewSessionCard } from "./NewSessionCard.tsx";
import { OpenSessionLink } from "./OpenSessionLink.tsx";
import { RailNode } from "./RailNode.tsx";
import { SessionCard } from "./SessionCard.tsx";
import { SessionRail } from "./SessionRail.tsx";
import { useReorderSessions } from "./useReorderSessions.ts";

interface Props {
  sessions: ReadonlyArray<SessionSummary>;
  highlightedId: string | undefined;
}

// Every session of the course, in order, dragged to reorder. The open card
// starts on the highlighted one.
export const AdminSessionRail = ({ sessions, highlightedId }: Props) => {
  const [openId, setOpenId] = useState<string | null>(highlightedId ?? null);
  const [dragged, setDragged] = useState<string | null>(null);
  const [over, setOver] = useState<string | null>(null);

  const reorder = useReorderSessions();

  const highlightedIndex = sessions.findIndex((session) => session.id === highlightedId);

  return (
    <SessionRail
      sessions={sessions}
      openId={openId}
      onOpen={setOpenId}
      renderNode={(session) => {
        const index = sessions.indexOf(session);
        const label = `Sesión ${index + 1}`;

        if (session.enabled !== true) {
          return (
            <span aria-label={label}>
              <RailNode look="locked">{index + 1}</RailNode>
            </span>
          );
        }

        return (
          <span aria-label={label}>
            {session.id === highlightedId ? (
              <RailNode look="live">{index + 1}</RailNode>
            ) : (
              <RailNode look={index < highlightedIndex ? "done" : "locked"}>
                <Icon name="check" size={20} />
              </RailNode>
            )}
          </span>
        );
      }}
      renderCard={(session, state) => (
        <div
          draggable
          onDragStart={() => setDragged(session.id)}
          onDragOver={(event) => {
            event.preventDefault();
            setOver(session.id);
          }}
          onDragEnd={() => {
            setDragged(null);
            setOver(null);
          }}
          onDrop={(event) => {
            event.preventDefault();

            if (dragged != null && dragged !== session.id) {
              reorder.mutate(
                moveTo(
                  sessions.map((each) => each.id),
                  dragged,
                  session.id,
                ),
              );
            }

            setDragged(null);
            setOver(null);
          }}
          className={`${dragged === session.id ? "opacity-40" : ""} ${
            over === session.id && dragged !== session.id
              ? "rounded-[22px] shadow-[0_-4px_0_#1f1b18]"
              : ""
          }`}
        >
          <SessionCard
            session={session}
            open={state.open}
            onToggle={state.onToggle}
            painted={session.enabled === true}
            handle={<DragHandle />}
            status={<EnabledLabel enabled={session.enabled === true} />}
            body={
              <p className="mt-3 leading-[1.45]">
                {session.summary === "" ? "Sin resumen todavía." : session.summary}
              </p>
            }
            actions={<OpenSessionLink sessionId={session.id} title={session.title} />}
          />
        </div>
      )}
      trailing={<NewSessionCard onCreated={setOpenId} />}
    />
  );
};
