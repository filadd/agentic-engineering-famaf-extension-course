import { useAdminMaterials } from "../materials/useAdminMaterials.ts";
import { useMaterialFile } from "../materials/useMaterialFile.ts";

// The HTML of the session's slides as the teacher sees it, or null without
// slides.
export const useSessionSlides = (sessionId: string) => {
  const materials = useAdminMaterials(sessionId);
  const slides = materials.data?.find((material) => material.isSlides);
  const file = useMaterialFile(slides?.id ?? "", { enabled: slides != null });

  return slides == null ? null : (file.data ?? null);
};
