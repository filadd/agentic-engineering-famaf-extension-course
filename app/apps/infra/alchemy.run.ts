import Api from "@kurasu/api/worker";
import * as Alchemy from "alchemy";
import { adopt } from "alchemy/AdoptPolicy";
import * as Cloudflare from "alchemy/Cloudflare";
import { WorkerRoute } from "alchemy/Cloudflare/Workers/Route";
import { retain } from "alchemy/RemovalPolicy";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";

import { kurasuDomain, zoneName } from "./src/domain.ts";
import {
  DropSuppressedRecipients,
  dropSuppressedRecipientsProvider,
} from "./src/drop-suppressed-recipients.ts";
import { Web } from "./src/web.ts";

// The state of every deployed stage lives in the Cloudflare account. `alchemy
// dev` keeps its state on this machine, so a dev stage needs no credentials.
const state = Layer.unwrap(
  Effect.map(Effect.orDie(Alchemy.ALCHEMY_DEV), (dev) =>
    dev ? Alchemy.localState() : Cloudflare.state(),
  ),
);

// `DropSuppressedRecipients` calls the Cloudflare API, so its provider needs
// the `Credentials` and `HttpClient` that `Cloudflare.providers()` builds.
// `provideMerge` feeds those in and keeps the provider in the stack's context.
const providers = dropSuppressedRecipientsProvider().pipe(
  Layer.provideMerge(Cloudflare.providers()),
);

export default Alchemy.Stack(
  "kurasu",
  { providers, state },
  Effect.gen(function* () {
    const domain = yield* kurasuDomain;
    const api = yield* Api;
    const web = yield* Web(api.url);

    // The zone, the mail sender and the route only exist in Cloudflare. The
    // route sends kurasu.asermax.com/api/* to the API Worker; routes win over
    // the web's custom domain on the same hostname.
    if (domain.deployed) {
      const zone = yield* Cloudflare.Zone.Zone("Zone", { name: zoneName }).pipe(
        adopt(true),
        retain(),
      );

      const sender = yield* Cloudflare.Email.SendingSubdomain("MailSender", {
        zoneId: zone.zoneId,
        name: domain.name,
      });

      yield* DropSuppressedRecipients("MailSenderDrop", {
        zoneId: sender.zoneId,
        subdomainId: sender.subdomainId,
      });

      yield* WorkerRoute("ApiRoute", {
        zoneId: zone.zoneId,
        pattern: `${domain.name}/api/*`,
        script: api.workerName,
      });
    }

    return {
      api: api.url,
      web: web.url,
    };
  }),
);
