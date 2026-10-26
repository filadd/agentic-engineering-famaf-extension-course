import * as emailSending from "@distilled.cloud/cloudflare/email-sending";
import { Resource } from "alchemy";
import type { Providers } from "alchemy/Cloudflare";
import * as Provider from "alchemy/Provider";
import * as Effect from "effect/Effect";

export interface DropSuppressedRecipientsProps {
  zoneId: string;
  subdomainId: string;
}

export interface DropSuppressedRecipientsAttributes extends DropSuppressedRecipientsProps {
  dropSuppressedRecipients: true;
}

export type DropSuppressedRecipients = Resource<
  "Kurasu.DropSuppressedRecipients",
  DropSuppressedRecipientsProps,
  DropSuppressedRecipientsAttributes,
  never,
  Providers
>;

export const DropSuppressedRecipients = Resource<DropSuppressedRecipients>(
  "Kurasu.DropSuppressedRecipients",
);

// `Cloudflare.Email.SendingSubdomain` owns the subdomain's lifecycle and
// converges its own settings, like `previewEnabled`, but does not expose this
// one; patching the flag from here is the stopgap until it does, so this
// resource only patches on reconcile and does nothing on delete.
export const dropSuppressedRecipientsProvider = () =>
  Provider.succeed(DropSuppressedRecipients, {
    reconcile: Effect.fn(function* ({ news }) {
      const { zoneId, subdomainId } = news;

      yield* emailSending.editSubdomain({
        zoneId,
        subdomainId,
        dropSuppressedRecipients: true,
      });

      return { zoneId, subdomainId, dropSuppressedRecipients: true };
    }),
    delete: () => Effect.void,
  });
