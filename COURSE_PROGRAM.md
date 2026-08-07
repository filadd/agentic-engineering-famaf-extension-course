# Agentic Engineering FaMAF Extension Course

---
created: 2026-03-28
status: draft
tags:
  - teaching
  - agentic-coding
  - course-design
---

# From Vibe Coding to Agentic Engineering

Short course for university CS students with some project experience but little/no professional training. The goal is to walk them through the full spectrum of AI-assisted development — from pure "vibe coding" to structured agentic engineering — building concepts progressively over 4 weeks.

## The Spectrum

1. **Vibe Coding** — pure prompt-and-accept, no code review, iterate only when things break
    1. Vibecoding origin (Karpathy): https://x.com/i/status/1886192184808149383
    2. Vibecoding as videogame (Naval) https://x.com/i/status/2039617101221224858
    3. Kids Vibecoding (usando Lovable): https://www.instagram.com/reels/DKj1ghsiRN3/
    4. Vibe coding in prod: https://youtu.be/fHWFF_pnqDk?si=aJ7ctIkNvouw_3Ix
2. **AI-Assisted Coding** — copilot-style completions, developer maintains control
3. **Directed AI Assistance** — experienced use of LLMs with constraints, specs, and review
4. **Agentic Coding** — orchestrating AI agents on tasks with oversight
5. **Agentic Engineering** — full discipline: specs, quality gates, multi-agent coordination, accountability
    1. [https://simonwillison.net/guides/agentic-engineering-patterns/](https://simonwillison.net/guides/agentic-engineering-patterns/ )
   

## Key Thesis

Vibe coding is a great on-ramp — fast, fun, empowering. But professional software development demands accountability: security, maintainability, correctness. The course shows *why* each level of structure matters by letting students experience the failures firsthand before introducing the solutions.

**Core mental model: "Managing a smart intern."** The AI is like a capable but inexperienced developer — fast, eager, produces a lot of output, but needs clear direction, regular review, and someone who understands the big picture. You wouldn't accept an intern's code without reading it. You wouldn't let an intern architect your system. The same applies here. This framing recurs throughout the course: each session adds a layer of "management skill" for your AI intern.

## Format

- **6 sessions**, 1 per week, ~2-3 hours each (originally 4; sessions 5-6 added as a deeper technical arc — see below)
- Each session: theory → hands-on → show-and-tell discussion
- **Same project across all 4 sessions** — students see their codebase evolve
- Students bring their own project idea; default fallback is a small web app
- Tool: **Pi** (`pi.dev`) — decided; installed by students in Session 1
- Class size: ~20-30 students

## Topic Inventory

These are the concepts to cover, roughly ordered by complexity:

### [Diego] Tier 1: Fundamentals
- **Responsibility is the starting point**: accountability stays with the person, not the AI. "The agent wrote it" is not an excuse. Everything else in the course is a way of living up to that.
- The AI-assisted coding spectrum (overview)
- Generative AI: what it is, where LLMs sit inside it
- LLM fundamentals: how they work at a practical level — tokens, context windows, probability, why hallucinations happen.
- The model landscape: Anthropic (Claude), OpenAI (GPT), Z.ai (GLM), Moonshot AI (Kimi). Reading a model page: modalities, context window, price. OpenAI's model-comparison page as a way to teach the base concepts in one pass.
- Tokens as the unit of everything: input, output, and price. Multimodality — images and audio become tokens too.
- Pricing shapes: per-token (API) vs subscription, and when each makes sense.
- Context window as finite working memory — and the rule of thumb we actually use: **don't go past 50%** of what the model supports. Nothing persists between conversations.
- Chat vs agent: a chat returns text and you execute; an agent executes in a loop (reads, runs, edits, checks, retries).
- A short timeline: tab completion (Copilot) → chat beside the editor → Cursor → terminal coding agents (Claude Code, Codex, Pi).
- Vibe coding: prompt-and-accept workflow. Talk with the agent, don't open files — focus entirely on the output. Working definition: *programar sin pensar que el código existe*.
- Analyzing AI output: what did it actually produce?
- Code quality awareness: dead code, inconsistent patterns, missing tests
- Comprehension debt: you shipped code you don't understand
- The productivity illusion (METR study, CodeRabbit data)
- Anatomy of a coding agent (brief intro): LLM + tools + harness — just enough vocabulary to use these terms in later sessions
  - Tool: a function the LLM can invoke (read file, run shell, edit code)
  - Coding agent: an LLM that takes actions on a codebase via tools, not just suggests text
  - Harness: the program wrapping the LLM (context management, tool dispatch, permissions). Pi is a harness.
  - The catalogue by environment: web (Lovable, v0, Bolt, Claude Code web), desktop (Claude Code desktop), terminal (Claude Code, Codex, Pi, opencode)

> `AGENTS.md` used to sit here as "first contact with project context". The step was dropped from Session 1 — first contact is now Tier 2 / Session 2, and Tier 3 goes deep.

### [Agus] Tier 2: Planning & Review
- Code review of AI output (reading diffs, understanding changes)
- Task decomposition: breaking work into reviewable units
- `AGENTS.md`, first contact: the file the agent reads on startup, as the answer to "I explained the same thing all week". Ten lines — stack, how to run it, how to test it, a couple of conventions, what not to touch. Depth is Tier 3
- Planning before executing: the plan always exists — the question is whether you can read it
- Structured planning & review (`@plannotator/pi-extension`): file-based plan mode for Pi. Externalize, annotate, deny-with-annotations, Plan Diff, then `/plannotator-review` on the resulting diff. Plans and reviews as first-class artifacts
- The harness enforces the discipline: planning mode restricts the toolset to read/search and blocks writes outside the plan file (seeds Tier 3's permissions/extension-points material)
- Testing: test-first development, tests as guardrails
- Debugging AI-generated code
- Git workflow with AI (branching, reviewing diffs, reverting)

### [Diego] Tier 3: Tooling & Skills

> Prerequisite, not content: **Pi is installed in Session 1**, and Session 2 adds the Plannotator and `pi-subagents` extensions plus a ten-line `AGENTS.md`. Tier 3 goes deeper on all of it — it introduces none of it.

- Tools deep dive: what tools are, how the LLM calls them, examples from Pi's toolbelt (read, write, edit, bash, grep, find, ls). Why tools are the unit of capability.
- Harness deep dive: what Pi provides as a harness — context management, tool dispatch, permissions, extension points. Comparison with other harnesses (Claude Code, Cursor, Aider, OpenCode). Why the harness matters as much as the model.
- Custom instructions: `AGENTS.md` in depth — the loading order across directories, rules files, how it relates to skills and slash commands. Students arrive with the ten-line version they wrote in Session 2, plus a week of notes on what it failed to cover.
- Skills / slash commands: teaching AI reusable behaviors
- MCP / external tools: extending the harness — the LLM gains new tools at runtime
- Documentation tools (e.g. [context7](https://context7.com/), [context-hub](https://github.com/andrewyng/context-hub)): fetching up-to-date library docs so the AI works with accurate references instead of guessing
- Subagents: delegating subtasks to specialized agents — intro to the concept and available agent types
- Worktrees: isolated parallel execution

### [Agus] Tier 4: Context Engineering
- Spec-driven development: defining WHAT before prompting HOW — specs as context for the AI
- Research-driven development: using documentation tools (context7, context-hub) to ground the AI in accurate, current docs before implementing
- Agent orchestration: the *pattern* of coordinating multiple agents on a task — distinct from the subagent primitive introduced in Tier 3. Orchestration is about dispatch and coordination (who plans, who works, how results merge); subagents are one substrate to implement it on, alongside separate Claude sessions, the Task tool, or MCP-mediated handoffs. The "Teams" pattern is a common form: a planner agent dispatches to specialized worker agents (research, review, exploration, implementation), often running in parallel.
- Framework vs. roll-your-own orchestration: a real design decision when you start coordinating agents. Example of an opinionated framework — `oh-my-openagent` (https://github.com/code-yeongyu/oh-my-openagent), with named discipline agents (Sisyphus planner, Hephaestus worker, Prometheus interviewer), automatic model routing, and parallel team mode. Useful to *learn from* — it shows what orchestration looks like at scale — but worth discussing the tradeoff: adopt a framework's opinions, or design your own orchestration on top of Claude Code's primitives (subagents, worktrees, Task tool). Neither is universally better; the choice depends on how much control vs. convention the team wants.
- Deep context engineering: shaping AI behavior through project structure and documentation
- Full workflow integration: spec → research → tests → implementation → review
- When to delegate vs. intervene (developing intuition)
- Professional accountability: you sign off on what the AI produces
- The spectrum revisited: when is each approach appropriate?

### [Agus] Tier 5: Harness Internals
- **TBD** — topics to be defined by the owner. See `harness_internals.md` and `sessions/session-5/`.

### [Diego] Tier 6: Open Source Models & HPC

> 🔴 **TO REVIEW** — Claude-generated, not yet reviewed by Diego.

- **Open source vs. open weights**: open weights means you can download and run them; open source in the strong sense means you could reproduce the model (training code + data information). Nearly everything marketed as "open source AI" is open weights — the binary, not the recipe.
- **Licences**, where that distinction gets consequences: standard software licences (Apache 2.0, MIT) vs. bespoke licences with usage restrictions and scale clauses (Llama community licence, Gemma terms) vs. restrictions on the output itself. The three questions to answer before shipping: commercial use? redistribute a fine-tune? who owns the generations?
- Open weights vs. hosted APIs as a **spectrum of control**: capability, where your data lives, cost shape (per-token vs. per-hour vs. capex), ops burden, offline capability. Honest about the capability gap on long-horizon agentic work and reliable tool calling.
- **Is an open model good enough to be the engine of a serious project?** Answered from the hands-on measurements, on concrete axes: schema-respecting tool calls every time, surviving a 20-step task, context window against a real repo, latency inside an agent loop. The bottleneck is usually reliable tool calling, not the ability to write code.
- **Running one on your own hardware**, made concrete: Agus brings a portable GPU and serves a small model in the room — no queue, no tunnel, no account, data never leaves the room.
- What it takes to run one: the VRAM arithmetic (parameters × bytes-per-parameter, before context), quantization and its cost to structured output (i.e. to tool calling), and the two families of runtime — local/single-user (llama.cpp, Ollama) vs. serving (vLLM, SGLang).
- The OpenAI-compatible endpoint as the interoperability story: why a harness can point at a different model with a base-URL change. This is the technical bridge from Tier 5.
- HPC mechanics: login node vs. compute node, the job scheduler (you describe a job and wait your turn), modules/environments, reaching a service on a node with no public address, shared-resource etiquette.
- **CCAD (Centro de Computación de Alto Desempeño, UNC)**: what it is, what hardware exists, and how a student gets an account. Guest intro by Ale Silva. Most students don't know UNC runs an HPC center they can use — arguably the highest-value practical takeaway of the course, independent of AI.
- Supply chain and self-hosting risk: what you trust when you download multi-gigabyte binary weights; how self-hosting removes a third party and adds you as the operator.
- When open source is the right call: sensitive data, cost-dominated volume, research reproducibility, offline work, studying the model itself — versus wanting the best coding agent today with no ops capacity.

### Cross-cutting: Security & Trust (woven throughout)
Not a dedicated session, but surfaced where relevant:
- **Session 1**: security issues found during code analysis (common vulnerabilities in AI output)
- **Session 2**: reviewing code with a security lens, what to look for
- **Session 3**: sandboxing, permission models, why tools have allowlists/denylists
- **Session 4**: trust boundaries, prompt injection awareness, supply chain risks with agents
- **Session 5**: TBD
- **Session 6**: model supply chain (binary weights from a hub), self-hosting as an operator responsibility, weaker models as easier injection targets

## Proposed Sessions

### Session 1: The Vibe Coding Experience

> **This session runs 3 hours** (every other session is 2): ~2 h of introductions + theory, ~1 h of hands-on. It carries all the shared vocabulary for the course *and* the tool install, which is why the usual theory/hands-on ratio is inverted here.

**Part 1 — Who we are (~10 min)**
- Diego and Agus: academic and industry background, what we do now, and concretely how we use AI at Filadd
- Introduce the Filadd TAs who help during the hands-on

**Part 2 — What this course is (~20 min)**
- This course is built on our own experience, not on theory — for theory there are excellent online courses (DeepLearning.AI/Andrew Ng, Karpathy, Simon Willison, Anthropic's "Claude Code in Action"). The practical consequence: ask a lot of questions.
- Ask the room what AI courses they've taken and recommend
- The six sessions in one slide
- **Responsibility stays with the person, not the AI** — the idea we most want them to leave with
- Core mental model: managing a smart intern. Today is deliberately the absent boss.
- The five-level spectrum as a map (revisited in Session 4's closing)

**Part 3 — Who they are (~15 min)**
- Quick round of introductions, and: do they use AI, and for what?
- This is the calibration instrument — the answers decide how much of Part 4 gets compressed

**Part 4 — Fundamentals (~35 min)**
- Generative AI; next-token prediction and why hallucinations are the mechanism, not a bug
- The model landscape (Claude, GPT, GLM, Kimi) — **read the model pages live**: modalities, context window, price. OpenAI's comparison page to explain the base concepts in one pass.
- Tokens; multimodality (images and audio are tokens too); pricing per-token vs subscription
- Context window as finite working memory, and the **50% rule of thumb**
- Chat vs agent; short timeline from tab completion to terminal coding agents
- What a coding agent is; the three words: LLM + tool + harness. **Pi is a harness.** Opened up in Session 3.
- The catalogue by environment: web / desktop / terminal
- **Pi intro + live demo (Agus)** — what Pi is, why we picked it, install pointer, and one prompt narrating the agent loop out loud

**Part 5 — Vibecoding: theory + demo (~35 min)**
- Definition: *programar sin pensar que el código existe*
- The four takes: Karpathy (origin), Naval (vibecoding as a video game), kids vibecoding with Lovable, vibe coding in prod
- Vibe coding is not an insult — present it honestly before critiquing it. Live demo.
- Then the critique, framed as predictions for the hands-on:
  - Comprehension debt: you shipped code you don't understand
  - The productivity illusion: METR (19% slower despite feeling 20% faster), CodeRabbit (1.7x more issues)
  - The 80% problem: the remaining rough edges are where the real effort lives — and where understanding the code matters
  - Agent failure modes: cascading errors, false success reporting ("tests pass" after editing the assertions), scope creep

**Hands-on (~27 min)**
- Install Pi (official quickstart), create the project + git repo, add the `pi-processes` package so the dev server can run in the background
- Then vibe code, with the rules: talk to the agent, don't open the files, describe symptoms not diagnoses, judge only by the output
- Nobody should leave the room without Pi working

**Reality check (~12 min, closes the hands-on)**
- Now open the files — what did the AI actually produce? Checklist: tests, secrets, dead code, duplication, unvalidated input
- Collect from the room; show one concrete security hole if it appears (permission asked in advance)
- Key question: "Would you ship this? Would you maintain this?" — left unresolved; Session 2 opens on it
- **Homework**: keep vibe coding with the same rules until it gets away from you. That's the material for Session 2's recap, which is where the deeper debrief now happens.

### Session 2: Planning & Review

> Runs on **Pi**, plus two extensions installed at the start of class: `@plannotator/pi-extension` and `pi-subagents`. Session duration is 2 h. All session materials are in Spanish, including the instructor notes.

**Recap & debrief from Session 1 (~15 min)**
- This is the course's real reality check. Session 1's in-class version was only ~12 min on 15 min of building; the material comes from the homework ("keep vibe coding until it gets away from you, and write down when")
- Collect the moments it got away from them. Ask who broke the no-reading rule, and what made them
- Cash in the predictions Diego framed as predictions: METR (19% slower while feeling 20% faster) and the 80% problem. Don't argue with students who were genuinely faster
- Name comprehension debt again and give it its mechanism: the bottleneck moved from writing code to verifying it

**Setup (~5 min)**
- `pi install npm:@plannotator/pi-extension` and `pi install npm:pi-subagents`, everyone together, before any theory. Asked for as pre-work, but don't assume. Doing it here means an hour of theory to unblock stragglers instead of losing build time

**Theory (~45 min)**
- Git as your safety net: branching, reviewing diffs, reverting. Goes first — everything after assumes you can back out
- `AGENTS.md`, first contact (~5 min): the answer to "I explained the same thing to the agent all week". Ten lines, in the repo root. A standard, not a Pi thing. It also makes the next block work better — a plan written by an agent that already knows the project starts far closer to what you wanted. Depth is Session 3
- **Planning and review as one block (~30 min), because in practice it's one loop**: the plan you approve is the spec you review the diff against
  - The plan always exists; the only question is whether you can read it. Pi has no built-in plan mode, so the extension *is* plan mode and the plan is a file from the first moment
  - The harness enforces the discipline: planning mode swaps the toolset to read/search, blocks destructive commands, restricts writes to the plan file. You cannot skip ahead
  - The spectrum of review surfaces: watch+steer, read in editor, `git diff`/hunk, `/plannotator-review`, delegate to a subagent
  - **One 20-minute live demo covering the whole loop**: `pi --plan` → checklist → **deny with annotations** → Plan Diff → subagent reviews the plan → approve and execute (interrupting once to show watch+steer) → `/plannotator-review` on the resulting diff → security smell in passing
- Test-first development: tests as guardrails. Delegate the runner setup, never the assertion

**Hands-on (~40 min)**
- Rules invert from Session 1: nothing executes without a written plan; **reject the first plan**; read every diff; read broken code yourself before asking for a fix
- Pick a small feature (4-5 files max), write a ten-line `AGENTS.md`, enter plan mode, iterate the plan through deny-with-annotations
- Write one test yourself before executing; have the agent set up the runner if there isn't one
- Execute the plan step by step, steering when it drifts
- Review the diff via `/plannotator-review`; commit the plan file and the `AGENTS.md` alongside the code

**Reflection & Discussion (~10 min)**
- Compare with Session 1: what changed? Did the annotated plan surface something you'd missed?
- What was the overhead? Was it worth it? (For a small feature, honestly: maybe not. Let them say so.)
- Homework for Session 3: where did the flow feel like pure ceremony, and what did you keep explaining to the agent even though it was in the `AGENTS.md`? The second question is Session 3's material.

### Session 3: Tooling & Skills

**Recap & Sharing (~15-20 min)**
- Show-and-tell: how did planning and review change the work?

> Students arrive with **Pi, the Plannotator and `pi-subagents` extensions, and a ten-line `AGENTS.md`** (Sessions 1 and 2). No setup block here; this session deepens what they already have.

**Theory: "Teaching The Agent" + "Parallel Execution" (~20-30 min)**
- Tools: the unit of agent capability. What a tool definition looks like (name + schema + handler), how the LLM decides which to call, examples from Pi's built-in toolbelt. Why a smarter tool often beats a smarter model.
- Harness: the program that wraps the LLM. Pi's responsibilities — context window management, tool execution, permissions, extension points. Quick comparison with Claude Code / Cursor / Aider / OpenCode so students see that "harness" is a real design space, not just "the UI."
- Custom instructions: `AGENTS.md` as the agent's persistent memory — from the ten-line version they wrote in Session 2 to one that actually shapes behaviour, plus loading order across directories and rules files
- Skills and slash commands: building reusable capabilities
- MCP and external tools: how external services plug into the harness as new tools — the agent's capabilities grow at runtime
- Documentation tools (e.g. context7, context-hub): why accurate docs matter — the AI hallucinates APIs, context7, context-hub fixes that
- Subagents: intro to the concept — different agent types for different tasks (research, exploration, code review). Not deep usage yet, just "these exist and here's what they do"
- Worktrees: delegating and parallelizing work
- Security sidebar: sandboxing, permissions, allowlists

**Hands-on (~1.5 hours)**
- Take the ten-line `AGENTS.md` from Session 2 and make it real: coding style, patterns, constraints, verification commands. Start from the week's notes on what it failed to cover. Start from what you had to repeat to the agent during Session 2's homework
- Create a custom skill or command for a repeated task
- Set up an MCP tool or external integration
- Try a documentation tool (context7, context-hub): ask the agent to look up a library you're using — compare the output with and without it
- Try subagents or worktrees for parallel work

**Reflection & Discussion (~15-20 min)**
- How did the agent's behavior change with instructions?
- What surprised you about the tooling capabilities?

### Session 4: Context Engineering

**Recap & Sharing (~15-20 min)**
- Show-and-tell: what did the tooling enable that wasn't possible before?

**Theory: "Shaping The Input" + "The Full Loop" (~20-30 min)**
- Spec-driven development: define WHAT before prompting HOW
- Research before implementation: use documentation tools (context7, context-hub) to ground the AI — "look it up, don't guess"
- Agent orchestration as a coordination pattern: distinct from the subagent primitive (Session 3). Orchestration = *how* multiple agents share work (dispatch, planning, result merging); subagents are one substrate to run it on, alongside separate sessions, the Task tool, or MCP-mediated handoffs. The "Teams" pattern is the canonical form: a planner agent dispatches to specialized worker agents (research, review, exploration, implementation), often in parallel. Why orchestration is the natural next step from single-agent context engineering.
- A design decision: framework vs. roll-your-own orchestration. Walk through oh-my-openagent (https://github.com/code-yeongyu/oh-my-openagent) as a concrete example of an opinionated orchestration framework — discipline agents (Sisyphus, Hephaestus, Prometheus), automatic model routing, parallel team mode. Open the discussion: do you adopt those opinions, or design your own orchestration on Claude Code's primitives? Frame it as a real choice the student will face, not a recommended path.
- Context engineering: the AI's output is only as good as what you feed it
- The full workflow: spec → research → tests → implementation → review
- Developing delegation intuition: what to hand off vs. what requires your judgment
- Professional accountability: you sign off on what the AI produces
- Security sidebar: trust boundaries, prompt injection, supply chain awareness

**Hands-on (~1.5 hours)**
- Write a spec for a feature, then have the AI implement it
- Research before coding: use context7/context-hub to look up the libraries/APIs you need — compare how the AI's output changes when it has accurate docs
- Use subagents for non-implementation tasks: have a research agent explore your codebase, a review agent check your last change
- Practice the full loop: spec → research → plan → test → implement → review
- Experiment with delegation: what can you safely hand off? What benefits do specialized agents bring beyond just "more AI"?
- (Optional) Compare two paths: (a) read through oh-my-openagent's discipline agents and try `ultrawork` on a small task, vs. (b) sketch a minimal roll-your-own orchestrator on top of Claude Code's subagents + Task tool. Discuss which approach feels right for your project — and why.

**Closing Discussion (~20-30 min)**

> With 6 sessions, the full-course retrospective moves to Session 6. Session 4 keeps the spectrum revisit and the cost/limits discussion as a checkpoint, not a farewell — decide which session owns the closing before the course runs.

- Retrospective: compare your codebase across all 4 sessions
- The spectrum revisited: when is each approach appropriate?
- Cost and token awareness (brief): AI tools aren't free — model tiering (fast/cheap vs slow/powerful), why context engineering saves money too, not just quality. Think of tokens as a budget, not an infinite resource
- When NOT to use AI: recognizing limitations, avoiding overreliance, the skill atrophy risk. AI amplifies expertise — if you don't have the fundamentals, it amplifies confusion. "Don't use AI as a crutch" (MIT Missing Semester)
- Career implications: what skills matter in an AI-augmented world?
- Key takeaway: AI tools amplify expertise — invest in fundamentals

### Session 5: Coding Harness (internals)

Owner: **Agus**. **TBD** — session design to be written by the owner in `sessions/session-5/INSTRUCTOR.md`.

Known dependency: **Session 6 currently assumes** students leave this session with an agent of their own that they can point at a different model. If the hands-on takes a different shape, Session 6's hands-on needs rework — sync between owners.

### Session 6: Open Source Models & Running on CCAD

> 🔴 **TO REVIEW** — Claude-generated, not yet reviewed by Diego.

Owner: Diego. Guest: **Ale Silva (CCAD)**. Goes last because it depends on Session 5 — students who wrote their own loop already believe the model is swappable.

**Recap & Sharing (~10-15 min)**

**Guest: intro to CCAD (~20-25 min)**
- Ale Silva on the Centro de Computación de Alto Desempeño: what it is, who it serves, what hardware exists, how a student gets an account, what HPC is normally used for at UNC. Scope to be agreed with him.

**Theory: "The Model Is a Component" (~35-40 min, split around the hands-on)**
- **Open source vs. open weights**: the binary, not the recipe. Nearly everything marketed as open-source AI is open weights.
- **Licences**: Apache 2.0/MIT vs. bespoke licences with usage and scale restrictions vs. restrictions on the output. Can I use it commercially, redistribute a fine-tune, and who owns the generations?
- Open weights vs. hosted APIs: the control spectrum.
- What it takes to run one: VRAM arithmetic, quantization, local vs. serving runtimes, the OpenAI-compatible endpoint.
- **Demo: Agus's portable GPU** serving a small model live — the "your own hardware" column made physical, and the session's fallback endpoint.
- HPC mechanics: login vs. compute node, the scheduler, port forwarding, shared-resource etiquette.
- Security sidebar: model supply chain, self-hosting as operator responsibility.
- *After* the hands-on: **is it good enough to be the engine of a serious project?** — answered from their own measurements (schema-respecting tool calls, 20-step tasks, context window, latency in the loop), then when open source is the right call. Both deliberately placed once students have felt the ops burden.

**Hands-on (~60-75 min)**
- Get onto a cluster, request a GPU allocation, serve a small open-weights model with an OpenAI-compatible endpoint, forward the port, change the base URL in the Session 5 agent, and compare both models on the same multi-step task.
- A fallback endpoint is provided (Agus's GPU in the room): the comparison is the lesson, not beating the queue.

**Course Closing (~15-20 min)**
- Full retrospective across all six sessions: open the repo, look at the first commit.
- The spectrum revisited (Session 1's slide, returned to).
- When NOT to use AI; skill atrophy; AI amplifies expertise.
- Key takeaway: everything from Sessions 2-5 — planning, review, tests, context, tools, harness — transfers across models. That's why the course taught structure instead of a product.

## Progression Arc

The arc follows a clear logic (and mirrors growing from a hands-off boss to an effective engineering manager):

1. **No structure** → experience the chaos, see what breaks ("just tell the intern what to build, don't check on them")
2. **Human process** → add your judgment: plan, review, test, debug ("start doing stand-ups and code reviews")
3. **Tool leverage** → use the tool's capabilities to scale your judgment ("give the intern better tools and clear documentation")
4. **Context shaping** → engineer the AI's environment (specs, project context, documentation) so it produces better output by default ("build a team culture where good work happens by default")

Sessions 5-6 change the question. The first four ask *how do I work well with this thing?*; the last two ask *what is this thing made of, and what if I swap its parts?*

5. **Open the box** → TBD (Agus)
6. **Swap the model** → the model is one replaceable component; everything you learned survives the swap

Each session adds a layer of structure. Students feel *why* each layer matters because they've experienced the problems it solves.

## Session Flow Template

Each session follows roughly the same structure:

1. **Recap & sharing** (~15-20 min) — open show-and-tell about what happened since last session, what was discovered, what broke
2. **Theory block** (~20-30 min) — introduce the session's new concepts. Prompting tips woven into each session naturally, not taught as a separate block.
3. **Hands-on work** (~1.5-2 hours) — apply concepts to their project
4. **Reflection & discussion** (~15-20 min) — what changed? What worked? Key insights?

## Default Project

For students who don't bring their own:
- Small web app (todo with auth, simple dashboard, chat app)
- Must be achievable as a basic vibe-coded prototype in ~2 hours
- Complex enough to reveal problems across all 4 weeks (security, architecture, testing, state management)

## Open Questions

- Exact session duration (2h vs 3h) — **Session 1 is 3 h**, the rest are 2 h. Confirm the room allows it.
- ~~Claude Code vs alternatives~~ → **decided: Pi is the course tool.** Terminal-based, minimal, standard `AGENTS.md`.
- ~~Session 2 is written against Claude Code and misaligned with the Pi decision~~ → **resolved: Session 2 runs on Pi.** Planning and review go through `@plannotator/pi-extension`, which adds file-based plan mode (`pi --plan`) and `/plannotator-review` to Pi. One harness for the whole course; students install one extension in Session 2.
- ~~`pi-subagents` package is unpinned~~ → **decided: the unscoped `pi-subagents`** (`pi install npm:pi-subagents`), installed by students at the start of Session 2. There are at least six forks on npm (`@tintinweb/`, `@gotgenes/`, `@yassimba/`, `@nklisch/`, plus bridges) — the course standardizes on one. **Confirm with Diego** before Session 3 builds on it.
- **`AGENTS.md` moved to Session 2 as first contact** (ten lines, right before the planning block). Session 3 now deepens a file that already exists instead of introducing one. **Confirm with Diego** — it changes what his hands-on starts from.
- API keys: provide them or have students set up their own?
- Pre-work: should students come to Session 1 with a project idea already?
- Do we want a final deliverable (repo + reflection) or is the journey enough?
- LLM fundamentals block: include or skip depending on group assessment?
- Does the extension-course format actually allow 6 weeks? Confirm before announcing.
- **Session 5 tooling prerequisites**: TBD once Agus defines the session. If the hands-on hits the API directly, note that raw API access is a different requirement from "Claude Code works" — course-wide keys, a proxy, or their own?
- **Session 6 needs CCAD accounts provisioned in advance** (form + email, not same-day). Send instructions weeks ahead; confirm whether bulk/expedited provisioning is possible and whether a sponsoring researcher is required.
- **Session 6 hands-on is hostage to the GPU queue** unless CCAD can reserve a window for the class. Fallback endpoint needed either way.
- Which session owns the full-course retrospective now that there are six? (Currently duplicated between Session 4's closing and Session 6.)

## References & Inspiration

- [MIT Missing Semester 2026: Agentic Coding lecture](https://missing.csail.mit.edu/2026/agentic-coding/) — full lecture content, exercises, and tool walkthroughs
- [Addy Osmani: "Agentic Engineering"](https://addyosmani.com/blog/agentic-engineering/) — defines the discipline, "managing an intern" framing, skill atrophy warnings
  - [Simon Willison: "Agentic Engineering Patterns"](https://simonwillison.net/guides/agentic-engineering-patterns/)
- [Simon Willison: "Vibe Engineering"](https://simonwillison.net/2025/Oct/7/vibe-engineering/) — analysis of vibe coding and the case for discipline (search for "vibe coding" posts)
- [OWASP Top 10 for Agentic Applications (2025)](https://genai.owasp.org/resource-center/security-guides/owasp-top-10-for-agentic-applications-the-benchmark-for-agentic-security-in-the-age-of-autonomous-ai/) — ASI01-ASI10: goal hijack, tool misuse, rogue agents, cascading failures
- [OWASP GenAI Security Project](https://genai.owasp.org/) — broader LLM security resources, supply chain risks, prompt injection
- Karpathy's progression from coining "vibe coding" to proposing "agentic engineering" — [original vibe coding tweet/thread (Feb 2025)](https://x.com/i/status/1886192184808149383) (same link as "The Spectrum" above; the two IDs previously disagreed)
- METR: "Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity" — [metr.org](https://metr.org/) (devs 19% slower with AI despite feeling 20% faster)
- CodeRabbit: AI co-authored code has 1.7x more major issues — [coderabbit.ai](https://coderabbit.ai/)
- Udemy: "The Complete Course on Coding Agents" by Nikolai Schuler & Jagger Bellagarda — [Udemy search](https://www.udemy.com/courses/search/?q=coding+agents+claude+code)
- ICSE 2026 AGENT Workshop — academic research on agentic software engineering
- The 80% Problem in Agentic Coding (vault: Reading_List/Queue)

### Session 5 — Harness internals
- **TBD** (Agus)

### Session 6 — Open source models & HPC
- [CCAD — Centro de Computación de Alto Desempeño, UNC](https://supercomputo.unc.edu.ar/ccad/) — created by Ordenanza HCS 18/2010; serves UNC faculties, the Astronomical Observatory, and external research organizations
- [CCAD wiki / documentation](https://wiki.ccad.unc.edu.ar/) — the reference for cluster usage
- [Opening a CCAD account](https://wiki.ccad.unc.edu.ar/empezar/abrir-cuenta.html) — SSH keys → request form → credentials by email
- [CCAD equipment](https://supercomputo.unc.edu.ar/equipamiento/) — active clusters: Boogie (2025), Gordito (2025/2026), Mendieta Fase 2 (2022), Serafín (2021), Eulogia (2018/2021), Mulatona (2018). Per-cluster specs live on the individual pages and the wiki
- [CCAD services](https://supercomputo.unc.edu.ar/servicios/pedido-de-cuentas/) — account requests, intensive-use requests, user support
- [CCAD status](https://stats.uptimerobot.com/eLhTV5CMni) · [dashboard](https://stats.ccad.unc.edu.ar/) — check before class
- Guest: **Ale Silva** (CCAD) — intro to the center. Details in the email thread; see `sessions/session-6/INSTRUCTOR.md` → Pending from Ale
