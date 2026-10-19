import { createFileRoute, redirect } from "@tanstack/react-router";

import { AppHeader } from "../../features/me/AppHeader.tsx";
import { useMe } from "../../features/me/useMe.ts";
import { EarlierSessions } from "../../features/sessions/EarlierSessions.tsx";
import { HighlightedSession } from "../../features/sessions/HighlightedSession.tsx";
import { useSessions } from "../../features/sessions/useSessions.ts";

// The highlighted session is the last enabled one; the earlier ones go below,
// the newest first.
const HomeRoute = () => {
  const me = useMe();
  const sessions = useSessions();

  const highlighted = sessions.data?.at(-1);
  const earlier = sessions.data?.slice(0, -1).toReversed() ?? [];

  return (
    <main className="px-12 pt-8 pb-10 max-[600px]:px-4 max-[600px]:pt-5 max-[600px]:pb-8">
      <AppHeader title={`Hola, ${me.data?.name ?? ""}`} />
      {sessions.data != null && highlighted == null ? (
        <p className="mt-[18px] text-muted">
          Todavía no hay sesiones habilitadas. Cuando el profe habilite la primera, aparece acá
          arriba.
        </p>
      ) : null}
      {highlighted == null ? null : <HighlightedSession session={highlighted} />}
      {earlier.length === 0 ? null : <EarlierSessions sessions={earlier} />}
    </main>
  );
};

export const Route = createFileRoute("/_app/")({
  beforeLoad: ({ context }) => {
    if (context.me.role === "teacher") {
      throw redirect({ to: "/admin" });
    }
  },
  component: HomeRoute,
});
