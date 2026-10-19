import type { Me } from "@kurasu/contract/user";
import { useQuery } from "@tanstack/react-query";

import type { EndpointError, QueryOptions } from "../../api/api-error.ts";
import { meQuery } from "./me-query.ts";

export const useMe = (options?: QueryOptions<Me, EndpointError<"me", "get">>) =>
  useQuery({ ...meQuery(), ...options });
