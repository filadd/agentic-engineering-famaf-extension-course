import { Sheet } from "../../ui/Sheet.tsx";
import { StudentQuestions } from "./StudentQuestions.tsx";

interface Props {
  sessionId: string;
  readOnly: boolean;
  onClose: () => void;
}

export const QuestionsSheet = ({ sessionId, readOnly, onClose }: Props) => (
  <Sheet open onClose={onClose} title="Preguntas">
    <StudentQuestions sessionId={sessionId} readOnly={readOnly} />
  </Sheet>
);
