import { Access } from "@kurasu/core/access/access";
import { D1Codes } from "@kurasu/database/codes";
import { Database } from "@kurasu/database/database";
import { KurasuDatabase } from "@kurasu/database/resource";
import { D1Users } from "@kurasu/database/users";
import * as Cloudflare from "alchemy/Cloudflare";
import * as Config from "effect/Config";
import * as Effect from "effect/Effect";
import * as HttpRouter from "effect/http/HttpRouter";
import * as HttpServer from "effect/http/HttpServer";
import { HttpApiBuilder } from "effect/http-api";
import * as Layer from "effect/Layer";

import { ServedApi } from "./api.ts";
import Aula from "./classroom/aula.ts";
import { WebCrypto } from "./crypto.ts";
import { MaterialsBucket } from "./files/bucket.ts";
import { AdminUsersHandlers } from "./handlers/admin-users.ts";
import { AuthHandlers } from "./handlers/auth.ts";
import { MeHandlers } from "./handlers/me.ts";
import { mailBinding } from "./mail/binding.ts";
import { EmailSendingMailer } from "./mail/email-sending.ts";
import { CurrentUserMiddlewareLive } from "./middleware.ts";
import { JoseSessionTokens } from "./session-tokens.ts";

// The construction runs at plan time as well as when the isolate starts, and
// the bindings only exist in the second. So the app, with every layer that
// reads D1, is built inside `fetch`, once per request.
export default class Api extends Cloudflare.Worker<Api>()(
  "Api",
  {
    main: import.meta.url,
    dev: { port: 1337 },
  },
  Effect.gen(function* () {
    const database = yield* KurasuDatabase;
    const d1 = yield* Cloudflare.D1.QueryDatabase(database);

    yield* Cloudflare.R2.ReadWriteBucket(MaterialsBucket);
    yield* Aula;

    const domain = yield* Config.String("KURASU_DOMAIN").pipe(
      Config.withDefault("kurasu.asermax.com"),
    );

    // Where the links of the mail and the QR point. Deployed it is the domain;
    // under `alchemy dev` it is the local web, set in .env.schema.
    const webOrigin = yield* Config.String("KURASU_WEB_ORIGIN").pipe(
      Config.withDefault(`https://${domain}`),
    );

    const jwtSecret = yield* Config.Redacted("JWT_SECRET");
    const sender = `no-reply@${domain}`;
    const email = yield* Cloudflare.Email.Send(yield* mailBinding(sender));

    const adapters = Layer.mergeAll(D1Users, D1Codes).pipe(Layer.provide(Database.layer(d1.raw)));

    const access = Access.layer(webOrigin).pipe(
      Layer.provide([EmailSendingMailer(email, sender), JoseSessionTokens(jwtSecret), WebCrypto]),
      Layer.provideMerge(adapters),
    );

    const services = access.pipe(
      Layer.provideMerge(Layer.mergeAll(JoseSessionTokens(jwtSecret), WebCrypto)),
    );

    const app = HttpApiBuilder.layer(ServedApi).pipe(
      Layer.provide([AuthHandlers, MeHandlers, AdminUsersHandlers(webOrigin)]),
      Layer.provide(CurrentUserMiddlewareLive),
      Layer.provide(services),
      Layer.provide(HttpServer.layerServices),
    );

    return {
      fetch: Effect.flatten(HttpRouter.toHttpEffect(app)).pipe(
        Effect.provide(services),
        Effect.catchTag("ConfigError", Effect.die),
      ),
    };
  }).pipe(
    Effect.provide(
      Layer.mergeAll(
        Cloudflare.D1.QueryDatabaseBinding,
        Cloudflare.R2.ReadWriteBucketBinding,
        Cloudflare.Email.SendBinding,
      ),
    ),
  ),
) {}
