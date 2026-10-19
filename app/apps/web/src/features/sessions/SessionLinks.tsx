import { useState } from "react";

import { Icon } from "../../ui/Icon.tsx";
import type { IconName } from "../../ui/icons.ts";
import { MaterialSheet } from "../materials/MaterialSheet.tsx";
import { ClosedPollsSheet } from "../polls/ClosedPollsSheet.tsx";
import { QuestionsSheet } from "../questions/QuestionsSheet.tsx";

interface Props {
  sessionId: string;
  highlighted: boolean;
}

type Link = "material" | "polls" | "questions";

const links: ReadonlyArray<{ id: Link; label: string; icon: IconName }> = [
  { id: "material", label: "Material", icon: "download" },
  { id: "polls", label: "Encuestas", icon: "chart-bar" },
  { id: "questions", label: "Preguntas", icon: "chat-messages" },
];

// The lists of a session are asked for only when their sheet opens.
export const SessionLinks = ({ sessionId, highlighted }: Props) => {
  const [open, setOpen] = useState<Link | null>(null);

  const close = () => setOpen(null);

  return (
    <div className="mt-2.5 flex flex-wrap gap-2">
      {links.map((link) => (
        <button
          key={link.id}
          type="button"
          onClick={() => setOpen(link.id)}
          className="inline-flex items-center gap-1.5 rounded-full bg-paper px-3 py-1 text-[13px] text-coal hover:outline-2 hover:outline-coal"
        >
          <Icon name={link.icon} size={15} />
          {link.label}
        </button>
      ))}
      {open === "material" ? <MaterialSheet sessionId={sessionId} onClose={close} /> : null}
      {open === "polls" ? <ClosedPollsSheet sessionId={sessionId} onClose={close} /> : null}
      {open === "questions" ? (
        <QuestionsSheet sessionId={sessionId} readOnly={!highlighted} onClose={close} />
      ) : null}
    </div>
  );
};
