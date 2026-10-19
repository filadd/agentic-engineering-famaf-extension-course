import type { Session } from "@kurasu/contract/sessions";

import { SlideStage } from "./SlideStage.tsx";
import { useSessionSlides } from "./useSessionSlides.ts";

interface Props {
  session: Session;
}

export const PresentedSlides = ({ session }: Props) => {
  const html = useSessionSlides(session.id);

  return (
    <SlideStage html={html} position={{ slide: session.currentSlide, step: session.currentStep }} />
  );
};
