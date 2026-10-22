import type { AnnouncementInput } from "@kurasu/contract/announcements";

import type { EndpointError, MutationOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiMutation } from "../../api/useApiMutation.ts";
import { showSuccess } from "../../ui/toast.ts";

// A failed send shows its error in the dialog, so it has no toast.
export const useSendAnnouncement = (
  options?: MutationOptions<void, AnnouncementInput, EndpointError<"adminAnnouncements", "send">>,
) =>
  useApiMutation({
    call: (api, input) => api.adminAnnouncements.send({ payload: input }),
    invalidates: [queryKeys.allAdminChangelog()],
    onSuccess: () => showSuccess("Anuncio enviado."),
    options,
  });
