import { InvalidLink, MailNotSent, NoAccess, NotRegistered } from "@kurasu/contract/errors";
import type { User } from "@kurasu/contract/user";
import * as Context from "effect/Context";
import * as Crypto from "effect/Crypto";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";

import { Codes, type NewCode } from "./codes.ts";
import { Mailer } from "./mailer.ts";
import { SessionTokens } from "./session-tokens.ts";
import { Users } from "./users.ts";

const toHex = (bytes: Uint8Array) =>
  Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");

export interface OpenedSession {
  readonly user: User;
  readonly token: string;
}

// The two paths of login and access that carry rules: requesting the link
// (registration and login are the same request) and opening it. `webOrigin` is
// where the link of the mail points, as `/entrar?codigo=<code>`. Opening spends
// the code before checking the access, so the link of someone without access
// is used up too.
export class Access extends Context.Service<
  Access,
  {
    readonly requestLink: (
      email: string,
      enrollmentCode: string | undefined,
    ) => Effect.Effect<void, NoAccess | NotRegistered | MailNotSent>;
    readonly openSession: (code: string) => Effect.Effect<OpenedSession, InvalidLink | NoAccess>;
  }
>()("kurasu/Access") {
  static readonly layer = (webOrigin: string) => {
    const linkUrl = (code: string) => `${webOrigin}/entrar?codigo=${encodeURIComponent(code)}`;

    return Layer.effect(
      Access,
      Effect.gen(function* () {
        const users = yield* Users;
        const codes = yield* Codes;
        const mailer = yield* Mailer;
        const tokens = yield* SessionTokens;
        const crypto = yield* Crypto.Crypto;

        const newCode: Effect.Effect<NewCode> = Effect.all({
          id: crypto.randomULID,
          code: Effect.map(crypto.randomBytes(24), toHex),
        }).pipe(Effect.orDie);

        const isCurrentEnrollment = (enrollmentCode: string | undefined) =>
          enrollmentCode == null
            ? Effect.succeed(false)
            : Effect.map(codes.currentEnrollment(), Option.contains(enrollmentCode));

        // The code is stored before the mail goes out, so a mail that fails
        // leaves it there and the next request replaces it.
        const userCodeFor = (email: string, enrollmentCode: string | undefined) =>
          Effect.gen(function* () {
            const existing = yield* users.findByEmail(email);

            if (Option.isSome(existing)) {
              if (!existing.value.hasAccess) {
                return yield* new NoAccess();
              }

              const code = yield* newCode;

              yield* codes.issueUserCode(existing.value.id, code);

              return code.code;
            }

            if (!(yield* isCurrentEnrollment(enrollmentCode))) {
              return yield* new NotRegistered();
            }

            const id = yield* crypto.randomULID.pipe(Effect.orDie);
            const code = yield* newCode;

            yield* users
              .register({ id, email }, code)
              .pipe(Effect.catchTag("EmailTaken", () => new NoAccess()));

            return code.code;
          });

        return Access.of({
          requestLink: Effect.fn("Access.requestLink")(function* (email, enrollmentCode) {
            const code = yield* userCodeFor(email.toLowerCase(), enrollmentCode);

            yield* mailer.sendLink(email, linkUrl(code)).pipe(
              Effect.tapError((error) =>
                Effect.logWarning("the magic link mail was not sent", error.message),
              ),
              Effect.mapError(() => new MailNotSent()),
            );
          }),
          openSession: Effect.fn("Access.openSession")(function* (code) {
            const userId = yield* codes.consumeUserCode(code);

            if (Option.isNone(userId)) {
              return yield* new InvalidLink();
            }

            const user = yield* users.get(userId.value);

            if (Option.isNone(user) || !user.value.hasAccess) {
              return yield* new NoAccess();
            }

            return { user: user.value, token: yield* tokens.sign(user.value.id) };
          }),
        });
      }),
    );
  };
}
