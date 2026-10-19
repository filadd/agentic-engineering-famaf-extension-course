import { request as httpRequest } from "node:http";

import { ClassroomMessage, type ClassroomTopic } from "@kurasu/contract/classroom";
import * as Effect from "effect/Effect";
import * as Schedule from "effect/Schedule";
import * as Schema from "effect/Schema";
import { WebSocket } from "ws";

const decodeMessage = Schema.decodeUnknownSync(Schema.fromJsonString(ClassroomMessage));

const classroomPath = (sessionId: string) =>
  `/api/classroom?sessionId=${encodeURIComponent(sessionId)}`;

export interface ClassroomSocket {
  readonly waitFor: (
    predicate: (message: ClassroomMessage) => boolean,
  ) => Effect.Effect<ClassroomMessage>;
  readonly quietFor: (predicate: (message: ClassroomMessage) => boolean) => Effect.Effect<boolean>;
  readonly close: Effect.Effect<void>;
}

// Opens the classroom WebSocket of a session with a session cookie, as the web
// does, and keeps every message it receives. `waitFor` takes the first message
// that matches, waiting up to five seconds for it; `quietFor` waits a second
// and tells whether no message matched. The socket closes with the test's
// scope.
export const openClassroom = (url: string, sessionId: string, cookie: string) =>
  Effect.acquireRelease(
    Effect.callback<ClassroomSocket, string>((resume) => {
      const received: Array<ClassroomMessage> = [];

      const socket = new WebSocket(`${url.replace(/^http/, "ws")}${classroomPath(sessionId)}`, {
        headers: { cookie },
      });

      const waitFor = (predicate: (message: ClassroomMessage) => boolean) =>
        Effect.suspend(() => {
          const index = received.findIndex(predicate);

          const [message] = index === -1 ? [] : received.splice(index, 1);

          return message == null ? Effect.fail("no matching message yet") : Effect.succeed(message);
        }).pipe(Effect.retry({ schedule: Schedule.spaced("50 millis"), times: 100 }), Effect.orDie);

      const quietFor = (predicate: (message: ClassroomMessage) => boolean) =>
        Effect.sleep("1 second").pipe(Effect.map(() => !received.some(predicate)));

      const close = Effect.sync(() => socket.close());

      socket.on("message", (data) => {
        const text = Array.isArray(data) ? Buffer.concat(data) : Buffer.from(data);

        received.push(decodeMessage(text.toString("utf8")));
      });
      socket.on("open", () => resume(Effect.succeed({ waitFor, quietFor, close })));
      socket.on("error", (error) =>
        resume(Effect.fail(`the classroom socket failed: ${error.message}`)),
      );
    }),
    (socket) => socket.close,
  );

// Sends the upgrade request a browser would and returns the HTTP status: 101
// when the classroom accepts it, or the error status when it refuses. A browser
// never sees that status; the API tests use it to tell the refusals apart.
export const upgradeStatus = (url: string, sessionId: string, cookie: string | undefined) =>
  Effect.callback<number, Error>((resume) => {
    const upgradeHeaders = {
      connection: "Upgrade",
      upgrade: "websocket",
      "sec-websocket-version": "13",
      "sec-websocket-key": "a3VyYXN1LXRlc3Qta2V5IQ==",
    };

    const headers = cookie == null ? upgradeHeaders : { ...upgradeHeaders, cookie };

    const outgoing = httpRequest(`${url}${classroomPath(sessionId)}`, { headers });

    outgoing.on("upgrade", (response, socket) => {
      socket.destroy();
      resume(Effect.succeed(response.statusCode ?? 101));
    });
    outgoing.on("response", (response) => {
      response.resume();
      resume(Effect.succeed(response.statusCode ?? 0));
    });
    outgoing.on("error", (error) => resume(Effect.fail(error)));
    outgoing.end();
  });

export const isChanged = (topic: ClassroomTopic) => (message: ClassroomMessage) =>
  message.type === "changed" && message.topic === topic;

// The people of a presence message, by id, so a test compares who is present.
export const presentIds = (message: ClassroomMessage) =>
  message.type === "presence" ? message.people.map((person) => person.id).toSorted() : [];

export const isPresence = (ids: ReadonlyArray<string>) => (message: ClassroomMessage) =>
  message.type === "presence" && presentIds(message).join() === ids.toSorted().join();
