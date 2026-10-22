import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";

import * as Effect from "effect/Effect";

// Alchemy's local simulators keep their data in SQLite files under
// `.alchemy/local`, next to the test process, one folder per kind of object.
// The files are only read: the stages' Workers keep them open.
export const sqliteFilesIn = (...folder: ReadonlyArray<string>) =>
  Effect.tryPromise(async () => {
    const path = join(process.cwd(), ".alchemy", "local", ...folder);
    const files = await readdir(path);

    return files
      .filter((file) => file.endsWith(".sqlite") && file !== "metadata.sqlite")
      .map((file) => join(path, file));
  });

// What `read` gets from the file, or nothing when the file has no `table`.
export const readWithTable = <A>(
  path: string,
  table: string,
  read: (database: DatabaseSync) => A,
) => {
  const database = new DatabaseSync(path, { readOnly: true });

  try {
    const hasTable =
      database
        .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?")
        .all(table).length > 0;

    return hasTable ? read(database) : undefined;
  } finally {
    database.close();
  }
};
