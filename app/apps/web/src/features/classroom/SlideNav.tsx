import type { Position, SlidesManifest } from "@kurasu/slides/messages";
import { next, previous } from "@kurasu/slides/navigation";

import { Icon } from "../../ui/Icon.tsx";

interface Props {
  manifest: SlidesManifest;
  position: Position;
  onNavigate: (position: Position) => void;
}

export const SlideNav = ({ manifest, position, onNavigate }: Props) => (
  <>
    <button
      type="button"
      title="Anterior"
      aria-label="Anterior"
      onClick={() => onNavigate(previous(position))}
      className="pill-button px-3 max-[600px]:px-2.5"
    >
      <Icon name="chevron-left" size={18} />
    </button>
    <span className="min-w-[60px] text-center text-sm text-muted max-[600px]:min-w-10 max-[600px]:text-[13px]">
      {position.slide} / {manifest.slides.length}
    </span>
    <button
      type="button"
      title="Siguiente"
      aria-label="Siguiente"
      onClick={() => onNavigate(next(position, manifest))}
      className="pill-button px-3 max-[600px]:px-2.5"
    >
      <Icon name="chevron-right" size={18} />
    </button>
  </>
);
