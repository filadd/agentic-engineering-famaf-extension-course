import type { ResponseValue } from "@kurasu/contract/polls";
import type { Ulid } from "@kurasu/contract/ulid";
import * as Context from "effect/Context";
import type * as Effect from "effect/Effect";

import type { Repository } from "../repository.ts";

export interface StoredResponse {
  readonly id: Ulid;
  readonly pollId: Ulid;
  readonly userId: Ulid;
  readonly value: ResponseValue;
}

export type NewResponse = StoredResponse;

export type ResponseChange = Partial<Pick<StoredResponse, "value">>;

// The votes of one poll, counted without saying who voted what: every vote, the
// votes per choice or point of the scale, and the students per word.
export interface ResponseCounts {
  readonly count: number;
  readonly values: ReadonlyArray<{ readonly value: ResponseValue; readonly count: number }>;
  readonly words: ReadonlyArray<{ readonly word: string; readonly count: number }>;
}

export const noResponses: ResponseCounts = { count: 0, values: [], words: [] };

// One response per student and poll. `counts` reads the counts of every given
// poll in one query, and leaves out the polls without votes.
export class ResponsesStore extends Context.Service<
  ResponsesStore,
  Pick<Repository<StoredResponse, NewResponse, ResponseChange>, "list" | "upsert"> & {
    readonly counts: (
      pollIds: ReadonlyArray<Ulid>,
    ) => Effect.Effect<ReadonlyMap<Ulid, ResponseCounts>>;
  }
>()("kurasu/ResponsesStore") {}
