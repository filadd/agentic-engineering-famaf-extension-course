// Live state of each session's classroom. The event log lives in memory: it only has to
// last for the class, and replaying it is how late joiners catch up with the teacher.
const classrooms = new Map();

const classroom = (number) => {
  if (!classrooms.has(number)) {
    classrooms.set(number, { events: [], clients: new Set(), showStudents: false, hands: new Map() });
  }

  return classrooms.get(number);
};

const send = (res, message) => res.write(`data: ${JSON.stringify(message)}\n\n`);

const broadcast = (number, message) => {
  for (const client of classroom(number).clients) {
    send(client.res, message);
  }
};

// One entry per student, even with the classroom open in several tabs.
const studentNames = (number) => {
  const byId = new Map();

  for (const client of classroom(number).clients) {
    if (client.student != null) {
      byId.set(client.student.id, client.student);
    }
  }

  return [...byId.values()].sort((a, b) => a.name.localeCompare(b.name, "es"));
};

const broadcastPresence = (number) => {
  broadcast(number, { type: "presence", students: studentNames(number) });
};

export const joinClassroom = (number, materialId, { res, teacher, student, extra }) => {
  const room = classroom(number);
  const client = { res, teacher, student };

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  send(res, { type: "sync", materialId, events: room.events, showStudents: room.showStudents, hands: hands(number), ...extra });
  room.clients.add(client);
  broadcastPresence(number);

  // Proxies close idle streams; a comment line every 25s keeps it open.
  const ping = setInterval(() => res.write(": ping\n\n"), 25_000);

  res.on("close", () => {
    clearInterval(ping);
    room.clients.delete(client);
    broadcastPresence(number);
  });
};

// For messages whose content depends on who receives them.
export const broadcastEach = (number, messageFor) => {
  for (const client of classroom(number).clients) {
    send(client.res, messageFor(client));
  }
};

export const changeMaterial = (number, materialId) => {
  classroom(number).events = [];
  broadcast(number, { type: "material", materialId });
};

// Raised hands outlive reloads and disconnects: they stay up until the student or the teacher lowers them.
const hands = (number) => [...classroom(number).hands.entries()].map(([id, name]) => ({ id, name }));

export const setHand = (number, student, raised) => {
  const room = classroom(number);

  if (raised) {
    room.hands.set(student.id, student.name);
  } else {
    room.hands.delete(student.id);
  }

  broadcast(number, { type: "hands", hands: hands(number) });
};

export const toggleStudents = (number, show) => {
  classroom(number).showStudents = show;
  broadcast(number, { type: "students-panel", show });
};

export const pushEvent = (number, event) => {
  classroom(number).events.push(event);
  broadcast(number, { type: "event", event });
};
