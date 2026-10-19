import * as Effect from "effect/Effect";
import * as Multipart from "effect/http/Multipart";
import * as Option from "effect/Option";
import * as Pull from "effect/Pull";
import * as Stream from "effect/Stream";

const skipContent = (part: Multipart.Part) =>
  Multipart.isFile(part) ? Stream.runDrain(part.content) : Effect.void;

// The parts of a multipart body one at a time: `next` gives none once the body
// ends. `skipRest` reads whatever the client still sends, the content of the
// last file included: answering before the client finished sending makes it
// lose the answer when the connection closes.
export const formParts = (parts: Stream.Stream<Multipart.Part, Multipart.MultipartError>) =>
  Effect.map(Stream.toPull(Stream.rechunk(parts, 1)), (pull) => {
    let last: Multipart.Part | undefined;

    const next = pull.pipe(
      Effect.map(([part]) => {
        last = part;

        return Option.some(part);
      }),
      Pull.catchDone(() => Effect.succeedNone),
      Effect.orDie,
    );

    const skipRest = Effect.gen(function* () {
      if (last != null) {
        yield* skipContent(last);
      }

      let part = yield* next;

      while (Option.isSome(part)) {
        yield* skipContent(part.value);
        part = yield* next;
      }
    }).pipe(Effect.ignoreCause);

    return { next, skipRest };
  });
