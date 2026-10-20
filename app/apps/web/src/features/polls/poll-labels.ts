import type { PollStatus, PollType } from "@kurasu/contract/polls";

export const pollTypeLabels: Record<PollType, string> = {
  choice: "Opción múltiple",
  words: "Word cloud",
  scale: "Escala 1 a 5",
};

export const pollStatusLabels: Record<PollStatus, string> = {
  draft: "Borrador",
  active: "Activa",
  closed: "Cerrada",
};
