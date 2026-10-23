import type { PollResults, ResponseValue } from "@kurasu/contract/polls";

import type { ResponseCounts } from "./responses-store.ts";
import type { StoredPoll } from "./polls-store.ts";

const countsOf = (size: number, votes: ReadonlyArray<readonly [number, number]>) => {
  const counts = Array.from({ length: size }, () => 0);

  for (const [index, count] of votes) {
    counts[index] = (counts[index] ?? 0) + count;
  }

  return counts;
};

// The results of a poll from its counted votes, without saying who voted what:
// a count per option, per point of the scale (1 to 5) or per word, the most
// sent words first.
export const tally = (poll: StoredPoll, counts: ResponseCounts): PollResults => {
  const { count, values } = counts;

  if (poll.type === "choice") {
    const votes = values.flatMap(({ value, count: sent }) =>
      "choice" in value ? [[value.choice, sent] as const] : [],
    );

    return { count, choice: countsOf(poll.options?.length ?? 0, votes) };
  }

  if (poll.type === "scale") {
    const votes = values.flatMap(({ value, count: sent }) =>
      "scale" in value ? [[value.scale - 1, sent] as const] : [],
    );

    return { count, scale: countsOf(5, votes) };
  }

  return {
    count,
    words: counts.words.toSorted((a, b) => b.count - a.count || a.word.localeCompare(b.word)),
  };
};

// Whether a vote is of the poll's type and, for a choice, one of its options.
export const fitsPoll = (poll: StoredPoll, value: ResponseValue) => {
  if (poll.type === "choice") {
    return "choice" in value && value.choice < (poll.options?.length ?? 0);
  }

  return poll.type === "scale" ? "scale" in value : "words" in value;
};
