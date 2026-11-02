import type { Question } from "@kurasu/contract/questions";

import { useQuestions } from "./useQuestions.ts";

const byVotes = (questions: ReadonlyArray<Question>) =>
  questions.toSorted((a, b) => b.votes - a.votes);

export const useQuestionsByVotes = (sessionId: string) =>
  useQuestions(sessionId, { select: byVotes });
