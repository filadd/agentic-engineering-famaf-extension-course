#!/usr/bin/env node
// Recording helper for the session-replay skill.
//
//   replay.mjs start <dir> [--url <app-url>]
//   replay.mjs resume <dir> [--since <iso-time>]
//   replay.mjs shot <dir> "<caption>" [--click <selector> | --type <selector> "<text>"]
//   replay.mjs condense <dir>
//   replay.mjs player <dir>
//   replay.mjs highlights <dir>
import { execFileSync } from "node:child_process";
import { appendFileSync, copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
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

const findPiSession = () => {
  // The extension that injects PI_SESSION_FILE may be absent or outdated; fall back to the
  // freshest transcript in the current project's sessions folder.
  const project = `--${process.cwd().replaceAll("/", "-")}--`;
  const dir = join(homedir(), ".pi", "agent", "sessions", project);

  if (!existsSync(dir)) {
    return null;
  }

  const [newest] = readdirSync(dir)
    .filter((f) => f.endsWith(".jsonl"))
    .map((f) => ({ f, m: statSync(join(dir, f)).mtimeMs }))
    .sort((a, b) => b.m - a.m);

  return newest == null ? null : join(dir, newest.f);
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

  if (process.env.PI_SESSION_FILE != null || process.env.PI_CODING_AGENT != null) {
    const transcript = process.env.PI_SESSION_FILE ?? findPiSession();

    if (transcript == null) {
      fail(`No hay transcript de pi para ${process.cwd()}`);
    }

    return { harness: "pi", transcript };
  }

  fail("Harness no soportado: solo Claude Code (CLAUDE_CODE_SESSION_ID) o pi (PI_SESSION_FILE).");
};

const readSession = (dir) => JSON.parse(readFileSync(join(dir, "session.json"), "utf8"));

// A recording continued from another session, possibly in another harness, keeps one segment per
// transcript. Recordings made before segments existed hold a single one at the top level.
const segmentsOf = ({ segments, harness, transcript, startedAt }) => segments ?? [{ harness, transcript, startedAt }];

const writeSession = (dir, session) => writeFileSync(join(dir, "session.json"), JSON.stringify(session, null, 2));

const start = (dir, args) => {
  const urlIndex = args.indexOf("--url");

  mkdirSync(join(dir, "screenshots"), { recursive: true });
  writeSession(dir, {
    segments: [{ ...detectHarness(), startedAt: new Date().toISOString() }],
    appUrl: urlIndex === -1 ? null : args[urlIndex + 1],
  });

  console.log(`Grabando en ${dir}`);
};

const resume = (dir, args) => {
  const session = readSession(dir);
  const sinceIndex = args.indexOf("--since");

  writeSession(dir, {
    segments: [
      ...segmentsOf(session),
      { ...detectHarness(), startedAt: sinceIndex === -1 ? new Date().toISOString() : args[sinceIndex + 1] },
    ],
    appUrl: session.appUrl,
  });

  console.log(`Retomando la grabación en ${dir}`);
};

const shot = (dir, [caption, flag, selector, text]) => {
  if (caption == null) {
    fail('Uso: replay.mjs shot <dir> "<caption>" [--click <selector> | --type <selector> "<text>"]');
  }

  const manifest = join(dir, "manifest.jsonl");
  // Number after the highest capture, not the line count: deleting a bad capture leaves a gap, and
  // counting lines would reuse the number of a capture that is still on disk and overwrite it.
  const taken = existsSync(manifest) ? readFileSync(manifest, "utf8").split("\n").filter(Boolean).map((line) => JSON.parse(line).n) : [];
  const n = Math.max(0, ...taken) + 1;
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

const toolLine = ({ name, input, arguments: args }) => {
  const source = input ?? args ?? {};
  const target = source.description ?? source.file_path ?? source.path ?? source.url ?? source.command ?? source.prompt ?? "";

  return `${name}: ${String(target).split("\n")[0].slice(0, 160)}`;
};

// Slash commands and voice messages from the canvas watch arrive wrapped in tags; show them the way
// the user said them.
const promptText = (text) => {
  const name = text.match(/<command-name>([\s\S]*?)<\/command-name>/)?.[1];
  const voice = text.match(/<event>voice: ([\s\S]*?)(?: \| selected: [\s\S]*?)?<\/event>/)?.[1];

  if (name != null) {
    return `${name} ${text.match(/<command-args>([\s\S]*?)<\/command-args>/)?.[1] ?? ""}`.trim();
  }

  return voice == null ? text : `🎙️ ${voice.trim()}`;
};

// A prompt the user types while the agent is mid-turn is stored as a queued-command attachment, not a user entry.
// A canvas voice message that arrives while the agent is mid-turn is queued the same way, as a task notification.
const isQueuedPrompt = (e) =>
  e.type === "attachment" &&
  e.attachment?.type === "queued_command" &&
  (e.attachment.origin?.kind === "human" ||
    (e.attachment.origin?.kind === "task-notification" && /<event>voice: /.test(e.attachment.prompt ?? "")));

const condenseClaude = (transcript, since, until) => {
  const lines = [];

  const entries = readFileSync(transcript, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line))
    .filter((e) => (e.type === "user" || e.type === "assistant" || isQueuedPrompt(e)) && !e.isSidechain && !e.isMeta)
    .filter((e) => e.timestamp >= since && (until == null || e.timestamp < until));

  for (const entry of entries) {
    const time = clock(new Date(entry.timestamp));

    if (isQueuedPrompt(entry)) {
      lines.push(`\n## [${time}] USER\n${promptText(entry.attachment.prompt.trim())}\n`);
      continue;
    }

    const content = entry.message.content;

    if (entry.type === "user") {
      // Tool results come back as user entries; they carry no prompt text.
      if (Array.isArray(content) && content.every((c) => c.type === "tool_result")) {
        continue;
      }

      const text = promptText(
        userText(content)
          .replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, "")
          .trim(),
      );

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

// In pi, a canvas voice message reaches the agent as a process notification for the watch's output line.
const isPiVoice = (e) => e.type === "custom_message" && e.details?.logMatch?.line?.startsWith("voice: ") === true;

const condensePi = (transcript, since, until) => {
  const lines = [];

  const entries = readFileSync(transcript, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line))
    .filter((e) => (e.type === "message" && (e.message.role === "user" || e.message.role === "assistant")) || isPiVoice(e))
    .filter((e) => e.timestamp >= since && (until == null || e.timestamp < until));

  for (const entry of entries) {
    const time = clock(new Date(entry.timestamp));

    if (isPiVoice(entry)) {
      lines.push(`\n## [${time}] USER\n${promptText(`<event>${entry.details.logMatch.line}</event>`)}\n`);
      continue;
    }

    const content = entry.message.content;

    if (entry.message.role === "user") {
      const text = userText(content).trim();

      // Skill loads and command wrappers arrive as user text starting with a tag; they carry no prompt.
      if (text !== "" && !text.startsWith("<")) {
        lines.push(`\n## [${time}] USER\n${text}\n`);
      }

      continue;
    }

    for (const block of Array.isArray(content) ? content : []) {
      if (block.type === "text" && block.text.trim() !== "") {
        lines.push(`[${time}] ASSISTANT\n${block.text.trim()}\n`);
      }

      if (block.type === "toolCall") {
        lines.push(`[${time}] TOOL ${toolLine(block)}`);
      }
    }
  }

  return lines.join("\n");
};

const condense = (dir) => {
  // A transcript can keep growing after the recording moved on to the next segment, so each segment
  // ends at its endedAt, when set, or where the next one starts.
  const condensed = segmentsOf(readSession(dir))
    .map(({ harness, transcript, startedAt, endedAt }, i, segments) =>
      ({ claude: condenseClaude, pi: condensePi })[harness](transcript, startedAt, endedAt ?? segments[i + 1]?.startedAt),
    )
    .join("\n");

  writeFileSync(join(dir, "condensed.md"), condensed);
  console.log(`${join(dir, "condensed.md")}: ${condensed.split("\n").length} líneas`);
};

const player = (dir) => {
  copyFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "assets", "player.html"), join(dir, "player.html"));
  console.log(join(dir, "player.html"));
};

// The highlights live next to the raw recording and reuse its captures. Their folder gets its own
// player and only the captures its script uses, so it can be opened or moved on its own.
const highlights = (dir) => {
  const target = join(dir, "..", "highlights");
  const script = join(target, "script.js");

  if (!existsSync(script)) {
    fail(`No encontré ${script}`);
  }

  const captures = [...new Set(readFileSync(script, "utf8").match(/screenshots\/[\w.-]+\.png/g) ?? [])];

  rmSync(join(target, "screenshots"), { recursive: true, force: true });
  mkdirSync(join(target, "screenshots"));
  player(target);

  for (const capture of captures) {
    copyFileSync(join(dir, capture), join(target, capture));
  }

  console.log(`${target}: player.html, script.js y ${captures.length} capturas`);
};

const [command, dir, ...rest] = process.argv.slice(2);

if (dir == null) {
  fail("Uso: replay.mjs <start|resume|shot|condense|player|highlights> <dir> ...");
}

const commands = { start, resume, shot, condense, player, highlights };

if (commands[command] == null) {
  fail(`Comando desconocido: ${command}`);
}

commands[command](resolve(dir), rest);
