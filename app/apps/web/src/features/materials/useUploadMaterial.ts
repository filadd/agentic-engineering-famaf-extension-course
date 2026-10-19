import type { FileTooLarge, SessionNotFound } from "@kurasu/contract/errors";
import type { Material } from "@kurasu/contract/materials";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { MutationOptions } from "../../api/api-error.ts";
import { runApi } from "../../api/run-api.ts";
import { queryKeys } from "../../api/query-keys.ts";

export interface MaterialUploadInput {
  readonly sessionId: string;
  readonly name: string;
  readonly isSlides: boolean;
  readonly file: File;
}

// The API reads the upload as a multipart stream, so the file goes as
// FormData and the flag as text.
const formOf = (input: MaterialUploadInput) => {
  const form = new FormData();

  form.set("sessionId", input.sessionId);
  form.set("name", input.name);
  form.set("isSlides", String(input.isSlides));
  form.set("file", input.file, input.file.name);

  return form;
};

export const useUploadMaterial = (
  options?: MutationOptions<Material, MaterialUploadInput, SessionNotFound | FileTooLarge>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (input) => runApi((api) => api.adminMaterials.upload({ payload: formOf(input) })),
    onSuccess: async (material, input, result, context) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.allMaterials() }),
        queryClient.invalidateQueries({ queryKey: queryKeys.allAdminMaterials() }),
        queryClient.invalidateQueries({ queryKey: queryKeys.sessions() }),
        queryClient.invalidateQueries({ queryKey: queryKeys.adminSessions() }),
      ]);
      await options?.onSuccess?.(material, input, result, context);
    },
  });
};
