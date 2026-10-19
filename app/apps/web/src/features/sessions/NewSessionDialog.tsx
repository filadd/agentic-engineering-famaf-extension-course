import { useState } from "react";

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
        <p className="mt-3 text-[13px] text-muted">
          Se suma al final del camino, deshabilitada. El material, las slides y las encuestas se
          cargan desde su página.
        </p>
        <div className="mt-[18px] flex justify-end gap-2">
          <button type="button" className="pill-button" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="submit"
            className="pill-button pill-dark"
            disabled={title.trim() === "" || create.isPending}
          >
            Crear sesión
          </button>
        </div>
      </form>
    </Sheet>
  );
};
