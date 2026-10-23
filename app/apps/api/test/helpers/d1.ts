import * as Effect from "effect/Effect";

import { readWithTable, sqliteFilesIn } from "./local-sqlite.ts";

// The local D1 simulator keeps each database in a file named by a hash. The
// files outlive their stage, so a test finds its stage's database by a session
// title new to the run.

// The tables and indexes the migrations created in the database that holds the
// session, as the SQL that creates them, without SQLite's, D1's and Alchemy's
// own.
export const schemaOf = (sessionTitle: string) =>
  Effect.gen(function* () {
    const files = yield* sqliteFilesIn("d1", "cloudflare-runtime-D1DatabaseObject");

    for (const file of files) {
      const schema = readWithTable(file, "sessions", (database) =>
        database.prepare("SELECT id FROM sessions WHERE title = ?").all(sessionTitle).length === 0
          ? undefined
          : database
              .prepare(
                `SELECT type, name, sql FROM sqlite_master
                 WHERE sql IS NOT NULL AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_cf_%'
                   AND name NOT LIKE '%alchemy%'
                 ORDER BY type DESC, name`,
              )
              .all()
              .map((row) => ({
                type: String(row["type"]),
                name: String(row["name"]),
                sql: String(row["sql"]),
              })),
      );

      if (schema != null) {
        return schema;
      }
    }

    return yield* Effect.die(`no local D1 database holds the session ${sessionTitle}`);
  });
