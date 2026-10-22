import { EmailTaken } from "@kurasu/contract/errors";
import { User } from "@kurasu/contract/user";
import { Users } from "@kurasu/core/access/users";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Schema from "effect/Schema";

import { batch, Database } from "./database.ts";
import { repositoryOf } from "./repository.ts";
import { codes, users } from "./schema.ts";

const decodeUser = Schema.decodeUnknownEffect(User);

const toUser = (row: typeof users.$inferSelect) => decodeUser(row).pipe(Effect.orDie);

const newStudent = (id: string, email: string) => ({
  id,
  email,
  name: null,
  avatar: null,
  role: "student" as const,
  hasAccess: true,
});

export const D1Users = Layer.effect(
  Users,
  Effect.gen(function* () {
    const { db, client } = yield* Database;

    const repository = yield* repositoryOf(users, { decode: toUser });

    const emailTaken = (email: string) =>
      Effect.flatMap(repository.count({ email }), (taken) =>
        taken > 0 ? Effect.fail(new EmailTaken()) : Effect.void,
      );

    return Users.of({
      ...repository,
      create: (user) =>
        Effect.gen(function* () {
          yield* emailTaken(user.email);

          return yield* repository.create(newStudent(user.id, user.email));
        }),
      register: (user, code) =>
        Effect.gen(function* () {
          yield* emailTaken(user.email);

          yield* batch(client, [
            db.insert(users).values(newStudent(user.id, user.email)),
            db
              .insert(codes)
              .values({ id: code.id, type: "user", code: code.code, userId: user.id }),
          ]);

          return yield* toUser(newStudent(user.id, user.email));
        }),
    });
  }),
);
