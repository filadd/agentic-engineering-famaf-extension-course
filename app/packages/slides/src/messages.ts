import * as Schema from "effect/Schema";

const Count = Schema.Int.check(Schema.isGreaterThanOrEqualTo(1));

// Slides and steps count from 1; a slide without inner steps has one step.
export const Position = Schema.Struct({
  slide: Count,
  step: Count,
});

export type Position = typeof Position.Type;

export const SlidesManifest = Schema.Struct({
  type: Schema.Literal("kurasu:manifest"),
  slides: Schema.Array(Schema.Struct({ steps: Count })).check(Schema.isMinLength(1)),
});

export type SlidesManifest = typeof SlidesManifest.Type;

export const SlidesGo = Schema.Struct({
  type: Schema.Literal("kurasu:go"),
  ...Position.fields,
});

export type SlidesGo = typeof SlidesGo.Type;

export const start: Position = { slide: 1, step: 1 };

export class SlidesInvalid extends Schema.TaggedError<SlidesInvalid>()("SlidesInvalid", {}) {}
