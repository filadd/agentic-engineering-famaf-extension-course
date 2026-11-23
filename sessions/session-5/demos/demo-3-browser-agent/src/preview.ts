/**
 * Preview renderer.
 *
 * Renders the single in-memory file into an iframe.
 *
 * Flicker-free streaming: when content grows by a prefix (the agent appending
 * a chunk), we `document.write()` only the new tail into the live document —
 * the browser renders it progressively without reloading. When content is
 * replaced or reloaded, we reopen the document from scratch.
 *
 * A console-capture script is injected on full renders so `get_console` can
 * read the preview's console output.
 */

import { getFile, onChange } from "./file";

const iframe = document.getElementById("preview-frame") as HTMLIFrameElement;
const reloadBtn = document.getElementById("reload-btn") as HTMLButtonElement;

// --- Console capture ------------------------------------------------------

const consoleMessages: string[] = [];

window.addEventListener("message", (event) => {
	if (event.data?.type === "console") {
		const level = event.data.level ?? "log";
		const args = event.data.args ?? [];
		consoleMessages.push(`[${level}] ${args.join(" ")}`);
	}
});

/** Script written into the document to forward console output + errors. */
const CONSOLE_CAPTURE_SCRIPT = `<script>
(function() {
	var levels = ["log", "info", "warn", "error", "debug"];
	levels.forEach(function(level) {
		var orig = console[level];
		console[level] = function() {
			try {
				parent.postMessage({
					type: "console",
					level: level,
					args: Array.prototype.map.call(arguments, function(a) {
						if (typeof a === "object") {
							try { return JSON.stringify(a); } catch(e) { return String(a); }
						}
						return String(a);
					})
				}, "*");
			} catch(e) {}
			orig.apply(console, arguments);
		};
	});
	window.addEventListener("error", function(e) {
		try {
			parent.postMessage({ type: "console", level: "error", args: [e.message + " (" + e.filename + ":" + e.lineno + ")"] }, "*");
		} catch(err) {}
	});
})();
<\/script>`;

// --- Streaming render state ----------------------------------------------

/** What's currently committed to the live iframe document. */
let committed: { content: string; hasCapture: boolean } | null = null;

/** Write a string into the live iframe document via document.write. */
function writeDoc(html: string): void {
	const doc = iframe.contentDocument;
	if (!doc) return;
	doc.write(html);
}

/** Reopen the document from scratch, optionally with the console capture. */
function openDocument(withCapture: boolean): void {
	const doc = iframe.contentDocument;
	if (!doc) return;
	doc.open();
	if (withCapture) writeDoc(CONSOLE_CAPTURE_SCRIPT);
}

/**
 * Display `content` in the preview.
 *
 * If `content` extends what's already committed (prefix match) and the capture
 * requirement is satisfied, only the new tail is written — no reload, no flicker.
 * Otherwise the document is reopened and fully rewritten.
 */
function display(content: string, needCapture: boolean): void {
	const c = committed;
	const canExtend =
		c !== null &&
		content.length >= c.content.length &&
		content.startsWith(c.content) &&
		(!needCapture || c.hasCapture);

	if (canExtend) {
		writeDoc(content.slice(c!.content.length));
		committed = { content, hasCapture: c!.hasCapture };
		return;
	}

	openDocument(needCapture);
	writeDoc(content || "<!-- empty -->");
	committed = { content, hasCapture: needCapture };
}

// --- Public API -----------------------------------------------------------

/** Render the current file fully (with console capture). */
export function render(): void {
	display(getFile(), true);
}

/**
 * Render a partial (in-progress) version of the file during streaming.
 * No console capture — keeps streaming smooth. Captured on the next full render.
 */
export function renderPartial(html: string): void {
	display(html, false);
}

/** Reset the committed state so the next display() reopens the document. */
export function invalidate(): void {
	committed = null;
}

/** Capture the iframe content as a base64 image. */
export async function getScreenshot(): Promise<string> {
	try {
		const iframeDoc = iframe.contentDocument;
		if (!iframeDoc || !iframe.contentWindow) {
			return "Unable to access iframe document.";
		}

		const width = iframe.clientWidth;
		const height = iframeDoc.body?.scrollHeight || iframe.clientHeight;

		const bodyHTML = iframeDoc.body?.innerHTML ?? "";
		const bodyStyle = iframeDoc.body?.style?.cssText ?? "";
		const computed = iframeDoc.defaultView?.getComputedStyle(iframeDoc.body ?? iframeDoc.documentElement) ?? null;
		const bgColor = computed?.backgroundColor ?? "#ffffff";

		const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
<foreignObject width="100%" height="100%">
<div xmlns="http://www.w3.org/1999/xhtml" style="background-color: ${bgColor}; width: ${width}px; min-height: ${height}px; ${bodyStyle}">
${bodyHTML}
</div>
</foreignObject>
</svg>`;

		return btoa(unescape(encodeURIComponent(svg)));
	} catch (e) {
		return `Screenshot failed: ${(e as Error).message}`;
	}
}

/** Return captured console output. */
export function getConsole(): string {
	return consoleMessages.join("\n") || "(console is empty)";
}

/** Clear console messages. */
export function clearConsole(): void {
	consoleMessages.length = 0;
}

/** Force-reload the preview with a full render. */
export function reload(): void {
	clearConsole();
	render();
}

// --- Initialization -------------------------------------------------------

export function initPreview(): void {
	onChange(() => render());
	reloadBtn.addEventListener("click", () => reload());
	render();
}
