import * as Duration from "effect/Duration";
import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";

import { SlidesGo, SlidesInvalid, SlidesManifest } from "./messages.ts";
import type { Position } from "./messages.ts";

const ManifestType = Schema.Struct({ type: Schema.Literal("kurasu:manifest") });

const isManifestMessage = Schema.is(ManifestType);

const decodeManifest = Schema.decodeUnknownEffect(SlidesManifest);

const encodeGo = Schema.encodeSync(SlidesGo);

export const manifestTimeout = Duration.seconds(5);

// The slides run in an iframe with an opaque origin, so the only way to tell
// their messages apart from any other window's is the event source. A message
// that announces a manifest settles the wait, whether it decodes or not.
export const waitForManifest = (
  frame: HTMLIFrameElement,
  timeout: Duration.Input = manifestTimeout,
) =>
  Effect.callback<SlidesManifest, SlidesInvalid>((resume) => {
    const onMessage = (event: MessageEvent) => {
      if (
        event.source == null ||
        event.source !== frame.contentWindow ||
        !isManifestMessage(event.data)
      ) {
        return;
      }

      window.removeEventListener("message", onMessage);
      resume(decodeManifest(event.data).pipe(Effect.mapError(() => new SlidesInvalid())));
    };

    window.addEventListener("message", onMessage);

    return Effect.sync(() => window.removeEventListener("message", onMessage));
  }).pipe(
    Effect.timeoutOrElse({
      duration: timeout,
      orElse: () => Effect.fail(new SlidesInvalid()),
    }),
  );

export const goTo = (frame: HTMLIFrameElement, position: Position) => {
  frame.contentWindow?.postMessage(encodeGo({ type: "kurasu:go", ...position }), "*");
};
