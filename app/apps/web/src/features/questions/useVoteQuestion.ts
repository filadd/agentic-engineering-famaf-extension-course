import type { Question } from "@kurasu/contract/questions";

import type { EndpointError, MutationOptions } from "../../api/api-error.ts";
import { optimisticPatch } from "../../api/optimistic-patch.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiMutation } from "../../api/useApiMutation.ts";

export interface QuestionVoteInput {
  readonly questionId: string;
  readonly myVote: boolean;
}

const withVote = (question: Question, { questionId, myVote }: QuestionVoteInput) =>
  question.id !== questionId || question.myVote === myVote
    ? question
    : { ...question, myVote, votes: question.votes + (myVote ? 1 : -1) };

export const useVoteQuestion = (
  options?: MutationOptions<Question, QuestionVoteInput, EndpointError<"questions", "vote">>,
) =>
  useApiMutation({
    call: (api, input) =>
      api.questions.vote({ params: { id: input.questionId }, payload: { myVote: input.myVote } }),
    invalidates: [queryKeys.allQuestions()],
    optimistic: [
      optimisticPatch<ReadonlyArray<Question>, QuestionVoteInput>({
        key: () => queryKeys.allQuestions(),
        patch: (questions, input) => questions.map((question) => withVote(question, input)),
      }),
    ],
    errorToast: () => "No se pudo votar la pregunta.",
    options,
  });
