import { type ClassroomMessage, type ClassroomTopic, Person } from "@kurasu/contract/classroom";
import * as Cloudflare from "alchemy/Cloudflare";
import * as Effect from "effect/Effect";
import * as HttpServerRequest from "effect/http/HttpServerRequest";
import * as HttpServerResponse from "effect/http/HttpServerResponse";
import * as Option from "effect/Option";
import * as Schema from "effect/Schema";

import { personHeader } from "./person-header.ts";

const decodePersonHeader = Schema.decodeUnknownOption(Schema.fromJsonString(Person));
const decodeAttachment = Schema.decodeUnknownOption(Person);
const encodeAttachment = Schema.encodeSync(Person);

const openState = 1;

// 1005 and 1006 report a close that carried no code, and cannot be sent back.
const closeCode = (code: number) => (code === 1005 || code === 1006 ? 1000 : code);

type RawSocket = Cloudflare.WebSocket["ws"];

// The classroom of one session. It keeps nothing in memory: every socket
// carries, in its hibernation attachment, the person who opened it, with the
// name and avatar they had then, so the present people survive hibernation.
// It accepts sockets without tags (alchemy issue #2264), so every notice goes
// to every socket. The web never writes to it.
export default class Aula extends Cloudflare.DurableObject<Aula>()(
  "Aula",
  Effect.map(Effect.service(Cloudflare.DurableObjectState), (state) => {
    // A socket that is closing still shows among the object's sockets, so the
    // one leaving is left out by hand.
    const openSockets = (leaving: RawSocket | undefined) =>
      state.raw
        .getWebSockets()
        .filter((socket) => socket !== leaving && socket.readyState === openState);

    // One record per person, however many tabs they have open.
    const present = (leaving: RawSocket | undefined) => {
      const people = new Map<string, Person>();

      for (const socket of openSockets(leaving)) {
        const person = decodeAttachment(socket.deserializeAttachment());

        if (Option.isSome(person)) {
          people.set(person.value.id, person.value);
        }
      }

      return [...people.values()];
    };

    const broadcast = (message: ClassroomMessage, leaving: RawSocket | undefined) => {
      const text = JSON.stringify(message);

      for (const socket of openSockets(leaving)) {
        socket.send(text);
      }
    };

    const sendPresence = (leaving: RawSocket | undefined) =>
      broadcast({ type: "presence", people: present(leaving) }, leaving);

    return Effect.succeed({
      fetch: Effect.gen(function* () {
        const request = yield* HttpServerRequest.HttpServerRequest;
        const person = decodePersonHeader(request.headers[personHeader]);

        if (Option.isNone(person)) {
          return HttpServerResponse.empty({ status: 400 });
        }

        const [response, socket] = yield* Cloudflare.upgrade();

        socket.serializeAttachment(encodeAttachment(person.value));
        sendPresence(undefined);

        return response;
      }),
      notify: (topic: ClassroomTopic) =>
        Effect.sync(() => broadcast({ type: "changed", topic }, undefined)),
      webSocketClose: (socket: Cloudflare.WebSocket, code: number, reason: string) =>
        socket
          .close(closeCode(code), reason)
          .pipe(Effect.ignoreCause, Effect.andThen(Effect.sync(() => sendPresence(socket.ws)))),
      webSocketError: (socket: Cloudflare.WebSocket) => Effect.sync(() => sendPresence(socket.ws)),
    });
  }),
) {}
