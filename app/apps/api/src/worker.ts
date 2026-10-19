import { Access } from "@kurasu/core/access/access";
import { Hands } from "@kurasu/core/hands/hands";
import { Materials } from "@kurasu/core/materials/materials";
import { Polls } from "@kurasu/core/polls/polls";
import { Questions } from "@kurasu/core/questions/questions";
import { Sessions } from "@kurasu/core/sessions/sessions";
import { D1Codes } from "@kurasu/database/codes";
import { Database } from "@kurasu/database/database";
import { D1Hands } from "@kurasu/database/hands";
import { D1Materials } from "@kurasu/database/materials";
import { D1Polls } from "@kurasu/database/polls";
import { D1Questions } from "@kurasu/database/questions";
import { KurasuDatabase } from "@kurasu/database/resource";
import { D1Responses } from "@kurasu/database/responses";
import { D1Sessions } from "@kurasu/database/sessions";
import { D1Users } from "@kurasu/database/users";
import * as Cloudflare from "alchemy/Cloudflare";
import * as Config from "effect/Config";
import * as Effect from "effect/Effect";
import * as HttpRouter from "effect/http/HttpRouter";
import * as HttpServer from "effect/http/HttpServer";
import { HttpApiBuilder } from "effect/http-api";
import * as Layer from "effect/Layer";

import { KurasuApi } from "@kurasu/contract/api";
import Aula from "./classroom/aula.ts";
import { ClassroomHandlers } from "./classroom/connect.ts";
import { DurableObjectClassroom } from "./classroom/notify.ts";
import { WebCrypto } from "./crypto.ts";
import { MaterialsBucket } from "./files/bucket.ts";
import { R2Files } from "./files/r2.ts";
import { AdminUsersHandlers } from "./handlers/admin-users.ts";
import { AuthHandlers } from "./handlers/auth.ts";
import { AdminMaterialsHandlers, MaterialsHandlers } from "./handlers/materials.ts";
import { MeHandlers } from "./handlers/me.ts";
import { AdminPollsHandlers, PollsHandlers } from "./handlers/polls.ts";
import { AdminQuestionsHandlers, QuestionsHandlers } from "./handlers/questions.ts";
import { AdminRaisedHandsHandlers, RaisedHandsHandlers } from "./handlers/raised-hands.ts";
import { AdminSessionsHandlers, SessionsHandlers } from "./handlers/sessions.ts";
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

    const bucket = yield* Cloudflare.R2.ReadWriteBucket(MaterialsBucket);
    const aulas = yield* Aula;

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

    const stores = Layer.mergeAll(
      D1Users,
      D1Codes,
      D1Sessions,
      D1Polls,
      D1Responses,
      D1Materials,
      D1Questions,
      D1Hands,
    ).pipe(Layer.provide(Database.layer(d1.raw)));

    const platform = Layer.mergeAll(
      EmailSendingMailer(email, sender),
      JoseSessionTokens(jwtSecret),
      WebCrypto,
      R2Files(bucket),
      DurableObjectClassroom(aulas),
    );

    const services = Layer.mergeAll(
      Access.layer(webOrigin),
      Sessions.layer,
      Polls.layer,
      Materials.layer,
      Questions.layer,
      Hands.layer,
    ).pipe(Layer.provideMerge(stores), Layer.provideMerge(platform));

    const app = HttpApiBuilder.layer(KurasuApi).pipe(
      Layer.provide([
        AuthHandlers,
        MeHandlers,
        AdminUsersHandlers(webOrigin),
        SessionsHandlers,
        AdminSessionsHandlers,
        PollsHandlers,
        AdminPollsHandlers,
        MaterialsHandlers,
        AdminMaterialsHandlers,
        QuestionsHandlers,
        AdminQuestionsHandlers,
        RaisedHandsHandlers,
        AdminRaisedHandsHandlers,
        ClassroomHandlers(aulas),
      ]),
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
