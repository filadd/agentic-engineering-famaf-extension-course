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
2. **AI-Assisted Coding** — copilot-style completions, developer maintains control
3. **Directed AI Assistance** — experienced use of LLMs with constraints, specs, and review
4. **Agentic Coding** — orchestrating AI agents on tasks with oversight
5. **Agentic Engineering** — full discipline: specs, quality gates, multi-agent coordination, accountability
    1. [https://simonwillison.net/guides/agentic-engineering-patterns/](https://simonwillison.net/guides/agentic-engineering-patterns/ )
   

## Key Thesis

Vibe coding is a great on-ramp — fast, fun, empowering. But professional software development demands accountability: security, maintainability, correctness. The course shows *why* each level of structure matters by letting students experience the failures firsthand before introducing the solutions.

**Core mental model: "Managing a smart intern."** The AI is like a capable but inexperienced developer — fast, eager, produces a lot of output, but needs clear direction, regular review, and someone who understands the big picture. You wouldn't accept an intern's code without reading it. You wouldn't let an intern architect your system. The same applies here. This framing recurs throughout the course: each session adds a layer of "management skill" for your AI intern.

## Format

- **4 sessions**, 1 per week, ~2-3 hours each
- Each session: theory → hands-on → show-and-tell discussion
- **Same project across all 4 sessions** — students see their codebase evolve
- Students bring their own project idea; default fallback is a small web app
- Tool: Claude Code (leaning toward, TBD)
- Class size: ~20-30 students

## Topic Inventory

These are the concepts to cover, roughly ordered by complexity:

### Tier 1: Fundamentals
- The AI-assisted coding spectrum (overview)
- (Conditional) LLM fundamentals: how they work at a practical level — tokens, context windows, probability, why hallucinations happen.
- Vibe coding: prompt-and-accept workflow. Talk with the agent, don't open files — focus entirely on the output.
- Analyzing AI output: what did it actually produce?
- Code quality awareness: dead code, inconsistent patterns, missing tests
- Comprehension debt: you shipped code you don't understand
- The productivity illusion (METR study, CodeRabbit data)

### Tier 2: Planning & Review
- Code review of AI output (reading diffs, understanding changes)
- Task decomposition: breaking work into reviewable units
- Plan mode: planning before executing
- Structured planning & review (plannotator): externalizing, annotating, and reviewing plans and generated code as first-class artifacts
- Testing: test-first development, tests as guardrails
- Debugging AI-generated code
- Git workflow with AI (branching, reviewing diffs, reverting)

### Tier 3: Tooling & Skills
- Custom instructions (CLAUDE.md basics, rules files)
- Skills / slash commands: teaching AI reusable behaviors
- MCP / external tools: extending what the agent can access
- Documentation tools (e.g. [context7](https://context7.com/), [context-hub](https://github.com/andrewyng/context-hub)): fetching up-to-date library docs so the AI works with accurate references instead of guessing
- Subagents: delegating subtasks to specialized agents — intro to the concept and available agent types
- Worktrees: isolated parallel execution

### Tier 4: Context Engineering
- Spec-driven development: defining WHAT before prompting HOW — specs as context for the AI
- Research-driven development: using documentation tools (context7, context-hub) to ground the AI in accurate, current docs before implementing
- Subagent orchestration in practice: using agents for code review, doc research, exploration — not just implementation
- Deep context engineering: shaping AI behavior through project structure and documentation
- Full workflow integration: spec → research → tests → implementation → review
- When to delegate vs. intervene (developing intuition)
- Professional accountability: you sign off on what the AI produces
- The spectrum revisited: when is each approach appropriate?

### Cross-cutting: Security & Trust (woven throughout)
Not a dedicated session, but surfaced where relevant:
- **Session 1**: security issues found during code analysis (common vulnerabilities in AI output)
- **Session 2**: reviewing code with a security lens, what to look for
- **Session 3**: sandboxing, permission models, why tools have allowlists/denylists
- **Session 4**: trust boundaries, prompt injection awareness, supply chain risks with agents

## Proposed Sessions

### Session 1: The Vibe Coding Experience

**Intro (~30 min)**
- What is AI-assisted coding? Brief tour of the spectrum
- (Conditional) LLM fundamentals: how they work, tokens, context windows, hallucinations
- Set expectations: today we start at the shallow end on purpose
- Introduce project briefs (or students pitch their own)

**Hands-on: Pure Vibe Coding (~1.5-2 hours)**
- Rules: talk with the agent, describe what you want — don't open files to see the code
- Focus entirely on the output: does it look right? Does it work?
- Iterate by describing problems, not by reading the code
- Goal: get a working (or "working") prototype

**Analysis & Discussion: "The Reality Check" (~30 min)**
- Now open the files — what did the AI actually produce?
- Group discussion: identify patterns — what's good, what's concerning?
- Surface common issues: no tests, security holes, dead code, inconsistent patterns
- The productivity illusion: METR study (19% slower despite feeling 20% faster), CodeRabbit (1.7x more issues)
- Agent failure modes to watch for: cascading errors (one bad assumption compounds), false success reporting (AI says "tests pass" but modified the assertions to match), scope creep (the agent over-solved the problem)
- The 80% problem: AI handled most of the work fast, but the remaining rough edges are where the real effort lives — and that's where understanding the code matters
- Key question: "Would you ship this? Would you maintain this?"

### Session 2: Planning & Review

**Recap & Sharing (~15-20 min)**
- Show-and-tell: what happened since last session? Anyone explore their code more?

**Theory: "Working With Intent" (~20-30 min)**
- Why code review matters more with AI (verification bottleneck, comprehension debt)
- Task decomposition: breaking work into reviewable units
- Plan mode: think before you execute — the agent plans, but the plan lives inside the agent's context
- Structured planning & review (plannotator): externalizing the plan — annotate, review, refine before executing. Also works for reviewing generated code: walk through the output step by step, annotate issues, approve or request changes. The plan (and the review) become first-class artifacts you can read, edit, and sign off on
- Test-first development: tests as guardrails for AI output
- Git as your safety net: branching, reviewing diffs, reverting

**Hands-on (~1.5 hours)**
- New rules: plan your work, break it into tasks, review every change
- Use plan mode to decompose the next feature — feel the difference vs. Session 1
- Try structured planning (plannotator): create an externalized plan, annotate it, review it — compare with the built-in plan mode experience
- Use plannotator to review generated code: walk through the output, annotate issues, approve or iterate
- Write tests first, have the AI implement to pass them
- Review diffs, use git to track changes
- Debug when things break — understand *why*, not just fix it

**Reflection & Discussion (~15-20 min)**
- Compare experience with Session 1: what changed?
- What was the overhead? Was it worth it?
- Security sidebar: what vulnerabilities did you catch (or miss) during review?

### Session 3: Tooling & Skills

**Recap & Sharing (~15-20 min)**
- Show-and-tell: how did planning and review change the work?

**Theory: "Teaching The Agent" + "Parallel Execution" (~20-30 min)**
- Custom instructions: CLAUDE.md as the agent's persistent memory
- Skills and slash commands: building reusable capabilities
- MCP and external tools: connecting the agent to the world
- Documentation tools (e.g. context7, context-hub): why accurate docs matter — the AI hallucinates APIs, context7, context-hub fixes that
- Subagents: intro to the concept — different agent types for different tasks (research, exploration, code review). Not deep usage yet, just "these exist and here's what they do"
- Worktrees: delegating and parallelizing work
- Security sidebar: sandboxing, permissions, allowlists

**Hands-on (~1.5 hours)**
- Write a CLAUDE.md for your project (coding style, patterns, constraints)
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
- Subagent orchestration in practice: different agents for different jobs — research agents for exploring docs, review agents for catching issues, exploration agents for codebase search. Not just "make it build things"
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

**Closing Discussion (~20-30 min)**
- Retrospective: compare your codebase across all 4 sessions
- The spectrum revisited: when is each approach appropriate?
- Cost and token awareness (brief): AI tools aren't free — model tiering (fast/cheap vs slow/powerful), why context engineering saves money too, not just quality. Think of tokens as a budget, not an infinite resource
- When NOT to use AI: recognizing limitations, avoiding overreliance, the skill atrophy risk. AI amplifies expertise — if you don't have the fundamentals, it amplifies confusion. "Don't use AI as a crutch" (MIT Missing Semester)
- Career implications: what skills matter in an AI-augmented world?
- Key takeaway: AI tools amplify expertise — invest in fundamentals

## Progression Arc

The arc follows a clear logic (and mirrors growing from a hands-off boss to an effective engineering manager):

1. **No structure** → experience the chaos, see what breaks ("just tell the intern what to build, don't check on them")
2. **Human process** → add your judgment: plan, review, test, debug ("start doing stand-ups and code reviews")
3. **Tool leverage** → use the tool's capabilities to scale your judgment ("give the intern better tools and clear documentation")
4. **Context shaping** → engineer the AI's environment (specs, project context, documentation) so it produces better output by default ("build a team culture where good work happens by default")

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

- Exact session duration (2h vs 3h)
- Claude Code vs alternatives (CC requires terminal comfort, but matches the agentic depth we want)
- API keys: provide them or have students set up their own?
- Pre-work: should students come to Session 1 with a project idea already?
- Do we want a final deliverable (repo + reflection) or is the journey enough?
- LLM fundamentals block: include or skip depending on group assessment?

## References & Inspiration

- [MIT Missing Semester 2026: Agentic Coding lecture](https://missing.csail.mit.edu/2026/agentic-coding/) — full lecture content, exercises, and tool walkthroughs
- [Addy Osmani: "Agentic Engineering"](https://addyosmani.com/blog/agentic-engineering/) — defines the discipline, "managing an intern" framing, skill atrophy warnings
  - [Simon Willison: "Agentic Engineering Patterns"](https://simonwillison.net/guides/agentic-engineering-patterns/)
- [Simon Willison: "Vibe Engineering"](https://simonwillison.net/2025/Oct/7/vibe-engineering/) — analysis of vibe coding and the case for discipline (search for "vibe coding" posts)
- [OWASP Top 10 for Agentic Applications (2025)](https://genai.owasp.org/resource-center/security-guides/owasp-top-10-for-agentic-applications-the-benchmark-for-agentic-security-in-the-age-of-autonomous-ai/) — ASI01-ASI10: goal hijack, tool misuse, rogue agents, cascading failures
- [OWASP GenAI Security Project](https://genai.owasp.org/) — broader LLM security resources, supply chain risks, prompt injection
- Karpathy's progression from coining "vibe coding" to proposing "agentic engineering" — [original vibe coding tweet/thread (Feb 2025)](https://x.com/karpathy/status/1889105372806840545)
- METR: "Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity" — [metr.org](https://metr.org/) (devs 19% slower with AI despite feeling 20% faster)
- CodeRabbit: AI co-authored code has 1.7x more major issues — [coderabbit.ai](https://coderabbit.ai/)
- Udemy: "The Complete Course on Coding Agents" by Nikolai Schuler & Jagger Bellagarda — [Udemy search](https://www.udemy.com/courses/search/?q=coding+agents+claude+code)
- ICSE 2026 AGENT Workshop — academic research on agentic software engineering
- The 80% Problem in Agentic Coding (vault: Reading_List/Queue)
