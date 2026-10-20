import { Ulid } from "@kurasu/contract/ulid";
import { InvalidToken, SessionTokens } from "@kurasu/core/access/session-tokens";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Redacted from "effect/Redacted";
import * as Schema from "effect/Schema";
import { jwtVerify, SignJWT } from "jose";

export const sessionMaxAgeSeconds = 7 * 24 * 60 * 60;

const decodeSubject = Schema.decodeUnknownEffect(Ulid);

export const JoseSessionTokens = (secret: Redacted.Redacted) =>
  Layer.sync(SessionTokens, () => {
    const key = new TextEncoder().encode(Redacted.value(secret));

    return SessionTokens.of({
      sign: (userId) =>
        Effect.promise(() =>
          new SignJWT({})
            .setProtectedHeader({ alg: "HS256" })
            .setSubject(userId)
            .setIssuedAt()
            .setExpirationTime(`${sessionMaxAgeSeconds}s`)
            .sign(key),
        ),
      verify: (token) =>
        Effect.tryPromise({
          try: () => jwtVerify(token, key, { algorithms: ["HS256"] }),
          catch: () => new InvalidToken(),
        }).pipe(
          Effect.flatMap((result) =>
            decodeSubject(result.payload.sub).pipe(Effect.mapError(() => new InvalidToken())),
          ),
        ),
    });
  });
