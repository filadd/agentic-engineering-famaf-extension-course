import type { ClassroomMessage, Person } from "@kurasu/contract/classroom";
import { ws } from "msw";

const link = ws.link("ws://localhost:5173/api/classroom");

interface Options {
  people?: ReadonlyArray<Person>;
  refuse?: boolean;
}

// The classroom's WebSocket answered by MSW. It sends `presence` to whoever
// connects, and the test can send any notice, or drop the connections. A
// refused classroom closes the socket before it opens, which is all the
// browser sees of a refused upgrade.
export const classroomSocket = ({ people = [], refuse = false }: Options = {}) => {
  let connections = 0;

  const handler = link.addEventListener("connection", ({ client }) => {
    if (refuse) {
      client.close();

      return;
    }

    connections += 1;
    client.send(JSON.stringify({ type: "presence", people }));
  });

  return {
    handler,
    connections: () => connections,
    send: (message: ClassroomMessage) => link.broadcast(JSON.stringify(message)),
    sendRaw: (data: string) => link.broadcast(data),
    dropAll: () => link.clients.forEach((client) => client.close(1012)),
  };
};
