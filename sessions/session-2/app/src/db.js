import { DatabaseSync } from "node:sqlite";
import { randomBytes } from "node:crypto";

const SESSIONS = [
  {
    number: 1,
    title: "La experiencia vibe coding",
    date: "2026-11-02",
    summary: "Cómo funciona un agente por dentro (LLM + herramientas + harness). Instalamos Pi y construimos un proyecto propio sin leer una línea de código. Seguridad: qué se escapa cuando no revisás.",
  },
  {
    number: 2,
    title: "Planificación y revisión",
    date: "2026-11-09",
    summary: "Explorar, diseñar y documentar antes de que el agente toque código. Revisar antes, con tests y con verificación hecha por el propio agente (API, datos, pantalla).",
  },
  {
    number: 3,
    title: "Herramientas y skills",
    date: "2026-11-16",
    summary: "Lo que le explicaste dos veces, escribilo una. Configuración, skills y extensiones. Todo lo que le agregás al agente se paga en contexto.",
  },
  {
    number: 4,
    title: "Ingeniería de contexto",
    date: "2026-11-23",
    summary: "Documentar el problema y la solución: PROJECT.md y un documento por feature. Usar esa documentación como contexto para planificar e implementar. Deuda cognitiva y cuándo no usar IA.",
  },
  {
    number: 5,
    title: "Por dentro del harness",
    date: "2026-11-30",
    summary: "Abrimos la caja: el loop del agente, sus puntos de extensión y el árbol de sesiones, con Pi como espécimen. El agente escribe su propia extensión.",
  },
  {
    number: 6,
    title: "Modelos abiertos y CCAD",
    date: "2026-12-07",
    summary: "El modelo es un componente reemplazable. Corremos lo construido en las sesiones 1 a 4 contra un modelo abierto en el CCAD a través de un gateway LiteLLM.",
  },
];

export const db = new DatabaseSync(process.env.DB_PATH ?? "data.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    number INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    summary TEXT NOT NULL,
    enabled INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS admin_tokens (
    token TEXT PRIMARY KEY,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS materials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_number INTEGER NOT NULL REFERENCES sessions(number),
    title TEXT NOT NULL,
    url TEXT,
    stored_name TEXT,
    original_name TEXT,
    mime TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS polls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_number INTEGER NOT NULL REFERENCES sessions(number),
    question TEXT NOT NULL,
    options TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS poll_votes (
    poll_id INTEGER NOT NULL REFERENCES polls(id),
    student_id INTEGER NOT NULL REFERENCES students(id),
    option INTEGER NOT NULL,
    PRIMARY KEY (poll_id, student_id)
  );
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

// Columns added after the first version; CREATE TABLE IF NOT EXISTS won't add them to an existing DB.
const sessionColumns = db.prepare("PRAGMA table_info(sessions)").all().map((c) => c.name);

if (!sessionColumns.includes("classroom_material_id")) {
  db.exec("ALTER TABLE sessions ADD COLUMN classroom_material_id INTEGER");
}

if (!db.prepare("PRAGMA table_info(polls)").all().some((c) => c.name === "live")) {
  db.exec("ALTER TABLE polls ADD COLUMN live INTEGER NOT NULL DEFAULT 1");
}

const insertSession = db.prepare(
  "INSERT OR IGNORE INTO sessions (number, title, date, summary) VALUES (?, ?, ?, ?)",
);

for (const s of SESSIONS) {
  insertSession.run(s.number, s.title, s.date, s.summary);
}

export const newToken = () => randomBytes(24).toString("hex");
export const newJoinCode = () => randomBytes(6).toString("hex");

export const getSetting = (key) => db.prepare("SELECT value FROM settings WHERE key = ?").get(key)?.value;
export const setSetting = (key, value) =>
  db.prepare("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").run(key, value);

if (getSetting("join_code") == null) {
  setSetting("join_code", newJoinCode());
}
