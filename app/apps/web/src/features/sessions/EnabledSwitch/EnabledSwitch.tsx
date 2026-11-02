import type { Session, SessionSummary } from "@kurasu/contract/sessions";
import { useState } from "react";

import { ConfirmAction } from "../../../ui/ConfirmAction.tsx";
import { SwitchButton } from "../../../ui/SwitchButton.tsx";
import { EnableSessionDialog } from "./EnableSessionDialog.tsx";
import { FeaturedEffects } from "../FeaturedEffects.tsx";
import { updateErrorText, useUpdateSession } from "../useUpdateSession.ts";

interface Props {
  session: Session;
  featured: SessionSummary | undefined;
}

export const EnabledSwitch = ({ session, featured }: Props) => {
  const [isEnabling, setIsEnabling] = useState(false);

  const update = useUpdateSession();

  const isEnabled = session.enabled === true;

  const toggle = (onClick: () => void) => (
    <SwitchButton
      isOn={isEnabled}
      disabled={update.isPending}
      onClick={onClick}
      className="switch-row mt-4"
    >
      <span>{isEnabled ? "Habilitada" : "Deshabilitada"}</span>
    </SwitchButton>
  );

  if (!isEnabled) {
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
      renderTrigger={toggle}
      title={`¿Deshabilitar "${session.title}"?`}
      text="Es la sesión destacada: al deshabilitarla deja de serlo, y nadie entra a ningún aula hasta que destaques otra."
      content={<FeaturedEffects session={session} />}
      confirmIcon={null}
      confirmLabel="Deshabilitar"
      pendingLabel="Deshabilitando…"
      errorText={updateErrorText}
      onConfirm={() => update.mutateAsync({ id: session.id, change: { enabled: false } })}
    />
  ) : (
    toggle(() =>
      update.mutate({
        id: session.id,
        change: { enabled: false },
        errorText: "No se pudo deshabilitar la sesión.",
      }),
    )
  );
};
