import { createFileRoute } from "@tanstack/react-router";

import { PresentedSlides } from "../../../features/classroom/PresentedSlides.tsx";
import { useClassroom } from "../../../features/classroom/useClassroom.ts";
import { useAdminSession } from "../../../features/sessions/useAdminSession.ts";

// The tab the teacher projects: the session's current slide, without
// controls, following each move through the classroom.
const PresentRoute = () => {
  const { id } = Route.useParams();

  const session = useAdminSession(id);

  useClassroom(id);

  return (
    <main className="flex h-dvh flex-col p-4">
      {session.data == null ? null : <PresentedSlides session={session.data} />}
    </main>
  );
};

export const Route = createFileRoute("/_app/admin/presentar/$id")({ component: PresentRoute });
