# Implement in kurasu

- **Tracker**: an Entire trail per change, created with `entire trail create --no-branch --type feature`. The trail's description holds the change's tasks as a markdown checklist, one `- [ ]` line per task with what it requires. There is no local task list.
- **Reaching it**: `entire trail show <P> --json` reads the description; `entire trail update <P> --body "…"` writes it, and replaces the whole description, so read it first and write it back whole.
- **States**: a task is pending as `- [ ]` and done as `- [x]`. It is marked done when its change is implemented, tested and committed. There is no in-progress state. The trail goes to `--status closed` when its branch is merged.
- **Branch**: the trail is created without a branch; implement links the change's branch with `entire trail link` when it creates it.
