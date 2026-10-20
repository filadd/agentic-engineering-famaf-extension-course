import type { PollDraft } from "@kurasu/contract/polls";

type PollContent = Pick<PollDraft, "type" | "options" | "scaleMinLabel" | "scaleMaxLabel">;

// A choice poll carries its options and a scale poll its labels; the fields of
// the other types stay empty.
export const fitsType = (poll: PollContent) => {
  const hasLabels = poll.scaleMinLabel != null || poll.scaleMaxLabel != null;

  if (poll.type === "choice") {
    return poll.options != null && !hasLabels;
  }

  return poll.options == null && (poll.type === "scale" || !hasLabels);
};
