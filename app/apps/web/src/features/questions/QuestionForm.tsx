import { useState } from "react";

import { Icon } from "../../ui/Icon.tsx";
import { InlineError } from "../../ui/InlineError.tsx";
import { Spinner } from "../../ui/Spinner.tsx";
import { useAskQuestion } from "./useAskQuestion.ts";

interface Props {
  sessionId: string;
}

export const QuestionForm = ({ sessionId }: Props) => {
  const [body, setBody] = useState("");

  const ask = useAskQuestion({ onSuccess: () => setBody("") });

  return (
    <form
      className="mt-1.5 mb-2.5"
      onSubmit={(event) => {
        event.preventDefault();
        ask.mutate({ sessionId, body: body.trim() });
      }}
    >
      <div className="flex gap-1.5">
        <input
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Hacé una pregunta"
          aria-label="Hacé una pregunta"
          className="min-w-0 flex-1 rounded-full border-[1.5px] border-line bg-field px-3.5 py-2 text-sm text-ink"
        />
        <button
          type="submit"
          title={ask.isPending ? "Enviando…" : "Enviar"}
          aria-label={ask.isPending ? "Enviando…" : "Enviar"}
          aria-busy={ask.isPending ? true : undefined}
          disabled={body.trim() === "" || ask.isPending}
          className="icon-button"
        >
          {ask.isPending ? <Spinner size={18} /> : <Icon name="send" size={18} />}
        </button>
      </div>
      {ask.isError ? (
        <InlineError className="mt-2">No se pudo enviar tu pregunta. Probá de nuevo.</InlineError>
      ) : null}
    </form>
  );
};
