/**
 * Settings management.
 *
 * Persists the model (provider/model string) and API key in localStorage.
 * Provides a modal dialog for editing settings, opened via the gear icon.
 */

export interface Settings {
	model: string;
	apiKey: string;
}

const STORAGE_KEY = "pi-browser-agent-settings";

const DEFAULT_SETTINGS: Settings = {
	model: "zai/glm-5.2",
	apiKey: "",
};

/** Read settings from localStorage, falling back to defaults. */
export function getSettings(): Settings {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return { ...DEFAULT_SETTINGS };
		return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
	} catch {
		return { ...DEFAULT_SETTINGS };
	}
}

/** Save settings to localStorage. */
export function saveSettings(settings: Settings): void {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

/** Parse the "provider/model" string into provider and model parts. */
export function parseModelString(modelStr: string): { provider: string; model: string } {
	const slashIdx = modelStr.indexOf("/");
	if (slashIdx === -1) {
		return { provider: "zai", model: modelStr };
	}
	return {
		provider: modelStr.slice(0, slashIdx),
		model: modelStr.slice(slashIdx + 1),
	};
}

// --- Modal UI -------------------------------------------------------------

const modal = document.getElementById("settings-modal") as HTMLDivElement;
const settingsBtn = document.getElementById("settings-btn") as HTMLButtonElement;
const cancelBtn = document.getElementById("settings-cancel") as HTMLButtonElement;
const saveBtn = document.getElementById("settings-save") as HTMLButtonElement;
const modelInput = document.getElementById("settings-model") as HTMLInputElement;
const apiKeyInput = document.getElementById("settings-apikey") as HTMLInputElement;

/** Open the settings modal, pre-filling current values. */
export function openSettingsModal(): void {
	const settings = getSettings();
	modelInput.value = settings.model;
	apiKeyInput.value = settings.apiKey;
	modal.classList.remove("hidden");
	modelInput.focus();
}

/** Close the settings modal. */
function closeModal(): void {
	modal.classList.add("hidden");
}

/** Initialize settings UI: wire buttons, pre-fill inputs. */
export function initSettings(): void {
	settingsBtn.addEventListener("click", () => openSettingsModal());
	cancelBtn.addEventListener("click", () => closeModal());

	saveBtn.addEventListener("click", () => {
		saveSettings({
			model: modelInput.value.trim() || DEFAULT_SETTINGS.model,
			apiKey: apiKeyInput.value.trim(),
		});
		closeModal();
	});

	// Close on backdrop click
	modal.addEventListener("click", (e) => {
		if (e.target === modal) closeModal();
	});

	// Close on Escape
	modal.addEventListener("keydown", (e) => {
		if (e.key === "Escape") closeModal();
	});
}
