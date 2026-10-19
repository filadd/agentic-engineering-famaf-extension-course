import { maxFileBytes } from "@kurasu/contract/materials";

export const slidesNotices = {
  checking: "Revisando que el HTML respete la API de las slides…",
  invalid:
    "Este HTML no respeta la API de las slides, así que no se puede usar como slides del aula. Podés subirlo como material.",
  tooLarge: `El archivo pesa más de ${maxFileBytes / (1024 * 1024)} MB, el máximo que se puede subir.`,
  failed: "No se pudo subir el archivo. Probá de nuevo.",
} as const;
