import type { AdminQuestion } from "@kurasu/contract/questions";
import type { Ulid } from "@kurasu/contract/ulid";
import * as Context from "effect/Context";
import type * as Effect from "effect/Effect";
import type * as Option from "effect/Option";

export interface StoredQuestion extends AdminQuestion {
  readonly authorId: Ulid;
}

export interface NewQuestion {
  readonly id: Ulid;
  readonly sessionId: Ulid;
  readonly authorId: Ulid;
  readonly body: string;
}

// Questions stored in D1, answered ones included, with their vote count.
// `mine` and `myVote` are seen from `viewerId`. `remove` deletes the question
// and its votes in one batch.
export class QuestionsStore extends Context.Service<
  QuestionsStore,
  {
    readonly list: (
      sessionId: Ulid,
      viewerId: Ulid,
    ) => Effect.Effect<ReadonlyArray<StoredQuestion>>;
    readonly get: (id: Ulid, viewerId: Ulid) => Effect.Effect<Option.Option<StoredQuestion>>;
    readonly create: (question: NewQuestion) => Effect.Effect<void>;
    readonly setVote: (questionId: Ulid, userId: Ulid, vote: boolean) => Effect.Effect<void>;
    readonly setAnswered: (id: Ulid, answered: boolean) => Effect.Effect<void>;
    readonly remove: (id: Ulid) => Effect.Effect<void>;
  }
>()("kurasu/QuestionsStore") {}
