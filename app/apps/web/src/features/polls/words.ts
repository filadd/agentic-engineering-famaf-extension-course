import { maxWordLength, maxWords } from "@kurasu/contract/polls";

// Words arrive separated by commas; they are joined to the ones already sent,
// lowercased and deduplicated, within the API's limits.
export const mergeWords = (previous: ReadonlyArray<string>, typed: string) =>
  [
    ...new Set(
      [...previous, ...typed.split(",")].flatMap((word) => {
        const clean = word.trim().toLowerCase().slice(0, maxWordLength);

        return clean === "" ? [] : [clean];
      }),
    ),
  ].slice(0, maxWords);
