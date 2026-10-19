import { createFileRoute } from "@tanstack/react-router";

import { PresentedSlides } from "../../../features/classroom/PresentedSlides.tsx";
import { SlideStage } from "../../../features/classroom/SlideStage.tsx";
import { useClassroom } from "../../../features/classroom/useClassroom.ts";
import { useAdminSession } from "../../../features/sessions/useAdminSession.ts";
import { SkeletonOf } from "../../../ui/SkeletonOf.tsx";

// The tab the teacher projects: the session's current slide, without
// controls, following each move through the classroom.
const PresentRoute = () => {
  const { id } = Route.useParams();

  const session = useAdminSession(id);

  useClassroom(id);

  return (
    <main className="flex h-dvh flex-col p-4">
      {session.data == null ? (
        <SkeletonOf>
          <SlideStage html={null} position={{ slide: 1, step: 1 }} />
        </SkeletonOf>
      ) : (
        <PresentedSlides session={session.data} />
      )}
    </main>
  );
};

export const Route = createFileRoute("/_app/admin/presentar/$id")({ component: PresentRoute });
