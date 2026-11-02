import type { QueryKey } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type * as Effect from "effect/Effect";

import type { QueryOptions } from "./api-error.ts";
import { runApi } from "./run-api.ts";
import type { KurasuClient } from "./run-api.ts";

export interface ApiQuery<A, E, D = A> {
  readonly queryKey: QueryKey;
  readonly call: (api: KurasuClient) => Effect.Effect<A, E>;
  readonly options?: QueryOptions<A, E, D> | undefined;
}

export const useApiQuery = <A, E, D = A>({ queryKey, call, options }: ApiQuery<A, E, D>) =>
  useQuery({
    queryKey,
    queryFn: () => runApi(call),
    ...options,
  });
