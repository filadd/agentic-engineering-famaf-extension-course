import type { Question } from "@kurasu/contract/questions";
import { useState } from "react";

import { Button } from "../../ui/Button.tsx";
import { countLabel } from "../../ui/count-label.ts";
import { Icon } from "../../ui/Icon.tsx";
import { QuestionForm } from "./QuestionForm.tsx";
import { StudentQuestionList } from "./StudentQuestionList.tsx";

interface Props {
  sessionId: string;
  questions: ReadonlyArray<Question>;
}

const visibleCount = 3;

export const FeaturedQuestionsCard = ({ sessionId, questions }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const shown = isOpen
    ? questions
    : questions.filter((question, index) => index < visibleCount || question.mine);

  const hidden = questions.length - shown.length;

  const toggleLabel = isOpen
    ? "Mostrar menos"
    : `Mostrar ${countLabel(hidden, "pregunta más", "preguntas más")}`;

  return (
    <div className="paper skeleton-block mt-3.5 px-[18px] py-4 text-coal max-[600px]:p-3.5">
      <div className="flex items-start gap-2 font-display font-medium">
        <Icon name="chat-messages" size={18} className="mt-0.5" />
        <h3>Preguntas</h3>
      </div>
      <div className="mt-0.5 text-[13px] opacity-70">
        {countLabel(questions.length, "pregunta", "preguntas")} · votá las que también querés que
        responda el profe
      </div>
      <QuestionForm sessionId={sessionId} />
      <StudentQuestionList
        questions={shown}
        readOnly={false}
        emptyText="Todavía no hay preguntas. Hacé la primera."
      />
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
