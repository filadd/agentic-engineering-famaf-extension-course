import type { Poll } from "@kurasu/contract/polls";
import * as Predicate from "effect/Predicate";
import { useState } from "react";

import { Button } from "../../ui/Button.tsx";
import { InlineError } from "../../ui/InlineError.tsx";
import { FeedbackAnswer } from "./FeedbackAnswer.tsx";
import { FeedbackScale } from "./FeedbackScale.tsx";
import { useVote } from "./useVote.ts";

interface Props {
  poll: Poll;
  onClosed?: () => void;
}

export const FeedbackForm = ({ poll, onClosed }: Props) => {
  const mine = poll.myResponse != null && "pick" in poll.myResponse ? poll.myResponse : null;

  const [isEditing, setIsEditing] = useState(false);
  const [pick, setPick] = useState<number | null>(mine?.pick ?? null);
  const [text, setText] = useState(mine?.text ?? "");

  const vote = useVote({
    onSuccess: () => setIsEditing(false),
    onError: (error) => (Predicate.isTagged(error, "PollNotActive") ? onClosed?.() : undefined),
  });

  if (mine != null && !isEditing) {
    return (
      <FeedbackAnswer
        answer={mine}
        closed={false}
        action={
          <button
            type="button"
            className="text-sm text-coal underline"
            onClick={() => setIsEditing(true)}
          >
            Cambiar mi respuesta
          </button>
        }
      />
    );
  }

  return (
    <div>
      <FeedbackScale value={pick} onChange={setPick} disabled={vote.isPending} />
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="¿Qué te pareció la sesión? (opcional)"
        aria-label="Comentario"
        disabled={vote.isPending}
        className="input-field mt-3 min-h-[74px] resize-y"
      />
      {vote.isError && !Predicate.isTagged(vote.error, "PollNotActive") ? (
        <InlineError className="mt-2.5">No se pudo enviar tu feedback. Probá de nuevo.</InlineError>
      ) : null}
      <div className="mt-3 flex items-center justify-end gap-3">
        {mine == null ? null : (
          <button
            type="button"
            className="text-sm text-coal underline"
            disabled={vote.isPending}
            onClick={() => setIsEditing(false)}
          >
            Cancelar
          </button>
        )}
        <Button
          variant="main"
          disabled={pick == null}
          pending={vote.isPending}
          pendingLabel="Enviando…"
          onClick={() => {
            if (pick == null) {
              return;
            }

            vote.mutate({
              pollId: poll.id,
              myResponse: text.trim() === "" ? { pick } : { pick, text },
            });
          }}
        >
          {mine == null ? "Enviar feedback" : "Modificar feedback"}
        </Button>
      </div>
    </div>
  );
};
