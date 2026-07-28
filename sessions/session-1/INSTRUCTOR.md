# Session 1 — The Vibe Coding Experience (Instructor Notes)

> 🔴 **TO REVIEW** — this file was Claude-generated and has **not** been reviewed by Diego yet.
> Treat every claim, timing, and pedagogical choice as a proposal, not a decision.

> Owner: Diego. Status: shaping. Audience-facing materials live alongside this file (slides.md, exercise/README.md) and are in Spanish. These notes are for the instructor in English.

## Session goal (in one sentence)

Students leave having **built something real without reading a single line of it** — and having seen, in their own code, why that doesn't scale.

The session deliberately ends on discomfort, not on a solution. Sessions 2–4 are the solutions.

## Audience & assumptions

- Heterogeneous — 1st year through graduates. Teach to the middle, entry points for beginners, depth for advanced.
- **This is the first session**: no recap, no shared vocabulary yet. Everything the later sessions lean on (tool, harness, agent, context) gets planted here.
- **Setup risk is the main risk of the day.** Claude Code + API access + a runnable project, for 20-30 people, in one room. Assume this eats time and plan for it (see Open items — pre-work).
- **Terminal comfort varies wildly.** Some students have never used a CLI seriously. Pair them.
- **Project**: students bring their own idea or take a default brief (see exercise/README.md). Either works; the exercise is written generically.

## The framing that carries the whole course

**"Managing a smart intern."** Introduce it here and name it explicitly, because every later session is another layer of management skill:

| Session | Management move |
|---|---|
| 1 | Hand the intern a task, walk away, don't check the work |
| 2 | Start doing plannings and code reviews |
| 3 | Give them better tools and written documentation |
| 4 | Build a culture where good work happens by default |

Today is deliberately the bad boss. Say that out loud so students don't think we're endorsing it.

## Topic-by-topic plan

### The spectrum (~5 min) — opens the session

Five levels, one slide, no depth: vibe coding → AI-assisted → directed → agentic coding → agentic engineering. The point is a **map**, so students know where each session sits. Come back to it in Session 4's closing.

Frame vibe coding positively first — it's a real on-ramp, it's fun, it works for prototypes and throwaway code. The critique lands harder if we didn't strawman it. Karpathy's original tweet is the honest source: he coined it for weekend projects, not production.

### LLM fundamentals (~10 min) — practical, not theoretical

Only what's needed to explain agent failure modes later today:

- **Tokens**: text is chunked; the model sees tokens, not characters. Explains why it miscounts letters.
- **Next-token prediction**: it produces the *plausible* continuation, not the *true* one. This is the root of hallucination — not a bug, the mechanism.
- **Context window**: finite working memory. Everything the agent "knows" about your project is in there, or it isn't.
- **No memory between sessions**: each conversation starts blank.

**Do NOT go into**: architecture, attention, training, embeddings. If someone asks, park it — offer a reference and move on. Calibrate depth to the room; if the group is mostly advanced, compress to 5 min.

### Anatomy of a coding agent (~5-7 min) — planting vocabulary

The three-word model we reuse all course:

- **LLM** — the model. Predicts tokens. Can't do anything by itself.
- **Tool** — a function the model can invoke: read a file, run a command, edit code. Tools are what turn suggestions into actions.
- **Harness** — the program wrapping the LLM: builds the context, dispatches tools, asks for permission. **Claude Code is a harness.**

Best delivery: open Claude Code, run one prompt, and narrate the loop out loud as it happens — "it just called Read, that's a tool; the harness decided to show me a permission prompt; now the model got the file contents back as context." One concrete pass beats a diagram.

Explicitly say: "we'll open all three of these up in Session 3." This is a promise, not a teaser — Session 3 depends on the vocabulary landing today.

### Setup & rules of the game (~5-10 min)

- Claude Code running, project directory created, agent responding.
- **The rules for today** (these matter — read them aloud, they're on the slide):
  1. Talk to the agent. Describe what you want.
  2. **Don't open the files.** Don't read the diffs. Don't peek in the IDE.
  3. If something breaks, describe the symptom, don't diagnose it.
  4. Judge only by the output: does it look right? does it run?
- Expect pushback from the more experienced students — that's a good sign. Ask them to play along for 90 minutes; the payoff is the reality check.

### Hands-on: pure vibe coding (~90-120 min)

Instructor and TAs walk the room. Your job during hands-on is **not** to help them write good code — it's to:

- Unblock setup and environment problems (fast, this is real friction, not pedagogy).
- **Enforce the no-reading rule** gently. Students will drift into the editor out of habit.
- **Take notes for the reality check.** Walk with a list. Concretely collect: who got a security hole, who has no tests, who has three copies of the same function, who has a file the agent rewrote four times. Named examples from the room beat generic slides — get permission before showing someone's code.
- Notice the mood shift. Usually: euphoria for the first 30-40 min, then friction, then frustration around the 60-90 min mark when the agent starts breaking things it previously fixed. That curve *is* the lesson — point at it during the debrief.

### Analysis & discussion: "The Reality Check" (~30 min)

The payoff of the session. Sequence:

1. **"Now open the files."** Give them 5-10 silent minutes to actually read what they shipped. Let the reaction happen without commentary.
2. **Collect from the room** (10 min), don't lecture. Ask "what did you find?" and write it up on the board. Expect: no tests, hardcoded secrets, missing input validation, dead code, duplicated logic, inconsistent patterns, files nobody understands.
3. **Name the patterns** (10 min) — now the theory has evidence behind it:
   - **Comprehension debt**: you shipped code you can't explain. Interest compounds — every future change costs more.
   - **The productivity illusion**: METR — experienced devs 19% *slower* with AI while *feeling* 20% faster. CodeRabbit — 1.7x more major issues in AI co-authored code. Land this only after they've felt it; presented up front it reads as anti-AI FUD.
   - **The 80% problem**: the first 80% arrived in minutes; the remaining 20% is where the effort lives, and that's exactly the part that needs understanding.
   - **Agent failure modes**: cascading errors (one bad assumption compounds silently), false success reporting ("tests pass" — after the agent edited the assertions), scope creep (it solved three problems you didn't ask about).
4. **Close on the question, not an answer**: *"¿Lo subirías a producción? ¿Lo mantendrías por un año?"* Don't resolve it. Session 2 opens on it.

### Security sidebar (~2-3 min, woven into the reality check)

Don't teach a vulnerability taxonomy. Find **one** real hole in **one** student's project (or your own demo, as a fallback) and show it on the projector: a secret in the repo, an unvalidated input, a missing auth check, `eval` on user data. The point is *"the agent produced this and neither of you noticed"* — not OWASP coverage.

Have a fallback ready in case the room's projects are surprisingly clean.

## Session timing (~2.5-3 h)

| Block | Time |
|---|---|
| Intro: the spectrum | 5 min |
| Intro: LLM fundamentals | 10 min |
| Intro: anatomy of a coding agent (live) | 5-7 min |
| Setup + rules of the game + pick project | 5-10 min |
| **Hands-on: pure vibe coding** | **90-120 min** |
| Reality check: open the files (silent) | 5-10 min |
| Reality check: collect from the room | 10 min |
| Reality check: name the patterns | 10 min |
| Closing: would you ship this? + what's next | 5 min |

If time slips, cut LLM fundamentals and the spectrum, not the reality check. **The reality check is the session** — hands-on without the debrief teaches the wrong lesson.

## Cross-session bridges

- **Tool / harness / LLM** → Session 3 (Diego). Vocabulary planted today, opened up there. Whatever wording lands well in class, keep it identical in Session 3's slides.
- **"Would you ship this?"** → Session 2 (Agus). Agus's recap opens on exactly this question. Sync before class: tell him what state students actually end in (working prototype? half-broken? tests at all?) — his exercise framing depends on it.
- **Comprehension debt** → Session 2's verification bottleneck. Same problem, named twice.
- **The spectrum** → Session 4's closing revisits it. Use the same five labels.

## Tools/assets referenced

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) — the harness for the whole course.
- [Karpathy's original vibe coding tweet (Feb 2025)](https://x.com/karpathy/status/1889105372806840545) — the honest framing of the term.
- [METR productivity study](https://metr.org/) — 19% slower, felt 20% faster.
- [CodeRabbit](https://coderabbit.ai/) — 1.7x more major issues in AI co-authored code.
- Default project briefs — see exercise/README.md.

## What we explicitly skipped (and why)

- **Prompting techniques**: teaching good prompting today would undercut the exercise. Woven into later sessions.
- **Any review, testing, or planning practice**: that's the whole point. Session 1 has no guardrails on purpose.
- **Deep LLM theory** (attention, training, embeddings): not needed to explain today's failure modes.
- **OWASP taxonomy**: one concrete hole beats a list. Security depth is spread across Sessions 2-4.
- **A recap block**: nothing to recap in the first session; that time goes to setup.

## Open items (for future iterations)

- **Pre-work decision**: do students arrive with Claude Code installed and an API key working? Strongly recommended — otherwise budget 30 min of the hands-on for setup and accept a shorter build.
- **API keys**: provide course-wide keys or have students set up their own? Unresolved course-wide (see COURSE_PROGRAM.md open questions).
- **Ask students to bring a project idea**? Reduces dead time at the start; the default briefs cover whoever doesn't.
- **Fallback demo project** with known-bad AI-generated code, for the security sidebar if the room's projects are too clean.
- **Ask permission early** to show a student's code on the projector during the reality check — mid-debrief is an awkward time to ask.
- Confirm session length (2h vs 3h). At 2h the hands-on drops to ~75 min and the euphoria→frustration curve may not complete — which weakens the debrief.
