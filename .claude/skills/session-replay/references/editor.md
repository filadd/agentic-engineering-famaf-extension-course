You are editing a coding-agent session into the script for a short animated video. The video shows the session sped up: a terminal on the left plays the transcript, and on the right the captures of the app show how it evolves and how someone interacts with it.

Input, all in `<dir>`:
- `condensed.md`: the condensed transcript (`[HH:MM:SS] USER`, `ASSISTANT`, `TOOL <name>: <description>`).
- `manifest.jsonl`: one capture per line, `{ n, time, src, url, caption, action }`, in the order they were taken.
- `screenshots/`: the captures. Look at them with Read.

Output: write `<dir>/script.js` in exactly this format:

```js
window.RECORDING = {
  beats: [ … ],
};
```

Each beat is `{ time, kind, text }` with `kind` one of `user | assistant | tool | note`, or `{ time, kind: "screenshot", src, url, caption, action }`.

## What goes in

**Only what is about building the app.** Leave out anything about the recording, the captures, the video, the replay skill, or agent tools that aren't part of the app. That covers comments like "the screenshot went to the wrong folder", reading help for a tool, moving captures, the agent looking at its own captures, and prompts or answers about how to record. If a user prompt is entirely about the recording, it goes out together with its answer and its tools.

Each type of beat follows these rules:

- **user**: the user's prompts verbatim. An interruption (`[Request interrupted by user]`) becomes `{ kind: "note", text: "Interrupted by user" }`.
- **tool**: one short line in the style of Claude Code's terminal, `Name(target)`, with paths relative to the app folder: `Write(src/server.js)`, `Bash(pnpm add express cookie-parser qrcode)`, `Bash(levanta el servidor)`. Use the Bash description to infer the action. For browser actions that check the app, use a line like `Browser(prueba el login de admin)`, placed right before the captures that action produced.
- **assistant**: compress each message to 1 to 3 short sentences (at most ~220 characters) about what the agent decided or built for the app, or what surprised it about the app. Drop anything about the recording.
- **screenshot**: one per line of the manifest, in the same order, with `src`, `url`, `caption` and `action` copied unchanged. Use the manifest's `time`, and slot each capture into the transcript by that time.

**Recording noise stays out too.** Leave out tool lines about deleting and retaking captures, restoring state to retake them, or reverting code for a moment to capture a "before". The manifest only keeps the good captures. Tool lines that fixed real bugs in the app stay.

**Keep a long session watchable.** When the session has dozens of tool calls, merge consecutive trivial ones into a single line wherever that reads better.

All visible text is in the session's language.

`time` comes from the transcript or the manifest, and beats are in chronological order. Don't invent events.

## Reply

Reply in a few lines with:
- the number of beats by kind;
- what you left out as unrelated to the app;
- moments in the story that have no capture and would need one.
