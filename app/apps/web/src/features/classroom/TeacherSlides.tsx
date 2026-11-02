import type { Session } from "@kurasu/contract/sessions";

import { useAdminMaterials } from "../materials/useAdminMaterials.ts";
import { useSlidesMaterial } from "../materials/useSlidesMaterial.ts";
import { PresentButton } from "./PresentButton.tsx";
import { SlideStage } from "./SlideStage.tsx";
import { SlideStageSkeleton } from "./SlideStageSkeleton.tsx";
import { useSlideMoves } from "./useSlideMoves.ts";

interface Props {
  session: Session;
}

// The teacher drives the session's position: each move is saved, and the
// classroom tells the students.
export const TeacherSlides = ({ session }: Props) => {
  const materials = useAdminMaterials(session.id);
  const slides = useSlidesMaterial(materials.data);
  const moves = useSlideMoves(session);

  const controls = <PresentButton sessionId={session.id} />;

  return materials.data == null || (slides != null && slides.html == null) ? (
    <SlideStageSkeleton controls={controls} />
  ) : (
    <SlideStage
      html={slides?.html ?? null}
      position={moves.position}
      onNavigate={moves.navigate}
      controls={controls}
    />
  );
};
