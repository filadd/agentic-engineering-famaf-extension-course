import { EmailTaken } from "@kurasu/contract/errors";
import { User } from "@kurasu/contract/user";
import { Users } from "@kurasu/core/access/users";
import { asc, eq } from "drizzle-orm";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Schema from "effect/Schema";

import { batch, Database, firstRow } from "./database.ts";
import { codes, users } from "./schema.ts";

const decodeUser = Schema.decodeUnknownEffect(User);

const toUser = (row: typeof users.$inferSelect) => decodeUser(row).pipe(Effect.orDie);

const firstUser = firstRow(toUser);

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

    const findBy = (condition: ReturnType<typeof eq>) =>
      db
        .select()
        .from(users)
        .where(condition)
        .limit(1)
        .pipe(Effect.orDie, Effect.flatMap(firstUser));

    const emailTaken = (email: string) =>
      db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, email))
        .limit(1)
        .pipe(
          Effect.orDie,
          Effect.flatMap((rows) => (rows.length > 0 ? Effect.fail(new EmailTaken()) : Effect.void)),
        );

    return Users.of({
      findByEmail: (email) => findBy(eq(users.email, email)),
      get: (id) => findBy(eq(users.id, id)),
      list: () =>
        db
          .select()
          .from(users)
          .orderBy(asc(users.email))
          .limit(100)
          .pipe(Effect.orDie, Effect.flatMap(Effect.forEach(toUser))),
      create: (user) =>
        Effect.gen(function* () {
          yield* emailTaken(user.email);

          const rows = yield* db
            .insert(users)
            .values(newStudent(user.id, user.email))
            .returning()
            .pipe(Effect.orDie);

          return yield* toUser(rows[0] ?? newStudent(user.id, user.email));
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
      setAccess: (id, hasAccess) =>
        db
          .update(users)
          .set({ hasAccess })
          .where(eq(users.id, id))
          .returning()
          .pipe(Effect.orDie, Effect.flatMap(firstUser)),
      updateProfile: (id, profile) =>
        db
          .update(users)
          .set({ name: profile.name, avatar: profile.avatar })
          .where(eq(users.id, id))
          .returning()
          .pipe(Effect.orDie, Effect.flatMap(firstUser)),
    });
  }),
);
