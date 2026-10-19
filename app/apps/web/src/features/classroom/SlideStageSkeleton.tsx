import type { SlidesManifest } from "@kurasu/slides/messages";
import type { ReactNode } from "react";

import { SkeletonOf } from "../../ui/SkeletonOf.tsx";
import { SlideNav } from "./SlideNav.tsx";
import { SlideStage } from "./SlideStage.tsx";

interface Props {
  controls: ReactNode;
}

const position = { slide: 1, step: 1 };

const manifest: SlidesManifest = {
  type: "kurasu:manifest",
  slides: Array.from({ length: 12 }, () => ({ steps: 1 })),
};

// The slide and its bar while the slides load. The bar draws the arrows and
// the position of an example deck, so it has the same controls as the real one.
export const SlideStageSkeleton = ({ controls }: Props) => (
  <SkeletonOf>
    <SlideStage
      html={null}
      position={position}
      controls={
        <>
          <SlideNav manifest={manifest} position={position} onNavigate={() => undefined} />
          {controls}
        </>
      }
    />
  </SkeletonOf>
);
