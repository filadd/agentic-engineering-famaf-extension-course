import {
  maxPage,
  type ListOptions,
  type Order,
  type Repository,
  type UpsertOptions,
  type Where,
} from "@kurasu/core/repository";
import type { Ulid } from "@kurasu/contract/ulid";
import {
  and,
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
  sql,
  type SQL,
} from "drizzle-orm";
import type { SQLiteColumn, SQLiteInsertValue, SQLiteTable } from "drizzle-orm/sqlite-core";
import * as DateTime from "effect/DateTime";
import * as Effect from "effect/Effect";
import * as Option from "effect/Option";

import { Database, firstRow, now } from "./database.ts";

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
    const { db } = yield* Database;
    const columns: Record<string, SQLiteColumn | undefined> = getTableColumns(table);

    const columnOf = (field: string) => {
      const column = columns[field];

      return column == null
        ? Effect.die(`${field} is not a column of the table`)
        : Effect.succeed(column);
    };

    const notDeleted = deletedAt == null ? undefined : isNull(deletedAt);

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

    // Marks the matching rows as deleted. A SET names the bare column, so the
    // column goes in as an identifier.
    const markDeleted = (column: SQLiteColumn, condition: SQL | undefined) =>
      db
        .all<{ readonly id: Ulid }>(
          sql`update ${table} set ${sql.identifier(column.name)} = ${now} where ${condition} returning ${table.id}`,
        )
        .pipe(Effect.orDie);

    type Shared = Repository<A, New<T>, Change<T>>;

    // Over a generic table, drizzle types the rows that `returning()` gives
    // back, and the `set` of `onConflictDoUpdate`, with conditionals it does not
    // resolve. So a write returns at most the ids, and the rows are read back
    // with a select, which it does type.

    return {
      get,
      getMany,
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
        db
          .insert(table)
          .values(row)
          .pipe(
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
          : db
              .update(table)
              .set(change)
              .where(byId(id))
              .returning({ id: table.id })
              .pipe(
                Effect.orDie,
                Effect.flatMap((rows) => (rows.length === 0 ? Effect.succeedNone : get(id))),
              ),
      updateWhere: (where: Where<A>, change: Change<T>): ReturnType<Shared["updateWhere"]> =>
        Effect.gen(function* () {
          const rows = yield* db
            .update(table)
            .set(change)
            .where(yield* conditionOf(where))
            .returning({ id: table.id })
            .pipe(Effect.orDie);

          return rows.length;
        }),
      // A row that conflicts on `target` and gets a `set` is updated by a
      // second statement, matched by the row's values on `target`.
      upsert: (
        row: New<T>,
        { target, set }: UpsertOptions<keyof New<T> & string, Change<T>>,
      ): ReturnType<Shared["upsert"]> =>
        Effect.gen(function* () {
          const targetColumns = yield* Effect.forEach(target, columnOf);

          const inserted = yield* db
            .insert(table)
            .values(row)
            .onConflictDoNothing({ target: targetColumns })
            .returning({ id: table.id })
            .pipe(Effect.orDie);

          if (set == null || inserted.length > 0) {
            return;
          }

          const conflicting = yield* Effect.forEach(target, (field) =>
            Effect.map(columnOf(field), (column) => eq(column, row[field])),
          );

          yield* db
            .update(table)
            .set(set)
            .where(and(...conflicting))
            .pipe(Effect.orDie);
        }),
      remove: (id: Ulid): ReturnType<Shared["remove"]> =>
        Effect.gen(function* () {
          const current = yield* get(id);

          if (Option.isSome(current)) {
            yield* deletedAt == null
              ? db.delete(table).where(eq(table.id, id)).pipe(Effect.orDie)
              : markDeleted(deletedAt, byId(id));
          }

          return current;
        }),
      removeWhere: (where: Where<A>): ReturnType<Shared["removeWhere"]> =>
        Effect.gen(function* () {
          const condition = yield* conditionOf(where);

          const rows =
            deletedAt == null
              ? yield* db
                  .delete(table)
                  .where(condition)
                  .returning({ id: table.id })
                  .pipe(Effect.orDie)
              : yield* markDeleted(deletedAt, condition);

          return rows.length;
        }),
    };
  });
