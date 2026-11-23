/**
 * Agent setup.
 *
 * Creates a Pi Agent configured for in-browser web development.
 * Registers every built-in provider so any "provider/model" string works;
 * provider SDKs stay in lazy chunks until the first request.
 * The agent uses five browser tools (read, write, get_screenshot,
 * get_console, reload) instead of the built-in filesystem tools.
 */

import { Agent } from "@earendil-works/pi-agent-core";
import { builtinModels } from "@earendil-works/pi-ai/providers/all";

import { browserTools } from "./browser-tools";
import { getSettings, parseModelString } from "./settings";

const SYSTEM_PROMPT = `You are a web developer running entirely in the browser.
You have tools to edit, read, fetch, and verify a single self-contained HTML page.

- edit(description, oldText, newText): Modify the page. Pass empty oldText to APPEND newText to the end of the page. Pass non-empty oldText to replace an exact chunk. Always include a short description of what you're adding.
- read(): Read the current HTML content.
- fetch(url): GET a URL for research (info, data, placeholder images). CORS may block some sites.
- get_screenshot(): Capture the rendered page to visually verify your work.
- get_console(): Read browser console output and errors.
- reload(): Force-reload the preview.

The preview panel renders your HTML in real time as you edit.
Be concise in your explanations — let the code speak.

BUILD INCREMENTALLY. Do not write the whole page at once. Start from an empty
file and append the page section by section with separate edit() calls — for
example: (1) document skeleton + <head> + base styles, (2) header/nav,
(3) hero section, (4) features/menu, (5) footer. Append by passing empty
oldText. Each append streams live into the preview, so build top-to-bottom.

KEEP IT VISIBLE WHILE STREAMING. The preview updates token-by-token as you
write, so the page must be readable at every intermediate step:
- Your VERY FIRST edit must establish readable colors: open the document
  skeleton and put a <style> with the body background-color and color at the
  top, BEFORE any visible text. Do not add text content until colors are set.
- Never add light-colored text before its background is in place. If you add
  a dark background first, light text stays readable as it streams.
- Make sure every section has readable contrast the moment it appears.
  Check: would the latest streamed chunk be legible on the background so far?

Use modern CSS (flexbox/grid, custom properties) and clean JavaScript.
Keep every HTML document well-formed; close the tags you open so partial
renders stay valid. After the page is complete, use get_screenshot() to
verify and fix any issues with targeted replacements.

JAVASCRIPT COMES LAST. The preview re-renders live as you stream, and scripts
run during streaming can hide content (scroll-reveal observers, opacity
transitions, animation triggers) before the page is ready — leaving sections
invisible. So:
- Build ALL static HTML and CSS first, with everything visible by default.
- Do not write any <script> until the page is structurally complete.
- Add JavaScript (interactivity, animations, scroll effects) in a final edit
  at the very end, and make sure it never hides content that is visible by
default in the static markup.
This keeps the page readable at every step of the stream.`;

const models = builtinModels();

/** Create the browser agent with current settings. */
export function createBrowserAgent(): Agent {
	const settings = getSettings();
	const { provider, model: modelId } = parseModelString(settings.model);

	const model = models.getModel(provider, modelId);
	if (!model) {
		throw new Error(`Model not found: ${settings.model}. Make sure the provider/model string is correct.`);
	}

	const agent = new Agent({
		initialState: {
			systemPrompt: SYSTEM_PROMPT,
			model,
			thinkingLevel: "off",
			tools: browserTools,
		},
		streamFn: models.streamSimple.bind(models),
		// Browsers have no environment variables, so the key from settings is passed explicitly.
		getApiKey: async () => {
			const current = getSettings();
			return current.apiKey || undefined;
		},
	});

	return agent;
}
