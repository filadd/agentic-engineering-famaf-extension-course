import type { MaterialNotFound } from "@kurasu/contract/errors";
import { queryOptions } from "@tanstack/react-query";
import * as Effect from "effect/Effect";
import * as Stream from "effect/Stream";

import type { ApiError } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { runApi } from "../../api/run-api.ts";

// The HTML of a material as text, to hand it to an iframe through srcdoc.
// Shared by useMaterialFile and the check that marks an HTML as slides.
export const materialFileQuery = (id: string) =>
  queryOptions<string, ApiError<MaterialNotFound>>({
    queryKey: queryKeys.materialFile(id),
    queryFn: () =>
      runApi((api) =>
        api.materials
          .file({ params: { id } })
          .pipe(Effect.flatMap((stream) => stream.pipe(Stream.decodeText(), Stream.mkString))),
      ),
    staleTime: Number.POSITIVE_INFINITY,
  });
