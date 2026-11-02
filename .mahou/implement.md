# Implement in kurasu

- **Tracker**: an Entire trail per change, created with `entire trail create --no-branch --type feature`. The trail's description holds the change's tasks as a markdown checklist, one `- [ ]` line per task with what it requires. There is no local task list.
- **Reaching it**: `entire trail show <P> --json` reads the description; `entire trail update <P> --body "…"` writes it, and replaces the whole description, so read it first and write it back whole.
- **States**: a task is pending as `- [ ]` and done as `- [x]`. It is marked done when its change is implemented, tested and committed. There is no in-progress state. The trail goes to `--status closed` when its branch is merged.
- **Description format**: Entire stores the description as plain text: it drops list dashes, bold, backticks and headings, and keeps line breaks and the `[ ]`/`[x]` marks. Write each task as one line starting with `[ ]`.
- **Branch**: the trail is created without a branch. Once the change's branch is pushed, and before its pull request is opened, link it with `entire trail link <P> --branch <branch>`. A pull request whose branch belongs to no trail makes Entire create a new trail for it.
- **Closing**: close the trail with `entire trail update <P> --status closed` once its pull request is merged.
