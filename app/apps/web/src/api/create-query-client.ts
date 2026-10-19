import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";

import { isAccessError, isTerminalError } from "./access-error.ts";

const refetchInterval = 5 * 60 * 1000;

const maxRetries = 2;

export const createQueryClient = (onAccessLost: () => void) => {
  const onError = (error: Error) => {
    if (isAccessError(error)) {
      onAccessLost();
    }
  };

  return new QueryClient({
    queryCache: new QueryCache({ onError }),
    mutationCache: new MutationCache({
      onError: (error, _input, _result, mutation) =>
        mutation.meta?.["ownsAccessErrors"] === true ? undefined : onError(error),
    }),
    defaultOptions: {
      queries: {
        refetchInterval,
        retry: (failures, error) => !isTerminalError(error) && failures < maxRetries,
      },
      mutations: { retry: false },
    },
  });
};
