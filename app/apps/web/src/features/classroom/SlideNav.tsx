import type { Position, SlidesManifest } from "@kurasu/slides/messages";
import { next, previous } from "@kurasu/slides/navigation";

import { Button } from "../../ui/Button.tsx";
import { Icon } from "../../ui/Icon.tsx";

interface Props {
  manifest: SlidesManifest;
  position: Position;
  onNavigate: (position: Position) => void;
}

export const SlideNav = ({ manifest, position, onNavigate }: Props) => (
  <>
    <Button
      variant="pill"
      title="Anterior"
      aria-label="Anterior"
      onClick={() => onNavigate(previous(position))}
      className="px-3 max-[600px]:px-2.5"
    >
      <Icon name="chevron-left" size={18} />
    </Button>
    <span className="skeleton-block min-w-[60px] text-center text-sm text-muted max-[600px]:min-w-10 max-[600px]:text-[13px]">
      {position.slide} / {manifest.slides.length}
    </span>
    <Button
      variant="pill"
      title="Siguiente"
      aria-label="Siguiente"
      onClick={() => onNavigate(next(position, manifest))}
      className="px-3 max-[600px]:px-2.5"
    >
      <Icon name="chevron-right" size={18} />
    </Button>
  </>
);
