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
sessions/          — per-session materials
examples/          — demo projects and code snippets
resources/         — reference materials and reading lists
COURSE_PROGRAM.md  — full course design document
```

## Tool

The course uses [Claude Code](https://docs.anthropic.com/en/docs/claude-code) as the primary AI coding tool.
