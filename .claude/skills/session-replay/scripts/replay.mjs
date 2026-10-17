#!/usr/bin/env node
// Recording helper for the session-replay skill.
//
//   replay.mjs start <dir> [--url <app-url>]
//   replay.mjs shot <dir> "<caption>" [--click <selector> | --type <selector> "<text>"]
//   replay.mjs condense <dir>
//   replay.mjs player <dir>
//   replay.mjs export <dir> <out>
import { execFileSync } from "node:child_process";
import { appendFileSync, copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const VIEWPORT = { width: 1280, height: 800 };

const browser = (...args) => execFileSync("agent-browser", args, { encoding: "utf8" }).trim();

const clock = (date) => date.toTimeString().slice(0, 8);

const fail = (message) => {
  console.error(message);
  process.exit(1);
};

const detectHarness = () => {
  if (process.env.CLAUDE_CODE_SESSION_ID != null) {
    const projects = join(homedir(), ".claude", "projects");
    const file = `${process.env.CLAUDE_CODE_SESSION_ID}.jsonl`;
    const project = readdirSync(projects).find((p) => existsSync(join(projects, p, file)));

    if (project == null) {
      fail(`No encontré ${file} en ${projects}`);
    }

    return { harness: "claude", transcript: join(projects, project, file) };
  }

  fail("Harness no soportado todavía: solo Claude Code (CLAUDE_CODE_SESSION_ID).");
};

const readSession = (dir) => JSON.parse(readFileSync(join(dir, "session.json"), "utf8"));

const start = (dir, args) => {
  const urlIndex = args.indexOf("--url");

  mkdirSync(join(dir, "screenshots"), { recursive: true });
  writeFileSync(
    join(dir, "session.json"),
    JSON.stringify(
      {
        ...detectHarness(),
        startedAt: new Date().toISOString(),
        appUrl: urlIndex === -1 ? null : args[urlIndex + 1],
      },
      null,
      2,
    ),
  );

  console.log(`Grabando en ${dir}`);
};

const shot = (dir, [caption, flag, selector, text]) => {
  if (caption == null) {
    fail('Uso: replay.mjs shot <dir> "<caption>" [--click <selector> | --type <selector> "<text>"]');
  }

  const manifest = join(dir, "manifest.jsonl");
  const n = existsSync(manifest) ? readFileSync(manifest, "utf8").split("\n").filter(Boolean).length + 1 : 1;
  const file = `screenshots/${String(n).padStart(3, "0")}.png`;

  // Viewport-only captures keep the action box coordinates valid for the image.
  browser("set", "viewport", String(VIEWPORT.width), String(VIEWPORT.height));

  let action = null;

  if (flag === "--click" || flag === "--type") {
    const box = JSON.parse(browser("get", "box", selector, "--json")).data;

    action = {
      kind: flag.slice(2),
      x: box.x / VIEWPORT.width,
      y: box.y / VIEWPORT.height,
      w: box.width / VIEWPORT.width,
      h: box.height / VIEWPORT.height,
      ...(flag === "--type" ? { text } : {}),
    };
  }

  // agent-browser treats a relative path as a selector, so it must be absolute.
  browser("screenshot", resolve(dir, file));

  const url = new URL(browser("get", "url"));

  appendFileSync(
    manifest,
    `${JSON.stringify({ n, time: clock(new Date()), src: file, url: `${url.host}${url.pathname}`, caption, action })}\n`,
  );

  console.log(`${file}: ${caption}`);
};

const userText = (content) =>
  typeof content === "string"
    ? content
    : content
        .filter((c) => c.type === "text")
        .map((c) => c.text)
        .join("\n");

const toolLine = ({ name, input }) => {
  const target = input.description ?? input.file_path ?? input.path ?? input.url ?? input.command ?? input.prompt ?? "";

  return `${name}: ${String(target).split("\n")[0].slice(0, 160)}`;
};

const condenseClaude = (transcript, since) => {
  const lines = [];

  const entries = readFileSync(transcript, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line))
    .filter((e) => (e.type === "user" || e.type === "assistant") && !e.isSidechain && !e.isMeta)
    .filter((e) => e.timestamp >= since);

  for (const entry of entries) {
    const time = clock(new Date(entry.timestamp));
    const content = entry.message.content;

    if (entry.type === "user") {
      // Tool results come back as user entries; they carry no prompt text.
      if (Array.isArray(content) && content.every((c) => c.type === "tool_result")) {
        continue;
      }

      const text = userText(content)
        .replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, "")
        .trim();

      if (text !== "" && !text.startsWith("<")) {
        lines.push(`\n## [${time}] USER\n${text}\n`);
      }

      continue;
    }

    for (const block of content) {
      if (block.type === "text" && block.text.trim() !== "") {
        lines.push(`[${time}] ASSISTANT\n${block.text.trim()}\n`);
      }

      if (block.type === "tool_use") {
        lines.push(`[${time}] TOOL ${toolLine(block)}`);
      }
    }
  }

  return lines.join("\n");
};

const condense = (dir) => {
  const session = readSession(dir);
  const condensed = { claude: condenseClaude }[session.harness](session.transcript, session.startedAt);

  writeFileSync(join(dir, "condensed.md"), condensed);
  console.log(`${join(dir, "condensed.md")}: ${condensed.split("\n").length} líneas`);
};

const player = (dir) => {
  copyFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "assets", "player.html"), join(dir, "player.html"));
  console.log(join(dir, "player.html"));
};

// Publishable copy of the video: the player, the script and only the captures it uses. The recording
// folder stays out of version control because it holds the transcript path and a condensed transcript.
const exportVideo = (dir, [out]) => {
  if (out == null) {
    fail("Uso: replay.mjs export <dir> <out>");
  }

  const target = resolve(out);
  const script = readFileSync(join(dir, "script.js"), "utf8");
  const captures = [...new Set(script.match(/screenshots\/[\w.-]+\.png/g) ?? [])];

  mkdirSync(join(target, "screenshots"), { recursive: true });
  copyFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "assets", "player.html"), join(target, "player.html"));
  copyFileSync(join(dir, "script.js"), join(target, "script.js"));

  for (const capture of captures) {
    copyFileSync(join(dir, capture), join(target, capture));
  }

  console.log(`${target}: player.html, script.js y ${captures.length} capturas`);
};

const [command, dir, ...rest] = process.argv.slice(2);

if (dir == null) {
  fail("Uso: replay.mjs <start|shot|condense|player|export> <dir> ...");
}

const commands = { start, shot, condense, player, export: exportVideo };

if (commands[command] == null) {
  fail(`Comando desconocido: ${command}`);
}

commands[command](resolve(dir), rest);
