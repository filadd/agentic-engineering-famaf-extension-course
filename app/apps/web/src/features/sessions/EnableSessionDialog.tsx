import type { Session, SessionSummary } from "@kurasu/contract/sessions";
import { useState } from "react";

import { Button } from "../../ui/Button.tsx";
import { InlineError } from "../../ui/InlineError.tsx";
import { Sheet } from "../../ui/Sheet.tsx";
import { Switch } from "../../ui/Switch.tsx";
import { FeaturedEffects } from "./FeaturedEffects.tsx";
import { useUpdateSession } from "./useUpdateSession.ts";

interface Props {
  session: Session;
  featured: SessionSummary | undefined;
  onClose: () => void;
}

// Enabling and featuring go in one request, so the session never shows as
// enabled and not featured in between.
export const EnableSessionDialog = ({ session, featured, onClose }: Props) => {
  const [isFeaturing, setIsFeaturing] = useState(true);

  const update = useUpdateSession({ onSuccess: () => onClose() });

  return (
    <Sheet
      open
      onClose={onClose}
      title={`Habilitar "${session.title}"`}
      width="narrow"
      pending={update.isPending}
    >
      <p className="leading-[1.45]">Los estudiantes van a ver la sesión en su inicio.</p>
      <button
        type="button"
        role="switch"
        aria-checked={isFeaturing}
        disabled={update.isPending}
        onClick={() => setIsFeaturing(!isFeaturing)}
        className="mt-3.5 flex items-center gap-2.5 text-sm"
      >
        <span>Destacada</span>
        <Switch on={isFeaturing} />
      </button>
      {isFeaturing && featured != null ? (
        <div className="mt-3 rounded-[14px] bg-[#f9dde1] px-3.5 py-3 text-sm text-[#8a2e3d]">
          <p>{`Hoy la destacada es "${featured.title}" y deja de serlo:`}</p>
          <FeaturedEffects session={featured} />
        </div>
      ) : null}
      {update.isError ? (
        <InlineError className="mt-3">No se pudo guardar el cambio. Probá de nuevo.</InlineError>
      ) : null}
      <div className="mt-[18px] flex justify-end gap-2">
        <Button variant="pill" disabled={update.isPending} onClick={onClose}>
          Cancelar
        </Button>
        <Button
          variant="pill-dark"
          pending={update.isPending}
          pendingLabel="Habilitando…"
          onClick={() =>
            update.mutate({
              id: session.id,
              change: isFeaturing ? { enabled: true, featured: true } : { enabled: true },
            })
          }
        >
          Habilitar
        </Button>
      </div>
    </Sheet>
  );
};
