import type { Session } from "@kurasu/contract/sessions";
import type { Position } from "@kurasu/slides/messages";

export const positionOf = (session: Session): Position => ({
  slide: session.currentSlide,
  step: session.currentStep,
});
