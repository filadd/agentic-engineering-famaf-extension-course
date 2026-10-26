import * as emailSending from "@distilled.cloud/cloudflare/email-sending";
import { Resource } from "alchemy";
import type { Providers } from "alchemy/Cloudflare";
import * as Provider from "alchemy/Provider";
import * as Effect from "effect/Effect";

export interface DropSuppressedRecipientsProps {
  zoneId: string;
  subdomainId: string;
}

export interface DropSuppressedRecipientsAttributes {
  zoneId: string;
  subdomainId: string;
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

// `Cloudflare.Email.SendingSubdomain` owns the subdomain's lifecycle, so this
// resource only patches the flag on reconcile and does nothing on delete.
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
