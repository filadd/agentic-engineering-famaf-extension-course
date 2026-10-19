import * as Crypto from "effect/Crypto";
import * as Effect from "effect/Effect";

import type { NewCode } from "./codes.ts";

const toHex = (bytes: Uint8Array) =>
  Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");

// A fresh row for the codes table: a link code or an enrollment code. The code
// travels in a URL, so it is hex.
export const newCode: Effect.Effect<NewCode, never, Crypto.Crypto> = Effect.gen(function* () {
  const crypto = yield* Crypto.Crypto;

  return yield* Effect.all({
    id: crypto.randomULID,
    code: Effect.map(crypto.randomBytes(24), toHex),
  }).pipe(Effect.orDie);
});
