import type { SessionSummary } from "@kurasu/contract/sessions";
import { Fragment } from "react";
import type { ReactNode } from "react";

interface CardState {
  open: boolean;
  onToggle: () => void;
}

interface Props {
  sessions: ReadonlyArray<SessionSummary>;
  openId: string | null;
  onOpen: (id: string | null) => void;
  renderNode: (session: SessionSummary) => ReactNode;
  renderCard: (session: SessionSummary, state: CardState) => ReactNode;
  trailing?: ReactNode;
}

// The path of "Todas las sesiones": a rail of nodes and one card per step,
// with one card open at a time.
export const SessionRail = ({
  sessions,
  openId,
  onOpen,
  renderNode,
  renderCard,
  trailing,
}: Props) => (
  <div className="mt-3 grid grid-cols-[56px_1fr] gap-x-4 max-[600px]:grid-cols-[34px_1fr] max-[600px]:gap-x-2.5">
    {sessions.map((session, index) => (
      <Fragment key={session.id}>
        <div className="flex flex-col items-center">
          {renderNode(session)}
          {index < sessions.length - 1 || trailing != null ? (
            <div className="min-h-3.5 w-1 flex-1 rounded-sm bg-line" />
          ) : null}
        </div>
        <div className="min-w-0 pb-3">
          {renderCard(session, {
            open: openId === session.id,
            onToggle: () => onOpen(openId === session.id ? null : session.id),
          })}
        </div>
      </Fragment>
    ))}
    {trailing}
  </div>
);
