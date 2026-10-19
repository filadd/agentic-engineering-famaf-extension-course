import type { Session } from "@kurasu/contract/sessions";

import { useMoveSlide } from "../sessions/useMoveSlide.ts";
import { PresentButton } from "./PresentButton.tsx";
import { SlideStage } from "./SlideStage.tsx";
import { useSessionSlides } from "./useSessionSlides.ts";

interface Props {
  session: Session;
}

// The teacher drives the session's position: each move is saved, and the
// classroom tells the students.
export const TeacherSlides = ({ session }: Props) => {
  const html = useSessionSlides(session.id);
  const move = useMoveSlide();

  return (
    <SlideStage
      html={html}
      position={{ slide: session.currentSlide, step: session.currentStep }}
      onNavigate={(position) => move.mutate({ id: session.id, position })}
      controls={<PresentButton sessionId={session.id} />}
    />
  );
};
