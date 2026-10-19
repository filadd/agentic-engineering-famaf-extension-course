// The classroom shares the web's origin, so the socket goes to the same host
// over ws or wss.
export const classroomUrl = (sessionId: string) => {
  const protocol = globalThis.location.protocol === "https:" ? "wss:" : "ws:";

  return `${protocol}//${globalThis.location.host}/api/classroom?sessionId=${encodeURIComponent(sessionId)}`;
};
