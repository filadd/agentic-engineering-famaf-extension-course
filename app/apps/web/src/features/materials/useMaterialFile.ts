import { useQuery } from "@tanstack/react-query";

import type { EndpointError, QueryOptions } from "../../api/api-error.ts";
import { materialFileQuery } from "./material-file-query.ts";

export const useMaterialFile = (
  id: string,
  options?: QueryOptions<string, EndpointError<"materials", "file">>,
) => useQuery({ ...materialFileQuery(id), ...options });
