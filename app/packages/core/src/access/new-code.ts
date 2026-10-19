import { enrollmentAlphabet, enrollmentCodeLength } from "@kurasu/contract/user";
import * as Crypto from "effect/Crypto";
import * as Effect from "effect/Effect";
import * as Hex from "effect/encoding/Hex";
import type * as PlatformError from "effect/PlatformError";

import type { NewCode } from "./codes.ts";

const newCodeRow = (
  code: (crypto: Crypto.Crypto) => Effect.Effect<string, PlatformError.PlatformError>,
): Effect.Effect<NewCode, never, Crypto.Crypto> =>
  Effect.gen(function* () {
    const crypto = yield* Crypto.Crypto;

    return yield* Effect.all({ id: crypto.randomULID, code: code(crypto) }).pipe(Effect.orDie);
  });

// The code of the magic link travels only in a URL and is never typed, so it
// is long hex.
export const newLinkCode = newCodeRow((crypto) => Effect.map(crypto.randomBytes(24), Hex.encode));

// The enrollment code is projected in class and typed by hand.
export const newEnrollmentCode = newCodeRow((crypto) =>
  Effect.map(crypto.randomBytes(enrollmentCodeLength), (bytes) =>
    Array.from(bytes, (byte) => enrollmentAlphabet[byte % enrollmentAlphabet.length]).join(""),
  ),
);
