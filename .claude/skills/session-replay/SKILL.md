---
name: session-replay
description: Graba una sesión de trabajo con el agente (capturas de la app después de cada cambio, con las interacciones) y la convierte en un video HTML que reproduce el transcript acelerado en una terminal junto a las capturas. Usar cuando el usuario pida grabar la sesión, registrar cómo evoluciona la app, o armar/actualizar el video o replay de la sesión.
---

# Session replay

The skill has two phases. **Recording** happens throughout the session, after every change. **Rendering** happens when the user asks for the video.

`replay.mjs` is in `scripts/` inside this skill; the examples below call it as `replay.mjs`. `<dir>` is the recording folder, by default `.recording/` at the root of the app being built.

It needs `node` and `agent-browser` on the PATH.

Keep `<dir>` out of version control by adding it to the app's `.gitignore`. It holds the transcript path, a condensed copy of the transcript, and every capture, including the ones the video doesn't use. To publish the video, export it (see Rendering).

## Recording

### Start

Run this once, when the user asks to start recording:

```bash
node replay.mjs start <dir> --url http://localhost:<port>
```

It detects the harness (only Claude Code for now) and saves the transcript path and the start time in `<dir>/session.json`. The video only includes what happens after this point.

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

4. When the user wants to keep or share the video, export it to a folder outside `<dir>`:
   ```bash
   node replay.mjs export <dir> <out>
   ```
   `<out>` gets `player.html`, `script.js`, and only the captures that the script uses. Commit that folder, not `<dir>`.

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
