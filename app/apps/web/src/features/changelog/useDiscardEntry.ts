import type { ChangelogEntryNotFound } from "@kurasu/contract/errors";
import * as Effect from "effect/Effect";

import type { EndpointError, MutationOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiMutation } from "../../api/useApiMutation.ts";

type DiscardError = Exclude<EndpointError<"adminChangelog", "discard">, ChangelogEntryNotFound>;

// An entry that no longer exists left with a change, another announcement or
// another tab, so discarding it counts as done.
export const useDiscardEntry = (options?: MutationOptions<void, string, DiscardError>) =>
  useApiMutation({
    call: (api, input) =>
      api.adminChangelog
        .discard({ params: { id: input } })
        .pipe(Effect.catchTag("ChangelogEntryNotFound", () => Effect.void)),
    invalidates: [queryKeys.allAdminChangelog()],
    options,
  });
