import { useState } from "react";

import { useAdminQuestions } from "./useAdminQuestions.ts";

// The questions that arrived while the teacher was not looking, counted in
// memory: the ones there when the page opened count as seen, and `looking`
// marks every open question as seen.
export const useNewQuestions = (sessionId: string, looking: boolean) => {
  const questions = useAdminQuestions(sessionId);

  const [seen, setSeen] = useState<ReadonlySet<string> | null>(null);

  const open = (questions.data ?? [])
    .filter((question) => !question.answered)
    .map((each) => each.id);

  const unseen = seen == null ? [] : open.filter((id) => !seen.has(id));

  if (questions.data != null && (seen == null || (looking && unseen.length > 0))) {
    setSeen(new Set([...(seen ?? []), ...open]));
  }

  return unseen.length;
};
