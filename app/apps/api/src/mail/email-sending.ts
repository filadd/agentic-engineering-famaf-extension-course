import { Mailer, MailError } from "@kurasu/core/mail/mailer";
import type * as Cloudflare from "alchemy/Cloudflare";
import { RuntimeContext } from "alchemy/RuntimeContext";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";

import { announcementMail } from "./announcement-mail.ts";
import { magicLinkMail } from "./magic-link-mail.ts";

export const EmailSendingMailer = (email: Cloudflare.Email.SendClient, from: string) =>
  Layer.effect(
    Mailer,
    Effect.gen(function* () {
      const runtime = yield* RuntimeContext;

      const send = (message: Parameters<Cloudflare.Email.SendClient["send"]>[0]) =>
        email.send(message).pipe(
          Effect.asVoid,
          Effect.mapError((error) => new MailError({ message: error.message })),
          Effect.provideService(RuntimeContext, runtime),
        );

      return Mailer.of({
        sendMagicLink: (to, url) => send({ from, to, ...magicLinkMail(to, url) }),
        sendAnnouncement: (mail) =>
          send({ from, to: mail.to, bcc: [...mail.bcc], ...announcementMail(mail) }),
      });
    }),
  );
