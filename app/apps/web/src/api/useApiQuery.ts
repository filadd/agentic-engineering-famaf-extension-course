import type { QueryKey } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type * as Effect from "effect/Effect";

import type { QueryOptions } from "./api-error.ts";
import { runApi } from "./run-api.ts";
import type { KurasuClient } from "./run-api.ts";

export interface ApiQuery<A, E, F> {
  readonly queryKey: QueryKey;
  readonly call: (api: KurasuClient) => Effect.Effect<A, F>;
  readonly options?: QueryOptions<A, E> | undefined;
}

export const useApiQuery = <A, F, E = never>({ queryKey, call, options }: ApiQuery<A, E, F>) =>
  useQuery({
    queryKey,
    queryFn: () => runApi(call),
    ...options,
  });
