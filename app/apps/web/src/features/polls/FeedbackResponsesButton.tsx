import type { AdminPoll } from "@kurasu/contract/polls";
import { useState } from "react";

import { Button } from "../../ui/Button.tsx";
import { FeedbackResponsesSheet } from "./FeedbackResponsesSheet.tsx";

interface Props {
  poll: AdminPoll;
}

export const FeedbackResponsesButton = ({ poll }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="pill-dark" onClick={() => setIsOpen(true)}>
        Ver las respuestas
      </Button>
      {isOpen ? <FeedbackResponsesSheet poll={poll} onClose={() => setIsOpen(false)} /> : null}
    </>
  );
};
