import { Batch } from "@kurasu/core/batch";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";

import { batch, Database } from "./database.ts";

export const D1Batch = Layer.effect(
  Batch,
  Effect.gen(function* () {
    const { client } = yield* Database;

    return Batch.of({ run: (writes) => batch(client, writes) });
  }),
);
