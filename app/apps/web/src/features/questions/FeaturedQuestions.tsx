import { useState } from "react";

import { Button } from "../../ui/Button.tsx";
import { SkeletonOf } from "../../ui/SkeletonOf.tsx";
import { countLabel } from "../../ui/count-label.ts";
import { Icon } from "../../ui/Icon.tsx";
import { DeleteOwnQuestion } from "./DeleteOwnQuestion.tsx";
import { questionExamples } from "./question-examples.ts";
import { QuestionForm } from "./QuestionForm.tsx";
import { QuestionList } from "./QuestionList.tsx";
import { useQuestions } from "./useQuestions.ts";
import { VoteToggle } from "./VoteToggle.tsx";

interface Props {
  sessionId: string;
}

const visibleCount = 3;

export const FeaturedQuestions = ({ sessionId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const questions = useQuestions(sessionId);

  const sorted = questions.data?.toSorted((a, b) => b.votes - a.votes);

  const shown = isOpen
    ? sorted
    : sorted?.filter((question, index) => index < visibleCount || question.mine);

  const hidden = (sorted?.length ?? 0) - (shown?.length ?? 0);

  const toggleLabel = isOpen
    ? "Mostrar menos"
    : `Mostrar ${countLabel(hidden, "pregunta más", "preguntas más")}`;

  return (
    <div className="paper mt-3.5 px-[18px] py-4 text-coal max-[600px]:p-3.5">
      <div className="flex items-start gap-2 font-display font-medium">
        <Icon name="chat-messages" size={18} className="mt-0.5" />
        <h3>Preguntas</h3>
      </div>
      <div className="mt-0.5 text-[13px] opacity-70">
        {sorted == null ? "Votá" : `${countLabel(sorted.length, "pregunta", "preguntas")} · votá`}{" "}
        las que también querés que responda el profe
      </div>
      <QuestionForm sessionId={sessionId} />
      {shown == null ? (
        <SkeletonOf>
          <QuestionList
            questions={questionExamples}
            renderVotes={(question) => <VoteToggle question={question} readOnly />}
            renderActions={() => null}
          />
        </SkeletonOf>
      ) : (
        <QuestionList
          questions={shown}
          emptyText="Todavía no hay preguntas. Hacé la primera."
          renderVotes={(question) => <VoteToggle question={question} readOnly={false} />}
          renderActions={(question) =>
            question.mine ? <DeleteOwnQuestion question={question} /> : null
          }
        />
      )}
      {isOpen || hidden > 0 ? (
        <div className="mt-1 flex justify-end">
          <Button variant="pill-ghost" onClick={() => setIsOpen(!isOpen)}>
            {toggleLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
};
