# Open Source Models & HPC

> 🔴 **TO REVIEW** — the Tier 6 / Session 6 material was Claude-generated and has **not** been
> reviewed by Diego yet. Treat it as a proposal.

Topic notes for Tier 6 / Session 6. Owner: Diego. Guest: Ale Silva (CCAD) — six settled
points: what CCAD is, what hardware it has, how a UNC student gets access to run an LLM there,
how you run one, and the inference stack itself — **LiteLLM** in front and **vLLM** behind.
The last two are why the `baseUrl` and the `vllm/` prefix in `models.json` land as recognition
rather than as strings copied off a slide.

Outline lives in `COURSE_PROGRAM.md` → Topic Inventory → Tier 6, and the session plan in
`sessions/session-6/INSTRUCTOR.md` — including the list of open questions pending the email
thread with Ale (gateway concurrency and rate limits, how API keys are issued, whether the
proxy logs prompts, the server-side context window).

**The session reaches CCAD through a LiteLLM gateway**, not through a cluster login: Pi gets
there with a provider entry in `~/.pi/agent/models.json`. The scheduler, the GPU queue and
SSH port forwarding are theory in this session, not steps the students perform.

**Two models, and the material must work with either.** [Gemma 4 26B](https://blog.google/innovation-and-ai/technology/developers-tools/gemma-4/)
is what the gateway serves today — MoE, 26B total / ~3.8B active, Apache 2.0, up to 256K context.
[Qwen3.8-27B](https://huggingface.co/Qwen/Qwen3.8-27B) — 27B dense, Apache 2.0, `bfloat16`,
262,144 native, ungated — **is requested from Ale and may not arrive**; it is an addition, not a
replacement.

Three consequences, all load-bearing:

- **VRAM arithmetic** is 26B × 2 ≈ 52 GB or 27B × 2 ≈ 54 GB — either number carries the block, and
  `bfloat16` is checkable in the model's own `config.json`, so the "2 bytes" stops being a rule
  students take on faith.
- **Dense vs. MoE is why we want both.** Same VRAM floor, very different latency: the MoE keeps all
  26B resident but routes ~3.8B per token. With both served the room measures that; with one, we
  explain it.
- **The licence block's hook is Gemma's own version history.** Gemma 4 is Apache 2.0 — *a change
  from Gemma 2/3's bespoke terms*, which corrects an earlier draft of the session notes. The generic
  warning "licences change between versions" turns out to have a live example in the model of the
  day. Three cards on screen: Gemma 4, Gemma 3, Llama.
- **The context window is three numbers for one thing**: ~262,144 native, Pi's 128,000 default, and
  whatever `--max-model-len` CCAD launched vLLM with — the one that actually wins.

Verified 2026-08-24; re-check before class.
