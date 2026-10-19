import type { Session } from "@kurasu/contract/sessions";

import { SkeletonOf } from "../../ui/SkeletonOf.tsx";
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

  const position = { slide: session.currentSlide, step: session.currentStep };
  const controls = <PresentButton sessionId={session.id} />;

  return materials.data == null || (slides != null && slides.html == null) ? (
    <SkeletonOf>
      <SlideStage html={null} position={position} controls={controls} />
    </SkeletonOf>
  ) : (
    <SlideStage
      html={slides?.html ?? null}
      position={position}
      onNavigate={(next) => move.mutate({ id: session.id, position: next })}
      controls={controls}
    />
  );
};
