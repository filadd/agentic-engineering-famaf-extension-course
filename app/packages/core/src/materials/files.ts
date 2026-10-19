import type { FileTooLarge } from "@kurasu/contract/errors";
import type { Ulid } from "@kurasu/contract/ulid";
import * as Context from "effect/Context";
import type * as Effect from "effect/Effect";
import type * as Option from "effect/Option";
import type * as Stream from "effect/Stream";

export interface FileUpload {
  readonly id: Ulid;
  readonly name: string;
  readonly contentType: string;
  readonly body: Stream.Stream<Uint8Array, FileTooLarge>;
}

export interface StoredFile {
  readonly name: string;
  readonly contentType: string;
  readonly size: number;
  readonly body: Stream.Stream<Uint8Array>;
}

// The material files, streamed in and out without buffering. `put` returns the
// stored size in bytes.
export class Files extends Context.Service<
  Files,
  {
    readonly put: (file: FileUpload) => Effect.Effect<number, FileTooLarge>;
    readonly get: (id: Ulid) => Effect.Effect<Option.Option<StoredFile>>;
    readonly remove: (id: Ulid) => Effect.Effect<void>;
  }
>()("kurasu/Files") {}
