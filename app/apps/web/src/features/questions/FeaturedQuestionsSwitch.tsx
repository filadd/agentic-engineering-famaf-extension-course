import type { Session } from "@kurasu/contract/sessions";

import { Switch } from "../../ui/Switch.tsx";
import { useUpdateSession } from "../sessions/useUpdateSession.ts";

interface Props {
  session: Session;
}

const lineOf = (session: Session) => {
  if (!session.featured) {
    return "Solo la sesión destacada puede mostrar sus preguntas en el inicio.";
  }

  return session.featuredQuestions
    ? "Las preguntas aparecen en la card destacada del inicio."
    : "Apagado: las preguntas se ven solo en el aula.";
};

export const FeaturedQuestionsSwitch = ({ session }: Props) => {
  const update = useUpdateSession();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={session.featuredQuestions}
      disabled={!session.featured}
      onClick={() =>
        update.mutate({ id: session.id, change: { featuredQuestions: !session.featuredQuestions } })
      }
      className="mb-3 flex w-full items-center justify-between gap-3 rounded-[14px] border-[1.5px] border-sand px-3 py-2.5 text-left text-coal disabled:opacity-50"
    >
      <span className="min-w-0 flex-1">
        <b className="block text-sm">Preguntas destacadas</b>
        <small className="block text-[13px] opacity-70">{lineOf(session)}</small>
      </span>
      <Switch on={session.featuredQuestions} />
    </button>
  );
};
