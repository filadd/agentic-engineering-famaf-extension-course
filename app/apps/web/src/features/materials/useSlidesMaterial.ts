import type { Material } from "@kurasu/contract/materials";

import { useMaterialFile } from "./useMaterialFile.ts";

// The session's slides among its materials, with their HTML once it arrives.
// Null without slides, and the file is not asked for until there are some.
export const useSlidesMaterial = (materials: ReadonlyArray<Material> | undefined) => {
  const slides = materials?.find((material) => material.isSlides);
  const file = useMaterialFile(slides?.id ?? "", { enabled: slides != null });

  return slides == null ? null : { id: slides.id, html: file.data ?? null };
};
