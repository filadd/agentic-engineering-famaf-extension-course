/**
 * Single in-memory file store.
 *
 * Holds one string (the entire HTML document) with callback-based change
 * notifications. This replaces a virtual filesystem — the agent works with
 * a single self-contained HTML file.
 */

type ChangeListener = (content: string) => void;

let fileContent = "";
const listeners = new Set<ChangeListener>();

/** Get the current file content. */
export function getFile(): string {
	return fileContent;
}

/** Set the file content and notify all subscribers. */
export function setFile(content: string): void {
	fileContent = content;
	for (const listener of listeners) {
		listener(fileContent);
	}
}

/** Subscribe to file changes. Returns an unsubscribe function. */
export function onChange(listener: ChangeListener): () => void {
	listeners.add(listener);
	return () => listeners.delete(listener);
}
