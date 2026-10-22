import type { AdminPoll, PollChange } from "@kurasu/contract/polls";
import * as Context from "effect/Context";

import type { Repository } from "../repository.ts";

export type StoredPoll = Omit<AdminPoll, "results">;

// Polls stored in D1. Every read leaves out deleted polls; `remove` marks the
// poll as deleted and keeps the row and its responses.
export class PollsStore extends Context.Service<
  PollsStore,
  Pick<
    Repository<StoredPoll, StoredPoll, PollChange>,
    "get" | "list" | "create" | "update" | "remove"
  >
>()("kurasu/PollsStore") {}
