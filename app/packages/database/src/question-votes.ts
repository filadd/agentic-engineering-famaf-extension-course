import { Ulid } from "@kurasu/contract/ulid";
import { QuestionVotesStore } from "@kurasu/core/questions/question-votes-store";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Schema from "effect/Schema";

import { repositoryOf } from "./repository.ts";
import { questionVotes } from "./schema.ts";

const decodeVote = Schema.decodeUnknownEffect(
  Schema.Struct({ id: Ulid, questionId: Ulid, userId: Ulid }),
);

export const D1QuestionVotes = Layer.effect(
  QuestionVotesStore,
  Effect.gen(function* () {
    const repository = yield* repositoryOf(questionVotes, {
      decode: (row) => decodeVote(row).pipe(Effect.orDie),
    });

    return QuestionVotesStore.of(repository);
  }),
);
