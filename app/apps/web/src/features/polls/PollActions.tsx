import type { AdminPoll } from "@kurasu/contract/polls";
import type { ReactNode } from "react";

import { DeletePollButton } from "./DeletePollButton.tsx";
import { PollStateActions } from "./PollStateActions.tsx";

interface Props {
  poll: AdminPoll;
  leading?: ReactNode;
  draftActions?: ReactNode;
  canActivate?: boolean;
}

export const PollActions = ({ poll, leading, draftActions, canActivate = true }: Props) => (
  <div className="mt-3 flex justify-end gap-2">
    {leading}
    <DeletePollButton poll={poll} />
    {draftActions}
    <PollStateActions poll={poll} canActivate={canActivate} />
  </div>
);
