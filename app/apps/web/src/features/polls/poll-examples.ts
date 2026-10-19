import type { AdminPoll, Poll } from "@kurasu/contract/polls";

const choice = (n: number, prompt: string): Poll => ({
  id: `example-poll-${n}`,
  sessionId: "example-session",
  type: "choice",
  prompt,
  options: ["Nada", "Algo", "La mitad", "Casi todo"],
  status: "active",
  myResponse: null,
  results: null,
});

// What a skeleton draws in place of the polls: choice polls, with a prompt and
// options of the usual length.
export const pollExamples: readonly [Poll, Poll] = [
  choice(1, "¿Cuánto código de tu último proyecto escribió un agente?"),
  choice(2, "¿Cuántas veces le pediste al agente que rehiciera un cambio?"),
];

export const closedPollExamples: ReadonlyArray<Poll> = pollExamples.map((poll) => ({
  ...poll,
  status: "closed",
}));

// An active poll, open with its results, and a folded draft, as a session
// usually has them.
export const adminPollExamples: ReadonlyArray<AdminPoll> = pollExamples.map(
  ({ myResponse: _mine, ...poll }, index) => ({
    ...poll,
    status: index === 0 ? "active" : "draft",
    results: { count: 24, choice: [3, 9, 8, 4] },
  }),
);
