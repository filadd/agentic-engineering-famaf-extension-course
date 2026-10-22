import { AdminPoll, PollOptions } from "@kurasu/contract/polls";
import { PollsStore, type StoredPoll } from "@kurasu/core/polls/polls-store";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Schema from "effect/Schema";

import { repositoryOf } from "./repository.ts";
import { polls } from "./schema.ts";

const { results: _results, ...storedPollFields } = AdminPoll.fields;

// The content of the other poll type is null in the row and absent in the poll.
const decodeRow = Schema.decodeUnknownEffect(
  Schema.Struct({
    ...storedPollFields,
    options: Schema.NullOr(PollOptions),
    scaleMinLabel: Schema.NullOr(Schema.String),
    scaleMaxLabel: Schema.NullOr(Schema.String),
  }),
);

const toPoll = (row: typeof polls.$inferSelect): Effect.Effect<StoredPoll> =>
  decodeRow(row).pipe(
    Effect.orDie,
    Effect.map((poll) => ({
      ...poll,
      options: poll.options ?? undefined,
      scaleMinLabel: poll.scaleMinLabel ?? undefined,
      scaleMaxLabel: poll.scaleMaxLabel ?? undefined,
    })),
  );

export const D1Polls = Layer.effect(
  PollsStore,
  Effect.gen(function* () {
    const repository = yield* repositoryOf(polls, {
      decode: toPoll,
      deletedAt: polls.deletedAt,
    });

    return PollsStore.of({
      ...repository,
      create: (poll) =>
        repository.create({
          ...poll,
          options: poll.options ?? null,
          scaleMinLabel: poll.scaleMinLabel ?? null,
          scaleMaxLabel: poll.scaleMaxLabel ?? null,
        }),
    });
  }),
);
