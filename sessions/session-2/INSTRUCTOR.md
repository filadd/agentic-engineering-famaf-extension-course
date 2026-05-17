# Session 2 — Planning & Review (Instructor Notes)

> Owner: Agus. Status: shaping. Audience-facing materials live alongside this file (slides.md, exercise/README.md) and are in Spanish. These notes are for the instructor in English.

## Session goal (in one sentence)

Students leave knowing how to **externalize a plan and review a diff before accepting** — internalizing "don't accept what you didn't externalize and didn't review."

## Audience & assumptions

- Heterogeneous — 1st year through graduates. Teach to the middle, with entry points for beginners and depth for advanced students.
- **Git baseline**: assume basics (commit/push). Teach diff-reading critically and branching-as-safety-net with AI explicitly.
- **Tests**: no strict baseline. Frame as "tests as guardrails" — accessible to first-years.
- **Starting state**: generic. Exercise refers to "a feature in your project" — works for default-project and own-project students.
- **No pre-work** between Session 1 and Session 2. Recap absorbs variance.

## Topic-by-topic plan

### Git with AI (~5 min) — opens the theory block

Foundation first: before we walk through the planning/review flow, set the safety net. Frame as a **spectrum tied to context**, not a rigid workflow:
- **Solo on your own repo**: working on `main` is fine.
- **In a team**: branches per feature.
- **Parallel work**: worktrees.

Key principle: AI doesn't change git; it just makes "throw the branch away" cheaper. **Diff review is the gate before merging** — explicitly teach reading diffs critically (does it match the plan? unused code? security smells?).

Putting this first sets the explicit expectation: "everything that follows assumes you have a way to back out."

### Planning side: plan mode + plannotator (~10–12 min)

Framing: **same idea, two UX levels.** Plan mode keeps the plan in agent context; plannotator externalizes it as a file you can annotate, share, version. Plannotator's appeal is UX — the concept is the same.

**Demo flow:**
1. Live demo on instructor's project, Claude Code in plan mode (TUI). Iterate the plan, approve, exit plan mode.
2. Open the plannotator UI on the same plan. Show annotation flow, comments, the "act on this" handoff.
3. One narrative: "this is the same plan; plannotator just makes it reviewable like a doc."

**Subagents for plan review** (subtopic): you can also delegate the plan review itself — a subagent reads the plan and reports what's vague, what's missing, where two engineers could implement it differently. Mention here without going deep; full subagent treatment is Session 3 (Diego).

No need to introduce decomposition as a separate topic — the plan output naturally decomposes work. Point at the plan's structure and say "this is decomposition" rather than teaching a rubric.

### Review side: multiple strategies (~10 min)

Don't give students a checklist — show the **spectrum of review surfaces**:

1. **Watch + steer**: review happens *during* generation. Stop the agent mid-stream, redirect.
2. **Read in editor**: open the changed files in their IDE.
3. **Diff tool**: `git diff`, or [hunk](https://github.com/anthropics/hunk) for interactive hunk-by-hunk review.
4. **Plannotator review view**: paste the diff, annotate inline.
5. **Subagent for code review** (subtopic): delegate the diff review itself — a subagent reads the diff and reports issues, smells, divergences from the plan. Same "you can delegate this" idea as plan review, applied to the output side. Quick mention; depth in Session 3.
6. **Annai** (instructor's own in-progress tool — `案内`, "guidance"): mid-session interactive review surface that streams events between the agent and reviewer, submits to GitHub via GraphQL. Mention as a contrast to plannotator's blocking model. v0.2 in design.

### Task decomposition (~5 min, integrated)

Not a standalone topic in theory. Instructor reviews the plan from the demo with an "entrypoint" style: start at the main file the plan touches, branch out to others. Frame this as "decomposition is reading flow, not a rubric — it depends on the project shape."

### Tests as guardrails (~5 min)

Framework-agnostic. Position: "tests are the spec the AI can't game." If you ask for behavior X and the AI's tests claim X works, you can still be fooled — but if *you* wrote the test first, the AI has to satisfy it.

Skip strict TDD discipline. The win is "tests exist and you wrote them before the implementation," not the red→green→refactor cycle.

### Debugging AI-generated code

**No theory block.** Cover organically during hands-on when things break. Instructor (and TAs if available) walks the room. The lesson is "read the code yourself before asking the AI to fix it."

### Security sidebar (~30 sec, woven)

During the review demo, point at one concrete security smell in the diff (unsanitized input, exposed secret, missing auth check). Don't lecture. The point is to make students notice these *while reviewing*, not as a separate topic.

## Theory block timing (~25 min target)

| Block | Time |
|---|---|
| Recap from Session 1 | 15-20 min |
| Theory: git with AI (spectrum) | 5 min |
| Theory: planning side (plan mode + plannotator + subagent for plan review) | 10-12 min |
| Theory: review side (surfaces + subagent for code review) | 10 min |
| Theory: tests as guardrails | 5 min |
| **Theory total** | **~30 min** |

Decomposition is folded into the planning demo; debugging is hands-on; security is 30 seconds during the review demo.

## Cross-session bridges

- **Subagents** → Session 3 (Diego). Subagents appear here as subtopics inside both plan review and code review — students see "you can delegate this" twice before Session 3 explains the primitive in depth. Sync with Diego so the bridge lands cleanly.
- **Plan as context for the AI** → Session 4 (Agus). The plan we externalize in Session 2 becomes the spec we engineer in Session 4. Foreshadow this in the closing.

## Tools/assets referenced

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) — TUI with plan mode.
- [plannotator](https://github.com/backnotprop/plannotator) — external; reuse the PostHog side-event demo pattern, but build a fresh example on the course's default web app.
- [hunk](https://github.com/anthropics/hunk) — interactive hunk-by-hunk diff review.
- **Annai** — instructor's tool, v0.2 design. See vault: `02_Areas/Ideas/code-review-surface/annai-architecture.md`.

## What we explicitly skipped (and why)

- **LIDR borrowings** (Decision Closure Rule, Verification tiers): too enterprise-flavored for this audience.
- **Code review checklist**: replaced with "spectrum of review surfaces" — strategies, not a rubric.
- **Dedicated debugging block**: covered organically in hands-on.
- **Closing security prompt**: 30-second mention in demo is enough; doesn't need a reflection question.

## Open items (for future iterations)

- Confirm with Diego what state students arrive in at end of Session 1 (for the recap and the exercise framing).
- Pick the instructor's demo project — what codebase do you actually run plan mode on?
- Decide if Annai gets demoed live or just mentioned (depends on its readiness by class date).
