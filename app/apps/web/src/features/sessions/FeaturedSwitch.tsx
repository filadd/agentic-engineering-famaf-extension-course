import type { Session, SessionSummary } from "@kurasu/contract/sessions";

import { ConfirmAction } from "../../ui/ConfirmAction.tsx";
import { Switch } from "../../ui/Switch.tsx";
import { FeaturedEffects } from "./FeaturedEffects.tsx";
import { useUpdateSession } from "./useUpdateSession.ts";

interface Props {
  session: Session;
  featured: SessionSummary | undefined;
}

const errorText = "No se pudo guardar el cambio. Probá de nuevo.";

// Featuring a session when another one is featured, and removing the mark,
// ask first because the session that stops being featured loses its active
// polls, its raised hands and its featured questions.
export const FeaturedSwitch = ({ session, featured }: Props) => {
  const update = useUpdateSession();

  const toggle = (onClick: () => void, isPending = false) => (
    <button
      type="button"
      role="switch"
      aria-checked={session.featured}
      disabled={session.enabled !== true || isPending}
      onClick={onClick}
      className="mt-3 flex items-center gap-2.5 text-sm"
    >
      <span>Destacada</span>
      <Switch on={session.featured} />
    </button>
  );

  return (
    <>
      {session.featured ? (
        <ConfirmAction
          renderTrigger={(ask) => toggle(ask)}
          title={`¿Sacarle la marca de destacada a "${session.title}"?`}
          text="La sesión deja de ser la destacada y nadie entra a ningún aula hasta que destaques otra."
          content={<FeaturedEffects session={session} />}
          confirmIcon={null}
          confirmLabel="Sacar la marca"
          pendingLabel="Sacando la marca…"
          errorText={errorText}
          onConfirm={() => update.mutateAsync({ id: session.id, change: { featured: false } })}
        />
      ) : null}
      {!session.featured && featured != null ? (
        <ConfirmAction
          renderTrigger={(ask) => toggle(ask)}
          title={`¿Destacar "${session.title}"?`}
          text={`"${featured.title}" deja de ser la destacada:`}
          content={<FeaturedEffects session={featured} />}
          confirmIcon={null}
          confirmLabel="Destacar"
          pendingLabel="Destacando…"
          errorText={errorText}
          onConfirm={() => update.mutateAsync({ id: session.id, change: { featured: true } })}
        />
      ) : null}
      {!session.featured && featured == null
        ? toggle(
            () => update.mutate({ id: session.id, change: { featured: true } }),
            update.isPending,
          )
        : null}
      {session.enabled === true ? null : (
        <div className="mt-1.5 text-[13px] opacity-75">
          Habilitá la sesión para poder destacarla.
        </div>
      )}
    </>
  );
};
