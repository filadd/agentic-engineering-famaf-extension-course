import type { Person } from "@kurasu/contract/classroom";
import type { ReactNode } from "react";

import type { ClassroomTab } from "../../helpers/local-ui/local-ui.ts";
import { useIsMobile } from "../../helpers/useIsMobile.ts";
import { useLocalUi } from "../../helpers/local-ui/useLocalUi.ts";
import { Icon } from "../../ui/Icon.tsx";
import type { IconName } from "../../ui/icons.ts";
import { PresenceList } from "./PresenceList.tsx";

export interface PanelTab {
  id: ClassroomTab;
  label: string;
  icon: IconName;
  badge?: ReactNode;
  content: ReactNode;
}

interface Props {
  people: ReadonlyArray<Person>;
  meId: string | undefined;
  tabs: ReadonlyArray<PanelTab>;
  hideable: boolean;
  railBadge?: ReactNode;
  presenceBadge?: ReactNode;
  renderHand: (person: Person) => ReactNode;
}

// The side panel of the classroom. Its tab, whether it is hidden and whether
// Presentes is folded live in the browser, one state for every session. On a
// phone it sits below the slide, cannot hide, and Presentes is one more tab.
export const ClassroomPanel = ({
  people,
  meId,
  tabs,
  hideable,
  railBadge,
  presenceBadge,
  renderHand,
}: Props) => {
  const [ui, setUi] = useLocalUi("kurasu:classroom");
  const isMobile = useIsMobile();

  const presence: PanelTab = {
    id: "presence",
    label: "Presentes",
    icon: "users",
    content: <PresenceList people={people} meId={meId} renderHand={renderHand} />,
  };

  const shown = isMobile ? [...tabs, presence] : tabs;
  const current = shown.find((tab) => tab.id === ui.tab) ?? shown[0];

  if (hideable && !isMobile && ui.panelHidden) {
    return (
      <aside aria-label="Panel del aula" className="w-[46px] flex-none pt-3.5">
        <button
          type="button"
          title="Mostrar el panel"
          aria-label="Mostrar el panel"
          onClick={() => setUi({ ...ui, panelHidden: false })}
          className="icon-button relative"
        >
          <Icon name="panel-right-open" size={20} />
          <span className="absolute -top-1.5 -right-1.5">{railBadge}</span>
        </button>
      </aside>
    );
  }

  return (
    <aside
      aria-label="Panel del aula"
      className="my-3.5 flex min-h-0 w-[340px] flex-none flex-col rounded-l-[18px] bg-side max-[600px]:m-0 max-[600px]:w-auto max-[600px]:flex-1 max-[600px]:rounded-t-[20px] max-[600px]:rounded-b-none"
    >
      {hideable && !isMobile ? (
        <div className="flex px-2.5 pt-2.5 pb-1">
          <button
            type="button"
            title="Ocultar el panel"
            aria-label="Ocultar el panel"
            onClick={() => setUi({ ...ui, panelHidden: true })}
            className="icon-button"
          >
            <Icon name="panel-right-close" size={20} />
          </button>
        </div>
      ) : null}
      <div
        role="tablist"
        aria-label="Pestañas del panel"
        className="flex gap-1.5 px-4 pb-2.5 max-[600px]:px-3 max-[600px]:pt-3"
      >
        {shown.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={tab.id === current?.id}
            onClick={() => setUi({ ...ui, tab: tab.id })}
            className={`relative inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border-[1.5px] py-1.5 text-[13px] max-[600px]:flex-col max-[600px]:gap-0.5 max-[600px]:rounded-[14px] max-[600px]:text-[11px] ${
              tab.id === current?.id ? "border-ink bg-ink text-window" : "border-line text-ink"
            }`}
          >
            <Icon name={tab.icon} size={15} />
            {tab.label}
            {tab.id === current?.id ? null : (
              <span className="absolute -top-1.5 -right-1.5">{tab.badge}</span>
            )}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="mr-1 min-h-0 flex-1 overflow-auto pr-3 pb-4 pl-4">
        {current?.content}
      </div>
      {isMobile ? null : (
        <div className="border-t-[1.5px] border-line pt-2.5 pb-3.5">
          <button
            type="button"
            aria-expanded={!ui.presenceCollapsed}
            onClick={() => setUi({ ...ui, presenceCollapsed: !ui.presenceCollapsed })}
            className="flex w-full items-center gap-1.5 px-4 text-left font-display text-[15px] font-bold text-ink"
          >
            <Icon name="users" size={18} />
            Presentes ({people.length}){ui.presenceCollapsed ? presenceBadge : null}
            <span className="ml-auto">
              <Icon name={ui.presenceCollapsed ? "chevron-up" : "chevron-down"} size={16} />
            </span>
          </button>
          {ui.presenceCollapsed ? null : (
            <div className="mt-2 mr-1 max-h-[210px] overflow-auto pr-3 pl-4">
              {presence.content}
            </div>
          )}
        </div>
      )}
    </aside>
  );
};
