import type { Session } from "@kurasu/contract/sessions";
import type { Position } from "@kurasu/slides/messages";
import { samePosition } from "@kurasu/slides/navigation";
import { useEffect, useState } from "react";

import { useMoveSlide } from "../sessions/useMoveSlide.ts";
import { positionOf } from "./position-of.ts";

// While moves save, the screen shows its own position and ignores what the
// server answers, because those answers arrive late and would send it back.
// Moves save one at a time, and a move made while another saves only keeps
// the last position.
export const useSlideMoves = (session: Session) => {
  const moveMutation = useMoveSlide();
  const [unsavedPosition, setUnsavedPosition] = useState<Position | null>(null);

  const sentPosition = moveMutation.variables?.position;

  const isSent =
    unsavedPosition != null && sentPosition != null && samePosition(sentPosition, unsavedPosition);

  const isDone = moveMutation.isError || (moveMutation.isSuccess && isSent);

  useEffect(() => {
    if (unsavedPosition == null || moveMutation.isPending || isDone) {
      return;
    }

    moveMutation.mutate({ id: session.id, position: unsavedPosition });
  }, [unsavedPosition, moveMutation, isDone, session.id]);

  // Starting over from an idle mutation forgets what it sent, so moving back
  // to the position saved last still sends it.
  const navigate = (position: Position) => {
    if (!moveMutation.isPending) {
      moveMutation.reset();
    }

    setUnsavedPosition(position);
  };

  return {
    position: unsavedPosition == null || isDone ? positionOf(session) : unsavedPosition,
    navigate,
  };
};
