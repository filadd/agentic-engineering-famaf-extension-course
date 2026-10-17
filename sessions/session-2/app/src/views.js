const escape = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const formatDate = (iso) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });

const materialIcon = (material) => (material.url == null ? "📄" : "🔗");

const materialsList = (materials) =>
  materials.length === 0
    ? ""
    : `<ul class="materials">${materials
        .map((m) => `<li><a href="/materials/${m.id}" target="_blank">${materialIcon(m)} ${escape(m.title)}</a></li>`)
        .join("")}</ul>`;

const percent = (count, total) => (total === 0 ? 0 : Math.round((count / total) * 100));

const pollResults = (poll) => `
  <ul class="poll-list">${poll.options
    .map(
      (option, i) => `<li class="poll-result ${poll.myVote === i ? "mine" : ""}">
        <div class="poll-bar" style="width: ${percent(poll.results[i], poll.total)}%"></div>
        <span>${escape(option)}${poll.myVote === i ? " ✓" : ""}</span>
        <strong>${percent(poll.results[i], poll.total)}%</strong>
      </li>`,
    )
    .join("")}</ul>`;

const pollVoting = (sessionNumber, poll) => `
  <form method="post" action="/sesiones/${sessionNumber}/polls/${poll.id}/vote" class="poll-list">
    ${poll.options
      .map(
        (option, i) =>
          `<button name="option" value="${i}" class="poll-option ${poll.myVote === i ? "mine" : ""}">${escape(option)}</button>`,
      )
      .join("")}
  </form>`;

const votesLabel = (total) => (total === 1 ? "1 voto" : `${total} votos`);

const studentPoll = (sessionNumber, poll) => `
  <div class="poll inline-poll">
    <h4>📊 ${escape(poll.question)}</h4>
    <p class="poll-status">${
      poll.status === "closed"
        ? `Resultados · ${votesLabel(poll.total)}`
        : poll.myVote == null
          ? "Elegí una opción"
          : "Votaste, podés cambiar tu voto hasta que cierre"
    }</p>
    ${poll.status === "closed" ? pollResults(poll) : pollVoting(sessionNumber, poll)}
  </div>`;

export const layout = (title, body) => `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escape(title)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=DM+Sans:wght@400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <main>${body}</main>
</body>
</html>`;

const header = (subtitle) => `
  <header class="hero">
    <p class="kicker">Curso de extensión · FaMAF</p>
    <h1>De vibe coding a ingeniería agéntica</h1>
    ${subtitle}
  </header>`;

const sessionItem = (session) => `
  <article class="card session-item" id="sesion-${session.number}">
    <header class="session-head">
      <span class="num">${session.number}</span>
      <h2>${escape(session.title)}</h2>
      <span class="date">${escape(formatDate(session.date))}</span>
    </header>
    <h3 class="label">Resumen</h3>
    <p>${escape(session.summary)}</p>
    ${session.materials.length === 0 ? "" : `<h3 class="label">Materiales</h3>${materialsList(session.materials)}`}
    ${
      session.polls.length === 0
        ? ""
        : `<h3 class="label">Encuestas</h3>${session.polls.map((poll) => studentPoll(session.number, poll)).join("")}`
    }
    <a class="button aula-link" href="/aula/${session.number}">Entrar al aula</a>
  </article>`;

// Students only see the sessions already unlocked in class; the rest stay hidden, not teased.
export const homePage = (student, sessions) => {
  const unlocked = sessions.filter((s) => s.enabled).reverse();

  return layout(
    "Curso",
    `${header(`<p class="hello">Hola, ${escape(student.name)} 👋</p>`)}
    ${
      unlocked.length === 0
        ? `<section class="panel center">
            <h2>Todavía no arrancamos</h2>
            <p>Las sesiones van a aparecer acá a medida que las habilitemos en clase.</p>
          </section>`
        : `<section class="session-list">${unlocked.map(sessionItem).join("")}</section>`
    }`,
  );
};

export const privatePage = () =>
  layout(
    "Curso privado",
    `${header("")}
    <section class="panel center">
      <h2>Este espacio es solo para el curso</h2>
      <p>Para sumarte, escaneá el QR que mostramos en clase.</p>
    </section>`,
  );

export const joinPage = (code, error) =>
  layout(
    "Sumarme al curso",
    `${header("")}
    <form class="panel" method="post" action="/join/${escape(code)}">
      <h2>Sumate al curso</h2>
      ${error ? `<p class="error">${escape(error)}</p>` : ""}
      <label>¿Cómo te llamás?<input name="name" required maxlength="60" autofocus></label>
      <button>Entrar</button>
    </form>`,
  );

export const invalidCodePage = () =>
  layout(
    "Código inválido",
    `${header("")}
    <section class="panel center">
      <h2>Este QR ya no es válido</h2>
      <p>Pedí el QR actualizado en clase.</p>
    </section>`,
  );

export const adminLoginPage = (error) =>
  layout(
    "Admin",
    `${header("")}
    <form class="panel" method="post" action="/admin/login">
      <h2>Acceso docentes</h2>
      ${error ? `<p class="error">${escape(error)}</p>` : ""}
      <label>Contraseña<input type="password" name="password" required autofocus></label>
      <button>Entrar</button>
    </form>`,
  );

const materialRow = (material) => `
  <li>
    <a href="/materials/${material.id}" target="_blank">${materialIcon(material)} ${escape(material.title)}</a>
    <form method="post" action="/admin/materials/${material.id}/delete" class="inline">
      <button class="small ghost">Quitar</button>
    </form>
  </li>`;

const materialsCount = (count) => (count === 1 ? "1 material" : `${count} materiales`);

const pollStatusButton = (sessionNumber, poll, status, label, style = "ghost") => `
  <form method="post" action="/admin/sessions/${sessionNumber}/polls/${poll.id}/status" class="inline">
    <button name="status" value="${status}" class="small ${style}">${label}</button>
  </form>`;

const adminPoll = (sessionNumber, poll) => `
  <div class="poll inline-poll">
    <h4>📊 ${escape(poll.question)}</h4>
    <p class="poll-status">${poll.status === "open" ? "Abierta" : "Cerrada, resultados visibles"} · ${votesLabel(poll.total)}</p>
    ${pollResults(poll)}
    <div class="poll-actions">
      ${
        poll.status === "open"
          ? pollStatusButton(sessionNumber, poll, "closed", "Cerrar y mostrar resultados", "")
          : pollStatusButton(sessionNumber, poll, "open", "Reabrir")
      }
      ${pollStatusButton(sessionNumber, poll, "done", "Quitar")}
    </div>
  </div>`;

const adminSession = (session) => `
  <details class="collapsible" id="sesion-${session.number}">
    <summary>
      <span class="num">${session.number}</span>
      <span class="summary-title">${escape(session.title)}</span>
      <span class="summary-meta">${escape(formatDate(session.date))} · ${materialsCount(session.materials.length)}</span>
      <span class="badge ${session.enabled ? "on" : "off"}">${session.enabled ? "Habilitada" : "Deshabilitada"}</span>
    </summary>
    <div class="collapsible-body">
      <div class="session-controls">
        <form method="post" action="/admin/sessions/${session.number}" class="session-details" id="detalles-${session.number}">
          <label class="inline-label">Fecha <input type="date" name="date" value="${escape(session.date)}"></label>
          <label>Resumen<textarea name="summary" rows="3" required>${escape(session.summary)}</textarea></label>
          <button class="small ghost">Guardar cambios</button>
        </form>
        <a class="button small-button" href="/aula/${session.number}">Abrir aula</a>
        <form method="post" action="/admin/sessions/${session.number}/toggle" class="inline">
          <button class="small ${session.enabled ? "ghost" : "on"}">${session.enabled ? "Deshabilitar" : "Habilitar"}</button>
        </form>
      </div>
      <h3>Materiales</h3>
      ${
        session.materials.length === 0
          ? `<p class="soon">Sin materiales todavía.</p>`
          : `<ul class="materials">${session.materials.map(materialRow).join("")}</ul>`
      }
      <form method="post" action="/admin/sessions/${session.number}/materials" enctype="multipart/form-data" class="add-material">
        <input name="title" placeholder="Título (ej. Slides)" required>
        <input name="url" type="url" placeholder="Link (opcional)">
        <input name="file" type="file">
        <button class="small">Agregar</button>
      </form>
      <h3>Encuestas</h3>
      ${
        session.polls.length === 0
          ? `<p class="soon">Sin encuestas todavía.</p>`
          : session.polls.map((poll) => adminPoll(session.number, poll)).join("")
      }
      <form method="post" action="/admin/sessions/${session.number}/polls" class="add-poll">
        <input name="question" placeholder="Pregunta" required maxlength="200">
        <textarea name="options" rows="3" placeholder="Opciones, una por línea" required></textarea>
        <button class="small">Crear encuesta</button>
      </form>
    </div>
  </details>`;

// Forms redirect to /admin#sesion-N; reopen that session so the change stays in view.
const reopenFromHash = `<script>
  document.getElementById(location.hash.slice(1))?.setAttribute("open", "");
</script>`;

export const adminPage = ({ sessions, studentsCount }) =>
  layout(
    "Admin",
    `${header(`<div class="admin-bar">
      <p class="hello">Panel docente</p>
      <nav class="admin-nav">
        <a class="button ghost" href="/admin/estudiantes">Estudiantes (${studentsCount})</a>
        <a class="button" href="/admin/qr">Mostrar QR</a>
      </nav>
    </div>`)}
    <section class="admin">${sessions.map(adminSession).join("")}</section>
    ${reopenFromHash}`,
  );

export const classroomPage = ({ session, materials, teacher, student }) =>
  layout(
    `Aula · ${session.title}`,
    `<section class="aula" id="aula" data-session="${session.number}" data-role="${teacher ? "teacher" : "student"}" data-student="${student?.id ?? ""}">
      <header class="aula-bar">
        <a class="back" href="${teacher ? `/admin#sesion-${session.number}` : "/"}">←</a>
        <span class="num">${session.number}</span>
        <h1>${escape(session.title)}</h1>
        ${
          teacher
            ? `<span class="live">● En vivo</span>
              <span class="aula-presence" id="aula-presence"></span>
              <label class="toggle"><input type="checkbox" id="aula-students-toggle"> Mostrar estudiantes</label>
              <button class="ghost small" id="aula-poll-new">📊 Encuesta</button>
              <select id="aula-picker" aria-label="Material a mostrar">
                <option value="">Elegir material…</option>
                ${materials.map((m) => `<option value="${m.id}">${escape(m.title)}</option>`).join("")}
              </select>`
            : `<span class="live">● Siguiendo al docente</span>
              <button class="hand-button" id="aula-hand">✋ Levantar la mano</button>`
        }
      </header>
      ${teacher ? `<div class="hands" id="aula-hands" hidden></div>` : ""}
      <div class="aula-main">
      <div class="aula-stage">
        <iframe id="aula-frame" class="${teacher ? "" : "follower"}" tabindex="${teacher ? "0" : "-1"}" hidden></iframe>
        <p class="aula-empty" id="aula-empty">${
          teacher
            ? materials.length === 0
              ? "Esta sesión no tiene materiales HTML. Subí uno desde el panel para mostrarlo acá."
              : "Elegí un material para empezar a mostrarlo."
            : "El docente todavía no está mostrando nada."
        }</p>
      </div>
      <div class="aula-side">
        <section class="poll" id="aula-poll" hidden></section>
        <aside class="aula-students" id="aula-students" hidden>
          <h2>En el aula</h2>
          <ul id="aula-students-list"></ul>
        </aside>
      </div>
      </div>
    </section>
    ${
      teacher
        ? `<dialog class="panel poll-dialog" id="aula-poll-dialog">
            <form method="dialog" id="aula-poll-form">
              <h2>Nueva encuesta</h2>
              <label>Pregunta<input name="question" required maxlength="200"></label>
              <label>Opciones, una por línea<textarea name="options" rows="4" required></textarea></label>
              <div class="dialog-actions">
                <button type="button" class="ghost" id="aula-poll-cancel">Cancelar</button>
                <button>Lanzar encuesta</button>
              </div>
            </form>
          </dialog>`
        : ""
    }
    <script src="/aula.js"></script>`,
  );

const formatJoined = (sqliteDate) =>
  new Date(`${sqliteDate.replace(" ", "T")}Z`).toLocaleDateString("es-AR", { day: "numeric", month: "long" });

export const studentsPage = (students) =>
  layout(
    "Estudiantes",
    `${header(`<div class="admin-bar">
      <p class="hello">Estudiantes · ${students.length === 0 ? "nadie todavía" : `${students.length} en el curso`}</p>
      <nav class="admin-nav"><a class="button ghost" href="/admin">Volver al panel</a></nav>
    </div>`)}
    <section class="panel students-panel">
      ${
        students.length === 0
          ? `<p class="soon">Todavía no se sumó nadie. Mostrá el QR en clase para que se sumen.</p>`
          : `<ul class="students">${students
              .map((s) => `<li><span>${escape(s.name)}</span><span class="date">se sumó el ${escape(formatJoined(s.created_at))}</span></li>`)
              .join("")}</ul>`
      }
    </section>`,
  );

export const qrPage = ({ joinUrl, qrSvg }) =>
  layout(
    "QR del curso",
    `<section class="projector">
      <h1>Sumate al curso</h1>
      <div class="qr big">${qrSvg}</div>
      <p class="mono">${escape(joinUrl)}</p>
      <div class="projector-actions">
        <a class="button ghost" href="/admin">Volver al panel</a>
        <form method="post" action="/admin/join-code/rotate" class="inline">
          <button class="ghost">Generar QR nuevo</button>
        </form>
      </div>
    </section>`,
  );
