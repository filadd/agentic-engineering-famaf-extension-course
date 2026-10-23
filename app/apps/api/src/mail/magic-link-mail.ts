import { escapeHtml } from "./escape-html.ts";

export const magicLinkMail = (to: string, url: string) => ({
  subject: "Tu link para entrar a kurasu",
  text: `Hola,

Pediste entrar a kurasu con ${to}. Para entrar, abrí este link:

${url}

El link sirve una sola vez. Si no lo pediste, ignorá este mail.
`,
  html: `<!doctype html>
<html lang="es">
  <body style="font-family: system-ui, sans-serif; color: #1f2937;">
    <p>Hola,</p>
    <p>Pediste entrar a kurasu con ${escapeHtml(to)}. Para entrar, abrí este link:</p>
    <p><a href="${escapeHtml(url)}">Entrar a kurasu</a></p>
    <p>El link sirve una sola vez. Si no lo pediste, ignorá este mail.</p>
  </body>
</html>
`,
});
