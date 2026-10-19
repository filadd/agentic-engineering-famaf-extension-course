import type { Poll, ResponseValue } from "@kurasu/contract/polls";

const scaleSize = 5;

// The place a choice or scale vote takes in its poll's counts.
const slotOf = (response: ResponseValue | null) => {
  if (response == null || "words" in response) {
    return null;
  }

  return "choice" in response ? response.choice : response.scale - 1;
};

const recount = (counts: ReadonlyArray<number>, from: number | null, to: number) =>
  counts.map((count, slot) => count + (slot === to ? 1 : 0) - (slot === from ? 1 : 0));

// The poll as the student sees it once their vote counts: the new vote added
// to its option or value and, when it replaces one, the old vote taken away.
// Before the first vote the student has no results, so they start from zero
// until the API answers with everyone's. A word cloud vote waits for the API.
export const withVote = (poll: Poll, myResponse: ResponseValue): Poll => {
  const results = poll.results ?? { count: 0 };
  const count = results.count + (poll.myResponse == null ? 1 : 0);
  const from = slotOf(poll.myResponse);

  if ("choice" in myResponse) {
    const counts = results.choice ?? (poll.options ?? []).map(() => 0);

    return {
      ...poll,
      myResponse,
      results: { ...results, count, choice: recount(counts, from, myResponse.choice) },
    };
  }

  if ("scale" in myResponse) {
    const counts = results.scale ?? Array.from({ length: scaleSize }, () => 0);

    return {
      ...poll,
      myResponse,
      results: { ...results, count, scale: recount(counts, from, myResponse.scale - 1) },
    };
  }

  return poll;
};
