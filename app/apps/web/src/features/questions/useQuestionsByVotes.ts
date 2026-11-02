import type { Question } from "@kurasu/contract/questions";

import type { EndpointError, QueryOptions } from "../../api/api-error.ts";
import { useQuestions } from "./useQuestions.ts";

const byVotes = (questions: ReadonlyArray<Question>) =>
  questions.toSorted((a, b) => b.votes - a.votes);

export const useQuestionsByVotes = (
  sessionId: string,
  options?: Omit<
    QueryOptions<ReadonlyArray<Question>, EndpointError<"questions", "list">>,
    "select"
  >,
) => useQuestions(sessionId, { ...options, select: byVotes });
