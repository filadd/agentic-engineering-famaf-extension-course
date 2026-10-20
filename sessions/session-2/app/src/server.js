import express from "express";
import cookieParser from "cookie-parser";
import QRCode from "qrcode";
import multer from "multer";
import { randomBytes } from "node:crypto";
import { mkdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { broadcastEach, changeMaterial, joinClassroom, pushEvent, setHand, toggleStudents } from "./classroom.js";
import {
  createLivePoll,
  createSessionPoll,
  livePollFor,
  sessionPollsFor,
  setLivePollStatus,
  setSessionPollStatus,
  voteLive,
  voteSession,
} from "./polls.js";
import { db, getSetting, setSetting, newJoinCode, newToken } from "./db.js";
import {
  adminLoginPage,
  adminPage,
  classroomPage,
  homePage,
  invalidCodePage,
  joinPage,
  privatePage,
  qrPage,
  studentsPage,
} from "./views.js";

const PORT = Number(process.env.PORT ?? 3000);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? randomBytes(6).toString("hex");

const UPLOADS_DIR = resolve(process.env.UPLOADS_DIR ?? "uploads");

mkdirSync(UPLOADS_DIR, { recursive: true });

const upload = multer({ dest: UPLOADS_DIR, limits: { fileSize: 100 * 1024 * 1024 } });

const COOKIE_OPTIONS = { httpOnly: true, sameSite: "lax", maxAge: 1000 * 60 * 60 * 24 * 180 };

const app = express();

app.set("trust proxy", true);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

const currentStudent = (req) =>
  req.cookies.student == null ? undefined : db.prepare("SELECT * FROM students WHERE token = ?").get(req.cookies.student);

const isAdmin = (req) =>
  req.cookies.admin != null && db.prepare("SELECT 1 FROM admin_tokens WHERE token = ?").get(req.cookies.admin) != null;

const requireAdmin = (req, res, next) => (isAdmin(req) ? next() : res.redirect("/admin/login"));

const allSessions = (viewer = { teacher: false, student: null }) => {
  const materials = db.prepare("SELECT * FROM materials ORDER BY created_at").all();

  return db
    .prepare("SELECT * FROM sessions ORDER BY number")
    .all()
    .map((session) => ({
      ...session,
      materials: materials.filter((m) => m.session_number === session.number),
      polls: sessionPollsFor(session.number, viewer),
    }));
};

const joinUrl = (req) => `${process.env.BASE_URL ?? `${req.protocol}://${req.get("host")}`}/join/${getSetting("join_code")}`;

const qrSvg = (url) => QRCode.toString(url, { type: "svg", margin: 1, color: { dark: "#0b1026", light: "#ffffff" } });

app.get("/", (req, res) => {
  const student = currentStudent(req);

  if (student == null && !isAdmin(req)) {
    return res.send(privatePage());
  }

  res.send(homePage(student ?? { name: "docente" }, allSessions({ teacher: student == null, student: student ?? null })));
});

app.get("/join/:code", (req, res) => {
  if (req.params.code !== getSetting("join_code")) {
    return res.status(404).send(invalidCodePage());
  }

  if (currentStudent(req) != null) {
    return res.redirect("/");
  }

  res.send(joinPage(req.params.code));
});

app.post("/join/:code", (req, res) => {
  if (req.params.code !== getSetting("join_code")) {
    return res.status(404).send(invalidCodePage());
  }

  const name = (req.body.name ?? "").trim();

  if (name === "") {
    return res.status(400).send(joinPage(req.params.code, "Necesitamos tu nombre."));
  }

  const token = newToken();
  db.prepare("INSERT INTO students (name, token) VALUES (?, ?)").run(name.slice(0, 60), token);

  res.cookie("student", token, COOKIE_OPTIONS).redirect("/");
});

app.get("/admin/login", (req, res) => (isAdmin(req) ? res.redirect("/admin") : res.send(adminLoginPage())));

app.post("/admin/login", (req, res) => {
  if (req.body.password !== ADMIN_PASSWORD) {
    return res.status(401).send(adminLoginPage("Contraseña incorrecta."));
  }

  const token = newToken();
  db.prepare("INSERT INTO admin_tokens (token) VALUES (?)").run(token);

  res.cookie("admin", token, COOKIE_OPTIONS).redirect("/admin");
});

app.get("/admin", requireAdmin, (req, res) => {
  res.send(
    adminPage({
      sessions: allSessions({ teacher: true, student: null }),
      studentsCount: db.prepare("SELECT COUNT(*) AS count FROM students").get().count,
    }),
  );
});

app.get("/admin/estudiantes", requireAdmin, (req, res) => {
  res.send(studentsPage(db.prepare("SELECT name, created_at FROM students ORDER BY created_at").all()));
});

app.get("/admin/qr", requireAdmin, async (req, res) => {
  const url = joinUrl(req);

  res.send(qrPage({ joinUrl: url, qrSvg: await qrSvg(url) }));
});

app.post("/admin/sessions/:number/toggle", requireAdmin, (req, res) => {
  db.prepare("UPDATE sessions SET enabled = 1 - enabled WHERE number = ?").run(Number(req.params.number));
  res.redirect(`/admin#sesion-${req.params.number}`);
});

app.post("/admin/sessions/:number", requireAdmin, (req, res) => {
  const number = Number(req.params.number);
  const summary = (req.body.summary ?? "").trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(req.body.date ?? "")) {
    db.prepare("UPDATE sessions SET date = ? WHERE number = ?").run(req.body.date, number);
  }

  if (summary !== "") {
    db.prepare("UPDATE sessions SET summary = ? WHERE number = ?").run(summary, number);
  }

  res.redirect(`/admin#sesion-${req.params.number}`);
});

app.post("/admin/sessions/:number/materials", requireAdmin, upload.single("file"), (req, res) => {
  const title = (req.body.title ?? "").trim();
  const url = (req.body.url ?? "").trim();

  if (title !== "" && req.file != null) {
    db.prepare(
      "INSERT INTO materials (session_number, title, stored_name, original_name, mime) VALUES (?, ?, ?, ?, ?)",
    ).run(Number(req.params.number), title, req.file.filename, req.file.originalname, req.file.mimetype);
  } else if (title !== "" && /^https?:\/\//.test(url)) {
    db.prepare("INSERT INTO materials (session_number, title, url) VALUES (?, ?, ?)").run(Number(req.params.number), title, url);
  } else if (req.file != null) {
    rmSync(req.file.path, { force: true });
  }

  res.redirect(`/admin#sesion-${req.params.number}`);
});

app.post("/admin/materials/:id/delete", requireAdmin, (req, res) => {
  const material = db.prepare("SELECT * FROM materials WHERE id = ?").get(Number(req.params.id));

  if (material?.stored_name != null) {
    rmSync(resolve(UPLOADS_DIR, material.stored_name), { force: true });
  }

  db.prepare("DELETE FROM materials WHERE id = ?").run(Number(req.params.id));
  res.redirect(material == null ? "/admin" : `/admin#sesion-${material.session_number}`);
});

// Files are only served to course members, and students only get them once the session is enabled.
app.get("/materials/:id", (req, res) => {
  const material = db
    .prepare("SELECT materials.*, sessions.enabled FROM materials JOIN sessions ON sessions.number = materials.session_number WHERE id = ?")
    .get(Number(req.params.id));
  const admin = isAdmin(req);

  if (material == null || (!admin && (currentStudent(req) == null || !material.enabled))) {
    return res.status(404).send("No encontrado");
  }

  if (material.url != null) {
    return res.redirect(material.url);
  }

  res.type(material.mime);
  res.set("Content-Disposition", `inline; filename*=UTF-8''${encodeURIComponent(material.original_name)}`);
  res.sendFile(resolve(UPLOADS_DIR, material.stored_name));
});

app.post("/admin/join-code/rotate", requireAdmin, (req, res) => {
  setSetting("join_code", newJoinCode());
  res.redirect("/admin/qr");
});

const pollOptions = (raw) =>
  String(raw ?? "")
    .split("\n")
    .map((o) => o.trim())
    .filter(Boolean)
    .slice(0, 8);

app.post("/admin/sessions/:number/polls", requireAdmin, (req, res) => {
  const question = String(req.body.question ?? "").trim();
  const options = pollOptions(req.body.options);

  if (question !== "" && options.length >= 2) {
    createSessionPoll(Number(req.params.number), question, options);
  }

  res.redirect(`/admin#sesion-${req.params.number}`);
});

app.post("/admin/sessions/:number/polls/:id/status", requireAdmin, (req, res) => {
  if (["open", "closed", "done"].includes(req.body.status)) {
    setSessionPollStatus(Number(req.params.id), req.body.status);
  }

  res.redirect(`/admin#sesion-${req.params.number}`);
});

app.post("/sesiones/:number/polls/:id/vote", (req, res) => {
  const student = currentStudent(req);
  const session = allSessions().find((s) => s.number === Number(req.params.number));

  if (student != null && session?.enabled) {
    voteSession(session.number, Number(req.params.id), student.id, Number(req.body.option));
  }

  res.redirect(`/#sesion-${req.params.number}`);
});

// Students reach the classroom of enabled sessions only; teachers reach every one.
const classroomAccess = (req, res, next) => {
  const session = allSessions().find((s) => s.number === Number(req.params.number));
  const teacher = isAdmin(req);

  if (session == null || (!teacher && (currentStudent(req) == null || !session.enabled))) {
    return res.status(404).send("No encontrado");
  }

  req.session = session;
  req.teacher = teacher;
  next();
};

const htmlMaterials = (session) => session.materials.filter((m) => m.mime === "text/html");

app.get("/aula/:number", classroomAccess, (req, res) => {
  res.send(
    classroomPage({
      session: req.session,
      materials: htmlMaterials(req.session),
      teacher: req.teacher,
      student: req.teacher ? null : currentStudent(req),
    }),
  );
});

app.get("/aula/:number/stream", classroomAccess, (req, res) => {
  const current = currentStudent(req);
  const student = req.teacher || current == null ? null : { id: current.id, name: current.name };

  joinClassroom(req.session.number, req.session.classroom_material_id, {
    res,
    teacher: req.teacher,
    student,
    extra: { poll: livePollFor(req.session.number, { teacher: req.teacher, student }) },
  });
});

app.post("/aula/:number/material", classroomAccess, requireAdmin, (req, res) => {
  const materialId = req.body.materialId == null ? null : Number(req.body.materialId);

  if (materialId != null && !htmlMaterials(req.session).some((m) => m.id === materialId)) {
    return res.status(400).json({ error: "Solo se pueden mostrar materiales HTML de esta sesión" });
  }

  db.prepare("UPDATE sessions SET classroom_material_id = ? WHERE number = ?").run(materialId, req.session.number);
  changeMaterial(req.session.number, materialId);
  res.json({ ok: true });
});

app.post("/aula/:number/hand", classroomAccess, (req, res) => {
  const student = currentStudent(req);

  if (req.teacher || student == null) {
    return res.status(403).json({ error: "Solo estudiantes pueden levantar la mano" });
  }

  setHand(req.session.number, student, req.body.raised === true);
  res.json({ ok: true });
});

app.post("/aula/:number/hand/:studentId/lower", classroomAccess, requireAdmin, (req, res) => {
  setHand(req.session.number, { id: Number(req.params.studentId) }, false);
  res.json({ ok: true });
});

const broadcastPoll = (number) => broadcastEach(number, (client) => ({ type: "poll", poll: livePollFor(number, client) }));

app.post("/aula/:number/polls", classroomAccess, requireAdmin, (req, res) => {
  const question = String(req.body.question ?? "").trim();
  const options = (Array.isArray(req.body.options) ? req.body.options : []).map((o) => String(o).trim()).filter(Boolean);

  if (question === "" || options.length < 2) {
    return res.status(400).json({ error: "La encuesta necesita una pregunta y al menos dos opciones" });
  }

  createLivePoll(req.session.number, question, options.slice(0, 8));
  broadcastPoll(req.session.number);
  res.json({ ok: true });
});

app.post("/aula/:number/polls/vote", classroomAccess, (req, res) => {
  const student = currentStudent(req);

  if (req.teacher || student == null || !voteLive(req.session.number, student.id, req.body.option)) {
    return res.status(400).json({ error: "No se pudo registrar el voto" });
  }

  broadcastPoll(req.session.number);
  res.json({ ok: true });
});

app.post("/aula/:number/polls/status", classroomAccess, requireAdmin, (req, res) => {
  if (!["closed", "done"].includes(req.body.status)) {
    return res.status(400).json({ error: "Estado desconocido" });
  }

  setLivePollStatus(req.session.number, req.body.status);
  broadcastPoll(req.session.number);
  res.json({ ok: true });
});

app.post("/aula/:number/students-panel", classroomAccess, requireAdmin, (req, res) => {
  toggleStudents(req.session.number, req.body.show === true);
  res.json({ ok: true });
});

app.post("/aula/:number/events", classroomAccess, requireAdmin, (req, res) => {
  const event = req.body;

  if (!["key", "click", "scroll"].includes(event?.type)) {
    return res.status(400).json({ error: "Evento desconocido" });
  }

  pushEvent(req.session.number, event);
  res.json({ ok: true });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Curso en http://localhost:${PORT}`);

  if (process.env.ADMIN_PASSWORD == null) {
    console.log(`ADMIN_PASSWORD no definida, contraseña de esta corrida: ${ADMIN_PASSWORD}`);
  }
});
