import type { AdminPoll } from "@kurasu/contract/polls";
import { useState } from "react";

import { Button } from "../../ui/Button.tsx";
import { FeedbackResponsesSheet } from "./FeedbackResponsesSheet.tsx";

interface Props {
  poll: AdminPoll;
}

export const FeedbackResponsesButton = ({ poll }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="pill-dark"
        className="border-coal bg-coal text-white"
        onClick={() => setOpen(true)}
      >
        Ver las respuestas
      </Button>
      {open ? <FeedbackResponsesSheet poll={poll} onClose={() => setOpen(false)} /> : null}
    </>
  );
};
