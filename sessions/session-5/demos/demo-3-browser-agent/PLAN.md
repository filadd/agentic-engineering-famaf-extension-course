# Demo 3 — Pi in the browser

## Context

This is the closer for the "Pi, the self-building agent" talk (~5 min). The entire Pi agent loop runs **client-side in the browser** — no backend, no server. The audience sees a chat panel where they talk to the agent, and a live preview panel where the single HTML page the agent writes renders in real time.

**The wow moment**: Ask "build me a landing page for a coffee shop" and watch the agent write HTML on the left while the page assembles itself on the right.

## Architecture

```
┌─────────────────────┬──────────────────────────┐
│ Chat  [⚙ settings]  │   Live preview           │
│─────────────────────│   (right)                │
│   (left)            │                          │
│                     │   <iframe srcdoc="...">  │
│   Message history   │   (re-renders when       │
│   (scrollable)      │    the file changes)     │
│                     │                          │
│   Streaming text    │                          │
│   Tool call feed    │                          │
│   ("write…")       │                          │
│─────────────────────│                          │
│   [ input box...  ] │                          │
└─────────────────────┴──────────────────────────┘
```

**Tech stack**: Vite + TypeScript, vanilla DOM (no framework), `@earendil-works/pi-agent-core` + `@earendil-works/pi-ai` + `@earendil-works/pi-schema` (tool parameters).

**LLM**: Configurable at runtime via a settings screen. User enters a `provider/model` string (e.g. `zai/glm-5.2`) and an API key. Every built-in provider is registered at startup (`builtinModels()`) so any model in the catalog works. Settings persist in `localStorage`.

### Key components

1. **Single in-memory file** — a string holding the entire HTML document (inline CSS in `<style>`, inline JS in `<script>`). No virtual filesystem, no paths — just one file.

2. **Custom browser tools** (five total):
   - `read()` — return the current HTML content of the single file
   - `write(content)` — replace the entire HTML content; triggers a preview re-render
   - `get_screenshot()` — capture the rendered iframe as a base64 image, return to the agent so it can visually verify its work
   - `get_console()` — return captured `console.log`/error output from the iframe
   - `reload()` — force-reload the iframe preview

3. **Agent** — `Agent` from `@earendil-works/pi-agent-core`, configured with:
   - Custom system prompt instructing it to build a single self-contained HTML page
   - The five browser tools
   - `streamFn: models.streamSimple.bind(models)`
   - `getApiKey` callback that reads the key from settings (browsers have no env vars, so the key is passed explicitly)
   - Model: resolved from the settings `provider/model` string via `models.getModel(provider, model)`

4. **LLM provider** — a `Models` collection from `builtinModels()` (`@earendil-works/pi-ai/providers/all`); provider SDKs load lazily on the first request. Calls go directly to the provider endpoint via native `fetch`. No backend proxy.

5. **Preview renderer** — when the single file changes, sets `iframe.srcdoc` to the new content. Injects a console-capture script that posts `console.log` and errors back to the parent via `postMessage`.

6. **Settings screen** — a gear icon in the chat panel header opens a modal with a text field for `provider/model` (e.g. `zai/glm-5.2`), a password field for the API key, and a save button. Values stored in `localStorage`.

7. **Chat UI** — subscribes to agent events, renders streaming text deltas, tool call indicators, and user messages. Input box pinned at the bottom; message history scrolls above it.

## Files to create

```
demo-3-browser-agent/
├── index.html              # Entry HTML with two-panel layout + settings modal
├── package.json            # Vite + TS + pi packages
├── tsconfig.json
├── vite.config.ts          # Vite config
├── src/
│   ├── main.ts             # App entry: wire agent → UI
│   ├── file.ts             # Single in-memory file + change notifications
│   ├── browser-tools.ts    # read / write / get_screenshot / get_console / reload
│   ├── agent.ts            # Agent setup (system prompt, model, tools, events)
│   ├── preview.ts          # Renders the single file into the iframe + console capture
│   ├── settings.ts         # Settings modal: provider/model + API key (localStorage)
│   ├── chat-ui.ts          # Chat panel: message list, input box, tool feed
│   └── style.css           # Two-panel layout + chat styling
└── PLAN.md
```

## Reuse

- `Agent` class and `AgentTool` interface from `@earendil-works/pi-agent-core`
- `builtinModels()` from `@earendil-works/pi-ai/providers/all`; `models.getModel(provider, model)` resolves the `provider/model` settings string
- `obj`, `str` from `@earendil-works/pi-schema` for the tool parameters (JSON Schema that also types `params`)
- `models.streamSimple` is passed to `Agent` as `streamFn`; the pi-ai README's "Browser Usage" section documents passing the API key explicitly

## System prompt (draft)

```
You are a web developer running entirely in the browser.
You have tools to write, read, and verify a single self-contained HTML page.

- write(content): Replace the entire HTML page. Inline all CSS in <style> and all JS in <script>.
- read(): Read the current HTML content.
- get_screenshot(): Capture the rendered page to visually verify your work.
- get_console(): Read browser console output and errors.
- reload(): Force-reload the preview.

The preview panel renders your HTML in real time.
Be concise in your explanations — let the code speak.
```

## Steps

- [ ] Scaffold Vite + TypeScript project
- [ ] Install `@earendil-works/pi-agent-core@^1.6.0`, `@earendil-works/pi-ai@^1.6.0` and `@earendil-works/pi-schema@^1.6.0`
- [ ] Verify Z.AI GLM-5.2 bundles cleanly for the browser (OpenAI SDK + `openai-completions` provider)
- [ ] Implement single-file store (string + callback-based change notifications)
- [ ] Implement browser tools: `read`, `write`, `get_screenshot`, `get_console`, `reload`
- [ ] Implement settings modal (`provider/model` text field + API key password field, persisted in localStorage)
- [ ] Register the built-in providers at startup (`builtinModels()`)
- [ ] Implement agent setup (system prompt, model from settings, tools, `getApiKey`)
- [ ] Build two-panel HTML layout + CSS
- [ ] Build chat UI (agent event subscription → DOM updates)
- [ ] Build preview renderer (single file → iframe srcdoc + console capture injection)
- [ ] Build settings UI (modal, gear icon, localStorage)
- [ ] Wire everything together in `main.ts`
- [ ] Test end-to-end: "build a landing page for a coffee shop"
- [ ] Verify provider SDK bundles cleanly for the browser (OpenAI SDK for openai-completions)
- [ ] Git init + initial commit

## Verification

1. `npm install && npm run dev` — Vite dev server starts
2. Click the settings gear, enter model (e.g. `zai/glm-5.2`) and API key, save
3. Type "build me a landing page for a coffee shop"
4. Watch: agent streams text on the left, tool calls appear ("write…"), and the page assembles on the right in real time
5. The preview should show a rendered self-contained HTML page
6. Agent can call `get_screenshot` to visually verify its work and `get_console` to debug
7. If CORS blocks direct browser→provider calls, add a Vite dev proxy as a fallback (dev only, not needed for the talk's point about client-side execution)
