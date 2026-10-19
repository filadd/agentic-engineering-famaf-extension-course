import type { Position, SlidesManifest } from "@kurasu/slides/messages";
import { useState } from "react";
import type { ReactNode } from "react";

import { SlideNav } from "./SlideNav.tsx";
import { SlidesFrame } from "./SlidesFrame.tsx";

interface Props {
  html: string | null;
  position: Position;
  onNavigate?: (position: Position) => void;
  controls?: ReactNode;
}

interface Loaded {
  html: string;
  manifest: SlidesManifest;
}

// The slide area both sides share. Without `onNavigate` it only shows the
// slide, as the presenting tab does.
export const SlideStage = ({ html, position, onNavigate, controls }: Props) => {
  const [loaded, setLoaded] = useState<Loaded | null>(null);

  const manifest = loaded != null && loaded.html === html ? loaded.manifest : null;

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 max-[600px]:flex-none max-[600px]:gap-2">
      <div className="min-h-0 flex-1 max-[600px]:aspect-[16/10] max-[600px]:flex-none">
        {html == null ? (
          <div className="grid size-full place-items-center rounded-[18px] border-[1.5px] border-line text-muted">
            Esta sesión todavía no tiene slides.
          </div>
        ) : (
          <SlidesFrame
            key={html}
            html={html}
            position={position}
            ready={manifest != null}
            onManifest={(next) => setLoaded({ html, manifest: next })}
          />
        )}
      </div>
      {controls == null && onNavigate == null ? null : (
        <div className="flex items-center gap-2.5 max-[600px]:gap-1.5">
          {manifest == null || onNavigate == null ? null : (
            <SlideNav manifest={manifest} position={position} onNavigate={onNavigate} />
          )}
          {controls}
        </div>
      )}
    </div>
  );
};
