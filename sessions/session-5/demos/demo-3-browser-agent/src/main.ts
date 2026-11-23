/**
 * App entry point.
 *
 * Wires together: settings → preview → agent → chat UI.
 * Everything runs client-side in the browser — no backend.
 */

import "./style.css";

import { registerProviders, createBrowserAgent } from "./agent";
import { initPreview } from "./preview";
import { initSettings, openSettingsModal, getSettings } from "./settings";
import { initChatUI } from "./chat-ui";

function main(): void {
	registerProviders();
	initSettings();
	initPreview();

	if (!getSettings().apiKey) {
		openSettingsModal();
	}

	const agent = createBrowserAgent();
	initChatUI(agent);
}

main();
