import * as Cloudflare from "alchemy/Cloudflare";
import * as Config from "effect/Config";
import * as Effect from "effect/Effect";
import * as Option from "effect/Option";

// The send_email binding. Production sends to any address from no-reply@ on the
// domain; the API test stages list their fixtures' emails in
// KURASU_MAIL_ALLOWED_DESTINATIONS, so a link for any other address fails.
export const mailBinding = (sender: string) =>
  Effect.map(Config.option(Config.String("KURASU_MAIL_ALLOWED_DESTINATIONS")), (allowed) =>
    Option.match(allowed, {
      onNone: () => Cloudflare.Email.SendEmail("EMAIL", { allowedSenderAddresses: [sender] }),
      onSome: (destinations) =>
        Cloudflare.Email.SendEmail("EMAIL", {
          allowedSenderAddresses: [sender],
          allowedDestinationAddresses: destinations.split(","),
        }),
    }),
  );
