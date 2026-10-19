import { Mailer, MailError } from "@kurasu/core/access/mailer";
import type * as Cloudflare from "alchemy/Cloudflare";
import { RuntimeContext } from "alchemy/RuntimeContext";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";

const escapeHtml = (text: string) =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const linkHtml = (to: string, url: string) => `<!doctype html>
<html lang="es">
  <body style="font-family: system-ui, sans-serif; color: #1f2937;">
    <p>Hola,</p>
    <p>Pediste entrar a kurasu con ${escapeHtml(to)}. Para entrar, abrí este link:</p>
    <p><a href="${escapeHtml(url)}">Entrar a kurasu</a></p>
    <p>El link sirve una sola vez. Si no lo pediste, ignorá este mail.</p>
  </body>
</html>
`;

const linkText = (to: string, url: string) => `Hola,

Pediste entrar a kurasu con ${to}. Para entrar, abrí este link:

${url}

El link sirve una sola vez. Si no lo pediste, ignorá este mail.
`;

export const EmailSendingMailer = (email: Cloudflare.Email.SendClient, from: string) =>
  Layer.effect(
    Mailer,
    Effect.gen(function* () {
      const runtime = yield* RuntimeContext;

      return Mailer.of({
        sendLink: (to, url) =>
          email
            .send({
              from,
              to,
              subject: "Tu link para entrar a kurasu",
              text: linkText(to, url),
              html: linkHtml(to, url),
            })
            .pipe(
              Effect.asVoid,
              Effect.mapError((error) => new MailError({ message: error.message })),
              Effect.provideService(RuntimeContext, runtime),
            ),
      });
    }),
  );
