import type { SessionSummary } from "@kurasu/contract/sessions";

export const findFeatured = <S extends SessionSummary>(sessions: ReadonlyArray<S> | undefined) =>
  sessions?.find((session) => session.featured);
