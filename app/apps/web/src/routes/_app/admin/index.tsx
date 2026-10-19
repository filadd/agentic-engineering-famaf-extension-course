import { createFileRoute } from "@tanstack/react-router";

import { AppHeader } from "../../../features/me/AppHeader.tsx";
import { useMe } from "../../../features/me/useMe.ts";
import { AdminHighlighted } from "../../../features/sessions/AdminHighlighted.tsx";
import { AdminSessionRail } from "../../../features/sessions/AdminSessionRail.tsx";
import { useAdminSessions } from "../../../features/sessions/useAdminSessions.ts";
import { UsersButton } from "../../../features/sessions/UsersButton.tsx";

const AdminHomeRoute = () => {
  const me = useMe();
  const sessions = useAdminSessions();

  const all = sessions.data ?? [];
  const highlighted = all.findLast((session) => session.enabled === true);

  return (
    <main className="px-12 pt-8 pb-10">
      <AppHeader title={`Hola, ${me.data?.name ?? ""}`} actions={<UsersButton />} />
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
      {sessions.data == null ? null : (
        <section aria-label="Todas las sesiones">
          <h2 className="mt-7 text-lg font-bold">Todas las sesiones</h2>
          <AdminSessionRail sessions={all} highlightedId={highlighted?.id} />
        </section>
      )}
    </main>
  );
};

export const Route = createFileRoute("/_app/admin/")({ component: AdminHomeRoute });
