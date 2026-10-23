import * as Effect from "effect/Effect";

import { readWithTable, sqliteFilesIn } from "./local-sqlite.ts";

// The local R2 simulator keeps the objects of each bucket in a file of its own.
// The folder is shared by every test file and run, so a test compares the keys
// before and after a request: only the materials tests upload, and the tests
// of a file run one after the other.
export const storedKeys = Effect.map(
  sqliteFilesIn("r2", "cloudflare-runtime-R2BucketObject"),
  (files) =>
    new Set(
      files.flatMap(
        (file) =>
          readWithTable(file, "_mf_objects", (database) =>
            database
              .prepare("SELECT key FROM _mf_objects")
              .all()
              .map((row) => String(row["key"])),
          ) ?? [],
      ),
    ),
);
