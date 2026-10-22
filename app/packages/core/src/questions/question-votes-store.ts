import type { Ulid } from "@kurasu/contract/ulid";
import * as Context from "effect/Context";

import type { Repository } from "../repository.ts";

export interface QuestionVote {
  readonly id: Ulid;
  readonly questionId: Ulid;
  readonly userId: Ulid;
}

// The votes of the questions, at most one per student and question.
export class QuestionVotesStore extends Context.Service<
  QuestionVotesStore,
  Pick<Repository<QuestionVote, QuestionVote, never>, "upsert" | "removeWhere">
>()("kurasu/QuestionVotesStore") {}
