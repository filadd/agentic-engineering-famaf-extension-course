import * as Predicate from "effect/Predicate";

const terminalTags = [
  "Unauthenticated",
  "NoAccess",
  "NotTeacher",
  "NotStudent",
  "NotAuthor",
  "InvalidLink",
  "NotRegistered",
  "UserNotFound",
  "SessionNotFound",
  "PollNotFound",
  "MaterialNotFound",
  "QuestionNotFound",
];

// The errors that send the person back to the login: no valid session cookie,
// or an account without access.
export const isAccessError = (error: Error) =>
  Predicate.isTagged(error, "Unauthenticated") || Predicate.isTagged(error, "NoAccess");

// 401, 403 and 404 answer the same on a second try.
export const isTerminalError = (error: Error) =>
  terminalTags.some((tag) => Predicate.isTagged(error, tag));
