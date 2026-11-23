/**
 * Browser tools for the agent.
 *
 * Five tools that operate on the single in-memory file and the preview iframe:
 * - read:           Read the current HTML content
 * - edit:           Append to or replace parts of the page (chunked building)
 * - get_screenshot: Capture the rendered preview as base64 image
 * - get_console:    Read browser console output
 * - reload:         Force-reload the preview
 */

import type { AgentTool } from "@earendil-works/pi-agent-core/base";
import { Type } from "@earendil-works/pi-ai/base";

import { getFile, setFile } from "./file";
import { getScreenshot, getConsole, reload as reloadPreview } from "./preview";

/** Read the current HTML content of the single file. */
const readTool: AgentTool = {
	name: "read",
	label: "Read",
	description: "Read the current HTML content of the page.",
	parameters: Type.Object({}),
	execute: async () => {
		const content = getFile();
		return {
			content: [{ type: "text", text: content || "(file is empty)" }],
			details: { length: content.length },
		};
	},
};

/**
 * Edit the page: replace `oldText` with `newText`.
 * Pass an empty `oldText` to append `newText` to the end of the file.
 * Use `description` to narrate what this edit adds.
 */
const editTool: AgentTool = {
	name: "edit",
	label: "Edit",
	description:
		"Edit the HTML page by replacing a chunk. Pass empty oldText to append. Always describe what you're adding.",
	parameters: Type.Object({
		description: Type.String({
			description: "A short description of what this edit does, e.g. 'Adding the hero section'.",
		}),
		oldText: Type.String({
			description: "The exact text to replace. Use an empty string to append to the end of the file.",
		}),
		newText: Type.String({
			description: "The replacement text (or the new chunk to append if oldText is empty).",
		}),
	}),
	execute: async (_id, params) => {
		const { description, oldText, newText } = params as {
			description: string;
			oldText: string;
			newText: string;
		};

		const current = getFile();

		// Append mode: empty oldText adds newText to the end.
		if (oldText === "") {
			setFile(current + newText);
			return {
				content: [{ type: "text", text: `Appended ${newText.length} bytes. ${description}` }],
				details: { mode: "append", bytes: newText.length, description },
			};
		}

		// Replace mode: swap the first occurrence of oldText for newText.
		if (!current.includes(oldText)) {
			throw new Error(`oldText not found in the file. Make sure it matches the current content exactly.`);
		}

		setFile(current.replace(oldText, newText));
		return {
			content: [{ type: "text", text: `Replaced ${oldText.length} bytes with ${newText.length} bytes. ${description}` }],
			details: { mode: "replace", description },
		};
	},
};

/** Capture the rendered preview as a base64-encoded image (SVG screenshot). */
const getScreenshotTool: AgentTool = {
	name: "get_screenshot",
	label: "Screenshot",
	description: "Capture the rendered preview page as a base64-encoded SVG image to visually verify your work.",
	parameters: Type.Object({}),
	execute: async () => {
		const screenshot = await getScreenshot();
		// Return as image content if it looks like base64, otherwise as text error
		if (screenshot.startsWith("PHN2Zz") || screenshot.startsWith("<svg")) {
			const data = screenshot.startsWith("<svg")
				? btoa(unescape(encodeURIComponent(screenshot)))
				: screenshot;
			return {
				content: [{ type: "image", data, mimeType: "image/svg+xml" }],
				details: { format: "svg", size: data.length },
			};
		}
		return {
			content: [{ type: "text", text: screenshot }],
			details: { error: true },
		};
	},
};

/** Read captured browser console output from the preview. */
const getConsoleTool: AgentTool = {
	name: "get_console",
	label: "Console",
	description: "Read browser console output and errors from the preview page. Useful for debugging JavaScript.",
	parameters: Type.Object({}),
	execute: async () => {
		const output = getConsole();
		return {
			content: [{ type: "text", text: output }],
			details: {},
		};
	},
};

/** Force-reload the preview iframe. */
const reloadTool: AgentTool = {
	name: "reload",
	label: "Reload",
	description: "Force-reload the preview page. Clears the console and re-renders the current HTML.",
	parameters: Type.Object({}),
	execute: async () => {
		reloadPreview();
		return {
			content: [{ type: "text", text: "Preview reloaded." }],
			details: {},
		};
	},
};

/** Fetch content from a URL (HTTP GET) for research. Subject to CORS. */
const fetchTool: AgentTool = {
	name: "fetch",
	label: "Fetch",
	description:
		"Fetch text content from a URL via HTTP GET. Use for research, looking up information, or fetching resources (e.g. placeholder image URLs, API data). Subject to browser CORS — some sites block cross-origin requests.",
	parameters: Type.Object({
		url: Type.String({ description: "The http(s) URL to fetch." }),
	}),
	execute: async (_id, params) => {
		const { url } = params as { url: string };
		const res = await fetch(url);
		const text = await res.text();
		const truncated =
			text.length > 8000
				? text.slice(0, 8000) + `\n...(truncated, ${text.length} bytes total)`
				: text;
		return {
			content: [{ type: "text", text: `HTTP ${res.status} ${res.statusText}\n\n${truncated}` }],
			details: { status: res.status, url, length: text.length },
		};
	},
};

/** All browser tools, ready to be passed to the Agent. */
export const browserTools: AgentTool[] = [
	readTool,
	editTool,
	getScreenshotTool,
	getConsoleTool,
	reloadTool,
	fetchTool,
];
