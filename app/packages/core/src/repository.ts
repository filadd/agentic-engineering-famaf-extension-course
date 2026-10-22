import type { Ulid } from "@kurasu/contract/ulid";
import type * as Effect from "effect/Effect";
import type * as Option from "effect/Option";

// A filter by field: a value matches with `=`, an array with `in` and null with
// `is null`; the fields combine with `and`.
export type Where<A> = {
  readonly [K in keyof A]?: A[K] | ReadonlyArray<A[K]> | null;
};

export interface Order<A> {
  readonly field: keyof A & string;
  readonly direction: "asc" | "desc";
}

// `orderBy` always ends with the id ascending, so the order is total. A page
// holds at most `maxPage` rows, and `after` is the last row of the previous
// page.
export interface ListOptions<A> {
  readonly where?: Where<A>;
  readonly orderBy?: Order<A> | ReadonlyArray<Order<A>>;
  readonly limit?: number;
  readonly after?: A;
}

export interface UpsertOptions<Field extends string, Change> {
  readonly target: ReadonlyArray<Field>;
  readonly set?: Change;
}

export const maxPage = 100;

// The operations every D1 store shares. A store's port takes the ones it
// exposes and adds its own. An `upsert` without `set` leaves the row it
// conflicts with as it was. A store with logical deletion leaves the deleted
// rows out of every read, and its `remove` marks the row instead of deleting it.
export interface Repository<A, New, Change> {
  readonly get: (id: Ulid) => Effect.Effect<Option.Option<A>>;
  readonly getMany: (ids: ReadonlyArray<Ulid>) => Effect.Effect<ReadonlyArray<A>>;
  readonly find: (where: Where<A>) => Effect.Effect<Option.Option<A>>;
  readonly list: (options?: ListOptions<A>) => Effect.Effect<ReadonlyArray<A>>;
  readonly count: (where?: Where<A>) => Effect.Effect<number>;
  readonly create: (row: New) => Effect.Effect<A>;
  readonly createMany: (rows: ReadonlyArray<New>) => Effect.Effect<ReadonlyArray<A>>;
  readonly update: (id: Ulid, change: Change) => Effect.Effect<Option.Option<A>>;
  readonly updateWhere: (where: Where<A>, change: Change) => Effect.Effect<number>;
  readonly upsert: (
    row: New,
    options: UpsertOptions<keyof New & string, Change>,
  ) => Effect.Effect<void>;
  readonly remove: (id: Ulid) => Effect.Effect<Option.Option<A>>;
  readonly removeWhere: (where: Where<A>) => Effect.Effect<number>;
}
