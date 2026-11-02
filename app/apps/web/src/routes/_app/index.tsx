import { createFileRoute, Navigate } from "@tanstack/react-router";
import * as Schema from "effect/Schema";

import { AppHeader } from "../../features/me/AppHeader.tsx";
import { Greeting } from "../../features/me/Greeting.tsx";
import { useMe } from "../../features/me/useMe.ts";
import { usePolls } from "../../features/polls/usePolls.ts";
import { FeaturedQuestions } from "../../features/questions/FeaturedQuestions.tsx";
import { AllSessions } from "../../features/sessions/AllSessions.tsx";
import { FeaturedSession } from "../../features/sessions/FeaturedSession.tsx";
import { findFeatured } from "../../features/sessions/find-featured.ts";
import { sessionExamples } from "../../features/sessions/session-examples.ts";
import { useSessions } from "../../features/sessions/useSessions.ts";
import { SkeletonOf } from "../../ui/SkeletonOf.tsx";

const HomeSearch = Schema.Struct({ sesion: Schema.optional(Schema.String) });

// The featured session is the one the teacher marked; every enabled session,
// the featured one included, goes below in the teacher's order. Until /api/me
// says who entered, the page draws the student's skeleton without asking for
// the student's lists, which the teacher cannot read.
const HomeRoute = () => {
  const search = Route.useSearch();
  const me = useMe();

  const student = me.data?.role === "student";
  const sessions = useSessions({ enabled: student });
  const featured = findFeatured(sessions.data);

  const activePolls = usePolls(
    { sessionId: featured?.id ?? "", status: "active" },
    { enabled: student && featured != null },
  );

  if (me.data?.role === "teacher") {
    return <Navigate to="/admin" />;
  }

  return (
    <main className="px-12 pt-8 pb-10 max-[600px]:px-4 max-[600px]:pt-5 max-[600px]:pb-8">
      <AppHeader title={<Greeting />} />
      {sessions.data == null ? (
        <SkeletonOf>
          <FeaturedSession session={sessionExamples[2]} polls={[]} />
        </SkeletonOf>
      ) : null}
      {sessions.data != null && sessions.data.length === 0 ? (
        <p className="mt-[18px] text-muted">
          Todavía no hay sesiones habilitadas. Cuando el profe habilite la primera, aparece acá
          arriba.
        </p>
      ) : null}
      {featured == null ? null : (
        <FeaturedSession
          session={featured}
          polls={activePolls.data}
          questions={
            featured.featuredQuestions ? <FeaturedQuestions sessionId={featured.id} /> : undefined
          }
        />
      )}
      {sessions.data != null && sessions.data.length === 0 ? null : (
        <section aria-label="Todas las sesiones">
          <h2 className="mt-7 text-lg font-bold max-[600px]:mt-6 max-[600px]:text-[17px]">
            Todas las sesiones
          </h2>
          {sessions.data == null ? (
            <SkeletonOf>
              <AllSessions sessions={sessionExamples.slice(0, 2)} />
            </SkeletonOf>
          ) : (
            <AllSessions
              sessions={sessions.data}
              featuredPosition={featured?.position}
              initialOpenId={search.sesion}
            />
          )}
        </section>
      )}
    </main>
  );
};

export const Route = createFileRoute("/_app/")({
  validateSearch: Schema.toStandardSchemaV1(HomeSearch),
  component: HomeRoute,
});
