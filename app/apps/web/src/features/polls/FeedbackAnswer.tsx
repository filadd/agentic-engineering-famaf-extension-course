import type { ResponseValue } from "@kurasu/contract/polls";
import type { ReactNode } from "react";

import { feedbackFaces } from "./feedback-faces.ts";

type FeedbackValue = Extract<ResponseValue, { pick: number }>;

interface Props {
  answer: FeedbackValue | null;
  closed: boolean;
  action?: ReactNode;
}

export const FeedbackAnswer = ({ answer, closed, action }: Props) =>
  answer == null ? (
    <div className="mt-2 text-sm opacity-70">No respondiste esta encuesta.</div>
  ) : (
    <div>
      <div className="mt-3 flex items-start gap-3">
        <span className="grid size-[34px] flex-none place-items-center rounded-full bg-mint">
          ✓
        </span>
        <div>
          <div className="font-display font-medium">
            {closed ? "La encuesta se cerró." : "Gracias, ya nos llegó tu feedback."}
          </div>
          <div className="text-[13px] opacity-70">
            {closed ? "Esta encuesta no acepta cambios." : "Podés cambiarlo cuando quieras."}
          </div>
        </div>
      </div>
      <div className="mt-2.5 flex items-baseline gap-2.5 rounded-[14px] border-2 border-sand px-3.5 py-2.5">
        <span aria-label={`${answer.pick} de 5`} className="text-[26px]">
          {feedbackFaces[answer.pick - 1]}
        </span>
        <p className="min-w-0 break-words whitespace-pre-wrap">
          {answer.text ?? <span className="opacity-60">Sin comentario.</span>}
        </p>
      </div>
      {action == null ? null : <div className="mt-2.5 flex justify-end">{action}</div>}
    </div>
  );
