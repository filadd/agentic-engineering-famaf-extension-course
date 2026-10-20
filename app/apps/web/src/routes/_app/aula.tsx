import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { StudentClassroom } from "../../features/classroom/StudentClassroom.tsx";
import { StudentClassroomSkeleton } from "../../features/classroom/StudentClassroomSkeleton.tsx";
import { useSessions } from "../../features/sessions/useSessions.ts";

// The student only enters the classroom of the highlighted session. The
// session entered stays fixed: if another one becomes the highlighted one, or
// none is left, the student goes back home. Until the list arrives, the
// classroom shows in skeleton.
const ClassroomRoute = () => {
  const navigate = useNavigate();
  const sessions = useSessions();

  const [entered, setEntered] = useState<string>();

  const highlighted = sessions.data?.at(-1)?.id;

  if (entered == null && highlighted != null) {
    setEntered(highlighted);
  }

  useEffect(() => {
    if (sessions.data != null && (highlighted == null || highlighted !== entered)) {
      void navigate({ to: "/" });
    }
  }, [entered, highlighted, navigate, sessions.data]);

  return entered == null ? (
    <StudentClassroomSkeleton />
  ) : (
    <StudentClassroom key={entered} sessionId={entered} />
  );
};

export const Route = createFileRoute("/_app/aula")({ component: ClassroomRoute });
