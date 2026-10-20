You are cutting a recorded coding-agent session down to its highlights, for showing in class. The full video already exists; the highlights are a short version of it that someone can walk through in a few minutes, one point per stage of the process. They are not a faithful copy of the session.

The player puts a terminal on the left that plays the beats and the captures of the app on the right. It shows one dot per `user` beat and stops at each one until the presenter moves on, so each `user` beat is one point of the highlights.

Input, all in `<raw>`:
- `script.js`: the full video, already edited down to what is about the app. Start from it.
- `condensed.md`: the condensed transcript, for when `script.js` leaves out something you need to understand a stage.
- `manifest.jsonl`: one capture per line, `{ n, time, src, url, caption, action }`.
- `screenshots/`: the captures. Look at the ones you consider with Read.

Output: write `<highlights>/script.js` in the same format as `<raw>/script.js`:

```js
window.RECORDING = {
  beats: [ … ],
};
```

Each beat is `{ time, kind, text }` with `kind` one of `user | assistant | tool | note`, or `{ time, kind: "screenshot", src, url, caption, action }`. Any beat accepts `hold` (ms) to change the pause after it.

## Choosing the points

- **At most 10 points.** Read the whole session first and split it into the stages it went through: for example a first prompt, the first working version, each round of fixes, or each step of a process such as exploring, designing, implementing, testing and deploying. Pick the points so that, taken together, they show how the process unfolded from start to end.
- **One point per stage.** When a stage spans many prompts, merge them into one point. Leave out stages that repeat what an earlier point already showed.
- **One part of the session.** When you are told the video covers only some stages, the session for this video is those stages: leave the rest out and use the 10 points to show those stages in more detail, splitting a stage into several points where it went through distinct steps.
- **Prefer the moments that show something.** A point works best when it ends on a capture of the app or of the artifact that stage produced.

## Writing each point

- **user**: one prompt per point, in the user's voice and in the session's language. Shorten it to what matters for that stage, at most ~400 characters; when the point merges several prompts, combine what they asked. Do not put words in the user's mouth that change what they asked for.
- **tool**: 2 to 6 lines that summarize what the agent did in that stage, in the same `Name(target)` style as the full video. Merge freely: `Write(src/server.js, src/db.js, src/views.js)`, `Bash(corre los tests)`.
- **assistant**: 1 or 2 beats of 1 to 3 short sentences each, at most ~220 characters, with what the agent built, decided or found in that stage.
- **screenshot**: 1 to 4 per point, copied from the manifest with `src`, `url`, `caption` and `action` unchanged, except that `action` becomes `null` when the capture that shows the action's result is left out. Give each one `hold: 3000` so the presenter has time to talk over it.
- **zoom**: when a capture has details too small to read on a projector, such as a diagram, a tree, a table or a part of a screen, follow it with beats that repeat its `src`, `url` and `time` with `zoom: { x, y, w, h }`, the region to show as fractions of the capture, `action: null`, a caption naming the detail, and `hold: 3000`. The player zooms into each region in turn over the same capture. Look at the capture with Read to pick each region, keep its proportions close to 16:10 so it fills the screen, and leave a small margin around the detail. Zoom beats don't count toward the 1 to 4 captures.
- **note**: only for what the stage needs, such as an interruption that changed the course of the session.

Every event, decision and capture comes from the recording; you may summarize and merge, but don't invent. `time` is the time of the first event a beat stands for, and beats are in chronological order.

All visible text is in the session's language.

## Reply

Reply in a few lines with:
- the points you chose, one line each: the stage and the captures it shows;
- the stages you left out and why.
