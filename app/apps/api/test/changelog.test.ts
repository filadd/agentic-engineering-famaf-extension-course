import { expect } from "@effect/vitest";
import { ChangelogEntry } from "@kurasu/contract/changelog";
import { ChangelogEntryNotFound, InvalidUpload, SessionNotFound } from "@kurasu/contract/errors";
import * as DateTime from "effect/DateTime";
import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";

import { apiTest } from "./helpers/api-test.ts";
import { bodyOf, failedWith } from "./helpers/body.ts";
import {
  request,
  type RequestOptions,
  upload,
  uploadEntries,
  type UploadFile,
} from "./helpers/http.ts";
import { cookieFor } from "./helpers/login.ts";

const { test, stack } = apiTest({ name: "changelog", allowedEmails: [] });

const teacher = "01CTCH00000000000000000000";
const ana = "01CSTA00000000000000000000";
const beto = "01CSTB00000000000000000000";

const session = (n: number) => `01CS${String(n).padStart(2, "0")}`.padEnd(26, "0");
const poll = (n: number) => `01CP${String(n).padStart(2, "0")}`.padEnd(26, "0");

const Entries = Schema.Array(ChangelogEntry);

const pdf: UploadFile = {
  name: "apunte.pdf",
  type: "application/pdf",
  bytes: Uint8Array.from({ length: 1024 }, (_, index) => index % 251),
};

const asTeacher = (method: "PATCH" | "DELETE", path: string, body?: RequestOptions["body"]) =>
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* cookieFor(teacher);

    return yield* request(url, method, path, body == null ? { cookie } : { cookie, body });
  });

const listRequest = (sessionId: string) =>
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* cookieFor(teacher);

    return yield* request(url, "GET", `/api/admin/changelog?sessionId=${sessionId}`, { cookie });
  });

const entriesOf = (sessionId: string) =>
  Effect.gen(function* () {
    const response = yield* listRequest(sessionId);

    expect(response.status).toBe(200);

    return yield* bodyOf(Entries, response);
  });

const kinds = (entries: ReadonlyArray<ChangelogEntry>) =>
  entries.map((entry) => [entry.type, entry.name]);

const vote = (userId: string, pollId: string) =>
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* cookieFor(userId);

    return yield* request(url, "PATCH", `/api/polls/${pollId}`, {
      cookie,
      body: { myResponse: { words: ["chau"] } },
    });
  });

test(
  "enabling a disabled session records that it was enabled, with its title and the date",
  Effect.gen(function* () {
    const response = yield* asTeacher("PATCH", `/api/admin/sessions/${session(1)}`, {
      enabled: true,
    });

    expect(response.status).toBe(200);

    const entries = yield* entriesOf(session(1));

    expect(kinds(entries)).toEqual([["session-enabled", "Para habilitar"]]);
    expect(entries[0]?.entityId).toBe(session(1));

    // Later than every date the fixtures hold, so the API set it on enabling.
    expect(entries[0]?.createdAt.epochMilliseconds).toBeGreaterThan(1_790_000_002_000);
  }),
);

test(
  "enabling an enabled session keeps its one entry",
  Effect.gen(function* () {
    const response = yield* asTeacher("PATCH", `/api/admin/sessions/${session(2)}`, {
      enabled: true,
    });

    expect(response.status).toBe(200);
    expect(kinds(yield* entriesOf(session(2)))).toEqual([["session-enabled", "Ya habilitada"]]);
  }),
);

test(
  "disabling a session drops its own entry and keeps those of its material and polls",
  Effect.gen(function* () {
    const response = yield* asTeacher("PATCH", `/api/admin/sessions/${session(3)}`, {
      enabled: false,
    });

    expect(response.status).toBe(200);
    expect(kinds(yield* entriesOf(session(3)))).toEqual([
      ["material-added", "Apunte de la tres"],
      ["poll-opened", "Encuesta de la tres"],
    ]);
  }),
);

test(
  "disabling a disabled session answers 200 and records nothing",
  Effect.gen(function* () {
    const response = yield* asTeacher("PATCH", `/api/admin/sessions/${session(4)}`, {
      enabled: false,
    });

    expect(response.status).toBe(200);
    expect(yield* entriesOf(session(4))).toEqual([]);
  }),
);

test(
  "renaming a session keeps the name its entry was recorded with",
  Effect.gen(function* () {
    const response = yield* asTeacher("PATCH", `/api/admin/sessions/${session(5)}`, {
      title: "Título más nuevo",
    });

    expect(response.status).toBe(200);
    expect(kinds(yield* entriesOf(session(5)))).toEqual([["session-enabled", "Título viejo"]]);
  }),
);

test(
  "uploading a material to an enabled session records it with the material's name",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* cookieFor(teacher);

    const response = yield* upload(url, cookie, {
      sessionId: session(6),
      name: "Apunte nuevo",
      isSlides: false,
      file: pdf,
    });

    expect(response.status).toBe(201);
    expect(kinds(yield* entriesOf(session(6)))).toEqual([["material-added", "Apunte nuevo"]]);
  }),
);

test(
  "uploading a material to a disabled session records it too",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* cookieFor(teacher);

    const response = yield* upload(url, cookie, {
      sessionId: session(7),
      name: "Apunte oculto",
      isSlides: false,
      file: pdf,
    });

    expect(response.status).toBe(201);
    expect(kinds(yield* entriesOf(session(7)))).toEqual([["material-added", "Apunte oculto"]]);
  }),
);

test(
  "an upload with a field after the file answers InvalidUpload and records nothing",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* cookieFor(teacher);

    const response = yield* uploadEntries(url, cookie, [
      { key: "sessionId", value: session(8) },
      { key: "name", value: "Apunte tardío" },
      { key: "file", file: pdf },
      { key: "isSlides", value: "false" },
    ]);

    expect(response.status).toBe(400);
    expect(failedWith(response, InvalidUpload)).toBe(true);
    expect(yield* entriesOf(session(8))).toEqual([]);
  }),
);

test(
  "deleting a material drops its entry and keeps the entry of another material",
  Effect.gen(function* () {
    const response = yield* asTeacher("DELETE", "/api/admin/materials/01CM9100000000000000000000");

    expect(response.status).toBe(204);
    expect(kinds(yield* entriesOf(session(9)))).toEqual([["material-added", "Apunte B"]]);
  }),
);

test(
  "deleting a material whose entry was already announced answers 204",
  Effect.gen(function* () {
    const response = yield* asTeacher("DELETE", "/api/admin/materials/01CM1010000000000000000000");

    expect(response.status).toBe(204);
    expect(yield* entriesOf(session(10))).toEqual([]);
  }),
);

test(
  "activating a draft records the poll as opened with its prompt",
  Effect.gen(function* () {
    const response = yield* asTeacher("PATCH", `/api/admin/polls/${poll(11)}`, {
      status: "active",
    });

    expect(response.status).toBe(200);
    expect(kinds(yield* entriesOf(session(11)))).toEqual([
      ["poll-opened", "Consigna para activar"],
    ]);
  }),
);

test(
  "activating a draft of a disabled session records it too",
  Effect.gen(function* () {
    const response = yield* asTeacher("PATCH", `/api/admin/polls/${poll(12)}`, {
      status: "active",
    });

    expect(response.status).toBe(200);
    expect(kinds(yield* entriesOf(session(12)))).toEqual([["poll-opened", "Borrador oculto"]]);
  }),
);

test(
  "closing a poll drops its entry",
  Effect.gen(function* () {
    const response = yield* asTeacher("PATCH", `/api/admin/polls/${poll(13)}`, {
      status: "closed",
    });

    expect(response.status).toBe(200);
    expect(yield* entriesOf(session(13))).toEqual([]);
  }),
);

test(
  "closing a poll whose entry left with its first vote answers 200",
  Effect.gen(function* () {
    const response = yield* asTeacher("PATCH", `/api/admin/polls/${poll(14)}`, {
      status: "closed",
    });

    expect(response.status).toBe(200);
    expect(yield* entriesOf(session(14))).toEqual([]);
  }),
);

test(
  "editing a draft's prompt records nothing",
  Effect.gen(function* () {
    const response = yield* asTeacher("PATCH", `/api/admin/polls/${poll(15)}`, {
      prompt: "Consigna nueva",
    });

    expect(response.status).toBe(200);
    expect(yield* entriesOf(session(15))).toEqual([]);
  }),
);

test(
  "deleting an active poll drops its entry",
  Effect.gen(function* () {
    const response = yield* asTeacher("DELETE", `/api/admin/polls/${poll(16)}`);

    expect(response.status).toBe(204);
    expect(yield* entriesOf(session(16))).toEqual([]);
  }),
);

test(
  "deleting a draft answers 204",
  Effect.gen(function* () {
    const response = yield* asTeacher("DELETE", `/api/admin/polls/${poll(17)}`);

    expect(response.status).toBe(204);
    expect(yield* entriesOf(session(17))).toEqual([]);
  }),
);

test(
  "the first vote on a poll drops its entry",
  Effect.gen(function* () {
    const response = yield* vote(ana, poll(18));

    expect(response.status).toBe(200);
    expect(yield* entriesOf(session(18))).toEqual([]);
  }),
);

test(
  "a later vote on a poll answers 200 and records nothing",
  Effect.gen(function* () {
    const response = yield* vote(beto, poll(19));

    expect(response.status).toBe(200);
    expect(yield* entriesOf(session(19))).toEqual([]);
  }),
);

test(
  "the list holds only the session's entries, from the oldest to the newest, with every field",
  Effect.gen(function* () {
    const entries = yield* entriesOf(session(20));

    expect(entries.map((entry) => entry.id)).toEqual([
      "01CE1300000000000000000000",
      "01CE1400000000000000000000",
      "01CE1200000000000000000000",
    ]);
    expect(entries[1]).toEqual({
      id: "01CE1400000000000000000000",
      sessionId: session(20),
      type: "material-added",
      entityId: "01CM2000000000000000000000",
      name: "Apunte de la veinte",
      createdAt: DateTime.makeUnsafe(1_790_000_001_000),
    });
  }),
);

test(
  "a session without entries lists none",
  Effect.gen(function* () {
    expect(yield* entriesOf(session(22))).toEqual([]);
  }),
);

test(
  "a session with 105 entries lists the 100 newest, from the oldest to the newest",
  Effect.gen(function* () {
    const entries = yield* entriesOf(session(23));

    expect(entries).toHaveLength(100);
    expect(entries[0]?.name).toBe("Apunte 006");
    expect(entries.at(-1)?.name).toBe("Apunte 105");
  }),
);

test(
  "the list of a deleted session answers SessionNotFound",
  Effect.gen(function* () {
    const response = yield* listRequest(session(24));

    expect(response.status).toBe(404);
    expect(failedWith(response, SessionNotFound)).toBe(true);
  }),
);

test(
  "the list of an unknown session answers SessionNotFound",
  Effect.gen(function* () {
    const response = yield* listRequest(session(99));

    expect(response.status).toBe(404);
    expect(failedWith(response, SessionNotFound)).toBe(true);
  }),
);

test(
  "discarding an entry removes it from the list",
  Effect.gen(function* () {
    const response = yield* asTeacher("DELETE", "/api/admin/changelog/01CE1700000000000000000000");

    expect(response.status).toBe(204);
    expect(kinds(yield* entriesOf(session(25)))).toEqual([["material-added", "Para quedarse"]]);
  }),
);

test(
  "discarding an entry that does not exist answers ChangelogEntryNotFound",
  Effect.gen(function* () {
    const response = yield* asTeacher("DELETE", "/api/admin/changelog/01CE9900000000000000000000");

    expect(response.status).toBe(404);
    expect(failedWith(response, ChangelogEntryNotFound)).toBe(true);
  }),
);
