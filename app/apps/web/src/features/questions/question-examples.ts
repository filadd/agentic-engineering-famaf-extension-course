import type { AdminQuestion } from "@kurasu/contract/questions";

const question = (n: number, body: string, votes: number): AdminQuestion => ({
  id: `example-question-${n}`,
  sessionId: "example-session",
  body,
  votes,
  myVote: false,
  mine: false,
  answered: false,
});

// What a skeleton draws in place of the questions, with the usual length.
export const questionExamples: ReadonlyArray<AdminQuestion> = [
  question(1, "¿Cómo sabemos cuándo conviene planificar antes de pedirle código al agente?", 6),
  question(2, "¿El plan lo escribimos nosotros o se lo pedimos al agente?", 4),
  question(3, "¿Qué pasa si el agente no sigue el plan?", 2),
];
