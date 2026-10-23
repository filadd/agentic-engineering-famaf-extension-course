import type { AdminQuestion } from "@kurasu/contract/questions";
import type { Ulid } from "@kurasu/contract/ulid";
import * as Context from "effect/Context";
import type * as Effect from "effect/Effect";
import type * as Option from "effect/Option";

import type { Repository } from "../repository.ts";

export interface StoredQuestion extends AdminQuestion {
  readonly authorId: Ulid;
}

export interface NewQuestion {
  readonly id: Ulid;
  readonly sessionId: Ulid;
  readonly authorId: Ulid;
  readonly body: string;
}

// A question as stored, without its votes or a viewer.
export interface QuestionRecord extends NewQuestion {
  readonly answered: boolean;
}

export type QuestionChange = Partial<Pick<QuestionRecord, "answered">>;

// Questions stored in D1, answered ones included. `list` and `get` add the
// vote count, and `mine` and `myVote` as seen from `viewerId`. `remove`
// deletes the question and its votes in one batch.
export class QuestionsStore extends Context.Service<
  QuestionsStore,
  Pick<Repository<QuestionRecord, NewQuestion, QuestionChange>, "create" | "update"> & {
    readonly list: (
      sessionId: Ulid,
      viewerId: Ulid,
    ) => Effect.Effect<ReadonlyArray<StoredQuestion>>;
    readonly get: (id: Ulid, viewerId: Ulid) => Effect.Effect<Option.Option<StoredQuestion>>;
    readonly remove: (id: Ulid) => Effect.Effect<void>;
  }
>()("kurasu/QuestionsStore") {}
