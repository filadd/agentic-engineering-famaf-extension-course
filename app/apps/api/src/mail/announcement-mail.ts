import { changelogLine } from "@kurasu/contract/changelog";
import type { AnnouncementMail } from "@kurasu/core/mail/mailer";

import { escapeHtml } from "./escape-html.ts";

// The colours of the app's theme, written as values: mail clients drop CSS
// variables and most of a stylesheet, so every style goes inline.
const colors = { window: "#FBF3EE", newsbox: "#F3E8E1", rule: "#EADFD8", ink: "#1F1B18" };

const bodyFont = "'Atkinson Hyperlegible', system-ui, sans-serif";
const headingFont = "'Rubik', system-ui, sans-serif";
const emojiFont = "'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif";

const crow = "🐦‍⬛";

const messageHtml = (message: string) =>
  message === ""
    ? ""
    : `<p style="margin: 0 0 18px;">${escapeHtml(message).replaceAll(/\r?\n/g, "<br>")}</p>`;

const newsHtml = (lines: ReadonlyArray<string>) =>
  lines.length === 0
    ? ""
    : `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: ${colors.newsbox}; border-radius: 16px; margin-bottom: 20px;">
              <tr>
                <td style="padding: 14px 18px;">
                  <h3 style="margin: 0 0 6px; font-family: ${headingFont}; font-size: 15px;">Novedades</h3>
                  <ul style="margin: 0; padding-left: 20px;">
                    ${lines.map((line) => `<li style="margin: 3px 0;">${escapeHtml(line)}</li>`).join("\n                    ")}
                  </ul>
                </td>
              </tr>
            </table>`;

const textBlocks = (blocks: ReadonlyArray<string>) =>
  `${blocks.filter((block) => block !== "").join("\n\n")}\n`;

// The announcement mail of one batch: the teacher's message as written, the
// lines of the included entries and the one link, to the session. Everything a
// user wrote is escaped in the HTML part and goes as is in the text part.
export const announcementMail = (mail: AnnouncementMail) => {
  const lines = mail.entries.map(changelogLine);

  return {
    subject: `Novedades de la sesión "${mail.sessionTitle}"`,
    text: textBlocks([
      mail.message,
      lines.length === 0 ? "" : `Novedades\n\n${lines.map((line) => `- ${line}`).join("\n")}`,
      `Ir a la sesión:\n${mail.sessionUrl}`,
    ]),
    html: `<!doctype html>
<html lang="es">
  <body style="margin: 0; padding: 24px 12px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background: ${colors.window}; border-radius: 16px; font-family: ${bodyFont}; color: ${colors.ink}; font-size: 15px; line-height: 1.5;">
            <tr>
              <td style="padding: 24px;">
            <p style="margin: 0 0 18px; padding-bottom: 16px; border-bottom: 1.5px solid ${colors.rule}; font-family: ${headingFont}; font-weight: 700; font-size: 20px;"><span style="font-family: ${emojiFont}; font-size: 30px; vertical-align: middle;">${crow}</span> kurasu</p>
            ${messageHtml(mail.message)}
            ${newsHtml(lines)}
            <p style="margin: 0; text-align: right;"><a href="${escapeHtml(mail.sessionUrl)}" style="display: inline-block; background: ${colors.ink}; color: #ffffff; text-decoration: none; border-radius: 999px; padding: 10px 20px; font-family: ${headingFont}; font-weight: 500; font-size: 15px;">Ir a la sesión</a></p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`,
  };
};
