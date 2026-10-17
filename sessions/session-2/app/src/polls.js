import { db } from "./db.js";

// Two kinds of poll share the table. Live polls (live = 1) belong to the classroom, one on screen
// at a time. Session polls (live = 0) sit in the session page for students to answer whenever.
// Status: "open" takes votes, "closed" shows everyone the results, "done" hides it but keeps it.

const currentLivePoll = (sessionNumber) =>
  db
    .prepare("SELECT * FROM polls WHERE session_number = ? AND live = 1 AND status != 'done' ORDER BY id DESC LIMIT 1")
    .get(sessionNumber);

const insertPoll = (sessionNumber, question, options, live) =>
  db
    .prepare("INSERT INTO polls (session_number, question, options, live) VALUES (?, ?, ?, ?)")
    .run(sessionNumber, question, JSON.stringify(options), live ? 1 : 0);

export const createLivePoll = (sessionNumber, question, options) => {
  db.prepare("UPDATE polls SET status = 'done' WHERE session_number = ? AND live = 1 AND status != 'done'").run(sessionNumber);
  insertPoll(sessionNumber, question, options, true);
};

export const createSessionPoll = (sessionNumber, question, options) => insertPoll(sessionNumber, question, options, false);

const castVote = (poll, studentId, option) => {
  if (poll == null || poll.status !== "open" || !Number.isInteger(option) || option < 0 || option >= JSON.parse(poll.options).length) {
    return false;
  }

  db.prepare(
    "INSERT INTO poll_votes (poll_id, student_id, option) VALUES (?, ?, ?) ON CONFLICT(poll_id, student_id) DO UPDATE SET option = excluded.option",
  ).run(poll.id, studentId, option);

  return true;
};

export const voteLive = (sessionNumber, studentId, option) => castVote(currentLivePoll(sessionNumber), studentId, option);

export const voteSession = (sessionNumber, pollId, studentId, option) =>
  castVote(
    db.prepare("SELECT * FROM polls WHERE id = ? AND session_number = ? AND live = 0").get(pollId, sessionNumber),
    studentId,
    option,
  );

export const setLivePollStatus = (sessionNumber, status) => {
  const poll = currentLivePoll(sessionNumber);

  if (poll != null) {
    db.prepare("UPDATE polls SET status = ? WHERE id = ?").run(status, poll.id);
  }
};

export const setSessionPollStatus = (pollId, status) =>
  db.prepare("UPDATE polls SET status = ? WHERE id = ? AND live = 0").run(status, pollId);

// Teachers always see the counts; students only once the poll is closed.
const pollView = (poll, { teacher, student }) => {
  const options = JSON.parse(poll.options);
  const votes = db.prepare("SELECT student_id, option FROM poll_votes WHERE poll_id = ?").all(poll.id);
  const showResults = teacher || poll.status === "closed";

  return {
    id: poll.id,
    question: poll.question,
    options,
    status: poll.status,
    myVote: student == null ? null : (votes.find((v) => v.student_id === student.id)?.option ?? null),
    total: votes.length,
    results: showResults ? options.map((_, i) => votes.filter((v) => v.option === i).length) : null,
  };
};

export const livePollFor = (sessionNumber, viewer) => {
  const poll = currentLivePoll(sessionNumber);

  return poll == null ? null : pollView(poll, viewer);
};

export const sessionPollsFor = (sessionNumber, viewer) =>
  db
    .prepare("SELECT * FROM polls WHERE session_number = ? AND live = 0 AND status != 'done' ORDER BY id")
    .all(sessionNumber)
    .map((poll) => pollView(poll, viewer));
