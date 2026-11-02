import type { AdminPoll } from "@kurasu/contract/polls";

import { Sheet } from "../../ui/Sheet.tsx";
import { FeedbackResponseRow } from "./FeedbackResponseRow.tsx";

interface Props {
  poll: AdminPoll;
  onClose: () => void;
}

export const FeedbackResponsesSheet = ({ poll, onClose }: Props) => {
  const count = poll.results.count;
  const responses = poll.responses ?? [];

  return (
    <Sheet open onClose={onClose} title={`${count} ${count === 1 ? "respuesta" : "respuestas"}`}>
      {responses.length === 0 ? (
        <div className="py-1.5 text-sm text-muted">Todavía no hay respuestas.</div>
      ) : (
        <ul className="mt-3 flex flex-col gap-2">
          {responses.map((response) => (
            <FeedbackResponseRow key={response.id} response={response} />
          ))}
        </ul>
      )}
    </Sheet>
  );
};
