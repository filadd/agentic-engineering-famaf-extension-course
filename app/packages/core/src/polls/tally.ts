import type { PollResults, ResponseValue } from "@kurasu/contract/polls";

import type { StoredPoll } from "./polls-store.ts";

const countBy = (size: number, indexes: ReadonlyArray<number>) => {
  const counts = Array.from({ length: size }, () => 0);

  for (const index of indexes) {
    counts[index] = (counts[index] ?? 0) + 1;
  }

  return counts;
};

// Each word counts once per student, however many times they sent it; the
// cloud lists the most sent words first.
const countWords = (lists: ReadonlyArray<ReadonlyArray<string>>) => {
  const counts = new Map<string, number>();

  for (const word of lists.flatMap((words) => [...new Set(words)])) {
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }

  return [...counts]
    .map(([word, count]) => ({ word, count }))
    .toSorted((a, b) => b.count - a.count || a.word.localeCompare(b.word));
};

// The results of a poll from its votes, without saying who voted what: a count
// per option, per point of the scale (1 to 5) or per word.
export const tally = (poll: StoredPoll, values: ReadonlyArray<ResponseValue>): PollResults => {
  const count = values.length;

  if (poll.type === "choice") {
    const choices = values.flatMap((value) => ("choice" in value ? [value.choice] : []));

    return { count, choice: countBy(poll.options?.length ?? 0, choices) };
  }

  if (poll.type === "scale") {
    const points = values.flatMap((value) => ("scale" in value ? [value.scale - 1] : []));

    return { count, scale: countBy(5, points) };
  }

  return {
    count,
    words: countWords(values.flatMap((value) => ("words" in value ? [value.words] : []))),
  };
};

// Whether a vote is of the poll's type and, for a choice, one of its options.
export const fitsPoll = (poll: StoredPoll, value: ResponseValue) => {
  if (poll.type === "choice") {
    return "choice" in value && value.choice < (poll.options?.length ?? 0);
  }

  return poll.type === "scale" ? "scale" in value : "words" in value;
};
