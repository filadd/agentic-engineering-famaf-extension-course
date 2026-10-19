import type { MaterialNotFound } from "@kurasu/contract/errors";
import { useQuery } from "@tanstack/react-query";
import * as Effect from "effect/Effect";
import * as Stream from "effect/Stream";

import type { QueryOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { runApi } from "../../api/run-api.ts";

// The slides' HTML as text, to hand it to the iframe through srcdoc.
export const useMaterialFile = (id: string, options?: QueryOptions<string, MaterialNotFound>) =>
  useQuery({
    queryKey: queryKeys.materialFile(id),
    queryFn: () =>
      runApi((api) =>
        api.materials
          .file({ params: { id } })
          .pipe(Effect.flatMap((stream) => stream.pipe(Stream.decodeText(), Stream.mkString))),
      ),
    staleTime: Number.POSITIVE_INFINITY,
    ...options,
  });
