import type { FileTooLarge, InvalidUpload, SessionNotFound } from "@kurasu/contract/errors";
import type { Material } from "@kurasu/contract/materials";

import type { MutationOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiMutation } from "../../api/useApiMutation.ts";

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
  options?: MutationOptions<
    Material,
    MaterialUploadInput,
    SessionNotFound | FileTooLarge | InvalidUpload
  >,
) =>
  useApiMutation({
    call: (api, input) => api.adminMaterials.upload({ payload: formOf(input) }),
    invalidates: [
      queryKeys.allMaterials(),
      queryKeys.allAdminMaterials(),
      queryKeys.sessions(),
      queryKeys.adminSessions(),
    ],
    options,
  });
