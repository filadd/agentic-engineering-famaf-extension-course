import type { Session } from "@kurasu/contract/sessions";

import { SkeletonOf } from "../../ui/SkeletonOf.tsx";
import { ChangelogColumn } from "../changelog/ChangelogColumn.tsx";
import { AdminMaterials } from "../materials/AdminMaterials.tsx";
import { DeleteSessionButton } from "./DeleteSessionButton.tsx";
import { EnabledSwitch } from "./EnabledSwitch.tsx";
import { FeaturedSwitch } from "./FeaturedSwitch.tsx";
import { sessionExamples } from "./session-examples.ts";
import { SessionDetailsForm } from "./SessionDetailsForm.tsx";
import { useFeaturedSession } from "./useFeaturedSession.ts";

interface Props {
  sessionId: string;
  session: Session | undefined;
}

const card = "rounded-[22px] bg-peach p-[22px] text-coal";

// A session can only be deleted while it is disabled. The pending changelog
// entries go in a column at the right, below the rest on a narrow screen.
export const ContentTab = ({ sessionId, session }: Props) => {
  const featured = useFeaturedSession();

  return (
    <div className="grid items-start gap-[18px] min-[900px]:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="flex flex-col gap-[18px]">
        {session == null || featured.isPending ? (
          <SkeletonOf>
            <section className={`skeleton-block ${card}`}>
              <SessionDetailsForm session={sessionExamples[0]} />
              <EnabledSwitch session={sessionExamples[0]} featured={undefined} />
              <FeaturedSwitch session={sessionExamples[0]} featured={undefined} />
            </section>
          </SkeletonOf>
        ) : (
          <section aria-label="La sesión" className={card}>
            <SessionDetailsForm key={`${session.title}|${session.summary}`} session={session} />
            <EnabledSwitch session={session} featured={featured.data} />
            <FeaturedSwitch session={session} featured={featured.data} />
            {session.enabled === true ? null : <DeleteSessionButton session={session} />}
          </section>
        )}
        <AdminMaterials sessionId={sessionId} />
      </div>
      <ChangelogColumn sessionId={sessionId} enabled={session?.enabled} />
    </div>
  );
};
