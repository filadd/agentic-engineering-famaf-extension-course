import { maxOptions } from "@kurasu/contract/polls";
import type { AdminPoll, PollType } from "@kurasu/contract/polls";

export interface PollContent {
  prompt: string;
  options: ReadonlyArray<string>;
  scaleMinLabel: string;
  scaleMaxLabel: string;
}

export const emptyContent: PollContent = {
  prompt: "",
  options: ["", ""],
  scaleMinLabel: "",
  scaleMaxLabel: "",
};

export const contentOf = (poll: AdminPoll): PollContent => ({
  prompt: poll.prompt,
  options: poll.options ?? ["", ""],
  scaleMinLabel: poll.scaleMinLabel ?? "",
  scaleMaxLabel: poll.scaleMaxLabel ?? "",
});

export const isComplete = (type: PollType, content: PollContent) =>
  content.prompt.trim() !== "" &&
  (type !== "choice" ||
    (content.options.length <= maxOptions &&
      content.options.every((option) => option.trim() !== "")));

// What a type of poll carries: a choice poll its options, a scale poll the
// meaning of its ends, a word cloud only its prompt.
export const fieldsOf = (type: PollType, content: PollContent) => {
  if (type === "choice") {
    return {
      prompt: content.prompt.trim(),
      options: content.options.map((option) => option.trim()),
    };
  }

  if (type === "scale") {
    return {
      prompt: content.prompt.trim(),
      scaleMinLabel: content.scaleMinLabel.trim(),
      scaleMaxLabel: content.scaleMaxLabel.trim(),
    };
  }

  return { prompt: content.prompt.trim() };
};
