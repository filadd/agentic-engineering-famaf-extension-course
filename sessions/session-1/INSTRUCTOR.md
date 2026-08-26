# Session 1 — The Vibe Coding Experience (Instructor Notes)

> 📊 **Presentation** — plain-language visual walkthrough of this session (run of show, the four rules, the context-hygiene commands, the reality check): <https://claude.ai/code/artifact/735320e0-90ba-4586-bb49-3551b35933cb>
> Private until shared from the page's share menu.

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
- **Project**: students bring their own idea or take a default brief (see exercise/README.md). Either works; the exercise is written generically. **It has to run in the browser** — keeps the reality check and later sessions demoable without extra setup.

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

### Part 2 — What this course is (~10 min)

The expectation-setting block. Five moves:

1. **This course is built on our own experience, not on theory.** For theory there are excellent online courses — many made by the same companies selling the AI services. Say it plainly, because the practical consequence is *ask a lot of questions*: the value of being in the room is access to people who already ate the problems.
2. **Recommend the courses and ask for theirs.** DeepLearning.AI (Andrew Ng), Karpathy, Simon Willison, "Claude Code in Action" (Anthropic), plus Agus's picks. Then ask the room what AI courses they've taken and would recommend — write it on the board, it seeds `resources/`.
3. **The six sessions in one slide — as two blocks, and say so.** Four base sessions (*how do I work well with this thing?*, closed by Session 4) plus two advanced ones (*what is this thing made of, and what if I swap its parts?*, closed by Session 6). This is the only time in the course the whole shape is visible at once, so it's worth thirty extra seconds. Two things to state plainly, because both are easy to get wrong: **it's the same six sessions for everyone** — "advanced" is register, not a separate enrolment — and **the advanced two are not an optional appendix**, they're where the base material gets proven.
4. **Announce the Session 5 demo hour**, on the slide right after that one: the project they start today gets shown to the room in the second-to-last class. Say what it is not: no deliverable, no grading, volunteers only, 5-7 minutes each, and what matters is *how* they built it. Announcing it now is the point — it changes how they work for six weeks. One slide, ~1 min; it absorbs into this block, and Session 4's closing reminds them.
5. **The two ideas that carry the course**: **responsibility is yours** and **managing a smart intern**. Close the block with the five-level spectrum as a map (vibe coding → AI-assisted → directed → agentic coding → agentic engineering) — one slide, no depth. **Revisited once, in Session 6's closing**, as the course's ending. Keep the slide file intact and reusable: Session 6 returns to this exact slide, unretouched.

### Part 3 — Who they are (~30 min)

Quick round: name, year, whether they work. With 20-30 people this needs a hard 15-20 seconds each — cut people off pleasantly. Budget more room here than it looks like it needs: with 20-30 introductions plus the show-of-hands discussion below, this block tends to run long.

The part that matters: **do they use AI, and for what?** Show of hands — studying, coding, ever used a terminal coding agent, never used any. That distribution decides how much of Part 4 you compress. Then a short break.

### Part 4 — Fundamentals (~35 min)

**The Filadd bootcamp deck is folded in** — summarized below, not pasted. Three things were adapted, because the audience changed from company leaders to CS students: the Filadd-internal framing is gone (the disclaimers, the normal-curve argument about where Filadd should sit, the NotebookLM links about how the deck itself was made); **the HPC material got promoted**, because these students *are* the FaMAF students in that story; and the cybersecurity block narrowed from company-wide data governance to the one point that matters at a keyboard — what you paste goes to a third party.

Anything that can be shown live should be shown live: the model pages are more convincing than bullets.

**Budget it as ~5 + ~25 + ~5 (Agus's demo).** The block is full, and Part 3's show of hands decides what gets compressed: with a room that already uses agents, the timeline and the catalogue go fast and the history block stays.

#### 4.a — De dónde viene esto (~5 min)

The history opener, and it earns its five minutes with this audience because it reframes the hype as the arrival of something old.

- **Turing, 1950.** The Turing test is 75 years old. AI has been studied as theory for +70 years — [there's a playable version](https://turingtest.live/) if the room wants to try it in the break.
- **What changed is that the theory became applicable**: compute got cheap enough, and in 2017 the [Transformers paper](https://arxiv.org/abs/1706.03762) showed an architecture that generates text from the preceding sequence. That's the whole revolution in one sentence — not new ideas, newly runnable ones.
- **GPT = Generative Pre-trained Transformer.** Say what the three letters mean; nobody in the room has been told. [3Blue1Brown's video](https://www.youtube.com/watch?v=wjZofJX0v4M) is the hand-out for whoever wants the visual version.
- **And the example that makes next-token prediction land in Argentina**: `Messi ...` → the model completes `es un excelente jugador de fútbol`. But a sports journalist in a bad decade completes *"no canta el himno"*, and [Casciari](https://hernancasciari.com/blog/messi_es_un_perro/) completes *"es un perro"*. **Same prefix, three different plausible continuations, none of them "the truth".** It's the cleanest possible setup for the next bullet, and it's funny, which buys attention for the twenty minutes after it.

#### 4.b — Cómo funciona, y qué te vende (~25 min)

- **Generative AI**: models that generate new content instead of classifying. Place LLMs inside that.
- **Next-token prediction**: it produces the *plausible* continuation, not the *true* one. Hallucination is the mechanism working, not a bug. This explains half of what they'll see in the hands-on.
- **The models**: Anthropic (Claude), OpenAI (GPT), Z.ai (GLM), Moonshot AI (Kimi). No ranking — the point is that there are more than two players and that open-weights models are part of the conversation (Session 6 lives there).
- **Live: the model pages.** Open Anthropic's and OpenAI's model pages and read them together — modalities, context window, price. OpenAI's model-comparison page is the most efficient way to explain the base concepts all at once. **Verify the URLs the day before**; they move.
- **Tokens**: the model sees tokens, not characters — hence the letter-counting failures. Tokens are the unit of everything: input, output, and price.
- **Multimodality**: images and audio also become tokens. That's why a screenshot costs, and why you can paste an image into an agent.
- **Pricing: per-token vs subscription.** Per-token (API): input + output, output costs more, scales with use. Subscription: flat, with usage limits. For this course a subscription is more predictable. Show the pricing page.
- **Context window** — the most important concept in the block, and it stays present all course. Finite working memory: everything the agent "knows" about your project is in there, or it isn't. Nothing persists between conversations. This is the seed of Session 4.
- **Context rot**: quality degrades as the window fills up, well before the harness warns you or the conversation hits its limit. Practical consequence: short sessions, clean context, start over when the conversation is dirty.
- **Chat vs agent**: a chat returns text and you execute; an agent executes — reads files, runs commands, edits code, looks at the result, tries again. It's a loop, not an answer.
- **A short timeline**: tab completion (Copilot) → chat beside the editor → Cursor → terminal coding agents (Claude Code, Codex, Pi). Lets them place whatever they were already using.
- **So: what is a coding agent?** An LLM that takes actions on a repo through tools.
- **Three words: LLM, tool, harness.** The vocabulary we reuse all course. **Pi is a harness.** Say explicitly: all three get opened up in Session 3 — today we only need the names.
- **The catalogue by environment**: web (Lovable, v0, Bolt, Claude Code web), desktop (Claude Code desktop), terminal (Claude Code, Codex, Pi, opencode). Then: in this course we use Pi.
- **Lo que pegás se lo estás dando a un tercero.** The cybersecurity point from the Filadd deck, narrowed to what applies at a keyboard: a prompt is data leaving your machine — your data, someone else's data, or the university's. It has a legal dimension too (Brazil's LGPD is the example Diego used, and it's a good one precisely because it is not ours). One minute, no taxonomy: security is cross-cutting and each session takes a piece. **Session 6 closes this thread from the other end** — running the model yourself removes that third party and makes you the operator.
- **El hardware existe, y está acá.** The block that lands hardest with *this* room and would have been a footnote anywhere else: [FaMAF students competing in HPC in China](https://www.instagram.com/teamcarpinchos/). The resources that are suddenly scarce and valuable — **knowledge, electricity, water for cooling, GPUs** — are not an abstraction in Córdoba. **This is the seed of Session 6**: UNC runs a supercomputing center, and in the last session they point their own agent at it. Plant it and move on; don't spend the ending here.
- **"Don't outsource the learning."** [Addy Osmani's line](https://x.com/addyosmani/status/2056078124346228860), and the phrase to leave hanging over the whole course — it pairs exactly with *responsibility is yours*, which is Part 2's idea. Say the practical version: explore, push every button, learn from trial and error, read, and leave time for the kind of rest where you actually think. **Plant the phrase and stop there** — skill atrophy is Session 4's closing material and spending it today would spend the base arc's ending in the first hour.
- **Pi intro + live demo — Agus.** What Pi is, why we picked it, how you install it (point at the official quickstart, don't dictate commands). Then one prompt, narrating the loop out loud as it happens: "that was a tool call; the result went back into the model's context". One concrete pass beats a diagram. ~5 min.

Then a break. Deep-theory questions (attention, training, embeddings) get answered in the break, not from the slide.

> **Two optional asides from the Filadd deck, for a room that's ahead of schedule** — both are colour, neither is content. [Simon Willison on the last six months in LLMs](https://simonw.substack.com/p/the-last-six-months-in-llms-in-five), for the exponential-curve framing; and **slop**, with the detail that lands in a CS classroom — SPAM as a term comes from [a Monty Python sketch](https://www.youtube.com/watch?v=mG8PcUiHTpY), and Monty Python is where Guido van Rossum got the name Python. [Willison on slop](https://simonwillison.net/2026/Mar/23/neurotica/) is the modern half. **Cut both without guilt**; the history block is worth more.

### Part 5 — Vibecoding (~35 min, theory + demo)

**Present it well before criticising it.** If we build a strawman here, the critique is worthless.

- **The definition Diego uses: "programar sin pensar que el código existe."** Not "coding badly" — coding at a layer where the code is not the material you work with.
- **Four takes** (URLs in `COURSE_PROGRAM.md`): Karpathy coining it (for weekend projects, not production); Naval on vibecoding as a video game (the loop is addictive, and that's part of why it works); kids vibecoding with Lovable (as a doorway into learning to program); vibe coding in prod (what happens when you take it to production).
- **Vibe coding is not an insult.** Real on-ramp: fast, fun, enabling. For prototypes and throwaway code it works, and we use it.
- **Live demo, ~8 min**: build something from zero by talking to the agent, no files opened. Let the room see the speed — and, if it happens naturally, one decision the agent made that nobody asked for.
- **Then the turn**: professional software demands accountability. The three concrete ways vibecoding falls short — and they'll see all three in their own code in an hour:
  - **Comprehension debt**: you shipped code you can't explain. Interest compounds. Named again in Session 2 as the verification bottleneck.
  - **The productivity illusion**: METR — experienced devs 19% *slower* with AI while *feeling* 20% faster. Present as data, not sermon, and tell them to check the number against their own feeling during the hands-on.
  - **The 80% problem**: the first 80% arrives in minutes; the remaining 20% is where the effort lives, and it's exactly the part that needs understanding.

> **Note on the reorder**: this critique used to live in a 30-minute "Reality Check" block after a 2-hour hands-on. With 2 h of theory and 1 h of practice it lands *before* the hands-on instead. That's a real tradeoff — the numbers hit harder after students have felt them. Mitigation: frame them as predictions ("watch for this in the next hour"), then collect evidence in step 4 of the exercise and hand the deeper debrief to Agus in Session 2's recap.

> **Cut for Session 1**: agent failure modes (cascading errors, false success reporting, scope creep) used to be part of this list. Diego's call: too much detail to introduce here, better placed after students have played with the tool a bit — leave it for a later session.

### Hands-on (~27 min)

Three steps in `exercise/README.md`. The first two are setup, and that's the point of the block: **nobody should leave the room without Pi working.**

1. Install Pi (~8) — the exercise links to the official quickstart rather than hardcoding a command.
2. Create the project + `git init` + GitHub repo (~4).
3. Vibe code, with the four rules (~15).

Instructor and TAs walk the room. Your job here is **not** to help them write good code — it's to:

- Unblock installs fast. This is real friction, not pedagogy.
- **Enforce the no-reading rule** gently from step 3 on. Students drift into the editor out of habit.
- **Say the context-hygiene commands out loud while walking** — a mention, not a block, and it's where the *context rot* slide from Part 4 gets paid: there we promise they'll see their own context today. Four Pi commands, all four in the exercise: `/session` (tokens and cost so far), `/new` (clean context for an unrelated task), `/compact` (summarize the old part of a long task — automatic when Pi runs out of room, manual before that, and it takes instructions), `/tree` (jump back to an earlier point and continue from there). **The one to push is `/tree`**: the third failed fix is the moment to rewind, not to keep digging — every failed attempt is still in the context making the next one worse. It's the first antidote to cascading errors the course offers and it costs one command. Depth is Session 5's; today they just need the four names. Worth saying explicitly that none of this breaks rule 2 — these are agent commands, not the code.
- **Take notes for the reality check.** Walk with a list: who has no tests, who has a hardcoded secret, who has three copies of the same function. Named examples from the room beat generic slides — **get permission before showing anyone's code.**

**The four rules** (read them aloud, they're on a slide and in the exercise):

1. Talk to the agent. Describe what you want.
2. **Don't open the files.** Not in the IDE, not with `cat`, not with `git diff`.
3. If something breaks, describe the symptom, don't diagnose it.
4. Judge only by the output: does it look right? does it run?

Expect pushback from the more experienced students — that's a good sign.

### Reality check (~12 min, closes the hands-on)

1. **"Now open the files."** A few silent minutes with the checklist in step 4 of the exercise. No commentary while they read — let the reaction happen.
2. **Collect from the room**, don't lecture. Write it on the board: no tests, hardcoded secrets, unvalidated input, dead code, duplicated logic, files they didn't know existed.
3. **If one concrete security hole shows up, show it** (permission asked *in advance*). The point is not OWASP — it's *"the agent produced this and neither of you noticed."* Have a fallback from your own demo project in case the room's projects are surprisingly clean.
4. **Close on the question, not an answer**: *"¿Lo subirías a producción? ¿Lo mantendrías por un año?"* Don't resolve it. Session 2 opens on it.

Note this block is much shorter than the original 30-minute design. It's a first pass, not the debrief — 15 minutes of building doesn't produce the same wreckage as two hours. The homework ("keep vibe coding with the same rules until it gets away from you") is what generates the material Agus needs.

## Session timing (~3 h)

| Block | Time |
|---|---|
| Part 1: who we are | 10 min |
| Part 2: what this course is | 10 min |
| Part 3: who they are + calibration | 30 min |
| Part 4: fundamentals (live pages + Pi demo by Agus) | 35 min |
| Part 5: vibecoding (theory + demo + the critique) | 35 min |
| **Hands-on: install Pi → vibe code** | **~27 min** |
| Reality check: open the files + collect | 12 min |
| Closing: would you ship this? + what's next | 5 min |
| 3 short breaks | ~15 min |

That adds to ~3 h, so it's tight but should fit. **If the room runs long, cut from Part 4 (compress if the room is advanced). Protect the hands-on hour and the reality check** — if students leave without Pi installed, Session 2 starts broken.

## Cross-session bridges

- **Tool / harness / LLM** → Session 3 (Diego). Vocabulary planted today, opened up there. Whatever wording lands in class, keep it identical in Session 3's slides.
- **Context window + context rot** → Session 4 (Agus). Today it's a constraint to respect; there it becomes something you engineer.
- **Context hygiene (`/session`, `/new`, `/compact`, `/tree`)** → Session 5 (Agus). Named in today's práctica as four commands to use; the harness session explains what compaction actually does to the transcript. Today is operations, not mechanism.
- **The reality-check debrief** → Session 2's recap (Agus). `sessions/session-2/slides.md` already opens on *"¿Qué pasó con su código durante la semana? ¿Alguien lo abrió?"* — that's where the real debrief happens now, so **sync with Agus before class**: tell him what state students actually ended in, and that today's in-class reality check was only ~12 minutes.
- **Comprehension debt** → Session 2's verification bottleneck. Same problem, named twice.
- **The spectrum** → **Session 6's closing** revisits it, as the course's ending. Use the same five labels, and keep the slide reusable — Session 6 shows this one, not a redrawn version. (Session 4 used to revisit it too; that was a leftover from when the course was 4 sessions and Session 4 was the finale.)
- **Open-weights models (GLM, Kimi) named in fundamentals** → Session 6. Just planting the names.
- **✅ Tooling mismatch resolved**: Session 2 now runs on Pi. It adds `@plannotator/pi-extension` (file-based plan mode + `/plannotator-review`) — one extension, no second harness. Nothing to warn students about; **Pi is the tool for all six sessions, full stop.**
- **The harness restricts the toolset** → Session 2 shows this concretely (planning mode allows only read/search) and hands it to Session 3 as permissions and extension points. Worth knowing when you plant "harness" as vocabulary in Part 4.

## Tools/assets referenced

- [Pi](https://pi.dev/docs/latest/quickstart) — the coding agent for the whole course. Quickstart covers install and `/login`; [source](https://github.com/earendil-works/pi).
- [Pi — sessions](https://pi.dev/docs/latest/sessions) and [compaction](https://pi.dev/docs/latest/compaction) — the reference behind the four hygiene commands. Auto-compaction fires when `contextTokens > contextWindow - reserveTokens` (16384 by default) and keeps the most recent ~20k tokens; `/tree` is branch navigation, and Pi offers to summarize the branch you leave.
- Model/pricing pages of Anthropic, OpenAI, Z.ai and Moonshot AI — opened live in Part 4. **Verify before class.**
- OpenAI's model-comparison page — used to explain the base concepts in one pass.
- The four vibecoding references — see `COURSE_PROGRAM.md` "The Spectrum": Karpathy (origin), Naval (as a video game), kids vibecoding with Lovable, vibe coding in prod.
- [**Sebastian Raschka: *The Components of a Coding Agent***](https://magazine.sebastianraschka.com/p/components-of-a-coding-agent) — **the reference behind Part 4's "what is a coding agent" and the three words.** Draws exactly the lines this session plants: LLM (next-token prediction) vs. reasoning model vs. *agent* (a control loop that decides what to inspect, which tools to call, and when to stop) vs. *harness* (the scaffold managing context, tools and execution). And it states this session's claim more strongly than we do — the harness is often what makes one model work better than another, because *"much of the apparent model quality is really context quality"*. **Instructor prep, not class content**: it runs 2,500-3,000 words and its six components go well past today's vocabulary — repo context, prompt/cache shape, tools, context reduction, session memory, subagents. Useful twice over as a map of what's coming: components 4-5 are the hygiene commands and Session 5's compaction, and 6 is Session 4's. Good optional reading to hand the advanced students who ask for more after Part 4.
- [METR productivity study](https://metr.org/) — 19% slower, felt 20% faster.
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

- ~~Pre-work~~ → **decided: no pre-work message.** The install happens in the room, as planned, and the ~27-minute hands-on absorbs it. The reason to keep it that way: an optional pre-work is done by half the room and we'd start with two populations. It does raise the stakes on the item below.
- **Test the Pi install on a clean machine before class, following the official quickstart.** Two package names are circulating on npm (`@earendil-works/…` and `@mariozechner/…`) — which is why the exercise points at the docs instead of a hardcoded command. Confirm what it needs from node/npm, and how `/login` resolves for 20-30 people at once.
- **Does Pi have its own tutorial** we could hand out as extra practice? Not in the quickstart. Check the rest of pi.dev/docs.
- **Agus's course recommendations** — pending from him for the Part 2 slide.
- **Align the fundamentals block with the Filadd bootcamp deck** — not in this repo; Diego has to bring it. Until then Part 4 is an outline, not final content.
- **Verify the live URLs** (Anthropic/OpenAI/Z.ai/Moonshot model + pricing pages, OpenAI compare page, "Claude Code in Action") the day before. They move.
- **Karpathy tweet ID**: `COURSE_PROGRAM.md` "The Spectrum" uses `1886192184808149383` (Feb 2 2025, the original) and the references section used a different ID. Unified to the first — worth a 10-second check that the link resolves.
- ~~Credentials: course-wide keys or students' own?~~ → **decided: each student uses their own account for `/login`.** Nothing to provision and nothing to hand out. Two consequences to carry, and neither is a blocker: whoever arrives without an account creates one in the room (which is part of why the install step is protected), and **the room will not all be running the same model** — worth remembering in Session 6, where the hosted model is the baseline each student compares the open one against. The comparison is per-student, so it survives.
- **Ask permission early** to show a student's code on the projector — mid-debrief is an awkward time to ask.
- ~~Fallback demo project~~ → **written: `exercise/proyecto-de-respaldo/`.** Vibe-coded and left untouched, with four real holes for the security moment when the room's own projects come out too clean. The instructor's cheat sheet is in that directory's README.
- **Confirm the 3-hour slot** for this session specifically, since the rest are 2 h.
