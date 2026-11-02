import type { Poll } from "@kurasu/contract/polls";

import { countLabel } from "../../ui/count-label.ts";

export const answers = (count: number) => countLabel(count, "respuesta", "respuestas");

export const pollMeta = (poll: Poll) => {
  if (poll.type === "feedback") {
    return poll.status === "closed"
      ? "Encuesta de feedback · cerrada"
      : "Encuesta de feedback · se puede cambiar";
  }

  if (poll.status === "closed") {
    return `Cerrada · ${answers(poll.results?.count ?? 0)}`;
  }

  return poll.results == null
    ? "Abierta"
    : `${poll.myResponse == null ? "Abierta" : "Votaste"} · ${answers(poll.results.count)}`;
};
