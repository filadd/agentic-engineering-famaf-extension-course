import { readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";

import * as Effect from "effect/Effect";
import * as Schedule from "effect/Schedule";

// The local send_email binding writes each mail's text body to
// `.alchemy/local/email/text/<uuid>.txt`, next to the test process. The folder
// is shared by every test file and run, so the mail is found by its recipient,
// which the body names, taking the newest match.
const textMailFolder = join(process.cwd(), ".alchemy", "local", "email", "text");

const newestMailTo = (email: string) =>
  Effect.tryPromise(async () => {
    const files = await readdir(textMailFolder);

    const mails = await Promise.all(
      files.map(async (file) => {
        const path = join(textMailFolder, file);

        return { text: await readFile(path, "utf8"), modified: (await stat(path)).mtimeMs };
      }),
    );

    return mails
      .filter((mail) => mail.text.includes(email))
      .toSorted((a, b) => b.modified - a.modified)[0]?.text;
  });

// The link code of the newest mail sent to `email`; waits a moment for the
// binding to write it.
export const linkCodeFor = (email: string) =>
  newestMailTo(email).pipe(
    Effect.flatMap((text) => {
      const code = text?.match(/codigo=([^\s&"]+)/)?.[1];

      return code == null
        ? Effect.fail(`no mail with a link for ${email}`)
        : Effect.succeed(decodeURIComponent(code));
    }),
    Effect.retry({ schedule: Schedule.spaced("200 millis"), times: 25 }),
    Effect.orDie,
  );
