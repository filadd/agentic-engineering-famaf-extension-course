import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";

import * as Effect from "effect/Effect";

// The local D1 simulator keeps each database in a SQLite file under
// `.alchemy/local/d1/cloudflare-runtime-D1DatabaseObject`, named by a hash.
// The files outlive their stage, so a test finds its stage's database by a
// session title new to the run. The files are only read: the stage's Worker
// keeps them open.
const databasesFolder = join(
  process.cwd(),
  ".alchemy",
  "local",
  "d1",
  "cloudflare-runtime-D1DatabaseObject",
);

// The tables and indexes the migrations created in a database, as the SQL that
// creates them, without SQLite's, D1's and Alchemy's own; none when the
// database does not hold the session.
const schemaIn = (path: string, sessionTitle: string) => {
  const database = new DatabaseSync(path, { readOnly: true });

  try {
    const hasSessions =
      database
        .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'sessions'")
        .all().length > 0;

    if (
      !hasSessions ||
      database.prepare("SELECT id FROM sessions WHERE title = ?").all(sessionTitle).length === 0
    ) {
      return undefined;
    }

    return database
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
      }));
  } finally {
    database.close();
  }
};

export const schemaOf = (sessionTitle: string) =>
  Effect.tryPromise(async () => {
    const files = await readdir(databasesFolder);

    for (const file of files.filter(
      (name) => name.endsWith(".sqlite") && name !== "metadata.sqlite",
    )) {
      const schema = schemaIn(join(databasesFolder, file), sessionTitle);

      if (schema != null) {
        return schema;
      }
    }

    throw new Error(`no local D1 database holds the session ${sessionTitle}`);
  });
