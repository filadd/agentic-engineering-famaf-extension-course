import { Badge } from "../../ui/Badge.tsx";
import { Icon } from "../../ui/Icon.tsx";
import { Tabs } from "../../ui/Tabs.tsx";
import type { SessionTab } from "./session-tab.ts";

interface Props {
  tab: SessionTab;
  onChange: (tab: SessionTab) => void;
  newQuestions: number;
  raisedHands: number;
}

// Away from Aula, its tab shows the new questions and the raised hands, each
// next to its icon.
export const SessionTabs = ({ tab, onChange, newQuestions, raisedHands }: Props) => (
  <Tabs
    label="Secciones de la sesión"
    value={tab}
    onChange={onChange}
    className="px-8 pt-2.5 pl-[86px]"
    tabs={[
      {
        id: "contenido",
        label: (
          <>
            <Icon name="file-text" size={16} /> Contenido
          </>
        ),
      },
      {
        id: "encuestas",
        label: (
          <>
            <Icon name="chart-bar" size={16} /> Encuestas
          </>
        ),
      },
      {
        id: "aula",
        label: (
          <>
            <Icon name="presentation" size={16} /> Aula
          </>
        ),
        badge:
          tab === "aula" ? null : (
            <span className="inline-flex items-center gap-1">
              {newQuestions > 0 ? <Icon name="chat-messages" size={15} /> : null}
              <Badge count={newQuestions} label={`${newQuestions} preguntas nuevas`} />
              {raisedHands > 0 ? <Icon name="hand" size={15} /> : null}
              <Badge count={raisedHands} label={`${raisedHands} manos levantadas`} />
            </span>
          ),
      },
    ]}
  />
);
