# Session 6 — Open Source Models & Running on CCAD (Instructor Notes)

> 🔴 **TO REVIEW** — this file was Claude-generated and has **not** been reviewed by Diego yet.
> Treat every claim, timing, and pedagogical choice as a proposal, not a decision.

> Owner: Diego. Status: skeleton — **blocked on the email thread with Ale Silva** (see Pending from Ale). Audience-facing materials live alongside this file (slides.md, exercise/README.md) and are in Spanish. These notes are for the instructor in English.
>
> Guest: **Ale Silva (CCAD)** — invited to open the session with an intro to the center. Confirm scope, date, and duration.

## Session goal (in one sentence)

Students leave knowing that **the model is a replaceable component** — and having pointed their own agent at an open-weights model running on UNC hardware.

## Why this session exists, and why it's last

Sessions 1-5 use one hosted model behind an API. That's a sensible default and also an unexamined assumption. This session breaks it:

- **Open weights** are a real option, with real tradeoffs (privacy, cost structure, offline use, research reproducibility — against capability, tool-calling reliability, and ops burden).
- **CCAD exists and these students can use it.** Most of the room does not know that UNC operates an HPC center they can get an account on. That's arguably the highest-value practical takeaway of the whole course, independent of AI.

It goes last because it depends on Session 5.

> ⚠️ **Unconfirmed dependency.** Session 5 is TBD (Agus owns it). This session's hands-on currently assumes students arrive with **an agent of their own** they can point at a different endpoint. If Session 5's hands-on takes a different shape, the exercise needs rework — sync with Agus early. Worst case, the fallback is a small pre-written client handed out at the start of the hands-on, which costs the "the loop doesn't care who answers" realization but keeps the model comparison intact.

The dependency is pedagogical, not technical: students who wrote their own loop already believe the model is swappable; students who only ever used Claude Code don't.

## Audience & assumptions

- **Linux/CLI comfort varies a lot** and this session is the most terminal-heavy of the six: SSH, keys, a job scheduler, port forwarding. Pair aggressively. Expect the setup to *be* the exercise for a chunk of the room.
- **No prior HPC exposure.** Nobody has used a batch scheduler. Budget real time for "what is a queue and why can't I just run things."
- **Session 5's agent is the vehicle** — assumed, not confirmed (see the warning above). Students who didn't finish it need a reference client.
- **Accounts are the hard prerequisite** — CCAD accounts are requested via a form and provisioned by email, which is not same-day. This must be pre-work, not classwork (see Open items).

## Topic-by-topic plan

### Guest slot: Ale Silva — intro to CCAD (~20-25 min)

Hand the room over. Suggested scope to propose to him (confirm against the email thread):

- What CCAD is and who it serves (UNC faculties, the Astronomical Observatory, external research orgs; created by Ordenanza HCS 18/2010).
- What the hardware actually looks like, and which clusters have GPUs.
- Who can get an account and how the process works in practice.
- What HPC is normally used for at UNC — the point being that LLM inference is a newcomer on machines built for simulation, and that framing is genuinely interesting to CS students.
- Clusters Latam (Argentina / Chile / Colombia / Uruguay) if he wants to go wider.

Ask him what he'd rather cover; don't over-specify a guest's talk. Confirm whether he wants slides, a live tour of the dashboard, or just to talk.

### Open source vs. open weights, and licences (~10 min) — opens the theory

The distinction almost nobody makes correctly, and it has to come before the spectrum table or the rest of the block is imprecise.

- **Open weights**: you can download the weights and run them. That's it.
- **Open source** in the strong sense: you also have the training code and enough information about the data to reproduce the model.
- Nearly everything marketed as "open source AI" is **open weights** — you get the binary, not the recipe. The honest analogy is a free executable, not source code. Use "pesos abiertos" in class where it's accurate; the sloppiness is in the industry's marketing, not in the students.

**Then licences**, because this is where the distinction acquires consequences:

- **Standard software licences** (Apache 2.0, MIT): free commercial use, derivatives, redistribution.
- **Bespoke licences with restrictions** (Llama's community licence, Gemma's terms): usage limits, scale clauses, naming obligations, acceptable-use policies attached.
- **Restrictions on the output** — some licences forbid using generations to train other models.

The three questions a student should be able to answer before putting a model in a project: can I use it commercially? can I redistribute a fine-tune? who owns what it generates?

**Verify each named model's licence the week of class** — licences change between versions of the same model family, and this is the kind of claim that's embarrassing to get wrong in front of a room.

### Open weights vs. hosted APIs (~10 min)

Frame as a **spectrum of control**, not open-vs-closed tribalism:

| | Hosted API | Open weights, someone else's GPU | Open weights, your GPU |
|---|---|---|---|
| Capability | Highest | Varies | Varies |
| Data leaves your control | Yes | Partly | No |
| Cost shape | Per token | Per hour | Capex + electricity |
| Ops burden | None | Some | All of it |
| Works offline / air-gapped | No | No | Yes |

Honest about the gap: the strongest open-weights models are genuinely useful and genuinely behind the frontier on the things this course cares about — long-horizon agentic work and reliable tool calling. Don't oversell, don't sneer.

**Verify model names and current capability claims the week of class.** This area moves faster than any other topic in the course, and a stale model name in a slide is the kind of error students notice.

### What it actually takes to run one (~10 min)

Practical mechanics, because this is where the exercise will fail if it's hand-waved:

- **Weights are big.** Parameter count × bytes-per-parameter ≈ VRAM floor, before context. Do the arithmetic live for one model — it demystifies the whole thing and immediately explains why they need a GPU node.
- **Quantization** trades precision for VRAM. Mention that heavily quantized models degrade on structured output — which is exactly tool calling.
- **Two families of runtime**: local/single-user (llama.cpp, Ollama) vs. serving (vLLM, SGLang — batching, throughput, an HTTP server). The exercise needs the second.
- **The OpenAI-compatible endpoint is the interoperability story.** Nearly every serving runtime exposes one, which is why a harness can point at it with a base-URL change. This is the entire technical bridge from Session 5.

**Live demo — Agus's portable GPU (~5-8 min).** Agus brings his own portable GPU and serves a small model in the room. This is the third column of the spectrum table made physical: no queue, no tunnel, no account, and the data never leaves the room. Show the actual VRAM usage against the arithmetic we did two slides earlier, plus tokens/second so the latency is felt rather than described.

It also doubles as **the session's insurance policy**: if the CCAD queue is impossible, this is a real fallback endpoint sitting at the front of the room. **Confirm with Agus that he's bringing it, and test it beforehand.**

### HPC mechanics: how a cluster is not a laptop (~10 min)

- **Login node vs. compute node.** Do not run the model on the login node. Say it twice; someone will do it anyway.
- **The scheduler.** You describe a job (how many GPUs, how long) and wait your turn. Interactive work means requesting an interactive allocation. This is the biggest mental shift for the room.
- **Modules / environments** for software.
- **Reaching a service on a compute node** — the model serves HTTP on a node with no public address, so SSH port forwarding is the bridge from their laptop to the endpoint. This is the step most likely to eat time.
- **Shared-resource etiquette**: your job blocks someone's thesis run. Ask for what you need, release it when done.

**Everything in this block needs to be verified against CCAD's actual setup** (scheduler, module system, GPU partitions, interactive-job policy) before it goes on a slide. See Pending from Ale.

### Security & trust sidebar (~5 min)

Rounds out the course's cross-cutting thread:

- **Supply chain**: you're downloading multi-gigabyte binary weights from a hub. What are you trusting, and who published it? Model files have historically been a code-execution vector depending on format.
- **The privacy argument cuts both ways**: self-hosting removes a third party but adds you as the operator, with logs, disk, and a shared filesystem you may not have thought about.
- **Prompt injection doesn't care which model you run.** A weaker model may be *easier* to hijack.

### Is it good enough to be the engine of a serious project? (~10 min)

**The question the room actually wants answered**, and the right place to answer it: after the hands-on, with their own measurements in hand. Run it as a discussion, not a verdict — make them argue from what they just measured.

The axes that decide it, all of them things they tested in step 6 of the exercise:

- Does it call tools respecting the schema — *every* time, not most of the time?
- Does it survive a 20-step task without losing the thread?
- Is the context window enough for a real repo?
- Is the latency tolerable inside an agent loop, where every step is another round trip?

Our honest answer today — **re-verify the week of class, this moves fast**: for bounded tasks, reviews, high-volume repetitive work, and anything with sensitive data, yes. As the primary engine of a coding agent on a serious, long-lived project, not quite yet — and the bottleneck is usually **reliable tool calling, not the model's ability to write code**. Say that plainly; it's more useful to them than either enthusiasm or dismissal.

This block leads directly into the next one: the answer isn't yes/no, it's "for which job".

### When open source is the right call (~8 min)

Close the session (and the course) on judgment rather than tooling:

- **Good fits**: sensitive or regulated data, high-volume repetitive tasks where cost dominates, research needing reproducibility and a pinned model, offline/air-gapped work, and *studying the thing itself* — you can't inspect logits you don't have.
- **Bad fits**: you want the best available coding agent today; you have no ops capacity; the task is low-volume (a hosted API will be cheaper than your time).
- Then widen to the course's real closing: **the model is one component**. Everything from Sessions 2-5 — planning, review, tests, context, tools, harness — transfers across models. That's the payoff of having taught structure instead of a product.

## Session timing (~2.5-3 h)

| Block | Time |
|---|---|
| Recap & sharing from Session 5 | 10-15 min |
| **Guest: Ale Silva — intro to CCAD** | **20-25 min** |
| Theory: open source vs. open weights + licences | 10 min |
| Theory: open weights vs. hosted (spectrum) | 10 min |
| Theory: what it takes to run one (VRAM, quantization, runtimes) | 10 min |
| Demo: Agus's portable GPU | 5-8 min |
| Theory: HPC mechanics (login vs. compute, scheduler, forwarding) | 10 min |
| Theory: security & trust sidebar | 5 min |
| **Hands-on: serve a model on CCAD, point your agent at it** | **60-75 min** |
| Discussion: is it good enough for a serious project? | 10 min |
| Theory: when open source is the right call | 8 min |
| Course closing & retrospective | 15-20 min |

Note the ordering: the "is it good enough" and "when is this the right call" blocks sit *after* the hands-on deliberately — judgment discussions are better once they've felt the ops burden firsthand. If the schedule slips, the two fold into one ~10-minute block at the closing.

**This now overflows a 3-hour session** (~2 h of non-hands-on content plus 60-75 min of hands-on). Something has to give on the day: the licence block compresses to 5 minutes if the room isn't interested, Agus's demo can happen *during* the hands-on rather than as its own slot, and the HPC-mechanics block can move into the exercise as written instructions. **Protect the guest slot, the hands-on, and the closing retrospective.**

## Hands-on notes

Expected shape: get onto a cluster → request a GPU allocation → serve a small open model with an OpenAI-compatible endpoint → forward the port → change the base URL in their Session 5 agent → give it a task and compare against the hosted model.

**Realistic expectation: a meaningful fraction of the room will not reach the last step.** Getting a model serving on shared HPC hardware in one sitting is genuinely hard. Plan for it:

- **Have a fallback endpoint.** The primary one is **Agus's portable GPU serving a small model in the room** — hand out the base URL at the start of the block. Back that up with a pre-launched model on CCAD or on the instructor machine. Students who lose the fight with the scheduler still get to do the comparison, which is the actual lesson.
- **Queue waits can exceed the class.** If the GPU partition is busy, nobody serves anything. This is the single biggest risk to the session — ask Ale whether a reservation is possible for the class window.
- **Pair up on accounts.** If some students' accounts aren't provisioned, they work with someone whose is.
- Emphasize using a **small** model. The goal is a working request, not benchmark scores. Nobody needs a frontier-sized model to see that the loop doesn't care who answers.

The comparison at the end is the payoff: same agent, same task, different model. Expect the open model to be visibly worse at multi-step tool use — that's data, not disappointment, and it directly supports the closing discussion.

## Pending from Ale (email thread — not yet read)

**These notes were written without the email thread.** The following is what the thread should resolve; treat every item as unverified until it's checked:

- **Which cluster / partition** the class should target, and its GPU model and VRAM per GPU. Active clusters per the public site: Boogie (2025), Gordito (2025/2026), Mendieta Fase 2 (2022), Serafín (2021), Eulogia (2018/2021), Mulatona (2018). Which of these have GPUs suitable for LLM inference is **not** on the public equipment page — confirm with him.
- **Scheduler and module system** — assume Slurm, but confirm; the exercise commands depend on it.
- **Accounts for ~20-30 students**: is the standard form the right path, is bulk/expedited provisioning possible, and what's the lead time? Does a student need a sponsoring researcher?
- **A reservation or reserved window** for the class, so the hands-on isn't hostage to the queue.
- **Interactive-job policy** and whether an inference server on a compute node is an acceptable use.
- **Port forwarding / access policy** — is SSH tunneling from a compute node acceptable? Is JupyterHub a better route for the class?
- **Whether models can be pre-staged** on shared storage so 25 students don't each download tens of GB during class.
- **Ale's own slot**: scope, duration, whether he wants slides, and whether he's presenting remotely or in person.
- Whether CCAD wants any acknowledgement, or has materials/branding they'd like used.

Once the thread is read, fold the answers into this file and rewrite the exercise's setup steps against the real commands.

## Cross-session bridges

- **Session 5** → this session's whole hands-on is "the agent you wrote, pointed somewhere else." **Session 5 is still TBD** — coordinate with Agus on whether his hands-on actually produces a client, and have him set up the handoff in his closing. Agus is also in the room for this session with his portable GPU, so the coordination is cheap.
- **Session 1**'s LLM + tool + harness → today we swap the L. Nice symmetry for the course closing: the vocabulary from day one still holds when you replace its first term.
- **Session 4**'s cost/token awareness → this is the other cost model (per-hour, not per-token).
- **Cross-cutting security thread** → closes here on supply chain and self-hosting risk.

## Tools/assets referenced

- [CCAD — Centro de Computación de Alto Desempeño, UNC](https://supercomputo.unc.edu.ar/ccad/)
- [CCAD wiki / documentation](https://wiki.ccad.unc.edu.ar/) — the reference for account setup and cluster usage
- [Opening an account](https://wiki.ccad.unc.edu.ar/empezar/abrir-cuenta.html) — generate SSH keys, submit the form, receive credentials by email
- [Equipment](https://supercomputo.unc.edu.ar/equipamiento/) — cluster list (specs live on the per-cluster pages / wiki)
- [Account requests](https://supercomputo.unc.edu.ar/servicios/pedido-de-cuentas/) · [intensive-use requests](https://supercomputo.unc.edu.ar/servicios/pedido-de-uso-intensivo-ventanilla-permanente/) · [user support](https://supercomputo.unc.edu.ar/servicios/soporte-usuarios/)
- [Service status](https://stats.uptimerobot.com/eLhTV5CMni) · [dashboard](https://stats.ccad.unc.edu.ar/) — worth checking before class
- Serving runtime — vLLM or equivalent; pick one and pin the version in the exercise once the cluster is confirmed.
- **Agus's portable GPU** — live demo of the "your own hardware" column, and the session's primary fallback endpoint.
- Licence sources: the model cards on Hugging Face (the licence field and the LICENSE file in the repo), plus the OSI's Open Source AI Definition for the open-source-vs-open-weights distinction. Read the actual licence text for anything we name, not a summary.
- The client for the hands-on — Session 5's agent if that session produces one (TBD, Agus), otherwise a small pre-written client to hand out.

## What we explicitly skipped (and why)

- **Fine-tuning / LoRA**: a course of its own, and not reachable in one session on shared hardware.
- **Multi-GPU and distributed inference**: interesting, but the exercise only needs one small model on one GPU.
- **Benchmarking open vs. hosted models rigorously**: a qualitative side-by-side on their own task teaches the point; a real eval doesn't fit.
- **Training anything**: explicitly out of scope. Say so early or someone will ask for the rest of the session.
- **A tour of every open-weights model family**: fast-moving and low-value as a list. Pick one small model that works and use it.

## Open items (for future iterations)

- **Read the email thread with Ale and resolve everything under Pending from Ale.** Blocking for the exercise.
- **Confirm Agus is bringing his portable GPU**, which model he'll serve on it, and test the whole thing (including handing its endpoint to a student laptop over the room's network) before class. It's both a demo slot and the session's main fallback, so it can't be a maybe.
- **Verify the licence of every model named in the slides**, the week of class. Licences differ between versions of the same family, and the licence block is worthless if the examples are stale.
- **Confirm Ale's participation, date, and format** — and have a plan if he can't make it (his intro becomes a 10-minute instructor-delivered version plus a link to the wiki).
- **Account pre-work**: send students the account instructions weeks ahead. Provisioning is not same-day, so this cannot be handled in class.
- **Pre-stage weights** on shared storage if CCAD allows it.
- **Build the fallback endpoint** and test it independently of CCAD, so the session survives a cluster outage or a full queue.
- Decide whether Session 6 or Session 5 owns the course retrospective — with six sessions, the closing needs one clear home.
- The course is now 6 sessions across 6 weeks; confirm the extension-course format actually allows that before announcing it.
