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

- **6 sessions**, 1 per week, ~2-3 hours each (originally 4; sessions 5-6 added as a deeper technical arc — see below). **Sessions 1 and 5 are the long ones**: Session 1 needs 3 h for introductions plus the install, Session 5 needs 2 h 30 because it opens with an hour of student demos.
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

> `AGENTS.md` used to sit here as "first contact with project context". The step was dropped from Session 1 — it is introduced from scratch in Tier 3.

### [Agus] Tier 2: Planning & Review
- Code review of AI output (reading diffs, understanding changes)
- Task decomposition: breaking work into reviewable units
- Planning before executing: the plan always exists — the question is whether you can read it
- Structured planning & review (`@plannotator/pi-extension`): file-based plan mode for Pi. Externalize, annotate, deny-with-annotations, Plan Diff, then `/plannotator-review` on the resulting diff. Plans and reviews as first-class artifacts
- The harness enforces the discipline: planning mode restricts the toolset to read/search and blocks writes outside the plan file (seeds Tier 3's permissions/extension-points material)
- Testing: test-first development, tests as guardrails
- Debugging AI-generated code
- Git workflow with AI (branching, reviewing diffs, reverting)

### [Diego] Tier 3: Tooling & Skills

> Prerequisite, not content: **Pi is installed in Session 1**, and Session 2 adds the Plannotator and `pi-subagents` extensions. Tier 3 goes deeper on the harness — it does not introduce it. `AGENTS.md` **is** introduced here from scratch: the Session 1 step that had students write one was dropped, and Session 2 does not touch it.
>
> **Subagents moved to Tier 4** (decided while building Session 3): Agus opens them there with a documentation use case, so Tier 3 only names them — one row in the always-loaded vs. on-demand table, one row in the extension-points table. Session 2's "depth on subagents is Session 3" promise moves with them.
>
> **Worktrees are out of the course**, not relocated. They were only ever a one-line mention riding along with subagents, no session's hands-on needs them, and git-level parallel work is already named in Session 2's git block. Cut rather than parked.

- Tools deep dive: what tools are, how the LLM calls them, examples from Pi's toolbelt (read, write, edit, bash, grep, find, ls). Why tools are the unit of capability.
- Harness deep dive: what Pi provides as a harness — context management, tool dispatch, permissions, extension points. Comparison with other harnesses (Claude Code, Cursor, Aider, OpenCode). Why the harness matters as much as the model.
- Custom instructions: `AGENTS.md` from scratch — what it is, the loading order across directories, rules files. Students arrive with the *motivation* for it from Session 2's homework ("what did you have to explain to the agent more than once?"), not with a file.
- Skills / slash commands: teaching AI reusable behaviors
- MCP / external tools: extending the harness — the LLM gains new tools at runtime
- Documentation tools (e.g. [context7](https://context7.com/), [context-hub](https://github.com/andrewyng/context-hub)): fetching up-to-date library docs so the AI works with accurate references instead of guessing
- Subagents: **named only, as the third row of the always-loaded vs. on-demand table** — the work itself can also go to a separate context. The block itself is Tier 4.

### [Agus] Tier 4: Context Engineering
- Problem domain vs. solution domain: the same feature described as a need (actors, data and relations, processes, in problem terms) and as a system (data diagrams, breadboards/page sketches, flows). Starting from the solution means deciding without having considered the problem in depth, and inheriting the agent's average answer for every decision left open.
- Living project documentation as context: `docs/PROJECT.md` (what the project is, main goal, constraints) plus one doc per feature (the problem it solves, then a design section with the model and one flow per interaction — each flow carries its screens, steps, rules and decisions with their reasons). Committed to the repo; `AGENTS.md` points to them.
- Writing docs with the agent: interrogation before drafting — the agent asks, the student decides (e.g. Matt Pocock's grill-me skill). Delegating the writing is fine; delegating the thinking is the failure mode.
- Research feeds the docs at high level: documentation tools (context7) to understand a library, while implementation details belong to the plan, not the doc
- Subagents, the primitive: delegating a subtask to a separate context, and the available agent types (research, exploration, review). Moved here from Tier 3, and **opened through the research above** — sending the library research to its own context is where the delegation pays for itself, so the primitive and its best motivation land together.
- The chain: doc → plan → implementation → review (the review checks against both the plan and the doc)
- Cognitive debt and cognitive surrender: the cost of repeatedly delegating reasoning to the AI, and adopting its decisions as your own opinions
- When to delegate vs. intervene (developing intuition)
- Professional accountability: you sign off on what the AI produces
- Orchestration, in passing: shared docs as the ground truth that lets several agents work in parallel

### [Agus] Tier 5: Harness Internals

> **The spine: teach the concept, use Pi as the specimen.** Every topic here is a design decision *any* harness has to make; Pi is the one we can open, not the one being sold. That rehearses Tier 6's transfer thesis a week early. The failure mode of this tier is turning into a tour of Pi's features.

- What a harness is, revisited from Tier 1: interface, agent loop, tools/memory/context, model. An LLM alone predicts tokens and can do nothing; the harness connects it to the world.
- **The other harnesses, as axes rather than a ranking**: open vs. closed source, what ships built in vs. what you add, whether there is an extension surface and how deep it reaches, who controls the system prompt. The questions to ask the next tool they pick up. **No comparison table** — comparing harnesses in the abstract is useless to someone who has used one.
- The agent loop, step by step, with the extension points on the arrows: `session_start`, `resources_discover`, `input`, `before_agent_start`, `turn_start`, `context`, the model call, `tool_call`, `tool_result`, `turn_end`, `agent_end`, `session_shutdown`. Every moment is subscribable, and from there you block, modify or inject. **This is where Tier 2's plan mode finally gets its mechanism**: `tool_call` → `{ block: true }`.
- Harness architecture as layers, and the idea that you use only the ones you need. Pi's four packages: unified model API, generic agent loop, coding layer, terminal UI.
- **Sessions as a tree, not a list**: entries with `id` and `parentId`, the active leaf, the whole tree in one file. Why `/tree` is cheap — you move a pointer, you don't delete. Tier 1 sold it as the antidote to cascading errors; here it gets its reason.
- **Steering vs. follow-up**: when does new information reach an agent that is already running? Interrupt mid-stream, wait for it to settle, or queue for the next turn. Every harness decides this; most hide it.
- **Three ways to give a model a tool**, and the tradeoffs: an **extension** (reaches harness internals, works in that harness only), a **CLI** (simplest, portable to any harness with a shell, no auth story, and the agent has to learn it exists — which is what `AGENTS.md` is for), **MCP** (for tools other people consume: distribution, auth, remote services, paid for in context). The question that decides it is who the consumer is.
- **Subagents, the mechanism** (the use case is Tier 4's): a separate context with its own transcript, whose entire result returns to the parent as one message. The honest reason is context economy, not "more AI".
- **Compaction**, the debt Tier 1 assigned here: the trigger (`contextTokens > contextWindow - reserveTokens`), the algorithm (walk back to `keepRecentTokens`, cut, summarize the older half in a structured format, store the summary with the first kept entry), and the two consequences — it is lossy and it is another model call, and it is interceptable.
- **Run modes**: interactive, headless one-shot, embedded as a library, served behind a protocol. The agent loop is a library and the terminal is one of its interfaces. Why CI agents, bots and in-browser agents exist.
- **Security, generalized**: threat models (prompt injection from repo content, a malicious extension/skill/MCP server, the agent's own destructive mistakes, credential exfiltration), permission models as a design space, and the sandbox ladder (none → in-process → container → micro-VM → separate machine). The counterintuitive argument worth stating: **a partial sandbox is worse than none**, because it reads as a boundary while still resting on your shell, filesystem, package managers and credentials. Real isolation comes from the OS.

### [Diego] Tier 6: Open Source Models & HPC

> 🔴 **TO REVIEW** — Claude-generated, not yet reviewed by Diego.

- **Open source vs. open weights**: open weights means you can download and run them; open source in the strong sense means you could reproduce the model (training code + data information). Nearly everything marketed as "open source AI" is open weights — the binary, not the recipe.
- **Licences**, where that distinction gets consequences: standard software licences (Apache 2.0, MIT) vs. bespoke licences with usage restrictions and scale clauses (Llama community licence, Gemma terms) vs. restrictions on the output itself. The three questions to answer before shipping: commercial use? redistribute a fine-tune? who owns the generations?
- Open weights vs. hosted APIs as a **spectrum of control**: capability, where your data lives, cost shape (per-token vs. per-hour vs. capex), ops burden, offline capability. Honest about the capability gap on long-horizon agentic work and reliable tool calling.
- **Is an open model good enough to be the engine of a serious project?** Answered from the hands-on measurements, on concrete axes: schema-respecting tool calls every time, surviving a 20-step task, context window against a real repo, latency inside an agent loop. The bottleneck is usually reliable tool calling, not the ability to write code.
- **Running one on your own hardware**, made concrete: Agus brings a portable GPU and serves a small model in the room — no queue, no tunnel, no account, data never leaves the room.
- What it takes to run one: the VRAM arithmetic (parameters × bytes-per-parameter, before context), quantization and its cost to structured output (i.e. to tool calling), and the two families of runtime — local/single-user (llama.cpp, Ollama) vs. serving (vLLM, SGLang). The distinction has a real referent rather than being hypothetical: CCAD runs **vLLM** behind its gateway because it serves many users and needs batching, while the optional local track runs **llama.cpp** because one student is one user.
- The OpenAI-compatible endpoint as the interoperability story: why a harness can point at a different model by adding a provider to its config. This is the technical bridge from Tier 5.
- **The inference gateway.** CCAD is reached through a **LiteLLM** proxy exposing an OpenAI-compatible endpoint, and Pi gets there with a provider entry in `~/.pi/agent/models.json` — no SSH, no scheduler, no tunnel. Swapping the model is a config file. Two things that fall out of it and are worth teaching: the context window turns out to be a startup parameter somebody chose (server-side here, chosen by the student with `-c` in the local track), and **a gateway is also a third party** — "runs on UNC hardware" is not the same as "nobody sees my prompts".
- HPC mechanics, framed as **what the gateway abstracts away**: login node vs. compute node, the job scheduler (you describe a job and wait your turn), modules/environments, reaching a service on a node with no public address, shared-resource etiquette. The ops burden didn't disappear — it just wasn't the student's.
- **CCAD (Centro de Computación de Alto Desempeño, UNC)**: what it is, what hardware exists, and how a student gets an account. Guest intro by Ale Silva. Most students don't know UNC runs an HPC center they can use — arguably the highest-value practical takeaway of the course, independent of AI.
- Supply chain and self-hosting risk: what you trust when you download multi-gigabyte binary weights; how self-hosting removes a third party and adds you as the operator.
- When open source is the right call: sensitive data, cost-dominated volume, research reproducibility, offline work, studying the model itself — versus wanting the best coding agent today with no ops capacity.

### Cross-cutting: Security & Trust (woven throughout)
Not a dedicated session, but surfaced where relevant:
- **Session 1**: security issues found during code analysis (common vulnerabilities in AI output)
- **Session 2**: reviewing code with a security lens, what to look for
- **Session 3**: sandboxing, permission models, why tools have allowlists/denylists
- **Session 4**: none dedicated — trust boundaries, prompt injection and supply chain moved out of this session and **landed in Session 5**, which now closes the thread with a block of its own
- **Session 5**: the block that closes the thread. Threat models (prompt injection from repo content, malicious extensions/skills/MCP servers, the agent's own destructive mistakes, credential exfiltration), permission models as a design space, and the sandbox ladder. Placed after the hands-on so it lands on an extension they just wrote and installed themselves.
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
- **Announce the Session 5 demo hour**: the project they start today gets shown to the room in the second-to-last class. Volunteers, 5-7 min each, no deliverable and no grading. Announcing it on day one is the point — it changes how they work for six weeks. Reminded in Session 4's closing.
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

**Recap & debrief from Session 1 (~12 min)**
- Discussion, not slides. The material comes from the homework ("keep vibe coding until it gets away from you, and write down when"); Session 1's in-class reality check was only ~12 min on 15 min of building
- Collect the moments it got away from them, onto the board. Ask who broke the no-reading rule, and what made them
- Don't close with a conclusion — the board is raw material for the next block, which supplies it

**What we're doing today (~8 min)**
- Takes what's on the board and orders it. First the diagnosis, as diagnosis and not scolding: **you don't know what you shipped** (comprehension debt, compounding because each new feature rests on something you don't understand); **the bottleneck moved** from writing code to verifying it, and skipping verification defers the cost rather than saving it; **the first 80% arrives on its own and the last 20% is all the work** — exactly the part that needs understanding
- Then the three moves that are the skeleton of the day and of the rest of the course: **plan** (decide before it's built, while changing your mind costs a sentence instead of a refactor), **document** (the plan lives outside the agent's head and yours — a file you can read, annotate, version and show; a plan that only exists in a conversation can't be reviewed), **design** (the decisions that matter are yours; the agent executes — when the agent designs by default you get last week)
- Closes on the session's line: *"Hoy no vamos a escribir menos código. Vamos a saber qué código escribimos."* Plus the honest warning that today will feel slower, and that's the point

**Setup (~5 min)**
- `pi install npm:@plannotator/pi-extension` and `pi install npm:pi-subagents`, everyone together, before any theory. Asked for as pre-work, but don't assume. Doing it here means an hour of theory to unblock stragglers instead of losing build time

**Git as your safety net (~5 min)**
- A spectrum tied to context, not a rigid workflow: solo on your repo, `main` is fine; in a team, branches; parallel work, worktrees. AI doesn't change git, it just makes throwing the branch away cheaper
- The reviewed diff is the gate before merging. Matters more than usual today, because the hands-on has students executing an agent-written plan step by step

**Planning: theory + demo (~18 min)**
- The plan always exists; the only question is whether you can read it. Pi has no built-in plan mode, so the extension *is* plan mode and the plan is a file from the first moment
- The harness enforces the discipline: planning mode swaps the toolset to read/search, blocks destructive commands, restricts writes to the plan file. You cannot skip ahead
- **Demo (~12 min)**: `pi --plan` → checklist → **deny with annotations** → Plan Diff → subagent reviews the plan → approve and execute. The diff it leaves behind is the material for the next demo
- Decomposition is folded in: the plan is already a checklist. Point at it, don't teach a rubric

**Review: theory + demo (~12 min)**
- The spectrum of review surfaces, not a checklist: watch+steer, read in editor, `git diff`/hunk, `/plannotator-review`, delegate to a subagent
- **Demo (~8 min)** on the diff the planning demo produced: `/plannotator-review`, annotate a concrete line, send it back. Closes on *"does this match the plan you approved?"* — the most useful review question, and one you can only ask because the plan is written down

**Tests as guardrails (~5 min)**
- Test-first development. Delegate the runner setup, never the assertion

**Hands-on (~40 min)**
- Rules invert from Session 1: nothing executes without a written plan; **reject the first plan**; read every diff; read broken code yourself before asking for a fix
- Pick a small feature (4-5 files max), enter plan mode, iterate the plan through deny-with-annotations
- Write one test yourself before executing; have the agent set up the runner if there isn't one
- Execute the plan step by step, steering when it drifts
- Review the diff via `/plannotator-review`; commit the plan file alongside the code
- Debugging has no theory block — it's said while walking the room: read the code yourself before asking for a fix

**Reflection & Discussion (~10 min)**
- Compare with Session 1: what changed? Did the annotated plan surface something you'd missed?
- What was the overhead? Was it worth it? (For a small feature, honestly: maybe not. Let them say so.)
- Homework for Session 3: where did the flow feel like pure ceremony, and what did you have to explain to the agent more than once? The second question sets up Session 3's `AGENTS.md` material.

### Session 3: Tooling & Skills

**Recap & Sharing (~15-20 min)**
- Show-and-tell: how did planning and review change the work?

> Students arrive with **Pi plus the Plannotator and `pi-subagents` extensions** (Sessions 1 and 2). No setup block here. `AGENTS.md` is introduced here from scratch — neither Session 1 nor Session 2 touches it.

**Theory: "Teaching The Agent" (~20-30 min)**
- Tools: the unit of agent capability. What a tool definition looks like (name + schema + handler), how the LLM decides which to call, examples from Pi's built-in toolbelt. Why a smarter tool often beats a smarter model.
- Harness: the program that wraps the LLM. Pi's responsibilities — context window management, tool execution, permissions, extension points. Quick comparison with Claude Code / Cursor / Aider / OpenCode so students see that "harness" is a real design space, not just "the UI."
- Custom instructions: `AGENTS.md` as the agent's persistent memory — from the ten-line version they wrote in Session 2 to one that actually shapes behaviour, plus loading order across directories and rules files
- Skills and slash commands: building reusable capabilities
- MCP and external tools: how external services plug into the harness as new tools — the agent's capabilities grow at runtime
- Documentation tools (e.g. context7, context-hub): why accurate docs matter — the AI hallucinates APIs, context7, context-hub fixes that
- Subagents: **named, not taught** — the third row of the always-loaded vs. on-demand table is left open and handed to Session 4
- Security sidebar: sandboxing, permissions, allowlists

**Hands-on (~1.5 hours)**
- Write your first `AGENTS.md` and make it real: coding style, patterns, constraints, verification commands. Start from what you had to repeat to the agent during Session 2's homework
- Create a custom skill or command for a repeated task
- Set up an MCP tool or external integration
- Try a documentation tool (context7, context-hub): ask the agent to look up a library you're using — compare the output with and without it

**Reflection & Discussion (~15-20 min)**
- How did the agent's behavior change with instructions?
- What surprised you about the tooling capabilities?

### Session 4: Context Engineering

> Materials in `sessions/session-4/` (instructor notes, deck, exercise), all in Spanish. The session interleaves explanation and practice per block instead of one long hands-on. Documentation replaces spec-driven development as the spine.

**Recap (~10 min)**
- Skills show-and-tell: new skills built or found during the week
- Open questions left from Session 3

**Framing (~5 min)**
- Building on planning (Session 2) and configuration (Session 3): project documents that feed the plans and record the decisions for the long run
- Cognitive debt and cognitive surrender, introduced here and returned to in the closing
- The session's phrase: "documentar es pensar antes de construir"

**Two domains (~15 min)**
- One feature described twice: adding multi-user support to the task list (the Session 1 brief, same project as Session 3's demo)
- Problem domain: the need, detailed with actors, data and relations, and processes, in problem terms
- Solution domain: the system, detailed with data diagrams, breadboards or page sketches, and flows — one of many possible solutions
- Same problem, many solutions; starting from the solution means deciding shallowly and inheriting the agent's average answer
- The distinction matters with or without AI (requirements vs. design)

**Document what you already built (~30 min: ~5 templates + ~25 work)**
- Two templates, committed to the repo: `docs/PROJECT.md` (what the project is, main goal, constraints) and `docs/features/<name>.md`, one per feature (the problem it solves, then a design section with the model and one flow per interaction — each flow carries its screens, steps, rules and decisions with their reasons)
- Templates, not forms: each project adapts them. `AGENTS.md` points to these docs
- Interactive drafting: the agent explores code, commits and past plans, shows a draft, and asks what it can't know — the problem and the whys; the student answers

**Break (~5 min)**

**Document the next feature and implement it (~40 min: ~5 explanation + ~35 work)**
- The feature from Session 3's homework, the one that doesn't fit in one sentence — a new feature, or a change to an existing one (extending that feature's doc)
- Interrogation before drafting: ask the agent to question you (Matt Pocock's grill-me skill); the doc gets written once the decisions are made
- The doc stays high-level: context7 to understand libraries, implementation details go to the plan
- The chain: doc → plan (Plannotator) → implement → review against both the plan and the doc
- Optional aside for fast students: parallel agents (subagents, worktrees) with the docs as shared ground truth

**Closing (~15 min)**
- What changed when the agent had the doc?
- Cognitive debt and surrender, revisited with the class's own experience
- When NOT to use AI: skill atrophy, "don't use AI as a crutch" (MIT Missing Semester)
- Ownership: understand, decide, discuss, maintain
- Name the transition: the next two sessions take the machine apart
- Remind them of the demo hour that opens Session 5 — this is the last class before it
- Homework: keep the docs alive during the week; note when they helped and when they went stale against the code

### Session 5: Coding Harness (internals)

> Materials in `sessions/session-5/` (instructor notes, deck, exercise), all in Spanish. **Nothing gets installed** — the only session in the course with no setup risk, because today's material is Pi itself: its docs and its example extensions, both already on every student's machine.
>
> **This session runs 2 h 30** (every other session but the first is 2): it opens with a **60-minute demo block** where students show the project they have carried since Session 1. Announced in Session 1, reminded in Session 4's closing. To pay for it, the theory stays intact and the extension-writing hands-on **moves to homework** — only its Paso 0 stays in the room.
>
> This session opens the advanced arc. The four base sessions each add a layer of structure; this one does not have to. The course closing belongs to Session 6, so there is no farewell here.

**Demo de proyectos (~60 min)**
- Opens the session. Volunteers, ~8 turns of 5-7 min (4-5 showing, 2 of questions), at the projector, each one opening their own repo. Not a deliverable, not graded.
- What they show: the project carried since Session 1 — and not only *what* they built but **how**: Session 2's plan, Session 3's `AGENTS.md` and skills, Session 4's docs. The question repeated every turn: *"what did you decide and what did the agent decide?"*
- **Session 4's recap lives inside this block**, with no slot of its own: where did a doc help, and where did it go stale against the code? Asked of each person who presents.
- **The elastic block**, the role the recap used to hold: if the day runs long, turns get cut. Plan B if fewer than eight hands go up: we pick, or the block shrinks.

**Qué vamos a ver hoy (~3 min)**
- Five weeks driving the tool. Today we open it.
- The framing that has to survive the whole session: *"we did not come to learn Pi. We came to see what problems any harness has to solve, using the one we can open."*

**What a harness is, and the others (~10 min)**
- The layer diagram, revisited from Session 1 in thirty seconds rather than rebuilt.
- The other harnesses as four axes, not a table: open vs. closed, built in vs. added, how far you can extend, who controls the system prompt. Each one is a decision somebody made.

**The loop, and Pi's parts (~14 min)**
- The densest block of the day; rehearse it against a clock. The loop is built on screen, not shown whole.
- Every moment is subscribable. `tool_call` → `{ block: true }` pays off the plan-mode thread from Sessions 2 and 3 for the third and last time.
- The four packages, base to surface, and the line that you use only the layers you need.

**The session tree, and steering vs. follow-up (~7 min)**
- Two quick looks, not two blocks. The tree explains why `/tree` costs nothing. Steering is the general question of when a message reaches a running agent.

**Break (~5 min)**

**Three ways to give a model a tool, and subagents (~13 min)**
- The most transferable block in the session, and not about Pi. Extension, CLI, MCP, and the question that decides between them.
- Subagents as mechanism, since Session 4 owns the use case. A ~200-line extension is the mechanism; the rest is product.

**Compaction (~7 min)**
- The trigger in one line, the algorithm in four steps, the before/after diagram of the entry array. Lossy, another model call, and interceptable.

**Abrí tu sesión, y la tarea de la semana (~10 min)**
- ~5 min **in the room**: reading their own session file (`~/.pi/agent/sessions/`, JSONL): `id`/`parentId` pairs, a branch point, and a compaction entry if anyone has one — project it. This is the only step of the exercise that needs the room, and it is the payoff of the tree and compaction blocks.
- ~5 min briefing **the homework**: the menu (a `/command`, a tool wrapping a CLI, a hook, a widget), the three rules, and where it installs. They pick one target and **direct the agent to build it** during the week, installed in `.pi/extensions/`, iterated with `/reload`.
- **TypeScript is not assumed**, which was the constraint Session 3 named. The exercise is direction, not typing, and it points everything the course has taught at the harness for the first time.
- The agent will hallucinate Pi's API. That is expected, it is the point, and it gets fixed the Session 4 way, with the docs in context — but now it happens at home, with nobody walking the room, so noticing it becomes the first question of Session 6's recap.

**Run modes (~4 min)**
- Interactive, headless, embedded, behind a protocol. The loop is a library; the terminal is one interface.

**Security (~9 min)**
- Threat models, permission models, the sandbox ladder, and Pi's deliberate absence of a sandbox.
- **Placed late on purpose.** They have been installing extensions since Session 2 and are about to write and install one of their own, alone, during the week; only then do they learn it runs with their full permissions, as Pi's own docs state. ⚠️ The staging changed with the hands-on moving to homework — Agus's call on how to re-land the punchline.

**Closing (~5 min)**
- What surprised you about opening the machine? None of what we saw today is Pi's; Pi is where we could look at it.
- Homework: **write the extension** (the full exercise, at home), then keep it alive during the week, note what you had to fix and whether you used it again, and **bring it** — Session 6 uses it.

> **Handoff to Session 6, changed.** The earlier design assumed students left here with a hand-written client to point at another model. ~~That dependency~~ → **no client comes out of this session.** What comes out is an extension, which serves Session 6 better: its opening recap can ask what they wrote and whether it survived the week, and its closing thesis is that everything they built survives the model swap. The extension included. **One consequence of the demo reshuffle**: the extension is now written at home, so part of the room may arrive without one, and Session 6's opening recap needs a path for those students.

### Session 6: Open Source Models & Running on CCAD

> 🔴 **TO REVIEW** — Claude-generated, not yet reviewed by Diego.

Owner: Diego. Guest: **Ale Silva (CCAD)**. Goes last because it lands better after Session 5 — students who wrote their own loop already believe the model is swappable — but it no longer *depends* on it.

> **The vehicle is a gateway, not a cluster login.** CCAD is exposed as a **LiteLLM** proxy with an OpenAI-compatible endpoint (`vllm/gemma4-26b`), and Pi reaches it with a provider entry in `~/.pi/agent/models.json`. The GPU queue — previously flagged here as the session's biggest risk — is out of the picture entirely.

**Recap & Sharing (~10 min)**

**Guest: intro to CCAD (~20-25 min)**
- Ale Silva on the Centro de Computación de Alto Desempeño: what it is, who it serves, what hardware exists, how a student gets an account, what HPC is normally used for at UNC. Scope to be agreed with him. If he's willing, the gateway from the inside: why CCAD put a proxy in front of the cluster and what it solves.

**Theory: "The Model Is a Component" (~45 min, split around the hands-on)**
- **Open source vs. open weights**: the binary, not the recipe. Nearly everything marketed as open-source AI is open weights.
- **Licences**: Apache 2.0/MIT vs. bespoke licences with usage and scale restrictions vs. restrictions on the output. Can I use it commercially, redistribute a fine-tune, and who owns the generations? Concrete rather than hypothetical: the model they'll use is a Gemma, so a bespoke Google licence.
- Open weights vs. hosted APIs: the control spectrum. The **middle column** — open weights on someone else's GPU — is what the gateway is, and it's the day's default.
- What it takes to run one: VRAM arithmetic (26B × 2 bytes ≈ 52 GB explains by itself why it lives at CCAD), quantization, local vs. serving runtimes, the OpenAI-compatible endpoint.
- **`models.json`: the model as config** — the block the session turns on. Walk the provider entry field by field: `api: openai-completions` as the interoperability story typed out, `apiKey` as an env var and never a literal, and `contextWindow` as a number somebody chose.
- **Demo: Agus's portable GPU** serving a small model live — the "your own hardware" column made physical, and the visible face of the optional local track. No longer the fallback endpoint: the gateway is more reliable than a laptop.
- HPC mechanics, as what the gateway abstracts away: login vs. compute node, the scheduler, why an inference gateway exists at all, shared-resource etiquette.
- Security sidebar: model supply chain, self-hosting as operator responsibility, and **the gateway as a third party** — ask in the room whether it logs prompts, even without the answer.
- *After* the hands-on: **is it good enough to be the engine of a serious project?** — answered from their own measurements (schema-respecting tool calls, 20-step tasks, context window, latency in the loop), then when open source is the right call. Both deliberately placed once students have felt the ops burden.

**Hands-on (~50-55 min), in two tracks**
- **Track A, everyone (~25-30 min)**: add the CCAD provider to `models.json`, pick the model with `/model`, and run a multi-step task **in their own repo with their own `AGENTS.md` and skills from Session 3** — then the same task on the hosted model, and compare tool-call validity, turns taken, hallucinated names, latency. Nothing here can be lost to a queue, so everyone finishes.
- **Track B, optional (~20-25 min)**: serve a small quantized model locally with `llama.cpp` and compare three ways. This is where the ops burden gets felt, and nobody's outcome depends on finishing it.
- **Extension** for whoever finished Session 5: point their own loop at the same endpoint. One base URL, no tunnel.

> **Timing doesn't fit.** The full plan runs ~2 h 50 against a 2 h slot. `sessions/session-6/INSTRUCTOR.md` carries a worked 117-minute variant (Track B becomes a written appendix, Agus's demo moves inside the hands-on) and a protect-list: the guest slot, Track A with its comparison, and the closing retrospective.

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

- Exact session duration (2h vs 3h) — **Session 1 is 3 h and Session 5 is 2 h 30** (it opens with an hour of demos), the rest are 2 h. Confirm the room allows it.
- ~~Claude Code vs alternatives~~ → **decided: Pi is the course tool.** Terminal-based, minimal, standard `AGENTS.md`.
- ~~Session 2 is written against Claude Code and misaligned with the Pi decision~~ → **resolved: Session 2 runs on Pi.** Planning and review go through `@plannotator/pi-extension`, which adds file-based plan mode (`pi --plan`) and `/plannotator-review` to Pi. One harness for the whole course; students install two extensions at the start of Session 2.
- ~~`pi-subagents` package is unpinned~~ → **decided: the unscoped `pi-subagents`** (`pi install npm:pi-subagents`), installed by students at the start of Session 2. There are at least six forks on npm (`@tintinweb/`, `@gotgenes/`, `@yassimba/`, `@nklisch/`, plus bridges) — the course standardizes on one. **Confirm with Agus** before Session 4 builds on it — the subagents block is his now, so it stays installed from Session 2 and unused until then.
- API keys: provide them or have students set up their own?
- Pre-work: should students come to Session 1 with a project idea already?
- ~~Do we want a final deliverable (repo + reflection) or is the journey enough?~~ → **half-answered: Session 5 opens with an hour of demos.** There is a public moment, but no deliverable and no grading — showing is voluntary. Still open: whether Session 6's retrospective wants a written reflection to go with it.
- LLM fundamentals block: include or skip depending on group assessment?
- Does the extension-course format actually allow 6 weeks? Confirm before announcing.
- ~~**Session 5 tooling prerequisites**~~ → **resolved: nothing.** The hands-on runs on Pi as they already have it, and its material (docs and example extensions) ships with the install. No new package, no raw API access, no keys to provision. It is the only session in the course with no setup risk.
- ~~Session 6 needs CCAD accounts provisioned in advance~~ → **no longer blocking.** The hands-on authenticates with an API key against the gateway. Keep recommending accounts weeks ahead — it's a takeaway that outlives the course and the door to real cluster work — but confirm with Ale whether the key is independent of an account.
- ~~Session 6 hands-on is hostage to the GPU queue~~ → **resolved by the gateway.** The replacement risk is **concurrency**: 25-30 students hitting one LiteLLM endpoint for an hour. Confirm rate limits, and decide how keys are handed out (one shared course key, or one per student?).
- **Session 6 needs slides and an exercise written from scratch.** The originals were built against the cluster hands-on and were deleted rather than patched; only `INSTRUCTOR.md` exists.
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
- **Pi's own docs, which ship with the install** — the primary source for this session and already on every student's machine: `extensions.md`, `compaction.md`, `sessions.md`, `session-format.md`, `security.md`, `sdk.md`. Online at [pi.dev/docs](https://pi.dev/docs/latest/).
- **`examples/extensions/`** — around eighty example extensions, also shipped with the install. They are the reading material for anyone who finishes the hands-on early, and the source of half the theory's examples. The ones this session uses: `subagent/`, `custom-compaction.ts`, `permission-gate.ts`, `protected-paths.ts`, `tool-override.ts`, `truncated-tool.ts`.
- [Mario Zechner: *The Pi coding agent*](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/) — Pi's own author writing about the agent the course runs on. The harness taken apart by the person who built it, which is exactly this session's move.
- [Mario Zechner: *What if you don't need MCP?*](https://mariozechner.at/posts/2025-11-02-what-if-you-dont-need-mcp/) — already on Session 3's list; it returns in the three-ways-to-give-a-tool block. Worth naming that the person who wrote the harness we are opening thinks a CLI is often enough.
- [Sebastian Raschka: *The Components of a Coding Agent*](https://magazine.sebastianraschka.com/p/components-of-a-coding-agent) — cited in Session 1 as instructor prep. Its components 4 and 5, context reduction and session memory, are this session's material.
- The BeerJS talk *"Pi, the self-building agent"* (2026-06-25, Agus) — the source of the layer diagram, the loop diagram, the package diagram and the subagents extension shown in class.

### Session 6 — Open source models & HPC
- **CCAD's inference gateway** — `https://litellm.ccad.unc.edu.ar`, OpenAI-compatible, model `vllm/gemma4-26b`. The vehicle for the hands-on. The API key is handed out in class and **never committed**; course material uses `$CCAD_API_KEY`.
- [Pi — models & custom providers](https://pi.dev/docs/latest/models) — `~/.pi/agent/models.json`, re-read every time `/model` opens. `api` accepts `openai-completions`, `openai-responses`, `anthropic-messages`, `google-generative-ai`. `apiKey` accepts `$VAR` / `${VAR}` and `!command`. Defaults: `contextWindow` 128000, `maxTokens` 16384.
- [Pi + llama.cpp](https://pi.dev/docs/latest/llama-cpp) — the optional local track. `/login llama.cpp` → `/llama` → `/model`.
- [LiteLLM](https://github.com/BerriAI/litellm) — the gateway/proxy pattern for inference, and what the `vllm/` prefix in the model id comes from.
- [CCAD — Centro de Computación de Alto Desempeño, UNC](https://supercomputo.unc.edu.ar/ccad/) — created by Ordenanza HCS 18/2010; serves UNC faculties, the Astronomical Observatory, and external research organizations
- [CCAD wiki / documentation](https://wiki.ccad.unc.edu.ar/) — the reference for cluster usage
- [Opening a CCAD account](https://wiki.ccad.unc.edu.ar/empezar/abrir-cuenta.html) — SSH keys → request form → credentials by email
- [CCAD equipment](https://supercomputo.unc.edu.ar/equipamiento/) — active clusters: Boogie (2025), Gordito (2025/2026), Mendieta Fase 2 (2022), Serafín (2021), Eulogia (2018/2021), Mulatona (2018). Per-cluster specs live on the individual pages and the wiki
- [CCAD services](https://supercomputo.unc.edu.ar/servicios/pedido-de-cuentas/) — account requests, intensive-use requests, user support
- [CCAD status](https://stats.uptimerobot.com/eLhTV5CMni) · [dashboard](https://stats.ccad.unc.edu.ar/) — check before class
- Guest: **Ale Silva** (CCAD) — intro to the center. Details in the email thread; see `sessions/session-6/INSTRUCTOR.md` → *Pendiente de Ale*
