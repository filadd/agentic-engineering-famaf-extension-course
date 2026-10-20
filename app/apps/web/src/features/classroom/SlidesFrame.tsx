import { goTo, waitForManifest } from "@kurasu/slides/frame";
import type { Position, SlidesManifest } from "@kurasu/slides/messages";
import * as Effect from "effect/Effect";
import * as Fiber from "effect/Fiber";
import { useEffect, useEffectEvent, useRef } from "react";

interface Props {
  html: string;
  position?: Position | null;
  onManifest: (manifest: SlidesManifest) => void;
  onInvalid?: () => void;
  hidden?: boolean;
  ready?: boolean;
}

// The teacher's HTML runs in an iframe with an opaque origin: its scripts run,
// but it sees neither the cookie nor the page. It only talks through the two
// messages of the slides protocol.
export const SlidesFrame = ({
  html,
  position,
  onManifest,
  onInvalid,
  hidden = false,
  ready = false,
}: Props) => {
  const frame = useRef<HTMLIFrameElement>(null);

  const announce = useEffectEvent((manifest: SlidesManifest) => onManifest(manifest));
  const reject = useEffectEvent(() => onInvalid?.());

  // Each HTML gets its own frame (the parent keys it by the HTML), so the
  // wait starts once per mount.
  useEffect(() => {
    const wait = Effect.runFork(
      Effect.suspend(() =>
        frame.current == null ? Effect.never : waitForManifest(frame.current),
      ).pipe(Effect.match({ onSuccess: announce, onFailure: reject })),
    );

    return () => {
      Effect.runFork(Fiber.interrupt(wait));
    };
  }, []);

  useEffect(() => {
    if (frame.current != null && ready && position != null) {
      goTo(frame.current, position);
    }
  }, [ready, position]);

  return (
    <iframe
      ref={frame}
      title="Slides"
      sandbox="allow-scripts"
      srcDoc={html}
      hidden={hidden}
      className="size-full rounded-[18px] border-[1.5px] border-line bg-paper max-[600px]:rounded-[14px]"
    />
  );
};
