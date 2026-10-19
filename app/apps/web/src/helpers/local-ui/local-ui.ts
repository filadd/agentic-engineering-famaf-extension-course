import * as Schema from "effect/Schema";

export const Theme = Schema.Literals(["light", "dark"]);

export const ClassroomTab = Schema.Literals(["polls", "questions", "material", "presence"]);

export type ClassroomTab = typeof ClassroomTab.Type;

export const ClassroomUi = Schema.Struct({
  panelHidden: Schema.Boolean,
  presenceCollapsed: Schema.Boolean,
  tab: ClassroomTab,
});

export type ClassroomUi = typeof ClassroomUi.Type;

// What the browser keeps of the UI. One classroom state serves every session.
export const localUi = {
  "kurasu:theme": { schema: Theme, fallback: "light" },
  "kurasu:classroom": {
    schema: ClassroomUi,
    fallback: { panelHidden: false, presenceCollapsed: false, tab: "polls" },
  },
} as const;

export type LocalUiKey = keyof typeof localUi;

export type LocalUiValue<K extends LocalUiKey> = (typeof localUi)[K]["schema"]["Type"];
