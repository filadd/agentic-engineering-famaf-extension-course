import type { Position, SlidesManifest } from "./messages.ts";

const stepsOf = (manifest: SlidesManifest, slide: number) => manifest.slides[slide - 1]?.steps ?? 1;

export const next = (position: Position, manifest: SlidesManifest): Position => {
  if (position.step < stepsOf(manifest, position.slide)) {
    return { slide: position.slide, step: position.step + 1 };
  }

  return position.slide < manifest.slides.length
    ? { slide: position.slide + 1, step: 1 }
    : position;
};

// Going back to the previous slide shows it from its first step, as going
// forward does.
export const previous = (position: Position): Position => {
  if (position.step > 1) {
    return { slide: position.slide, step: position.step - 1 };
  }

  return position.slide > 1 ? { slide: position.slide - 1, step: 1 } : position;
};

export const samePosition = (a: Position, b: Position) => a.slide === b.slide && a.step === b.step;
