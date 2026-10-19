import { useState } from "react";

import { Button } from "../../ui/Button.tsx";
import { Sheet } from "../../ui/Sheet.tsx";
import { useCreateSession } from "./useCreateSession.ts";

interface Props {
  onClose: () => void;
  onCreated: (id: string) => void;
}

export const NewSessionDialog = ({ onClose, onCreated }: Props) => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");

  const create = useCreateSession({ onSuccess: (session) => onCreated(session.id) });

  return (
    <Sheet open onClose={onClose} title="Nueva sesión" width="normal">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          create.mutate({ title: title.trim(), summary: summary.trim() });
        }}
      >
        <label className="field-label">
          Título
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Ej.: Testing con agentes"
            className="input-field"
          />
        </label>
        <label className="field-label">
          Resumen
          <textarea
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
            placeholder="De qué trata la sesión"
            className="input-field min-h-20 resize-y"
          />
        </label>
        <div className="mt-[18px] flex justify-end gap-2">
          <Button variant="pill" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="pill-dark"
            type="submit"
            disabled={title.trim() === "" || create.isPending}
          >
            Crear sesión
          </Button>
        </div>
      </form>
    </Sheet>
  );
};
