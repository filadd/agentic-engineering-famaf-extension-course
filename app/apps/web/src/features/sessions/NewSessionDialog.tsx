import { useState } from "react";

import { Button } from "../../ui/Button.tsx";
import { InlineError } from "../../ui/InlineError.tsx";
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
        {create.isError ? (
          <InlineError className="mt-3">No se pudo crear la sesión. Probá de nuevo.</InlineError>
        ) : null}
        <div className="mt-[18px] flex justify-end gap-2">
          <Button variant="pill" disabled={create.isPending} onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="pill-dark"
            type="submit"
            disabled={title.trim() === ""}
            pending={create.isPending}
            pendingLabel="Creando…"
          >
            Crear sesión
          </Button>
        </div>
      </form>
    </Sheet>
  );
};
