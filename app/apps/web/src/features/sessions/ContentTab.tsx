import type { Session } from "@kurasu/contract/sessions";

import { SkeletonOf } from "../../ui/SkeletonOf.tsx";
import { AdminMaterials } from "../materials/AdminMaterials.tsx";
import { DeleteSessionButton } from "./DeleteSessionButton.tsx";
import { EnabledSwitch } from "./EnabledSwitch.tsx";
import { sessionExamples } from "./session-examples.ts";
import { SessionDetailsForm } from "./SessionDetailsForm.tsx";
import { useAdminSessions } from "./useAdminSessions.ts";

interface Props {
  sessionId: string;
  session: Session | undefined;
}

const card = "rounded-[22px] bg-peach p-[22px] text-coal";

// A session can only be deleted while it is disabled.
export const ContentTab = ({ sessionId, session }: Props) => {
  const sessions = useAdminSessions();

  const number = (sessions.data ?? []).findIndex((each) => each.id === sessionId) + 1;

  return (
    <div className="flex max-w-[760px] flex-col gap-[18px]">
      {session == null ? (
        <SkeletonOf>
          <section className={`skeleton-block ${card}`}>
            <div className="text-sm opacity-75">Sesión 1 de 6</div>
            <SessionDetailsForm session={sessionExamples[0]} />
            <EnabledSwitch session={sessionExamples[0]} />
          </section>
        </SkeletonOf>
      ) : (
        <section aria-label="La sesión" className={card}>
          {sessions.data == null ? (
            <SkeletonOf>
              <div className="skeleton-block w-fit text-sm">Sesión 1 de 6</div>
            </SkeletonOf>
          ) : null}
          {number === 0 ? null : (
            <div className="text-sm opacity-75">
              Sesión {number} de {sessions.data?.length}
            </div>
          )}
          <SessionDetailsForm key={`${session.title}|${session.summary}`} session={session} />
          <EnabledSwitch session={session} />
          {session.enabled === true ? null : <DeleteSessionButton session={session} />}
        </section>
      )}
      <AdminMaterials sessionId={sessionId} />
    </div>
  );
};
