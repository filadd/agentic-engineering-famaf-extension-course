import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

import * as Effect from "effect/Effect";
import * as Schedule from "effect/Schedule";

export interface SentMail {
  readonly from: string;
  readonly to: ReadonlyArray<string>;
  readonly bcc: ReadonlyArray<string>;
  readonly subject: string;
  readonly text: string;
  readonly html: string;
}

const header = "send_email binding called with MessageBuilder:\n";

const addresses = (value: string | undefined) =>
  value == null || value === "" ? [] : value.split(", ").toSorted();

// One message as the local binding logs it: a line per field (`From`, `To`,
// `Cc` and `Bcc` when present, `Subject`), a blank line, and the paths of the
// text and HTML bodies it wrote.
const parseMessage = async (block: string): Promise<SentMail> => {
  const fields = new Map(
    block.split("\n").flatMap((line) => {
      const separator = line.indexOf(": ");

      return separator === -1 ? [] : [[line.slice(0, separator), line.slice(separator + 2)]];
    }),
  );

  const body = (field: string) => {
    const path = fields.get(field);

    return path == null ? Promise.resolve("") : readFile(path, "utf8");
  };

  return {
    from: fields.get("From") ?? "",
    to: addresses(fields.get("To")),
    bcc: addresses(fields.get("Bcc")),
    subject: fields.get("Subject") ?? "",
    text: await body("Text"),
    html: await body("HTML"),
  };
};

// The mails a test stage sent. The local send_email binding logs the
// recipients of each message only to the Worker's output, which Alchemy writes
// as it runs to `.alchemy/log/<stage>/Api/<timestamp>.log`, next to the test
// process; the body files under `.alchemy/local/email` carry no recipients.
export const sentMails = (stage: string) =>
  Effect.tryPromise(async () => {
    const folder = join(process.cwd(), ".alchemy", "log", stage, "Api");

    const logs = await Promise.all(
      (await readdir(folder)).map((file) => readFile(join(folder, file), "utf8")),
    );

    const blocks = logs.flatMap((log) => log.split(header).slice(1));

    return Promise.all(blocks.map(parseMessage));
  }).pipe(Effect.orDie);

// The mails with `subject`, once `count` of them are in the log; waits a moment
// for the Worker's output to reach it.
export const mailsWithSubject = (stage: string, subject: string, count: number) =>
  sentMails(stage).pipe(
    Effect.map((mails) => mails.filter((mail) => mail.subject === subject)),
    Effect.filterOrFail(
      (mails) => mails.length >= count,
      (mails) => `${mails.length} of ${count} mails with the subject ${subject}`,
    ),
    Effect.retry({ schedule: Schedule.spaced("200 millis"), times: 25 }),
    Effect.orDie,
  );

// Whether no mail with `subject` was sent. Waits a moment first, so a mail
// being logged is not missed.
export const noMailWithSubject = (stage: string, subject: string) =>
  Effect.sleep("1 second").pipe(
    Effect.andThen(sentMails(stage)),
    Effect.map((mails) => mails.every((mail) => mail.subject !== subject)),
  );
