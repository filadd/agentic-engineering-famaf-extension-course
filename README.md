# From Vibe Coding to Agentic Engineering

A 6-session extension course at FaMAF (Universidad Nacional de Cordoba) that walks CS students through the full spectrum of AI-assisted development — from pure "vibe coding" to structured agentic engineering, and then into the internals: how a coding harness works, and running open-weights models on UNC's supercomputing center.

## Sessions

The six run as two blocks. Same cohort throughout — "advanced" describes depth, not enrollment — and the split is announced to students in session 1.

### Base — *how do I work well with this thing?*

1. **The Vibe Coding Experience** — prompt-and-accept workflow, anatomy of a coding agent (tool + harness + LLM), analyze what the AI actually produced
2. **Planning & Review** — task decomposition, plan mode, test-first development, git workflow
3. **Tooling & Skills** — tools and harness deep dive, AGENTS.md in depth, custom skills, MCP, documentation tools
4. **Context Engineering** — spec-driven development, subagents, agent orchestration (Teams pattern), full workflow integration. **Closes the base arc.**

### Advanced — *what is it made of, and what if I swap its parts?*

5. **Coding Harness (internals)** — the agent loop and its extension points, the session tree, compaction, three ways to give a model a tool, subagents as mechanism, run modes, and agent security
6. **Open Source Models & CCAD** — open weights vs. hosted APIs, pointing your agent at an open-weights model running on UNC's HPC hardware, and what it takes to serve one yourself. **Closes the course.**

## Structure

```
sessions/          — per-session materials (slides, exercises, instructor notes)
resources/         — reference materials and reading lists
COURSE_PROGRAM.md  — full course design document
```

## Tool

The course runs on [Pi](https://pi.dev) for all six sessions — terminal-based, minimal, standard `AGENTS.md`. Students install it in session 1, and later sessions add extensions on top of it rather than switching harness: `@plannotator/pi-extension` (file-based plan mode and review) and `pi-subagents` in session 2, `pi-mcp-adapter` in session 3. In session 6 the same tool is pointed at an open-weights model served by UNC's HPC center — which is the point of teaching structure instead of a product.
