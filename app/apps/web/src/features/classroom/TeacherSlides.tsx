import type { Session } from "@kurasu/contract/sessions";

import { useAdminMaterials } from "../materials/useAdminMaterials.ts";
import { useSlidesMaterial } from "../materials/useSlidesMaterial.ts";
import { useMoveSlide } from "../sessions/useMoveSlide.ts";
import { PresentButton } from "./PresentButton.tsx";
import { SlideStage } from "./SlideStage.tsx";

interface Props {
  session: Session;
}

// The teacher drives the session's position: each move is saved, and the
// classroom tells the students.
export const TeacherSlides = ({ session }: Props) => {
  const materials = useAdminMaterials(session.id);
  const slides = useSlidesMaterial(materials.data);
  const move = useMoveSlide();

  return (
    <SlideStage
      html={slides?.html ?? null}
      position={{ slide: session.currentSlide, step: session.currentStep }}
      onNavigate={(position) => move.mutate({ id: session.id, position })}
      controls={<PresentButton sessionId={session.id} />}
    />
  );
};
