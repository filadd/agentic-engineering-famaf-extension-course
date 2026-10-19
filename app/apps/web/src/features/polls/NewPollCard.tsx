import type { PollType } from "@kurasu/contract/polls";
import { useState } from "react";

import { Button } from "../../ui/Button.tsx";
import { emptyContent, fieldsOf, isComplete } from "./poll-content.ts";
import { pollTypeLabels } from "./poll-labels.ts";
import { PollEditor } from "./PollEditor.tsx";
import { useCreatePoll } from "./useCreatePoll.ts";

interface Props {
  sessionId: string;
  type: PollType;
  onDone: () => void;
}

// A poll that is not saved yet: it becomes a draft when the teacher saves it.
export const NewPollCard = ({ sessionId, type, onDone }: Props) => {
  const [draft, setDraft] = useState(emptyContent);

  const create = useCreatePoll({ onSuccess: onDone });

  return (
    <article aria-label="Nueva encuesta" className="paper px-[18px] py-4">
      <span className="mb-1 inline-block rounded-full bg-[#efe6e0] px-2.5 py-0.5 text-xs text-coal">
        Borrador
      </span>
      <div className="font-display font-medium">
        {draft.prompt === "" ? "Nueva encuesta" : draft.prompt}
      </div>
      <div className="text-[13px] opacity-70">{pollTypeLabels[type]}</div>
      <PollEditor type={type} value={draft} onChange={setDraft} />
      <div className="mt-3 flex justify-end gap-2">
        <Button variant="pill" className="border-sand text-coal" onClick={onDone}>
          Descartar
        </Button>
        <Button
          variant="pill-dark"
          className="border-coal bg-coal text-white"
          disabled={!isComplete(type, draft) || create.isPending}
          onClick={() => create.mutate({ sessionId, type, ...fieldsOf(type, draft) })}
        >
          Guardar borrador
        </Button>
      </div>
    </article>
  );
};
