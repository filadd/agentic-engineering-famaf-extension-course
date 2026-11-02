import type { Session, SessionSummary } from "@kurasu/contract/sessions";

import { ConfirmAction } from "../../ui/ConfirmAction.tsx";
import { SwitchButton } from "../../ui/SwitchButton.tsx";
import { FeaturedEffects } from "./FeaturedEffects.tsx";
import { updateErrorText, useUpdateSession } from "./useUpdateSession.ts";

interface Props {
  session: Session;
  featured: SessionSummary | undefined;
}

const confirmationOf = (session: Session, featured: SessionSummary | undefined) => {
  if (session.featured) {
    return {
      title: `¿Sacarle la marca de destacada a "${session.title}"?`,
      text: "La sesión deja de ser la destacada y nadie entra a ningún aula hasta que destaques otra.",
      leaving: session,
      confirmLabel: "Sacar la marca",
      pendingLabel: "Sacando la marca…",
    };
  }

  return featured == null
    ? null
    : {
        title: `¿Destacar "${session.title}"?`,
        text: `"${featured.title}" deja de ser la destacada:`,
        leaving: featured,
        confirmLabel: "Destacar",
        pendingLabel: "Destacando…",
      };
};

// Featuring a session when another one is featured, and removing the mark,
// ask first because the session that stops being featured loses its active
// polls, its raised hands and its featured questions.
export const FeaturedSwitch = ({ session, featured }: Props) => {
  const update = useUpdateSession();

  const toggle = (onClick: () => void, isPending = false) => (
    <SwitchButton
      isOn={session.featured}
      disabled={session.enabled !== true || isPending}
      onClick={onClick}
      className="switch-row mt-3"
    >
      <span>Destacada</span>
    </SwitchButton>
  );

  const confirmation = confirmationOf(session, featured);

  return (
    <>
      {confirmation == null ? (
        toggle(
          () => update.mutate({ id: session.id, change: { featured: true } }),
          update.isPending,
        )
      ) : (
        <ConfirmAction
          renderTrigger={toggle}
          title={confirmation.title}
          text={confirmation.text}
          content={<FeaturedEffects session={confirmation.leaving} />}
          confirmIcon={null}
          confirmLabel={confirmation.confirmLabel}
          pendingLabel={confirmation.pendingLabel}
          errorText={updateErrorText}
          onConfirm={() =>
            update.mutateAsync({ id: session.id, change: { featured: !session.featured } })
          }
        />
      )}
      {session.enabled === true ? null : (
        <div className="mt-1.5 text-[13px] opacity-75">
          Habilitá la sesión para poder destacarla.
        </div>
      )}
    </>
  );
};
