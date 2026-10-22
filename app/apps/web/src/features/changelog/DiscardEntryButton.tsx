import type { ChangelogEntry } from "@kurasu/contract/changelog";

import { ConfirmAction } from "../../ui/ConfirmAction.tsx";
import { Icon } from "../../ui/Icon.tsx";
import { useDiscardEntry } from "./useDiscardEntry.ts";

interface Props {
  entry: ChangelogEntry;
}

export const DiscardEntryButton = ({ entry }: Props) => {
  const discard = useDiscardEntry();

  return (
    <ConfirmAction
      renderTrigger={(ask) => (
        <button
          type="button"
          title="Descartar"
          aria-label={`Descartar ${entry.name}`}
          onClick={ask}
          className="icon-button text-coal hover:bg-mist"
        >
          <Icon name="trash" size={16} />
        </button>
      )}
      title={`¿Descartar "${entry.name}"?`}
      text="No va a aparecer en ningún anuncio."
      confirmLabel="Descartar"
      pendingLabel="Descartando…"
      errorText="No se pudo descartar la novedad. Probá de nuevo."
      onConfirm={() => discard.mutateAsync(entry.id)}
    />
  );
};
