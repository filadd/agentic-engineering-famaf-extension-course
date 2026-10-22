import {
  InvalidPollContent,
  InvalidResponse,
  InvalidTransition,
  NotStudent,
  PollNotActive,
  PollNotDraft,
  PollNotFound,
  type SessionNotFound,
} from "@kurasu/contract/errors";
import {
  type AdminPoll,
  type Poll,
  type PollChange,
  type PollDraft,
  type PollStatus,
  type ResponseValue,
  type VisiblePollStatus,
} from "@kurasu/contract/polls";
import type { Ulid } from "@kurasu/contract/ulid";
import type { User } from "@kurasu/contract/user";
import * as Context from "effect/Context";
import * as Crypto from "effect/Crypto";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";

import { Classroom } from "../classroom.ts";
import { SessionsStore } from "../sessions/sessions-store.ts";
import { existingSession, visibleSession } from "../sessions/visible-session.ts";
import { fitsType } from "./fits-type.ts";
import { PollsStore, type StoredPoll } from "./polls-store.ts";
import { ResponsesStore } from "./responses-store.ts";
import { fitsPoll, tally } from "./tally.ts";

export interface StudentPollFilter {
  readonly sessionId?: Ulid | undefined;
  readonly status?: VisiblePollStatus | undefined;
}

const transitions: ReadonlyArray<readonly [PollStatus, PollStatus]> = [
  ["draft", "active"],
  ["active", "closed"],
];

const isContentChange = (change: PollChange) =>
  change.prompt != null ||
  change.options != null ||
  change.scaleMinLabel != null ||
  change.scaleMaxLabel != null;

// Drafts never reach the student, so a stored status they see is active or
// closed.
const visibleStatus = (status: PollStatus): VisiblePollStatus =>
  status === "closed" ? "closed" : "active";

// The polls as each side sees them. The student sees the active and closed
// polls of enabled sessions, with their own vote, and the results once they
// voted or the poll closed. The teacher sees every poll not deleted with its
// results, and moves a poll only from draft to active and from active to
// closed; only a draft's content changes.
export class Polls extends Context.Service<
  Polls,
  {
    readonly listForStudent: (
      viewer: User,
      filter: StudentPollFilter,
    ) => Effect.Effect<ReadonlyArray<Poll>, SessionNotFound>;
    readonly vote: (
      viewer: User,
      id: Ulid,
      response: ResponseValue,
    ) => Effect.Effect<Poll, NotStudent | PollNotFound | PollNotActive | InvalidResponse>;
    readonly listForTeacher: (
      sessionId: Ulid,
    ) => Effect.Effect<ReadonlyArray<AdminPoll>, SessionNotFound>;
    readonly create: (
      draft: PollDraft,
    ) => Effect.Effect<AdminPoll, SessionNotFound | InvalidPollContent>;
    readonly update: (
      id: Ulid,
      change: PollChange,
    ) => Effect.Effect<
      AdminPoll,
      PollNotFound | PollNotDraft | InvalidTransition | InvalidPollContent
    >;
    readonly remove: (id: Ulid) => Effect.Effect<void, PollNotFound>;
  }
>()("kurasu/Polls") {
  static readonly layer = Layer.effect(
    Polls,
    Effect.gen(function* () {
      const store = yield* PollsStore;
      const responses = yield* ResponsesStore;
      const sessions = yield* SessionsStore;
      const classroom = yield* Classroom;
      const crypto = yield* Crypto.Crypto;

      const forStudent = (viewer: User, polls: ReadonlyArray<StoredPoll>) =>
        Effect.gen(function* () {
          const ids = polls.map((poll) => poll.id);
          const mine = yield* responses.forUser(viewer.id, ids);

          const shown = polls.flatMap((poll) =>
            poll.status === "closed" || mine.has(poll.id) ? [poll.id] : [],
          );

          const values = yield* responses.values(shown);

          return polls.map((poll): Poll => ({
            ...poll,
            status: visibleStatus(poll.status),
            myResponse: mine.get(poll.id) ?? null,
            results: Option.match(Option.fromNullishOr(values.get(poll.id)), {
              onNone: () => null,
              onSome: (pollValues) => tally(poll, pollValues),
            }),
          }));
        });

      const forTeacher = (polls: ReadonlyArray<StoredPoll>) =>
        Effect.map(responses.values(polls.map((poll) => poll.id)), (values) =>
          polls.map((poll): AdminPoll => ({
            ...poll,
            results: tally(poll, values.get(poll.id) ?? []),
          })),
        );

      const findPoll = (id: Ulid) =>
        Effect.flatMap(store.get(id), (poll) =>
          Effect.fromOption(poll).pipe(Effect.mapError(() => new PollNotFound())),
        );

      const notifyPolls = (poll: StoredPoll) => classroom.notify(poll.sessionId, "polls");

      return Polls.of({
        listForStudent: Effect.fn("Polls.listForStudent")(function* (viewer, filter) {
          const sessionIds =
            filter.sessionId == null
              ? (yield* sessions.listEnabled()).map((session) => session.id)
              : [(yield* visibleSession(sessions, filter.sessionId)).id];

          const polls = yield* store.list({
            where: {
              sessionId: sessionIds,
              status: filter.status == null ? ["active", "closed"] : [filter.status],
            },
          });

          return yield* forStudent(viewer, polls);
        }),
        vote: Effect.fn("Polls.vote")(function* (viewer, id, response) {
          if (viewer.role !== "student") {
            return yield* new NotStudent();
          }

          const poll = yield* findPoll(id);

          yield* visibleSession(sessions, poll.sessionId).pipe(
            Effect.mapError(() => new PollNotFound()),
          );

          if (poll.status !== "active") {
            return yield* new PollNotActive();
          }

          if (!fitsPoll(poll, response)) {
            return yield* new InvalidResponse();
          }

          const responseId = yield* crypto.randomULID.pipe(Effect.orDie);

          yield* responses.upsert({
            id: responseId,
            pollId: poll.id,
            userId: viewer.id,
            value: response,
          });
          yield* notifyPolls(poll);

          const [voted] = yield* forStudent(viewer, [poll]);

          return voted ?? (yield* Effect.die("the voted poll was not read back"));
        }),
        listForTeacher: Effect.fn("Polls.listForTeacher")(function* (sessionId) {
          yield* existingSession(sessions, sessionId);

          return yield* forTeacher(yield* store.list({ where: { sessionId } }));
        }),
        create: Effect.fn("Polls.create")(function* (draft) {
          yield* existingSession(sessions, draft.sessionId);

          if (!fitsType(draft)) {
            return yield* new InvalidPollContent();
          }

          const id = yield* crypto.randomULID.pipe(Effect.orDie);
          const poll = yield* store.create({ ...draft, id, status: "draft" });

          return { ...poll, results: tally(poll, []) };
        }),
        update: Effect.fn("Polls.update")(function* (id, change) {
          const poll = yield* findPoll(id);

          if (isContentChange(change) && poll.status !== "draft") {
            return yield* new PollNotDraft();
          }

          const next = change.status;

          if (
            next != null &&
            !transitions.some(([from, to]) => from === poll.status && to === next)
          ) {
            return yield* new InvalidTransition();
          }

          // The content a draft ends up with must still fit its type.
          if (
            !fitsType({
              type: poll.type,
              options: change.options ?? poll.options,
              scaleMinLabel: change.scaleMinLabel ?? poll.scaleMinLabel,
              scaleMaxLabel: change.scaleMaxLabel ?? poll.scaleMaxLabel,
            })
          ) {
            return yield* new InvalidPollContent();
          }

          const updated = yield* Effect.flatMap(store.update(id, change), (stored) =>
            Effect.fromOption(stored).pipe(Effect.mapError(() => new PollNotFound())),
          );

          if (next != null) {
            yield* notifyPolls(updated);
          }

          const [withResults] = yield* forTeacher([updated]);

          return withResults ?? (yield* Effect.die("the updated poll was not read back"));
        }),
        remove: Effect.fn("Polls.remove")(function* (id) {
          const poll = yield* findPoll(id);

          yield* store.remove(id);
          yield* notifyPolls(poll);
        }),
      });
    }),
  );
}
