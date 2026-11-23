/**
 * Chat UI.
 *
 * Subscribes to agent events and renders them to the DOM.
 * - Assistant text is rendered as markdown.
 * - Edit tool calls show their description and stream the live preview.
 * - During execution only the LATEST tool call / message is shown normally;
 *   everything earlier collapses into a "N previous steps" disclosure whose
 *   text is dimmed and italicized.
 */

import type { Agent } from "@earendil-works/pi-agent-core/base";
import type { AgentEvent } from "@earendil-works/pi-agent-core/base";
import { marked } from "marked";

import { getFile } from "./file";
import { renderPartial } from "./preview";

const messagesEl = document.getElementById("messages") as HTMLDivElement;
const inputEl = document.getElementById("chat-input") as HTMLTextAreaElement;
const sendBtn = document.getElementById("send-btn") as HTMLButtonElement;

marked.setOptions({ breaks: true, gfm: true });

// --- Markdown + sanitize --------------------------------------------------

function renderMarkdown(md: string): string {
	const raw = marked.parse(md, { async: false }) as string;
	return sanitizeHtml(raw);
}

function sanitizeHtml(html: string): string {
	const doc = new DOMParser().parseFromString(html, "text/html");
	doc.querySelectorAll("script").forEach((el) => el.remove());
	doc.querySelectorAll("*").forEach((el) => {
		for (const attr of Array.from(el.attributes)) {
			if (attr.name.startsWith("on")) el.removeAttribute(attr.name);
			else if (attr.name === "href" || attr.name === "src") {
				if (attr.value.trim().toLowerCase().startsWith("javascript:")) el.removeAttribute(attr.name);
			}
		}
	});
	return doc.body.innerHTML;
}

function escapeHtml(text: string): string {
	const div = document.createElement("div");
	div.textContent = text;
	return div.innerHTML;
}

// --- Collapsible history --------------------------------------------------
//
// historyEl holds every assistant text / tool-call element except the most
// recent one (currentEl). Only currentEl is rendered with full styling; items
// inside historyEl get the dimmed, italic "history" treatment.

let historyEl: HTMLDetailsElement | null = null;
let currentEl: HTMLElement | null = null;

/** Move currentEl into the collapsible history, then clear it. */
function parkCurrent(): void {
	if (!currentEl) return;

	if (!historyEl) {
		historyEl = document.createElement("details");
		historyEl.className = "history";
		const summary = document.createElement("summary");
		historyEl.appendChild(summary);
		messagesEl.appendChild(historyEl);
	}

	currentEl.classList.add("history-item");
	historyEl.appendChild(currentEl);
	currentEl = null;
	updateHistorySummary();
}

/** Park whatever is current, then promote `el` as the new current element. */
function makeCurrent(el: HTMLElement): void {
	if (currentEl === el) return;
	parkCurrent();
	messagesEl.appendChild(el);
	currentEl = el;
	scrollToBottom();
}

function updateHistorySummary(): void {
	if (!historyEl) return;
	const count = historyEl.querySelectorAll(".history-item").length;
	const summary = historyEl.querySelector("summary");
	if (summary) summary.textContent = `${count} previous step${count === 1 ? "" : "s"}`;
	historyEl.style.display = count > 0 ? "" : "none";
}

// --- Message + tool-call element factories --------------------------------

function createMessageEl(role: "user" | "assistant", content = ""): HTMLDivElement {
	const el = document.createElement("div");
	el.className = `message ${role}`;
	if (role === "assistant") el.innerHTML = renderMarkdown(content);
	else el.textContent = content;
	return el;
}

// --- Thinking indicator ---------------------------------------------------

let thinkingEl: HTMLDivElement | null = null;

function showThinking(): void {
	if (thinkingEl) return;
	thinkingEl = document.createElement("div");
	thinkingEl.className = "thinking";
	thinkingEl.innerHTML = `<span class="think-dot"></span> thinking…`;
	messagesEl.appendChild(thinkingEl);
	scrollToBottom();
}

function hideThinking(): void {
	if (thinkingEl) {
		thinkingEl.remove();
		thinkingEl = null;
	}
}

// --- Tool-call indicators -------------------------------------------------

const toolCallEls = new Map<string, HTMLDivElement>();

function ensureToolCallEl(toolCallId: string, toolName: string, description: string): HTMLDivElement {
	const existing = toolCallEls.get(toolCallId);
	if (existing) {
		updateToolCallEl(existing, toolName, description);
		return existing;
	}

	const el = document.createElement("div");
	el.className = "tool-call running";
	updateToolCallEl(el, toolName, description);
	toolCallEls.set(toolCallId, el);
	makeCurrent(el);
	return el;
}

function updateToolCallEl(el: HTMLDivElement, toolName: string, description: string): void {
	const verb = toolName === "edit" ? "editing" : toolName.replace(/_/g, " ");
	el.innerHTML =
		`<span class="tool-icon">⚙</span> ` +
		`<span class="tool-body"><span class="tool-name">${escapeHtml(verb)}</span>` +
		(description ? `<span class="tool-desc">${escapeHtml(description)}</span>` : "") +
		`</span>` +
		`<span class="tool-status">running…</span>`;
}

function markToolCallDone(el: HTMLDivElement): void {
	el.classList.remove("running");
	const status = el.querySelector(".tool-status");
	if (status) status.textContent = "done";
}

function scrollToBottom(): void {
	messagesEl.scrollTop = messagesEl.scrollHeight;
}

// --- Streaming state ------------------------------------------------------

let currentAssistantEl: HTMLDivElement | null = null;

// --- Init -----------------------------------------------------------------

export function initChatUI(agent: Agent): void {
	agent.subscribe((event: AgentEvent) => handleAgentEvent(event));

	sendBtn.addEventListener("click", () => void sendMessage(agent));

	inputEl.addEventListener("keydown", (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			void sendMessage(agent);
		}
	});

	inputEl.addEventListener("input", () => {
		inputEl.style.height = "auto";
		inputEl.style.height = `${Math.min(inputEl.scrollHeight, 120)}px`;
	});
}

async function sendMessage(agent: Agent): Promise<void> {
	const text = inputEl.value.trim();
	if (!text) return;

	inputEl.value = "";
	inputEl.style.height = "auto";
	sendBtn.disabled = true;

	const userEl = createMessageEl("user", text);
	messagesEl.appendChild(userEl);
	scrollToBottom();

	try {
		await agent.prompt(text);
	} catch (e) {
		const errorEl = createMessageEl("assistant", `**Error:** ${(e as Error).message}`);
		makeCurrent(errorEl);
	} finally {
		sendBtn.disabled = false;
		inputEl.focus();
	}
}

function handleAgentEvent(event: AgentEvent): void {
	switch (event.type) {
		case "agent_start":
		case "turn_start":
			showThinking();
			break;

		case "agent_end":
			hideThinking();
			break;

		case "message_start": {
			if (event.message.role === "assistant") {
				hideThinking();
				// Bubble is created lazily on the first text delta, so a tool-call-only
				// message never produces an empty bubble.
			}
			break;
		}

		case "message_update": {
			const { assistantMessageEvent } = event;

			if (assistantMessageEvent.type === "text_delta") {
				const text = getText(event.message);
				if (text) {
					if (!currentAssistantEl) {
						currentAssistantEl = createMessageEl("assistant", "");
						messagesEl.appendChild(currentAssistantEl);
					}
					currentAssistantEl.innerHTML = renderMarkdown(text);
					// Promote to current (parks the previous step) once real text exists.
					makeCurrent(currentAssistantEl);
				}
			}

			if (assistantMessageEvent.type === "toolcall_delta") {
				handleStreamingEdit(event.message);
			}
			break;
		}

		case "message_end": {
			if (event.message.role === "assistant" && currentAssistantEl) {
				const text = getText(event.message);
				if (text && text.trim()) {
					currentAssistantEl.innerHTML = renderMarkdown(text);
					makeCurrent(currentAssistantEl);
				} else {
					// Empty (tool-call-only) bubble: drop it before it ever becomes current.
					currentAssistantEl.remove();
				}
				currentAssistantEl = null;
				scrollToBottom();
			}
			break;
		}

		case "tool_execution_start": {
			hideThinking();
			const desc = getExecutionDescription(event.args);
			ensureToolCallEl(event.toolCallId, event.toolName, desc);
			break;
		}

		case "tool_execution_end": {
			const el = toolCallEls.get(event.toolCallId);
			if (el) {
				markToolCallDone(el);
				toolCallEls.delete(event.toolCallId);
			}
			scrollToBottom();
			break;
		}
	}
}

function getText(message: unknown): string {
	if (typeof message !== "object" || message === null) return "";
	const msg = message as { content?: unknown };
	if (!Array.isArray(msg.content)) return "";
	for (const part of msg.content) {
		if (typeof part === "object" && part !== null && (part as { type?: string }).type === "text") {
			return (part as { text?: string }).text ?? "";
		}
	}
	return "";
}

function getExecutionDescription(args: unknown): string {
	if (args && typeof args === "object" && "description" in args) {
		return String((args as { description: unknown }).description ?? "");
	}
	return "";
}

function handleStreamingEdit(message: unknown): void {
	const edit = extractStreamingEdit(message);
	if (!edit) return;

	ensureToolCallEl(edit.id, "edit", edit.description);

	if (edit.oldText === "" && edit.newText) {
		renderPartial(getFile() + edit.newText);
	}
}

function extractStreamingEdit(message: unknown): {
	id: string;
	description: string;
	oldText: string;
	newText: string;
} | null {
	if (typeof message !== "object" || message === null) return null;
	const msg = message as { content?: unknown };
	if (!Array.isArray(msg.content)) return null;

	for (const part of msg.content) {
		if (typeof part !== "object" || part === null) continue;
		const p = part as { type?: string; name?: string; id?: string; arguments?: unknown };
		if (p.type !== "toolCall" || p.name !== "edit" || !p.id) continue;

		// Arguments may arrive as a parsed object OR as a raw partial JSON string
		// depending on the provider/streaming stage. Handle both so the preview
		// updates live regardless.
		if (p.arguments && typeof p.arguments === "object") {
			const args = p.arguments as { description?: unknown; oldText?: unknown; newText?: unknown };
			return {
				id: p.id,
				description: typeof args.description === "string" ? args.description : "",
				oldText: typeof args.oldText === "string" ? args.oldText : "",
				newText: typeof args.newText === "string" ? args.newText : "",
			};
		}

		if (typeof p.arguments === "string") {
			return {
				id: p.id,
				description: extractPartialStringField(p.arguments, "description"),
				oldText: extractPartialStringField(p.arguments, "oldText"),
				newText: extractPartialStringField(p.arguments, "newText"),
			};
		}
	}
	return null;
}

/**
 * Pull a string field value out of a (possibly truncated) JSON blob.
 * Tolerates unterminated strings so we can read `newText` mid-stream.
 */
function extractPartialStringField(rawArgs: string, field: string): string {
	const marker = `"${field}"`;
	const idx = rawArgs.indexOf(marker);
	if (idx === -1) return "";

	let i = idx + marker.length;
	while (i < rawArgs.length && /[\s:]/.test(rawArgs[i]!)) i++;
	if (rawArgs[i] !== '"') return "";
	i++;

	let out = "";
	while (i < rawArgs.length) {
		const ch = rawArgs[i]!;
		if (ch === "\\" && i + 1 < rawArgs.length) {
			const next = rawArgs[i + 1]!;
			const escapes: Record<string, string> = {
				n: "\n", t: "\t", r: "\r", "\\": "\\", '"': '"', "/": "/",
			};
			out += escapes[next] ?? next;
			i += 2;
			continue;
		}
		if (ch === "\\") break;
		if (ch === '"') break;
		out += ch;
		i++;
	}
	return out.replace(/\\+$/, "");
}
