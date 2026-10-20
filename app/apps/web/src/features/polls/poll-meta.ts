import type { Poll } from "@kurasu/contract/polls";

const answers = (count: number) => `${count} ${count === 1 ? "respuesta" : "respuestas"}`;

export const pollMeta = (poll: Poll) => {
  if (poll.status === "closed") {
    return `Cerrada · ${answers(poll.results?.count ?? 0)}`;
  }

  return poll.results == null
    ? "Abierta"
    : `${poll.myResponse == null ? "Abierta" : "Votaste"} · ${answers(poll.results.count)}`;
};
