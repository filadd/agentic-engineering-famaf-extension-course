import type { Material } from "@kurasu/contract/materials";

const material = (n: number, name: string, size: number, contentType: string): Material => ({
  id: `example-material-${n}`,
  sessionId: "example-session",
  name,
  isSlides: false,
  size,
  contentType,
});

// What a skeleton draws in place of the material, with names of the usual
// length.
export const materialExamples: ReadonlyArray<Material> = [
  material(1, "Guía de la sesión.pdf", 480 * 1024, "application/pdf"),
  material(2, "Slides de la sesión.html", 96 * 1024, "text/html"),
  material(3, "Ejercicios resueltos.zip", 2.4 * 1024 * 1024, "application/zip"),
];
