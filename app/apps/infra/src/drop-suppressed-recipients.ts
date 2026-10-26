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
  dropSuppressedRecipients: boolean;
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
// one; patching the flag from here is the stopgap until it does. `read`
// observes the flag so a deploy re-applies it when the dashboard drifted,
// and delete does nothing because SendingSubdomain owns the subdomain.
export const dropSuppressedRecipientsProvider = () =>
  Provider.succeed(DropSuppressedRecipients, {
    read: Effect.fn(function* ({ output }) {
      const zoneId = output?.zoneId;
      const subdomainId = output?.subdomainId;

      if (zoneId == null || subdomainId == null) {
        return undefined;
      }

      return yield* emailSending.getSubdomain({ zoneId, subdomainId }).pipe(
        Effect.map((subdomain) => ({
          zoneId,
          subdomainId,
          dropSuppressedRecipients: subdomain.dropSuppressedRecipients === true,
        })),
        Effect.catchTag("SendingSubdomainNotFound", () => Effect.succeed(undefined)),
      );
    }),
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
