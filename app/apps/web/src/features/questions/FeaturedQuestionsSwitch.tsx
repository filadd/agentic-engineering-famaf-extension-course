import type { Session } from "@kurasu/contract/sessions";

import { SwitchButton } from "../../ui/SwitchButton.tsx";
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
    <SwitchButton
      isOn={session.featuredQuestions}
      disabled={!session.featured}
      onClick={() =>
        update.mutate({
          id: session.id,
          change: { featuredQuestions: !session.featuredQuestions },
          errorText: "No se pudo cambiar las preguntas destacadas.",
        })
      }
      className="skeleton-block mb-3 flex w-full items-center justify-between gap-3 rounded-[14px] border-[1.5px] border-line px-3 py-2.5 text-left text-ink disabled:opacity-50"
    >
      <span className="min-w-0 flex-1">
        <b className="block text-sm">Preguntas destacadas</b>
        <small className="block text-[13px] opacity-70">{lineOf(session)}</small>
      </span>
    </SwitchButton>
  );
};
