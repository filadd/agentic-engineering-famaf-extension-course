# Upstream

Copied from [dmmulroy/anti-slop](https://github.com/dmmulroy/anti-slop) at commit `13909c9e07590f5a85d93c62712259fe14a883f7` (2026-10-13), from that commit's `install-anti-slop` skill assets. MIT licensed; see `LICENSE`.

These files are kurasu's now. Change a rule when it stops matching how kurasu works, and record the change below. To take upstream fixes, stage the new revision beside this copy and merge by hand; never overwrite this folder.

## Local changes

- 2026-10-18, `shared/dictionary-types.ts`: the intersection branch returns its first unsafe member through a destructured binding, so it typechecks under `noUncheckedIndexedAccess`. Behavior unchanged. `tools/oxlint` is part of the root `typecheck-tools` script.
