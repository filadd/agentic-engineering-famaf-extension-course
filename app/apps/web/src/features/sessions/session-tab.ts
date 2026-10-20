import * as Schema from "effect/Schema";

export const SessionTab = Schema.Literals(["contenido", "encuestas", "aula"]);

export type SessionTab = typeof SessionTab.Type;

const isSessionTab = Schema.is(SessionTab);

export const sessionTabOf = (tab: string | undefined): SessionTab =>
  isSessionTab(tab) ? tab : "contenido";
