import { changelogLine, type ChangelogEntry } from "@kurasu/contract/changelog";
import { useState } from "react";

import { Button } from "../../ui/Button.tsx";
import { Icon } from "../../ui/Icon.tsx";
import { InlineError } from "../../ui/InlineError.tsx";
import { Sheet } from "../../ui/Sheet.tsx";
import { ChangelogTypeChip } from "./ChangelogTypeChip.tsx";
import { useSendAnnouncement } from "./useSendAnnouncement.ts";

interface Props {
  sessionId: string;
  entries: ReadonlyArray<ChangelogEntry>;
  onClose: () => void;
  onSent: (ids: ReadonlyArray<string>) => void;
}

// The chosen entries are shown, not chosen here: they change in the column.
export const AnnouncementDialog = ({ sessionId, entries, onClose, onSent }: Props) => {
  const [message, setMessage] = useState("");

  const send = useSendAnnouncement({ onSuccess: (_, input) => onSent(input.entryIds) });

  return (
    <Sheet open onClose={onClose} title="Anuncio" width="normal" pending={send.isPending}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          send.mutate({ sessionId, message, entryIds: entries.map((entry) => entry.id) });
        }}
      >
        <label className="field-label">
          Mensaje
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Escribí el anuncio"
            disabled={send.isPending}
            className="input-field min-h-24 resize-y"
          />
        </label>
        <div className="mt-3 mb-1.5 text-sm font-bold">Novedades incluidas</div>
        {entries.length === 0 ? (
          <div className="text-sm text-muted">Ninguna novedad elegida.</div>
        ) : (
          <ul aria-label="Novedades incluidas" className="flex flex-col gap-2">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="flex items-start gap-2 rounded-xl border-[1.5px] border-sand bg-paper px-3.5 py-2.5 text-coal"
              >
                <ChangelogTypeChip type={entry.type} />
                <div className="min-w-0 flex-1">
                  <b className="block truncate">{entry.name}</b>
                  <small className="block text-[13px] text-stone">{changelogLine(entry)}</small>
                </div>
              </li>
            ))}
          </ul>
        )}
        {send.isError ? (
          <InlineError className="mt-3">No se pudo enviar el anuncio. Probá de nuevo.</InlineError>
        ) : null}
        <div className="mt-[18px] flex justify-end gap-2">
          <Button variant="pill" disabled={send.isPending} onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="pill-dark"
            type="submit"
            disabled={!(message.trim() !== "" || entries.length > 0)}
            pending={send.isPending}
            pendingLabel="Enviando…"
          >
            <Icon name="send" size={16} />
            Enviar anuncio
          </Button>
        </div>
      </form>
    </Sheet>
  );
};
