import type { MaterialNotFound } from "@kurasu/contract/errors";
import { useQuery } from "@tanstack/react-query";

import type { QueryOptions } from "../../api/api-error.ts";
import { materialFileQuery } from "./material-file-query.ts";

export const useMaterialFile = (id: string, options?: QueryOptions<string, MaterialNotFound>) =>
  useQuery({ ...materialFileQuery(id), ...options });
