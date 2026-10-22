import { randomUUID } from "node:crypto";
import { DatabaseSync } from "node:sqlite";

import { expect } from "@effect/vitest";
import * as Effect from "effect/Effect";

import { apiTest } from "./helpers/api-test.ts";
import { schemaOf } from "./helpers/d1.ts";
import { request } from "./helpers/http.ts";
import { cookieFor } from "./helpers/login.ts";

const { test, stack } = apiTest({ name: "schema", allowedEmails: [] });

// The schema goes into a database of its own, so the inserts leave the stage's
// database untouched.
const rejectsRowWithoutId = (sql: ReadonlyArray<string>, table: string) => {
  const database = new DatabaseSync(":memory:");

  try {
    database.exec(sql.join(";\n"));
    database.exec(`INSERT INTO "${table}" (id) VALUES (NULL)`);

    return false;
  } catch (error) {
    return String(error).includes(`NOT NULL constraint failed: ${table}.id`);
  } finally {
    database.close();
  }
};

test(
  "every table rejects a row without an id",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* cookieFor("01SCHM00000000000000000000");
    const title = `Esquema ${randomUUID()}`;

    const created = yield* request(url, "POST", "/api/admin/sessions", {
      cookie,
      body: { title, summary: "" },
    });

    expect(created.status).toBe(201);

    const schema = yield* schemaOf(title);
    const sql = schema.map((entry) => entry.sql);
    const tables = schema.flatMap((entry) => (entry.type === "table" ? [entry.name] : []));

    expect(tables.toSorted()).toEqual([
      "changelog_entries",
      "codes",
      "materials",
      "polls",
      "question_votes",
      "questions",
      "raised_hands",
      "responses",
      "sessions",
      "users",
    ]);
    expect(tables.filter((table) => !rejectsRowWithoutId(sql, table))).toEqual([]);
  }),
);
