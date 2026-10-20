import type { Session } from "@kurasu/contract/sessions";

const session = (n: number, title: string, summary: string): Session => ({
  id: `example-session-${n}`,
  title,
  summary,
  position: n,
  enabled: true,
  currentSlide: 1,
  currentStep: 1,
});

// What a skeleton draws in place of the sessions, with titles and summaries of
// the usual length.
export const sessionExamples: readonly [Session, Session, Session] = [
  session(
    1,
    "La experiencia vibe coding",
    "Construimos una app de punta a punta pidiéndole todo a un agente, sin planificar ni revisar, y miramos qué salió.",
  ),
  session(
    2,
    "Planificación y revisión",
    "Antes de escribir código armamos un plan con el agente y revisamos cada cambio antes de aceptarlo.",
  ),
  session(
    3,
    "Tooling y skills",
    "Sumamos herramientas y skills al agente para que trabaje con el mismo contexto que tenemos nosotros.",
  ),
];
