import type { Session } from "@kurasu/contract/sessions";

import { SkeletonOf } from "../../ui/SkeletonOf.tsx";
import { ChangelogColumn } from "../changelog/ChangelogColumn.tsx";
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

// A session can only be deleted while it is disabled. The pending changelog
// entries go in a column at the right, below the rest on a narrow screen.
export const ContentTab = ({ sessionId, session }: Props) => {
  const sessions = useAdminSessions();

  const number = (sessions.data ?? []).findIndex((each) => each.id === sessionId) + 1;

  return (
    <div className="grid items-start gap-[18px] min-[900px]:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="flex flex-col gap-[18px]">
        {session == null || sessions.data == null ? (
          <SkeletonOf>
            <section className={`skeleton-block ${card}`}>
              <div className="text-sm opacity-75">Sesión 1 de 6</div>
              <SessionDetailsForm session={sessionExamples[0]} />
              <EnabledSwitch session={sessionExamples[0]} />
            </section>
          </SkeletonOf>
        ) : (
          <section aria-label="La sesión" className={card}>
            {number === 0 ? null : (
              <div className="text-sm opacity-75">
                Sesión {number} de {sessions.data.length}
              </div>
            )}
            <SessionDetailsForm key={`${session.title}|${session.summary}`} session={session} />
            <EnabledSwitch session={session} />
            {session.enabled === true ? null : <DeleteSessionButton session={session} />}
          </section>
        )}
        <AdminMaterials sessionId={sessionId} />
      </div>
      <ChangelogColumn sessionId={sessionId} enabled={session?.enabled} />
    </div>
  );
};
