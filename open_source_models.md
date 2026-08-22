# Open Source Models & HPC

> 🔴 **TO REVIEW** — the Tier 6 / Session 6 material was Claude-generated and has **not** been
> reviewed by Diego yet. Treat it as a proposal.

Topic notes for Tier 6 / Session 6. Owner: Diego. Guest: Ale Silva (CCAD).

Outline lives in `COURSE_PROGRAM.md` → Topic Inventory → Tier 6, and the session plan in
`sessions/session-6/INSTRUCTOR.md` — including the list of open questions pending the email
thread with Ale (gateway concurrency and rate limits, how API keys are issued, whether the
proxy logs prompts, the server-side context window).

**The session reaches CCAD through a LiteLLM gateway**, not through a cluster login: Pi gets
there with a provider entry in `~/.pi/agent/models.json`. The scheduler, the GPU queue and
SSH port forwarding are theory in this session, not steps the students perform.
