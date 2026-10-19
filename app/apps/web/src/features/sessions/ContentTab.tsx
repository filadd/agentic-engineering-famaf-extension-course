import type { Session } from "@kurasu/contract/sessions";

import { AdminMaterials } from "../materials/AdminMaterials.tsx";
import { DeleteSessionButton } from "./DeleteSessionButton.tsx";
import { EnabledSwitch } from "./EnabledSwitch.tsx";
import { SessionDetailsForm } from "./SessionDetailsForm.tsx";
import { useAdminSessions } from "./useAdminSessions.ts";

interface Props {
  session: Session;
}

// A session can only be deleted while it is disabled.
export const ContentTab = ({ session }: Props) => {
  const sessions = useAdminSessions();

  const number = (sessions.data ?? []).findIndex((each) => each.id === session.id) + 1;

  return (
    <div className="flex max-w-[760px] flex-col gap-[18px]">
      <section aria-label="La sesión" className="rounded-[22px] bg-peach p-[22px] text-coal">
        {number === 0 ? null : (
          <div className="text-sm opacity-75">
            Sesión {number} de {sessions.data?.length}
          </div>
        )}
        <SessionDetailsForm key={`${session.title}|${session.summary}`} session={session} />
        <EnabledSwitch session={session} />
        {session.enabled === true ? null : <DeleteSessionButton session={session} />}
      </section>
      <AdminMaterials sessionId={session.id} />
    </div>
  );
};
