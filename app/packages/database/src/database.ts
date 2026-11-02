import { type Write, WriteTypeId } from "@kurasu/core/batch";
import * as D1Client from "@effect/sql-d1/D1Client";
import { sql } from "drizzle-orm";
import * as SQLiteD1Drizzle from "drizzle-orm/effect-d1";
import type { EffectSQLiteD1Database } from "drizzle-orm/effect-d1";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";

// The Drizzle database over the D1 binding, plus the D1 client underneath it:
// Drizzle's effect-d1 driver has no batch, and D1 has no transactions, so writes
// that must land together go through the client's batch.
export class Database extends Context.Service<
  Database,
  {
    readonly db: EffectSQLiteD1Database;
    readonly client: D1Client.D1Client;
  }
>()("kurasu/Database") {
  static readonly layer = <E, R>(binding: Effect.Effect<D1Database, E, R>) =>
    Layer.unwrap(
      Effect.map(binding, (db) =>
        Layer.effect(
          Database,
          Effect.gen(function* () {
            const client = yield* D1Client.D1Client;

            const drizzle = yield* SQLiteD1Drizzle.makeWithDefaults({}).pipe(
              Effect.provideService(D1Client.D1Client, client),
            );

            return { db: drizzle, client };
          }),
        ).pipe(Layer.provide(D1Client.layer({ db }))),
      ),
    );
}

export interface Statement {
  readonly toSQL: () => { readonly sql: string; readonly params: ReadonlyArray<unknown> };
}

// The core's `Write` is opaque; here each one stands for a Drizzle statement.
const statementOf = new WeakMap<Write, Statement>();

export const write = (statement: Statement): Write => {
  const pending: Write = { [WriteTypeId]: WriteTypeId };

  statementOf.set(pending, statement);

  return pending;
};

const unwrap = (pending: Write) => {
  const statement = statementOf.get(pending);

  return statement == null
    ? Effect.die("the write was not built by this adapter")
    : Effect.succeed(statement);
};

/** Runs Drizzle statements as one atomic D1 batch, in order. */
export const batch = (client: D1Client.D1Client, writes: ReadonlyArray<Write>) =>
  Effect.forEach(writes, (pending) =>
    Effect.map(unwrap(pending), (statement) => {
      const query = statement.toSQL();

      return client.unsafe(query.sql, query.params);
    }),
  ).pipe(
    Effect.flatMap((statements) => client.batch(statements)),
    Effect.orDie,
    Effect.asVoid,
  );

export const firstRow =
  <Row, A>(decode: (row: Row) => Effect.Effect<A>) =>
  (rows: ReadonlyArray<Row>) => {
    const row = rows[0];

    return row == null ? Effect.succeedNone : Effect.asSome(decode(row));
  };

export const now = sql<Date>`(cast(unixepoch('subsec') * 1000 as integer))`;
