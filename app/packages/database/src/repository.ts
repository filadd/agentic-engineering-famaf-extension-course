import {
  maxPage,
  type ListOptions,
  type Order,
  type RemoveOptions,
  type Repository,
  type UpsertOptions,
  type Where,
} from "@kurasu/core/repository";
import type { Ulid } from "@kurasu/contract/ulid";
import {
  and,
  type Assume,
  type InferInsertModel,
  type InferSelectModel,
  asc,
  count as countRows,
  desc,
  eq,
  getTableColumns,
  gt,
  inArray,
  isNull,
  lt,
  or,
  type SQL,
} from "drizzle-orm";
import type {
  SQLiteColumn,
  SQLiteInsertValue,
  SQLiteTable,
  SQLiteUpdateSetSource,
} from "drizzle-orm/sqlite-core";
import type { EffectDrizzleQueryError } from "drizzle-orm/effect-core";
import * as DateTime from "effect/DateTime";
import * as Effect from "effect/Effect";
import * as Option from "effect/Option";

import { batch, Database, firstRow, now, type Statement } from "./database.ts";

export type Table = SQLiteTable & { readonly id: SQLiteColumn };

type New<T extends Table> = SQLiteInsertValue<T> & { readonly id: Ulid };

type Change<T extends Table> = Partial<InferInsertModel<T>>;

export interface RepositoryOptions<T extends Table, A> {
  readonly decode: (row: InferSelectModel<T>) => Effect.Effect<A>;
  readonly deletedAt?: SQLiteColumn;
}

// A value of the core goes to the column as the driver expects it: a DateTime
// becomes the Date that a timestamp column maps.
const toColumnValue = <V>(value: V) =>
  DateTime.isDateTime(value) ? DateTime.toDateUtc(value) : value;

const decodeAll = <T extends Table, A>(
  rows: ReadonlyArray<InferSelectModel<T>>,
  decode: RepositoryOptions<T, A>["decode"],
) => Effect.forEach(rows, decode);

type Write<R> = Statement & Effect.Effect<R, EffectDrizzleQueryError>;

const rowsGuardOf =
  <T extends Table>() =>
  <R>(rows: R): rows is R & ReadonlyArray<InferSelectModel<T>> =>
    Array.isArray(rows);

const ordersOf = <A>(orderBy: ListOptions<A>["orderBy"]): ReadonlyArray<Order<A>> =>
  orderBy == null ? [] : "field" in orderBy ? [orderBy] : orderBy;

/**
 * The shared operations of a D1 store over one table, as the core's
 * `Repository` declares them. Every row read goes through `decode`. With
 * `deletedAt`, reads leave out the rows that have it set and `remove` sets it.
 */
export const repositoryOf = <T extends Table, A extends { readonly id: Ulid }>(
  table: T,
  { decode, deletedAt }: RepositoryOptions<T, A>,
) =>
  Effect.gen(function* () {
    const { db, client } = yield* Database;
    const columns: Record<string, SQLiteColumn | undefined> = getTableColumns(table);

    const columnOf = (field: string) => {
      const column = columns[field];

      return column == null
        ? Effect.die(`${field} is not a column of the table`)
        : Effect.succeed(column);
    };

    const notDeleted = deletedAt == null ? undefined : isNull(deletedAt);

    const propertyOf = (column: SQLiteColumn) =>
      Object.entries(columns).find(([, candidate]) => candidate === column)?.[0] ?? column.name;

    const conditionOf = (where: Where<A> | undefined) =>
      Effect.map(
        Effect.forEach(Object.entries(where ?? {}), ([field, value]) =>
          Effect.map(columnOf(field), (column) =>
            value == null
              ? isNull(column)
              : Array.isArray(value)
                ? inArray(column, value.map(toColumnValue))
                : eq(column, toColumnValue(value)),
          ),
        ),
        (conditions) => and(notDeleted, ...conditions),
      );

    // The rows after `after` in the given order: those past it on the first
    // field, or tied on it and past it on the next, and so on.
    const afterOf = (orders: ReadonlyArray<Order<A>>, after: A) =>
      Effect.map(
        Effect.forEach(orders, (order) =>
          Effect.map(columnOf(order.field), (column) => ({
            column,
            value: toColumnValue(after[order.field]),
            direction: order.direction,
          })),
        ),
        (keys) =>
          or(
            ...keys.map((key, index) =>
              and(
                ...keys.slice(0, index).map((tied) => eq(tied.column, tied.value)),
                key.direction === "asc" ? gt(key.column, key.value) : lt(key.column, key.value),
              ),
            ),
          ),
      );

    const byId = (id: Ulid) => and(eq(table.id, id), notDeleted);

    const get = (id: Ulid) =>
      db
        .select()
        .from(table)
        .where(byId(id))
        .limit(1)
        .pipe(Effect.orDie, Effect.flatMap(firstRow(decode)));

    const getMany = (ids: ReadonlyArray<Ulid>) =>
      ids.length === 0
        ? Effect.succeed([])
        : db
            .select()
            .from(table)
            .where(and(inArray(table.id, [...ids]), notDeleted))
            .orderBy(asc(table.id))
            .pipe(
              Effect.orDie,
              Effect.flatMap((rows) => decodeAll(rows, decode)),
            );

    // drizzle maps the rows that `.returning()` gives back to the table's select
    // model, but over a generic table it types them with a conditional it does
    // not resolve, and it cannot type a set with a computed key or the set of
    // `onConflictDoUpdate`. These guards give those values the types drizzle
    // cannot.
    const areRows = rowsGuardOf<T>();

    const namesColumns = (keys: ReadonlyArray<string>) => keys.every((key) => columns[key] != null);

    const isChange = <R extends object>(change: R): change is R & Change<T> =>
      namesColumns(Object.keys(change));

    const isConflictSet = <R extends object>(
      change: R,
    ): change is R & SQLiteUpdateSetSource<Assume<T, SQLiteTable>> =>
      namesColumns(Object.keys(change));

    const deletion = (column: SQLiteColumn) => {
      const mark = { [propertyOf(column)]: now };

      return isChange(mark)
        ? Effect.succeed(mark)
        : Effect.die(`${column.name} is not a column of the table`);
    };

    const removing = (condition: SQL | undefined): Effect.Effect<Write<unknown>> =>
      deletedAt == null
        ? Effect.succeed(db.delete(table).where(condition).returning())
        : Effect.map(deletion(deletedAt), (mark) =>
            db.update(table).set(mark).where(condition).returning(),
          );

    const removeReturning = (condition: SQL | undefined) =>
      Effect.gen(function* () {
        const rows = yield* (yield* removing(condition)).pipe(Effect.orDie);

        return areRows(rows)
          ? yield* decodeAll(rows, decode)
          : yield* Effect.die("the removed rows did not come back");
      });

    // A statement reads nothing after its write, so several can go in one D1
    // batch.
    const statements = {
      create: (row: New<T>) => db.insert(table).values(row),
      update: (id: Ulid, change: Change<T>) =>
        db.update(table).set(change).where(byId(id)).returning({ id: table.id }),
      updateWhere: (where: Where<A>, change: Change<T>) =>
        Effect.map(conditionOf(where), (condition) =>
          db.update(table).set(change).where(condition).returning({ id: table.id }),
        ),
      upsert: (row: New<T>, { target, set }: UpsertOptions<keyof New<T> & string, Change<T>>) =>
        Effect.gen(function* () {
          const targetColumns = yield* Effect.forEach(target, columnOf);
          const insert = db.insert(table).values(row);

          if (set == null) {
            return insert.onConflictDoNothing({ target: targetColumns });
          }

          return isConflictSet(set)
            ? insert.onConflictDoUpdate({ target: targetColumns, set })
            : yield* Effect.die("the set names a field that is not a column of the table");
        }),
      remove: (id: Ulid) => removing(byId(id)),
      removeWhere: (where: Where<A>) => Effect.flatMap(conditionOf(where), removing),
    };

    function removeWhere(where: Where<A>): Effect.Effect<number>;
    function removeWhere(where: Where<A>, options: RemoveOptions): Effect.Effect<ReadonlyArray<A>>;
    function removeWhere(
      where: Where<A>,
      options?: RemoveOptions,
    ): Effect.Effect<number | ReadonlyArray<A>> {
      if (options?.returning === true) {
        return Effect.flatMap(conditionOf(where), removeReturning);
      }

      return Effect.gen(function* () {
        const rows = yield* (yield* statements.removeWhere(where)).pipe(Effect.orDie);

        return areRows(rows)
          ? rows.length
          : yield* Effect.die("the removed rows did not come back");
      });
    }

    type Shared = Repository<A, New<T>, Change<T>>;

    return {
      statements,
      batch: (writes: ReadonlyArray<Statement>) => batch(client, writes),
      get,
      getMany,
      find: (where: Where<A>): ReturnType<Shared["find"]> =>
        Effect.gen(function* () {
          const rows = yield* db
            .select()
            .from(table)
            .where(yield* conditionOf(where))
            .orderBy(asc(table.id))
            .limit(1)
            .pipe(Effect.orDie);

          return yield* firstRow(decode)(rows);
        }),
      list: (options: ListOptions<A> = {}): ReturnType<Shared["list"]> =>
        Effect.gen(function* () {
          const orders: ReadonlyArray<Order<A>> = [
            ...ordersOf(options.orderBy),
            { field: "id", direction: "asc" },
          ];

          const keys = yield* Effect.forEach(orders, (order) =>
            Effect.map(columnOf(order.field), (column) =>
              order.direction === "asc" ? asc(column) : desc(column),
            ),
          );

          const condition = and(
            yield* conditionOf(options.where),
            options.after == null ? undefined : yield* afterOf(orders, options.after),
          );

          const rows = yield* db
            .select()
            .from(table)
            .where(condition)
            .orderBy(...keys)
            .limit(Math.min(options.limit ?? maxPage, maxPage))
            .pipe(Effect.orDie);

          return yield* decodeAll(rows, decode);
        }),
      count: (where?: Where<A>): ReturnType<Shared["count"]> =>
        Effect.gen(function* () {
          const rows = yield* db
            .select({ count: countRows() })
            .from(table)
            .where(yield* conditionOf(where))
            .pipe(Effect.orDie);

          return rows[0]?.count ?? 0;
        }),
      create: (row: New<T>): ReturnType<Shared["create"]> =>
        statements.create(row).pipe(
          Effect.orDie,
          Effect.andThen(get(row.id)),
          Effect.flatMap(
            Option.match({
              onNone: () => Effect.die("the new row was not stored"),
              onSome: Effect.succeed,
            }),
          ),
        ),
      createMany: (rows: ReadonlyArray<New<T>>): ReturnType<Shared["createMany"]> =>
        rows.length === 0
          ? Effect.succeed([])
          : db
              .insert(table)
              .values([...rows])
              .pipe(Effect.orDie, Effect.andThen(getMany(rows.map((row) => row.id)))),
      update: (id: Ulid, change: Change<T>): ReturnType<Shared["update"]> =>
        Object.keys(change).length === 0
          ? get(id)
          : statements.update(id, change).pipe(
              Effect.orDie,
              Effect.flatMap((rows) => (rows.length === 0 ? Effect.succeedNone : get(id))),
            ),
      updateWhere: (where: Where<A>, change: Change<T>): ReturnType<Shared["updateWhere"]> =>
        Effect.gen(function* () {
          const rows = yield* (yield* statements.updateWhere(where, change)).pipe(Effect.orDie);

          return rows.length;
        }),
      upsert: (
        row: New<T>,
        options: UpsertOptions<keyof New<T> & string, Change<T>>,
      ): ReturnType<Shared["upsert"]> =>
        Effect.gen(function* () {
          yield* (yield* statements.upsert(row, options)).pipe(Effect.orDie);
        }),
      remove: (id: Ulid, options?: RemoveOptions): ReturnType<Shared["remove"]> =>
        Effect.gen(function* () {
          if (options?.returning === true) {
            return Option.fromNullishOr((yield* removeReturning(byId(id)))[0]);
          }

          const current = yield* get(id);

          if (Option.isSome(current)) {
            yield* (yield* statements.remove(id)).pipe(Effect.orDie);
          }

          return current;
        }),
      removeWhere,
    };
  });
