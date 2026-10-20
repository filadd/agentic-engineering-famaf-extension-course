import { createFileRoute } from "@tanstack/react-router";

import { AppHeader } from "../../../features/me/AppHeader.tsx";
import { Greeting } from "../../../features/me/Greeting.tsx";
import { AdminHighlighted } from "../../../features/sessions/AdminHighlighted.tsx";
import { AdminSessionRail } from "../../../features/sessions/AdminSessionRail.tsx";
import { sessionExamples } from "../../../features/sessions/session-examples.ts";
import { useAdminSessions } from "../../../features/sessions/useAdminSessions.ts";
import { UsersButton } from "../../../features/sessions/UsersButton.tsx";
import { SkeletonOf } from "../../../ui/SkeletonOf.tsx";

const AdminHomeRoute = () => {
  const sessions = useAdminSessions();

  const all = sessions.data ?? [];
  const highlighted = all.findLast((session) => session.enabled === true);

  return (
    <main className="px-12 pt-8 pb-10">
      <AppHeader title={<Greeting />} actions={<UsersButton />} />
      {sessions.data == null ? (
        <SkeletonOf>
          <AdminHighlighted session={sessionExamples[2]} number={3} total={3} />
        </SkeletonOf>
      ) : null}
      {sessions.data != null && all.length === 0 ? (
        <div className="mt-10 text-center text-muted">
          <h3 className="mb-1.5 text-[22px] font-bold text-ink">Todavía no hay sesiones</h3>
          Creá la primera desde la card de abajo.
        </div>
      ) : null}
      {all.length > 0 && highlighted == null ? (
        <p className="mt-[18px] text-muted">
          Todavía no habilitaste ninguna sesión: los estudiantes no ven nada.
        </p>
      ) : null}
      {highlighted == null ? null : (
        <AdminHighlighted
          session={highlighted}
          number={all.indexOf(highlighted) + 1}
          total={all.length}
        />
      )}
      <section aria-label="Todas las sesiones">
        <h2 className="mt-7 text-lg font-bold">Todas las sesiones</h2>
        {sessions.data == null ? (
          <SkeletonOf>
            <AdminSessionRail sessions={sessionExamples} highlightedId={sessionExamples[2].id} />
          </SkeletonOf>
        ) : (
          <AdminSessionRail sessions={all} highlightedId={highlighted?.id} />
        )}
      </section>
    </main>
  );
};

export const Route = createFileRoute("/_app/admin/")({ component: AdminHomeRoute });
