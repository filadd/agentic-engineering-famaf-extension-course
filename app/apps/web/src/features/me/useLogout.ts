import { useQueryClient } from "@tanstack/react-query";

import type { EndpointError, MutationOptions } from "../../api/api-error.ts";
import { useApiMutation } from "../../api/useApiMutation.ts";

export const useLogout = (
  options?: MutationOptions<void, void, EndpointError<"auth", "logout">>,
) => {
  const queryClient = useQueryClient();

  // The cache is cleared in onSettled, which runs after the screen's
  // onSuccess: it empties once the screen has left for the login, not while
  // the page's queries are still mounted.
  return useApiMutation({
    call: (api) => api.auth.logout(),
    errorToast: () => "No se pudo cerrar la sesión. Probá de nuevo.",
    onSettled: (_data, error) => (error == null ? queryClient.clear() : undefined),
    options,
  });
};
