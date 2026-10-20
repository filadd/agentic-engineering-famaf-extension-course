import type { Material } from "@kurasu/contract/materials";
import type { AdminPoll, Poll } from "@kurasu/contract/polls";
import type { AdminQuestion, Question } from "@kurasu/contract/questions";
import type { Session, SessionSummary } from "@kurasu/contract/sessions";

import { ulid } from "./ids.ts";

export const sessionSummary = (n: number, title: string): SessionSummary => ({
  id: ulid("Y", n),
  title,
  summary: `Resumen de ${title}.`,
  position: n,
});

export const sessionDetail = (summary: SessionSummary, slide = 1, step = 1): Session => ({
  ...summary,
  currentSlide: slide,
  currentStep: step,
});

export const vibeCoding = sessionSummary(1, "La experiencia vibe coding");
export const planning = sessionSummary(2, "Planificación y revisión");
export const tooling = sessionSummary(3, "Tooling y skills");

export const choicePoll = (sessionId: string, n = 1): Poll => ({
  id: ulid("P", n),
  sessionId,
  type: "choice",
  prompt: "¿Cuánto código de tu último proyecto escribió un agente?",
  options: ["Nada", "Algo", "La mitad", "Casi todo"],
  status: "active",
  myResponse: null,
  results: null,
});

export const scalePoll = (sessionId: string, n = 2): Poll => ({
  id: ulid("P", n),
  sessionId,
  type: "scale",
  prompt: "¿Qué tan cómodo te sentís revisando código generado?",
  scaleMinLabel: "Nada cómodo",
  scaleMaxLabel: "Muy cómodo",
  status: "active",
  myResponse: null,
  results: null,
});

export const wordsPoll = (sessionId: string, n = 3): Poll => ({
  id: ulid("P", n),
  sessionId,
  type: "words",
  prompt: "Una palabra para trabajar con agentes",
  status: "active",
  myResponse: null,
  results: null,
});

export const voted = (
  poll: Poll,
  myResponse: Poll["myResponse"],
  results: Poll["results"],
): Poll => ({
  ...poll,
  myResponse,
  results,
});

export const closed = (
  poll: Poll,
  myResponse: Poll["myResponse"],
  results: Poll["results"],
): Poll => ({
  ...poll,
  status: "closed",
  myResponse,
  results,
});

export const adminPoll = (
  poll: Poll,
  status: AdminPoll["status"],
  results: AdminPoll["results"],
): AdminPoll => {
  const { myResponse: _, ...rest } = poll;

  return { ...rest, status, results };
};

export const material = (
  n: number,
  sessionId: string,
  name: string,
  fields: Partial<Material> = {},
): Material => ({
  id: ulid("M", n),
  sessionId,
  name,
  isSlides: false,
  size: 480 * 1024,
  contentType: "application/pdf",
  ...fields,
});

export const question = (
  n: number,
  sessionId: string,
  body: string,
  fields: Partial<Question> = {},
): Question => ({
  id: ulid("Q", n),
  sessionId,
  body,
  votes: 0,
  myVote: false,
  mine: false,
  ...fields,
});

export const adminQuestion = (q: Question, answered = false): AdminQuestion => ({ ...q, answered });
