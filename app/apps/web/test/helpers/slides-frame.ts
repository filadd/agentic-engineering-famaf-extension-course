import type { SlidesGo } from "@kurasu/slides/messages";
import { screen, waitFor } from "@testing-library/react";
import * as Schema from "effect/Schema";

// Looser than the protocol's schema, so a fixture can announce a manifest the
// web must reject.
const AnnouncedManifest = Schema.Struct({
  type: Schema.Literal("kurasu:manifest"),
  slides: Schema.Array(Schema.Struct({ steps: Schema.Finite })),
});

type AnnouncedManifest = typeof AnnouncedManifest.Type;

type PostedMessage = string | AnnouncedManifest | Pick<SlidesGo, "type" | "slide" | "step">;

// The fixtures write their manifest as JSON in a script tag and post it from
// there, so the test reads the same manifest.
const manifestOf = (html: string): AnnouncedManifest | undefined => {
  const json = new DOMParser().parseFromString(html, "text/html").getElementById("manifest");

  return json?.textContent == null
    ? undefined
    : Schema.decodeSync(Schema.fromJsonString(AnnouncedManifest))(json.textContent);
};

// happy-dom does not run the scripts of an iframe's srcdoc, so the test plays
// the slides' part: it announces the manifest written in the fixture, from the
// iframe's window, and records the positions the web sends to it.
export const slidesFrame = async () => {
  const frame = await waitFor(() => {
    const found = screen.getByTitle("Slides");

    if (!(found instanceof HTMLIFrameElement) || found.contentWindow == null) {
      throw new Error("The slides frame is not ready");
    }

    return found;
  });

  const goes: Array<Pick<SlidesGo, "slide" | "step">> = [];

  frame.contentWindow?.addEventListener("message", (event) => {
    const data: Partial<SlidesGo> = event.data;

    if (data.type === "kurasu:go" && data.slide != null && data.step != null) {
      goes.push({ slide: data.slide, step: data.step });
    }
  });

  return {
    frame,
    goes,
    lastGo: () => goes.at(-1),
    // The web starts listening once the frame mounts; a real iframe takes
    // longer than that to load its HTML, so the test waits a moment too.
    announce: async () => {
      await new Promise((resolve) => setTimeout(resolve, 20));

      const manifest = manifestOf(frame.srcdoc);

      if (manifest != null) {
        window.dispatchEvent(
          new MessageEvent("message", { data: manifest, source: frame.contentWindow }),
        );
      }
    },
    postFrom: (source: Window | null, data: PostedMessage) =>
      window.dispatchEvent(new MessageEvent("message", { data, source })),
  };
};
