import type { Session } from "@kurasu/contract/sessions";

import { SkeletonOf } from "../../ui/SkeletonOf.tsx";
import { useAdminMaterials } from "../materials/useAdminMaterials.ts";
import { useSlidesMaterial } from "../materials/useSlidesMaterial.ts";
import { SlideStage } from "./SlideStage.tsx";

interface Props {
  session: Session;
}

export const PresentedSlides = ({ session }: Props) => {
  const materials = useAdminMaterials(session.id);
  const slides = useSlidesMaterial(materials.data);

  const position = { slide: session.currentSlide, step: session.currentStep };

  return materials.data == null || (slides != null && slides.html == null) ? (
    <SkeletonOf>
      <SlideStage html={null} position={position} />
    </SkeletonOf>
  ) : (
    <SlideStage html={slides?.html ?? null} position={position} />
  );
};
