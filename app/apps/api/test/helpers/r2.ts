import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";

import * as Effect from "effect/Effect";

// The local R2 simulator keeps the objects of each bucket in a SQLite file
// under `.alchemy/local/r2/cloudflare-runtime-R2BucketObject`, next to the
// test process. The folder is shared by every test file and run, so a test
// compares the keys before and after a request: only the materials tests
// upload, and the tests of a file run one after the other.
const objectsFolder = join(
  process.cwd(),
  ".alchemy",
  "local",
  "r2",
  "cloudflare-runtime-R2BucketObject",
);

const keysIn = (path: string) => {
  const database = new DatabaseSync(path, { readOnly: true });

  try {
    const tables = database
      .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = '_mf_objects'")
      .all();

    return tables.length === 0
      ? []
      : database
          .prepare("SELECT key FROM _mf_objects")
          .all()
          .map((row) => String(row["key"]));
  } finally {
    database.close();
  }
};

// Every object key the local R2 holds, across buckets.
export const storedKeys = Effect.tryPromise(async () => {
  const files = await readdir(objectsFolder);

  return new Set(
    files
      .filter((file) => file.endsWith(".sqlite") && file !== "metadata.sqlite")
      .flatMap((file) => keysIn(join(objectsFolder, file))),
  );
});
