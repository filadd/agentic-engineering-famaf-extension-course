import type { Session } from "@kurasu/contract/sessions";

import { useAdminMaterials } from "../materials/useAdminMaterials.ts";
import { useSlidesMaterial } from "../materials/useSlidesMaterial.ts";
import { SlideStage } from "./SlideStage.tsx";

interface Props {
  session: Session;
}

export const PresentedSlides = ({ session }: Props) => {
  const materials = useAdminMaterials(session.id);
  const slides = useSlidesMaterial(materials.data);

  return (
    <SlideStage
      html={slides?.html ?? null}
      position={{ slide: session.currentSlide, step: session.currentStep }}
    />
  );
};
