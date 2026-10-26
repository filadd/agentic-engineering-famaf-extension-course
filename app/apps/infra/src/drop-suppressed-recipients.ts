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

/**
 * Turns on `drop_suppressed_recipients` on a Cloudflare Email Sending
 * subdomain. Without it a single suppressed recipient fails the whole send
 * request; with it Email Service drops that recipient and delivers the rest.
 *
 * The setting lives on the subdomain that `Cloudflare.Email.SendingSubdomain`
 * owns, so this resource never creates or deletes anything: it only patches
 * the flag on reconcile.
 */
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
    // SendingSubdomain owns the subdomain's lifecycle.
    delete: () => Effect.void,
  });
