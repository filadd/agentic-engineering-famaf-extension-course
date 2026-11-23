# Demo 1 prompt

Build a small Pi extension that adds a playful mascot to the TUI.

The mascot should appear under the input bar and move on its own:
- use a widget below the editor, not an overlay or command output
- render a compact ASCII mascot on one or two lines
- move it horizontally across the available terminal width
- on each animation tick, give it a 10% chance to change direction
- always reverse direction when it reaches either terminal border
- make it visibly jump while it moves

When I run a user shell command with `!`, the mascot should celebrate:
- listen for user bash commands, not slash commands
- do not block or replace the command execution
- trigger a short celebration animation with bigger jumps and fireworks around the mascot
- return to the normal wandering animation after the celebration finishes

Keep this stage-friendly:
- implement it as a single TypeScript extension file
- avoid dependencies
- keep the code readable enough to explain live
- guard TUI-only behavior so non-interactive modes do not break
- start any timers on session start and clean them up on session shutdown
- include the command I should run to test it locally with Pi
