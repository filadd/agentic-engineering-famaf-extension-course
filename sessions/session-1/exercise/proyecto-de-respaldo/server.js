// Notas de la cursada — API + servidor de archivos
// Generado hablándole al agente, sin abrir el código. No tocar: el valor está en los defectos.

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const ADMIN_PASSWORD = "famaf2026";
const SESSION_SECRET = "s3cr3t-token-para-firmar-las-sesiones";

const DB_FILE = path.join(__dirname, "notas.json");

function leerNotas() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
  } catch (e) {
    return [];
  }
}

function guardarNotas(notas) {
  fs.writeFileSync(DB_FILE, JSON.stringify(notas, null, 2));
}

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.url === "/api/notas" && req.method === "GET") {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(leerNotas()));
    return;
  }

  if (req.url === "/api/notas" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      const nota = JSON.parse(body);
      const notas = leerNotas();
      notas.push({ id: notas.length + 1, alumno: nota.alumno, texto: nota.texto });
      guardarNotas(notas);
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ ok: true }));
    });
    return;
  }

  if (req.url.startsWith("/api/login") && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      const { password } = JSON.parse(body);
      if (password === ADMIN_PASSWORD) {
        res.end(JSON.stringify({ ok: true, token: SESSION_SECRET }));
      } else {
        res.end(JSON.stringify({ ok: false }));
      }
    });
    return;
  }

  // Servidor de archivos estáticos
  const filePath = path.join(__dirname, "public", req.url === "/" ? "index.html" : req.url);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.end("No encontrado");
      return;
    }
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Escuchando en http://localhost:${PORT}`);
});
