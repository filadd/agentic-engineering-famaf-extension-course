import type { PollDraft } from "@kurasu/contract/polls";

type Labelled = Pick<PollDraft, "scaleMinLabel" | "scaleMaxLabel">;

export const scaleLabelsOf = (poll: Labelled): readonly [string, string] => [
  poll.scaleMinLabel ?? "",
  poll.scaleMaxLabel ?? "",
];
