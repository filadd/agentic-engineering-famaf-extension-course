import type { FeedbackValue, Poll } from "@kurasu/contract/polls";

export const feedbackFaces = ["😞", "😕", "😐", "🙂", "😄"] as const;

export const feedbackAnchors = ["No me gustó", "Más o menos", "Me gustó"] as const;

export const feedbackAnswerOf = (poll: Poll): FeedbackValue | null =>
  poll.myResponse != null && "pick" in poll.myResponse ? poll.myResponse : null;
