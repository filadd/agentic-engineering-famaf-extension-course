import { ClassroomMessage } from "@kurasu/contract/classroom";
import type { Person } from "@kurasu/contract/classroom";
import { useQueryClient } from "@tanstack/react-query";
import * as Option from "effect/Option";
import * as Schema from "effect/Schema";
import { WebSocket as ReconnectingSocket } from "partysocket";
import { useEffect, useState } from "react";

import { classroomUrl } from "./classroom-url.ts";
import {
  invalidateClassroom,
  invalidateSessionLists,
  invalidateTopic,
} from "./invalidate-topic.ts";

// After a cut, try again soon and then back off, up to ten seconds apart.
const reconnection = {
  minReconnectionDelay: 500,
  reconnectionDelayGrowFactor: 1.5,
  maxReconnectionDelay: 10_000,
};

const decodeMessage = Schema.decodeUnknownOption(Schema.fromJsonString(ClassroomMessage));

// The live classroom of a session. Every notice only says what changed; the
// data always comes again from the API through the hooks.
export const useClassroom = (sessionId: string) => {
  const queryClient = useQueryClient();

  // Undefined until the first `presence` arrives.
  const [people, setPeople] = useState<ReadonlyArray<Person>>();
  const [reconnecting, setReconnecting] = useState(false);

  useEffect(() => {
    const socket = new ReconnectingSocket(() => classroomUrl(sessionId), [], reconnection);

    let opened = false;

    // Opening, also after a cut, asks again for everything of the session, so
    // nothing changed while the socket was down gets lost.
    socket.addEventListener("open", () => {
      opened = true;
      setReconnecting(false);
      void invalidateClassroom(queryClient, sessionId);
    });

    // The browser does not see why an upgrade was refused. A socket that
    // closes without having opened makes the web ask for the sessions again,
    // and the screen acts on what comes back.
    socket.addEventListener("close", () => {
      setPeople([]);

      if (opened) {
        opened = false;
        setReconnecting(true);

        return;
      }

      void invalidateSessionLists(queryClient);
    });

    socket.addEventListener("message", (event) => {
      Option.match(decodeMessage(event.data), {
        onNone: () => undefined,
        onSome: (message) =>
          message.type === "presence"
            ? setPeople(message.people)
            : void invalidateTopic(queryClient, sessionId, message.topic),
      });
    });

    return () => socket.close();
  }, [queryClient, sessionId]);

  return {
    people,
    reconnecting,
    teacherPresent: people?.some((person) => person.role === "teacher") ?? false,
  };
};
