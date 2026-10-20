import { createFileRoute, Navigate } from "@tanstack/react-router";

import { AppHeader } from "../../features/me/AppHeader.tsx";
import { Greeting } from "../../features/me/Greeting.tsx";
import { useMe } from "../../features/me/useMe.ts";
import { usePolls } from "../../features/polls/usePolls.ts";
import { EarlierSessions } from "../../features/sessions/EarlierSessions.tsx";
import { HighlightedSession } from "../../features/sessions/HighlightedSession.tsx";
import { sessionExamples } from "../../features/sessions/session-examples.ts";
import { useSessions } from "../../features/sessions/useSessions.ts";
import { SkeletonOf } from "../../ui/SkeletonOf.tsx";

// The highlighted session is the last enabled one; the earlier ones go below,
// the newest first. Until /api/me says who entered, the page draws the
// student's skeleton without asking for the student's lists, which the
// teacher cannot read.
const HomeRoute = () => {
  const me = useMe();

  const student = me.data?.role === "student";
  const sessions = useSessions({ enabled: student });
  const activePolls = usePolls({ status: "active" }, { enabled: student });

  const highlighted = sessions.data?.at(-1);
  const earlier = sessions.data?.slice(0, -1).toReversed() ?? [];

  if (me.data?.role === "teacher") {
    return <Navigate to="/admin" />;
  }

  return (
    <main className="px-12 pt-8 pb-10 max-[600px]:px-4 max-[600px]:pt-5 max-[600px]:pb-8">
      <AppHeader title={<Greeting />} />
      {sessions.data == null ? (
        <SkeletonOf>
          <HighlightedSession session={sessionExamples[2]} polls={[]} />
        </SkeletonOf>
      ) : null}
      {sessions.data != null && highlighted == null ? (
        <p className="mt-[18px] text-muted">
          Todavía no hay sesiones habilitadas. Cuando el profe habilite la primera, aparece acá
          arriba.
        </p>
      ) : null}
      {highlighted == null ? null : (
        <HighlightedSession
          session={highlighted}
          polls={activePolls.data?.filter((poll) => poll.sessionId === highlighted.id)}
        />
      )}
      {sessions.data != null && earlier.length === 0 ? null : (
        <section aria-label="Sesiones anteriores">
          <h2 className="mt-7 text-lg font-bold max-[600px]:mt-6 max-[600px]:text-[17px]">
            Sesiones anteriores
          </h2>
          {sessions.data == null ? (
            <SkeletonOf>
              <EarlierSessions sessions={sessionExamples.slice(0, 2)} />
            </SkeletonOf>
          ) : (
            <EarlierSessions sessions={earlier} />
          )}
        </section>
      )}
    </main>
  );
};

export const Route = createFileRoute("/_app/")({ component: HomeRoute });
