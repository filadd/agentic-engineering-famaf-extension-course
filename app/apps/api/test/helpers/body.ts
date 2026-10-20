import * as Effect from "effect/Effect";
import * as Exit from "effect/Exit";
import * as Schema from "effect/Schema";

import type { ApiResponse } from "./http.ts";

// Decodes a response body with the JSON codec of the schema the contract gives
// it, as the web does, so a test reads typed values. A body that does not
// match fails the test.
export const bodyOf = <S extends Schema.Codec<unknown, unknown>>(
  schema: S,
  response: ApiResponse,
) => Schema.decodeUnknownEffect(Schema.toCodecJson(schema))(response.body).pipe(Effect.orDie);

// Whether the response carries the typed error of the contract, such as
// NotRegistered or NoAccess.
export const failedWith = (response: ApiResponse, error: Schema.Decoder<unknown>) =>
  Exit.isSuccess(Schema.decodeUnknownExit(error)(response.body));
