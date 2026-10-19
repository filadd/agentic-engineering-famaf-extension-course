import * as Cloudflare from "alchemy/Cloudflare";
import * as Config from "effect/Config";
import * as Effect from "effect/Effect";
import * as Option from "effect/Option";

const migrations = new URL("../migrations", import.meta.url).pathname;

// The D1 database of the stack. Alchemy applies the pending migrations on every
// deploy. KURASU_D1_IMPORT_FILES lists SQL files to load after the migrations,
// separated by commas: the API tests use it to start each stage from its own
// fixtures.
export const KurasuDatabase = Effect.gen(function* () {
  const importFiles = yield* Config.option(Config.String("KURASU_D1_IMPORT_FILES"));

  return yield* Cloudflare.D1.Database("Database", {
    migrations,
    ...Option.match(importFiles, {
      onNone: () => ({}),
      onSome: (files) => ({ importFiles: files.split(",") }),
    }),
  });
});
