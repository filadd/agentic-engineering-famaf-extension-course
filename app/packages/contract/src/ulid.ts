import * as Schema from "effect/Schema";

export const Ulid = Schema.String.check(Schema.isULID());

export type Ulid = typeof Ulid.Type;
