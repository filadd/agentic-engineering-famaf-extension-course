import type { Session, SessionSummary } from "@kurasu/contract/sessions";
import { useState } from "react";

import { ConfirmAction } from "../../ui/ConfirmAction.tsx";
import { Switch } from "../../ui/Switch.tsx";
import { EnableSessionDialog } from "./EnableSessionDialog.tsx";
import { FeaturedEffects } from "./FeaturedEffects.tsx";
import { useUpdateSession } from "./useUpdateSession.ts";

interface Props {
  session: Session;
  featured: SessionSummary | undefined;
}

// Enabling opens a dialog that can also feature the session; disabling the
// featured session asks first; disabling any other session is immediate.
export const EnabledSwitch = ({ session, featured }: Props) => {
  const [isEnabling, setIsEnabling] = useState(false);

  const update = useUpdateSession();

  const enabled = session.enabled === true;

  const toggle = (onClick: () => void) => (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      disabled={update.isPending}
      onClick={onClick}
      className="mt-4 flex items-center gap-2.5 text-sm"
    >
      <span>{enabled ? "Habilitada" : "Deshabilitada"}</span>
      <Switch on={enabled} />
    </button>
  );

  if (!enabled) {
    return (
      <>
        {toggle(() => setIsEnabling(true))}
        {isEnabling ? (
          <EnableSessionDialog
            session={session}
            featured={featured}
            onClose={() => setIsEnabling(false)}
          />
        ) : null}
      </>
    );
  }

  return session.featured ? (
    <ConfirmAction
      renderTrigger={(ask) => toggle(ask)}
      title={`¿Deshabilitar "${session.title}"?`}
      text="Es la sesión destacada: al deshabilitarla deja de serlo, y nadie entra a ningún aula hasta que destaques otra."
      content={<FeaturedEffects session={session} />}
      confirmIcon={null}
      confirmLabel="Deshabilitar"
      pendingLabel="Deshabilitando…"
      errorText="No se pudo guardar el cambio. Probá de nuevo."
      onConfirm={() => update.mutateAsync({ id: session.id, change: { enabled: false } })}
    />
  ) : (
    toggle(() => update.mutate({ id: session.id, change: { enabled: false } }))
  );
};
