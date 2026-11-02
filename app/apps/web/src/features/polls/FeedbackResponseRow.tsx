import type { FeedbackResponse } from "@kurasu/contract/polls";

import { Avatar } from "../me/Avatar.tsx";
import { feedbackFaces } from "./feedback-faces.ts";

interface Props {
  response: FeedbackResponse;
}

export const FeedbackResponseRow = ({ response }: Props) => (
  <li className="flex items-start gap-2.5 answer-box">
    <Avatar animal={response.user.avatar} size="small" />
    <div className="min-w-0 flex-1">
      <div className="font-display text-sm font-medium">{response.user.name}</div>
      <p className="mt-0.5 text-sm break-words whitespace-pre-wrap">
        {response.text ?? <span className="opacity-60">Sin comentario.</span>}
      </p>
    </div>
    <span aria-label={`${response.pick} de 5`} className="ml-auto text-xl">
      {feedbackFaces[response.pick - 1]}
    </span>
  </li>
);
