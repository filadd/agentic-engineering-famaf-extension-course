import {
	createAgentSession,
	DefaultResourceLoader,
	getAgentDir,
	SessionManager,
	SettingsManager,
	type ExtensionAPI,
	type ExtensionContext,
} from "@earendil-works/pi-coding-agent";
import { Text } from "@earendil-works/pi-tui";
import { Type } from "typebox";

// The child SDK session loads this same extension, so this flag prevents recursive delegation.
const SUBAGENT_ENV = "PI_SUBAGENT_CHILD";
const SUBAGENT_RESULT_TYPE = "subagent-result";
const ACTIVE_SUBAGENTS_WIDGET = "active-subagents";
const DEFAULT_SUBAGENT_TOOLS = ["read", "grep", "find", "ls"];

interface BackgroundTask {
	id: string;
	label: string;
	task: string;
	status: "running" | "done" | "failed";
	output?: string;
	error?: string;
}

interface SubagentOptions {
	systemPrompt: string;
	tools: string[];
}

interface PipelineAgent {
	name: string;
	instructions: string;
	tools?: string[];
}

// Pull the final assistant text out of the child session after it finishes.
const getFinalText = (session: Awaited<ReturnType<typeof createAgentSession>>["session"]): string => {
	for (let i = session.messages.length - 1; i >= 0; i--) {
		const message = session.messages[i];
		if (message.role !== "assistant") continue;

		for (const part of message.content) {
			if (part.type === "text") return part.text;
		}
	}

	return "Subagent finished without text output.";
};

const defaultSubagentOptions: SubagentOptions = {
	systemPrompt: [
		"You are a focused subagent running inside an isolated Pi agent session.",
		"Use the available read-only tools to inspect the project when useful.",
		"Return a concise report for the parent agent.",
	].join("\n"),
	tools: DEFAULT_SUBAGENT_TOOLS,
};

// Create a fresh in-memory Pi agent session and run the delegated task inside it.
const runSubagent = async (
	ctx: Pick<ExtensionContext, "cwd" | "model">,
	task: string,
	options = defaultSubagentOptions,
): Promise<string> => {
	// Keep normal resource loading, but replace the system prompt for the child.
	const loader = new DefaultResourceLoader({
		cwd: ctx.cwd,
		agentDir: getAgentDir(),
		systemPromptOverride: () => options.systemPrompt,
		appendSystemPromptOverride: () => [],
	});

	// Mark resource loading as child-only so this extension opts out.
	process.env[SUBAGENT_ENV] = "1";
	try {
		await loader.reload();
	} finally {
		delete process.env[SUBAGENT_ENV];
	}

	// The subagent has its own context window, session state, tools, and model loop.
	const { session } = await createAgentSession({
		cwd: ctx.cwd,
		model: ctx.model,
		// Pi 1.6 no longer accepts the parent's modelRegistry here; the child builds its own
		// ModelRuntime from the same agentDir (auth.json, models.json), so it sees the same credentials.
		resourceLoader: loader,
		sessionManager: SessionManager.inMemory(ctx.cwd),
		settingsManager: SettingsManager.inMemory(),
		tools: options.tools,
	});

	try {
		await session.prompt(task);
		return getFinalText(session);
	} finally {
		session.dispose();
	}
};

const runPipeline = async (
	ctx: Pick<ExtensionContext, "cwd" | "model">,
	task: string,
	agents: PipelineAgent[],
): Promise<string> => {
	let previousOutput = "";
	const outputs: string[] = [];

	for (const [index, agent] of agents.entries()) {
		const output = await runSubagent(
			ctx,
			[
				`Overall task:\n${task}`,
				previousOutput ? `Previous step output:\n${previousOutput}` : "This is the first pipeline step.",
				"Complete your assigned step and return a concise handoff for the next agent.",
			].join("\n\n"),
			{
				systemPrompt: agent.instructions,
				tools: agent.tools?.length ? agent.tools : DEFAULT_SUBAGENT_TOOLS,
			},
		);

		outputs.push(`## ${index + 1}. ${agent.name}\n\n${output}`);
		previousOutput = output;
	}

	return outputs.join("\n\n");
};

export default function subagents(pi: ExtensionAPI) {
	// Child sessions load normal project extensions, but should not get their own delegate tool.
	if (process.env[SUBAGENT_ENV] === "1") return;

	let nextTaskNumber = 1;
	const tasks = new Map<string, BackgroundTask>();

	const updateActiveSubagents = (ctx: ExtensionContext) => {
		if (!ctx.hasUI) return;

		const activeTasks = Array.from(tasks.values()).filter((task) => task.status === "running");
		if (activeTasks.length === 0) {
			ctx.ui.setWidget(ACTIVE_SUBAGENTS_WIDGET, undefined);
			return;
		}

		ctx.ui.setWidget(ACTIVE_SUBAGENTS_WIDGET, [
			`Active subagents: ${activeTasks.length}`,
			...activeTasks.map((task) => `⏳ ${task.id} (${task.label}) — ${task.task}`),
		]);
	};

	const startBackgroundTask = (ctx: ExtensionContext, label: string, requestedTask: string, run: () => Promise<string>) => {
		const id = `${label}-${nextTaskNumber++}`;
		const task: BackgroundTask = { id, label, task: requestedTask, status: "running" };
		tasks.set(id, task);
		updateActiveSubagents(ctx);

		run()
			.then((output) => {
				task.status = "done";
				task.output = output;
				updateActiveSubagents(ctx);

				pi.sendMessage(
					{
						customType: SUBAGENT_RESULT_TYPE,
						content: `Task ${id} finished.\n\n${output}`,
						display: true,
						details: { id, task: requestedTask, output },
					},
					{ deliverAs: "followUp", triggerTurn: true },
				);
			})
			.catch((error: unknown) => {
				task.status = "failed";
				task.error = error instanceof Error ? error.message : String(error);
				updateActiveSubagents(ctx);

				pi.sendMessage(
					{
						customType: SUBAGENT_RESULT_TYPE,
						content: `Task ${id} failed.\n\n${task.error}`,
						display: true,
						details: { id, task: requestedTask, error: task.error },
					},
					{ deliverAs: "followUp", triggerTurn: true },
				);
			});

		return task;
	};

	pi.registerMessageRenderer(SUBAGENT_RESULT_TYPE, (message, _options, theme) => {
		return new Text(theme.fg("success", "✓ subagent result") + "\n" + message.content, 0, 0);
	});

	pi.registerTool({
		name: "delegate",
		label: "Delegate",
		description: "Start one focused background subagent task and return a task handle immediately.",
		parameters: Type.Object({
			task: Type.String({ description: "The focused task to hand to the subagent" }),
		}),
		promptSnippet: "Start focused research or inspection tasks in isolated background subagents.",
		promptGuidelines: ["Use delegate when a focused independent task can run in the background while you continue working."],

		async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
			// Background mode: return a handle now, then inject the child result later.
			const task = startBackgroundTask(ctx, "subagent", params.task, () => runSubagent(ctx, params.task));

			return {
				content: [{ type: "text", text: `Started ${task.id}. I can keep working while it runs.` }],
				details: { id: task.id, task: params.task, status: task.status },
			};
		},

		renderCall(args, theme) {
			return new Text(
				theme.fg("toolTitle", theme.bold("delegate ")) + theme.fg("dim", args.task ?? ""),
				0,
				0,
			);
		},

		renderResult(result, _options, theme) {
			const text = result.content.find((part) => part.type === "text")?.text ?? "";
			return new Text(theme.fg("warning", "⏳ subagent started") + "\n" + text, 0, 0);
		},
	});

	pi.registerTool({
		name: "pipeline",
		label: "Pipeline",
		description: "Start a configurable background pipeline of subagents that run in sequence.",
		parameters: Type.Object({
			task: Type.String({ description: "The overall task for the pipeline" }),
			agents: Type.Array(
				Type.Object({
					name: Type.String({ description: "Short label for this pipeline agent" }),
					instructions: Type.String({ description: "System instructions for this pipeline agent" }),
					tools: Type.Optional(
						Type.Array(Type.String({ description: "Tool name available to this agent" }), {
							description: "Optional tool allowlist. Defaults to read, grep, find, and ls.",
						}),
					),
				}),
				{ minItems: 1, description: "Agents to run in order" },
			),
		}),
		promptSnippet: "Run a configurable background pipeline of subagents in sequence.",
		promptGuidelines: ["Use pipeline when the user asks for a custom multi-agent workflow with ordered steps."],

		async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
			const task = startBackgroundTask(ctx, "pipeline", params.task, () => runPipeline(ctx, params.task, params.agents));

			return {
				content: [
					{ type: "text", text: `Started ${task.id}. ${params.agents.length} agents will run in sequence.` },
				],
				details: { id: task.id, task: params.task, agents: params.agents, status: task.status },
			};
		},

		renderCall(args, theme) {
			return new Text(
				theme.fg("toolTitle", theme.bold("pipeline ")) +
					theme.fg("dim", `${args.agents?.length ?? 0} agents — ${args.task ?? ""}`),
				0,
				0,
			);
		},

		renderResult(result, _options, theme) {
			const text = result.content.find((part) => part.type === "text")?.text ?? "";
			return new Text(theme.fg("warning", "⏳ pipeline started") + "\n" + text, 0, 0);
		},
	});
}
