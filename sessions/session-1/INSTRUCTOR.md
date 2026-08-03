# Session 1 — The Vibe Coding Experience (Instructor Notes)

> Owner: Diego, with Agus on the Pi intro and demo. Status: shaping. Audience-facing materials live alongside this file (slides.md, exercise/README.md) and are in Spanish. These notes are for the instructor in English.

## Session goal (in one sentence)

Students leave **knowing how the tool works underneath, with Pi running on a project of their own**, and having built something without reading a line of it.

The session deliberately ends on discomfort, not on a solution. Sessions 2–6 are the solutions.

## Audience & assumptions

- **This session is 3 hours; every other session is 2.** The extra hour buys the introductions and the fundamentals block. Confirm the room booking allows it.
- Split: **~2 h intro + theory, ~1 h hands-on.** This is deliberately the inverse of a normal session — Session 1 carries all the shared vocabulary for the course, and the tool has to be installed before anyone can do anything.
- Heterogeneous room — 1st year through graduates. Teach to the middle, entry points for beginners, depth for advanced. **Part 3 (student introductions) is the calibration instrument**: use what you hear to decide how far to compress the fundamentals block.
- **This is the first session**: no recap, no shared vocabulary yet. Everything the later sessions lean on (tool, harness, agent, context, tokens) gets planted here.
- **Setup risk is the main risk of the day.** Pi + credentials + node/npm, for 20-30 people, in one room, in the last hour. Pre-work is strongly recommended (see Open items).
- **Terminal comfort varies wildly.** Some students have never used a CLI seriously. Pair them, and use the Filadd TAs.
- **Project**: students bring their own idea or take a default brief (see exercise/README.md). Either works; the exercise is written generically.

## The framing that carries the whole course

**"Managing a smart intern."** Introduce it here and name it explicitly, because every later session is another layer of management skill:

| Session | Management move |
|---|---|
| 1 | Hand the intern a task, walk away, don't check the work |
| 2 | Start doing plannings and code reviews |
| 3 | Give them better tools and written documentation |
| 4 | Build a culture where good work happens by default |
| 5 | Understand the machinery the intern actually works inside (TBD — Agus) |
| 6 | Realise the intern is a replaceable component — and host one yourself |

Today is deliberately the bad boss. Say that out loud so students don't think we're endorsing it.

**The companion idea, and the one Diego most wants them to leave with: responsibility stays with the person.** If it breaks, if a key leaks, if the code is unmaintainable — you are accountable, not the AI. "The agent wrote it" is not an excuse that exists. Every later session is a way of living up to that.

## Topic-by-topic plan

### Part 1 — Who we are (~10 min) — opens the session

Diego and Agus: academic background, industry background, what we do now, **and concretely how we use AI at Filadd**. Concrete beats generic: what we delegate, what we don't, how much of the day goes through a coding agent. Introduce the Filadd TAs if any are in the room — say what they can help with during the hands-on hour.

### Part 2 — What this course is (~20 min)

The expectation-setting block. Three moves:

1. **This course is built on our own experience, not on theory.** For theory there are excellent online courses — many made by the same companies selling the AI services. Say it plainly, because the practical consequence is *ask a lot of questions*: the value of being in the room is access to people who already ate the problems.
2. **Recommend the courses and ask for theirs.** DeepLearning.AI (Andrew Ng), Karpathy, Simon Willison, "Claude Code in Action" (Anthropic), plus Agus's picks. Then ask the room what AI courses they've taken and would recommend — write it on the board, it seeds `resources/`.
3. **The six sessions in one slide**, then the two ideas that carry the course: **responsibility is yours** and **managing a smart intern**. Close the block with the five-level spectrum as a map (vibe coding → AI-assisted → directed → agentic coding → agentic engineering) — one slide, no depth. Revisited in Session 4's closing.

### Part 3 — Who they are (~15 min)

Quick round: name, year, whether they work. With 20-30 people this needs a hard 15-20 seconds each — cut people off pleasantly.

The part that matters: **do they use AI, and for what?** Show of hands — studying, coding, ever used a terminal coding agent, never used any. That distribution decides how much of Part 4 you compress. Then a short break.

### Part 4 — Fundamentals (~35 min)

Align with the **Filadd bootcamp deck** — Diego brings it; this is where its material lands. Anything that can be shown live should be shown live: the model pages are more convincing than bullets.

- **Generative AI**: models that generate new content instead of classifying. Place LLMs inside that.
- **Next-token prediction**: it produces the *plausible* continuation, not the *true* one. Hallucination is the mechanism working, not a bug. This explains half of what they'll see in the hands-on.
- **The models**: Anthropic (Claude), OpenAI (GPT), Z.ai (GLM), Moonshot AI (Kimi). No ranking — the point is that there are more than two players and that open-weights models are part of the conversation (Session 6 lives there).
- **Live: the model pages.** Open Anthropic's and OpenAI's model pages and read them together — modalities, context window, price. OpenAI's model-comparison page is the most efficient way to explain the base concepts all at once. **Verify the URLs the day before**; they move.
- **Tokens**: the model sees tokens, not characters — hence the letter-counting failures. Tokens are the unit of everything: input, output, and price.
- **Multimodality**: images and audio also become tokens. That's why a screenshot costs, and why you can paste an image into an agent.
- **Pricing: per-token vs subscription.** Per-token (API): input + output, output costs more, scales with use. Subscription: flat, with usage limits. For this course a subscription is more predictable. Show the pricing page.
- **Context window** — the most important concept in the block, and it stays present all course. Finite working memory: everything the agent "knows" about your project is in there, or it isn't. Nothing persists between conversations. This is the seed of Session 4.
- **Rule of thumb: don't go past 50%** of the model's window. Quality degrades well before the harness warns you. Practical consequence: short sessions, clean context, start over when the conversation is dirty.
- **Chat vs agent**: a chat returns text and you execute; an agent executes — reads files, runs commands, edits code, looks at the result, tries again. It's a loop, not an answer.
- **A short timeline**: tab completion (Copilot) → chat beside the editor → Cursor → terminal coding agents (Claude Code, Codex, Pi). Lets them place whatever they were already using.
- **So: what is a coding agent?** An LLM that takes actions on a repo through tools.
- **Three words: LLM, tool, harness.** The vocabulary we reuse all course. **Pi is a harness.** Say explicitly: all three get opened up in Session 3 — today we only need the names.
- **The catalogue by environment**: web (Lovable, v0, Bolt, Claude Code web), desktop (Claude Code desktop), terminal (Claude Code, Codex, Pi, opencode). Then: in this course we use Pi.
- **Pi intro + live demo — Agus.** What Pi is, why we picked it, how you install it (point at the official quickstart, don't dictate commands), and `AGENTS.md`, because that's the centre of today's hands-on. Then one prompt, narrating the loop out loud as it happens: "that was a tool call; the result went back into the model's context". One concrete pass beats a diagram. ~5 min.

Then a break. Deep-theory questions (attention, training, embeddings) get answered in the break, not from the slide.

### Part 5 — Vibecoding (~35 min, theory + demo)

**Present it well before criticising it.** If we build a strawman here, the critique is worthless.

- **The definition Diego uses: "programar sin pensar que el código existe."** Not "coding badly" — coding at a layer where the code is not the material you work with.
- **Four takes** (URLs in `COURSE_PROGRAM.md`): Karpathy coining it (for weekend projects, not production); Naval on vibecoding as a video game (the loop is addictive, and that's part of why it works); kids vibecoding with Lovable (as a doorway into learning to program); vibe coding in prod (what happens when you take it to production).
- **Vibe coding is not an insult.** Real on-ramp: fast, fun, enabling. For prototypes and throwaway code it works, and we use it.
- **Live demo, ~8 min**: build something from zero by talking to the agent, no files opened. Let the room see the speed — and, if it happens naturally, one decision the agent made that nobody asked for.
- **Then the turn**: professional software demands accountability. The four concrete ways vibecoding falls short — and they'll see all four in their own code in an hour:
  - **Comprehension debt**: you shipped code you can't explain. Interest compounds. Named again in Session 2 as the verification bottleneck.
  - **The productivity illusion**: METR — experienced devs 19% *slower* with AI while *feeling* 20% faster. CodeRabbit — 1.7x more major issues in AI co-authored code. Present as data, not sermon, and tell them to check the number against their own feeling during the hands-on.
  - **The 80% problem**: the first 80% arrives in minutes; the remaining 20% is where the effort lives, and it's exactly the part that needs understanding.
  - **Agent failure modes**: cascading errors, false success reporting ("tests pass" — after the agent edited the assertions), scope creep. Ask them to hunt these during the hands-on; collect them in the reality check.

> **Note on the reorder**: this critique used to live in a 30-minute "Reality Check" block after a 2-hour hands-on. With 2 h of theory and 1 h of practice it lands *before* the hands-on instead. That's a real tradeoff — the numbers hit harder after students have felt them. Mitigation: frame them as predictions ("watch for this in the next hour"), then collect evidence in step 7 of the exercise and hand the deeper debrief to Agus in Session 2's recap.

### Hands-on (~47 min)

Seven steps in `exercise/README.md`. The first five are setup, and that's the point of the block: **nobody should leave the room without Pi working.**

1. Install Pi (~8) — the exercise links to the official quickstart rather than hardcoding a command.
2. Create the project + `git init` + GitHub repo (~4).
3. Try the base commands: `/model`, `/new`, `/resume`, `@file`, `!command`, Shift+Tab (~8).
4. Copy `AGENTS.md.template`, fill the TODOs, **then ask Pi to add a line to it** (~8).
5. Restart Pi (or `/reload`) and look at the loaded context (~4).
6. Vibe code, with the four rules (~15).

Instructor and TAs walk the room. Your job here is **not** to help them write good code — it's to:

- Unblock installs fast. This is real friction, not pedagogy.
- **Enforce the no-reading rule** gently from step 6 on. Students drift into the editor out of habit.
- **Take notes for the reality check.** Walk with a list: who has no tests, who has a hardcoded secret, who has three copies of the same function. Named examples from the room beat generic slides — **get permission before showing anyone's code.**

**The four rules** (read them aloud, they're on a slide and in the exercise):

1. Talk to the agent. Describe what you want.
2. **Don't open the files.** Not in the IDE, not with `cat`, not with `git diff`.
3. If something breaks, describe the symptom, don't diagnose it.
4. Judge only by the output: does it look right? does it run?

Expect pushback from the more experienced students — that's a good sign.

### Reality check (~12 min, closes the hands-on)

1. **"Now open the files."** A few silent minutes with the checklist in step 7 of the exercise. No commentary while they read — let the reaction happen.
2. **Collect from the room**, don't lecture. Write it on the board: no tests, hardcoded secrets, unvalidated input, dead code, duplicated logic, files they didn't know existed.
3. **If one concrete security hole shows up, show it** (permission asked *in advance*). The point is not OWASP — it's *"the agent produced this and neither of you noticed."* Have a fallback from your own demo project in case the room's projects are surprisingly clean.
4. **Close on the question, not an answer**: *"¿Lo subirías a producción? ¿Lo mantendrías por un año?"* Don't resolve it. Session 2 opens on it.

Note this block is much shorter than the original 30-minute design. It's a first pass, not the debrief — 15 minutes of building doesn't produce the same wreckage as two hours. The homework ("keep vibe coding with the same rules until it gets away from you") is what generates the material Agus needs.

## Session timing (~3 h)

| Block | Time |
|---|---|
| Part 1: who we are | 10 min |
| Part 2: what this course is | 20 min |
| Part 3: who they are + calibration | 15 min |
| Part 4: fundamentals (live pages + Pi demo by Agus) | 35 min |
| Part 5: vibecoding (theory + demo + the critique) | 35 min |
| **Hands-on: install Pi → AGENTS.md → vibe code** | **~47 min** |
| Reality check: open the files + collect | 12 min |
| Closing: would you ship this? + what's next | 5 min |
| 3 short breaks | ~15 min |

That adds to ~3 h 15 with breaks, so something has to give on the day. **Cut from Part 3 (shorten the round) and Part 4 (compress if the room is advanced). Protect the hands-on hour and the reality check** — if students leave without Pi installed, Session 2 starts broken.

## Cross-session bridges

- **Tool / harness / LLM** → Session 3 (Diego). Vocabulary planted today, opened up there. Whatever wording lands in class, keep it identical in Session 3's slides.
- **Context window + the 50% rule** → Session 4 (Agus). Today it's a constraint to respect; there it becomes something you engineer.
- **The reality-check debrief** → Session 2's recap (Agus). `sessions/session-2/slides.md` already opens on *"¿Qué pasó con su código durante la semana? ¿Alguien lo abrió?"* — that's where the real debrief happens now, so **sync with Agus before class**: tell him what state students actually ended in, and that today's in-class reality check was only ~12 minutes.
- **Comprehension debt** → Session 2's verification bottleneck. Same problem, named twice.
- **The spectrum** → Session 4's closing revisits it. Use the same five labels.
- **Open-weights models (GLM, Kimi) named in fundamentals** → Session 6. Just planting the names.
- **⚠️ Tooling mismatch**: the course tool is **Pi**, but Session 2's material is written against Claude Code (plan mode via `Shift+Tab`, plannotator, `git diff`). Session 2 was not touched. **Coordinate with Agus** — either Session 2 moves to Pi or the course accepts two harnesses. Tracked in `COURSE_PROGRAM.md` open questions.

## Tools/assets referenced

- [Pi](https://pi.dev/docs/latest/quickstart) — the coding agent for the whole course. Quickstart covers install and `/login`; [source](https://github.com/earendil-works/pi).
- `exercise/AGENTS.md.template` — the minimal AGENTS.md students copy in step 4.
- Model/pricing pages of Anthropic, OpenAI, Z.ai and Moonshot AI — opened live in Part 4. **Verify before class.**
- OpenAI's model-comparison page — used to explain the base concepts in one pass.
- The four vibecoding references — see `COURSE_PROGRAM.md` "The Spectrum": Karpathy (origin), Naval (as a video game), kids vibecoding with Lovable, vibe coding in prod.
- [METR productivity study](https://metr.org/) — 19% slower, felt 20% faster.
- [CodeRabbit](https://coderabbit.ai/) — 1.7x more major issues in AI co-authored code.
- Recommended courses: [DeepLearning.AI](https://www.deeplearning.ai/courses/), Karpathy's YouTube channel, [Simon Willison](https://simonwillison.net/), Anthropic's "Claude Code in Action".
- Default project briefs — see exercise/README.md.

## What we explicitly skipped (and why)

- **Prompting techniques**: teaching good prompting today would undercut the exercise. Woven into later sessions.
- **Any review, testing, or planning practice**: that's the whole point. Session 1 has no guardrails on purpose.
- **Deep LLM theory** (attention, training, embeddings): not needed to explain today's failure modes. Park it for the break.
- **OWASP taxonomy**: one concrete hole beats a list. Security depth is spread across the later sessions.
- **A recap block**: nothing to recap in the first session; that time goes to the introductions.
- **A long hands-on**: the two-hour build moved to homework. The hour in class buys a working install for everyone, which is worth more than 45 extra minutes of unsupervised building.

## Open items (for future iterations)

- **Pre-work**: ask students to arrive with node/npm installed and, ideally, Pi already running. Otherwise the install step eats the building time.
- **Test the Pi install on a clean machine before class, following the official quickstart.** Two package names are circulating on npm (`@earendil-works/…` and `@mariozechner/…`) — which is why the exercise points at the docs instead of a hardcoded command. Confirm what it needs from node/npm, and how `/login` resolves for 20-30 people at once.
- **`/context` is not documented in Pi.** The quickstart documents `/reload` for context files. Diego's outline asks students to "see the loaded context with `/context`" — **check whether that command exists** before class. If it doesn't, step 5 of the exercise shows the context via `/reload` plus whatever Pi prints at startup, and the exercise text needs updating to match.
- **Does Pi have its own tutorial** we could hand out as extra practice? Not in the quickstart. Check the rest of pi.dev/docs.
- **Agus's course recommendations** — pending from him for the Part 2 slide.
- **Align the fundamentals block with the Filadd bootcamp deck** — not in this repo; Diego has to bring it. Until then Part 4 is an outline, not final content.
- **Verify the live URLs** (Anthropic/OpenAI/Z.ai/Moonshot model + pricing pages, OpenAI compare page, "Claude Code in Action") the day before. They move.
- **Karpathy tweet ID**: `COURSE_PROGRAM.md` "The Spectrum" uses `1886192184808149383` (Feb 2 2025, the original) and the references section used a different ID. Unified to the first — worth a 10-second check that the link resolves.
- **Credentials**: course-wide keys or students' own? Unresolved course-wide (see COURSE_PROGRAM.md open questions).
- **Ask permission early** to show a student's code on the projector — mid-debrief is an awkward time to ask.
- **Fallback demo project** with known-bad AI-generated code, for the security moment if the room's projects are too clean.
- **Confirm the 3-hour slot** for this session specifically, since the rest are 2 h.
