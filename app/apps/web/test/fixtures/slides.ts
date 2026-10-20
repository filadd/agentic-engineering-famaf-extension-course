import guideDataUrl from "./guia.pdf?inline";
import emptyHtml from "./slides-empty.html?raw";
import noManifestHtml from "./slides-no-manifest.html?raw";
import validHtml from "./slides-valid.html?raw";

export const validSlides = validHtml;
export const slidesWithoutManifest = noManifestHtml;
export const emptySlides = emptyHtml;

export const guidePdf = Uint8Array.from(atob(guideDataUrl.split(",")[1] ?? ""), (char) =>
  char.charCodeAt(0),
);
