---
name: session-replay
description: Graba una sesión de trabajo con el agente (capturas de la app después de cada cambio, con las interacciones) y la convierte en un video HTML que reproduce el transcript acelerado en una terminal junto a las capturas. Usar cuando el usuario pida grabar la sesión, registrar cómo evoluciona la app, armar/actualizar el video o replay de la sesión, o armar sus highlights.
---

# Session replay

The skill has three phases. **Recording** happens throughout the session, after every change. **Rendering** happens when the user asks for the video. **Highlights** cut the video down to at most 10 points, when the user asks for a short version to show.

`replay.mjs` is in `scripts/` inside this skill; the examples below call it as `replay.mjs`. It needs `node` and `agent-browser` on the PATH.

## Where the files go

Each recording has its own folder inside the session it belongs to, `sessions/session-<n>/recordings/<name>/`, named after what it recorded (`vibecoding`, `agentic`). Ask the user for the session and the name when starting if they are not clear from the conversation. The folder holds two subfolders:

- `raw/` is `<dir>` in the commands below: `session.json`, `condensed.md`, `manifest.jsonl`, every capture in `screenshots/`, and the full video (`script.js` and `player.html`).
- `highlights/` is the short version: its own `player.html` and `script.js`, and only the captures its script uses. When the class shows the recording in parts, each part has its own folder inside it with the same files, numbered in the order they are shown: `highlights/1-implementacion/`, `highlights/2-validacion/`.

Commit both folders. The captures are PNGs, which the repo tracks with Git LFS (`.gitattributes`). Never put the recording inside the app being built.

## Recording

### Start

Run this once, when the user asks to start recording:

```bash
node replay.mjs start <dir> --url http://localhost:<port>
```

It detects the harness (Claude Code or pi) and saves the transcript path and the start time in `<dir>/session.json` as the recording's first segment. The video only includes what happens after this point.

### Resume

When the user asks to continue an earlier recording from a new session, in the same harness or another one, add the new session as a segment instead of starting over:

```bash
node replay.mjs resume <dir> --since <iso-time>
```

`--since` is the timestamp of the session's first prompt that belongs in the video; without it the segment starts now. `condense` joins the segments in order, and each one ends where the next one starts. When the earlier transcript also holds work after the recording that should stay out of the video, set that segment's `endedAt` in `session.json`.

### After every change to the app

When a change has a visible result, check it in the browser with `agent-browser` and take captures with `shot`. Do it on your own; the user shouldn't have to ask for it.

```bash
node replay.mjs shot <dir> "<caption>"
node replay.mjs shot <dir> "<caption>" --click "<selector>"
node replay.mjs shot <dir> "<caption>" --type "<selector>" "<text>"
```

- **The caption** describes what the screen shows, in the language of the session and in 2 to 6 words: "Formulario para sumarse", "Sesión 1 habilitada".
- **Interactions are emulated with captures.** Take the capture with `--click` or `--type` *before* doing the action. The player moves a cursor to that element and clicks or types the text. Then perform the action in `agent-browser` and take a capture of the result. For example, to fill and submit a form:
  1. `shot "Formulario vacío" --type 'input[name=name]' "Lucía"`
  2. `agent-browser fill 'input[name=name]' "Lucía"`
  3. `shot "Formulario completo" --click 'button'`
  4. `agent-browser click 'button'`
  5. `shot "Ya adentro"`
- **When a change alters an existing state**, capture before and after. For example, the student's view with everything locked, then with the session enabled.
- **Check every capture with Read before moving on.** A server restart (for example `--watch` after editing code) can log out a session or reset its state, and the capture then shows the wrong screen. If that happens, delete the capture and its line in `manifest.jsonl`, restore the state, and take it again.
- **Desktop only.** `shot` fixes the viewport at 1280×800. Don't take mobile captures.
- **Several users at once.** When the flow involves different roles, such as an admin and a student, give each its own browser session with `export AGENT_BROWSER_SESSION=<role>` before its commands. `shot` captures whichever session is active.
- **Keep comments about the recording out of the replies to the user.** The video is about the app; mention the captures only if something failed.

## Rendering

1. Condense the transcript from the start of the recording:
   ```bash
   node replay.mjs condense <dir>
   ```
2. Delegate the editing to a subagent. Use the prompt in [references/editor.md](references/editor.md), replacing `<dir>` with the absolute path. The subagent writes `<dir>/script.js`.
3. Copy the player and open it:
   ```bash
   node replay.mjs player <dir>
   xdg-open <dir>/player.html
   ```

When the recording continues after a render, condense and edit again; the subagent rewrites `script.js`. Don't keep earlier versions next to it as `script.prev.js`: git keeps the history.

`player.html` reads `script.js`, which also works when opened as `file://`. The player puts a terminal on the left, which fills from the top and scrolls once it is full. On the right it shows the browser, empty until the first capture, with the caption above it. The space bar or a click works like in a visual novel: while a user prompt is typing, it completes the prompt; once the prompt is complete, it continues; during the agent's turn, it draws the rest of the turn at once and jumps to the next prompt. Only the pause button pauses. The controls bar at the bottom is always visible, with a speed dropdown, and shows one dot per prompt, with the passed prompts filled in and the current one highlighted; hovering a dot shows the prompt text and clicking it jumps there; ⏮/⏭ and the ←/→ keys move between prompts.

### `script.js` format

```js
window.RECORDING = {
  beats: [
    { time: "15:28:36", kind: "user", text: "…" },
    { time: "15:29:34", kind: "tool", text: "Write(src/db.js)" },
    { time: "15:31:26", kind: "assistant", text: "…" },
    { time: "15:30:23", kind: "note", text: "Interrupted by user" },
    { time: "15:31:10", kind: "screenshot", src: "screenshots/001.png", url: "localhost:3000/admin", caption: "…", action: null },
  ],
};
```

`action` is copied from `manifest.jsonl`: `{ kind: "click" | "type", x, y, w, h, text? }`, with coordinates as fractions of the capture. Any beat accepts `hold` (ms) to change the pause after it.

A screenshot beat also accepts `zoom: { x, y, w, h }`, a region of the capture in the same fractions. The player scales the capture until the region fills the screen. When the beat repeats the `src` already on screen, the player moves the zoom over that capture instead of fading in a new one, so a capture followed by beats with the same `src` and different `zoom` walks through its details; a beat without `zoom` zooms back out. Zoom beats carry `action: null`, because the action's coordinates refer to the whole capture.

## Highlights

The highlights are a short version of the video for showing in class: at most 10 points, one per stage of the process, each one a prompt with a summary of what the agent did and the captures of the result. They summarize and merge, so they don't copy the session faithfully, but every event in them comes from the recording.

When the class shows different stages of the session at different moments, cut one highlights video per part instead, each with at most 10 points over its own stages. Check the session's slides to decide where each part starts and ends, and ask the user when the slides leave it open.

1. Render the full video first; the highlights start from `<dir>/script.js`.
2. Delegate the cut to a subagent. Use the prompt in [references/highlights.md](references/highlights.md), replacing `<raw>` with the absolute path of `<dir>` and `<highlights>` with the `highlights/` folder next to it, or with the part's folder inside it. Tell the subagent which stages go in each part. The subagent writes `script.js` in that folder.
3. Copy the player and the captures the highlights use, and open them:
   ```bash
   node replay.mjs highlights <dir> [<part>]
   xdg-open <dir>/../highlights/[<part>/]player.html
   ```
   `<part>` is the name of the part's folder inside `highlights/`. The command empties that folder's `screenshots/` before copying, so it can run again after editing the script.
