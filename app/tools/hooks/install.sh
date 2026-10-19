#!/bin/sh
# lefthook looks for its config at the repository root, but app/ is a folder
# inside the course repository. The installed hook points lefthook at
# app/lefthook.yml of whichever checkout or worktree is committing.
set -e

hooks_dir=$(git rev-parse --path-format=absolute --git-path hooks)

cat > "$hooks_dir/pre-commit" <<'HOOK'
#!/bin/sh
top=$(git rev-parse --show-toplevel)
lefthook="$top/app/node_modules/.bin/lefthook"

if [ ! -x "$lefthook" ]; then
  if git diff --cached --name-only | grep -q '^app/'; then
    echo "kurasu: run pnpm install in app/ before committing changes to app/" >&2
    exit 1
  fi

  exit 0
fi

LEFTHOOK_CONFIG="$top/app/lefthook.yml" exec "$lefthook" run pre-commit "$@"
HOOK

chmod +x "$hooks_dir/pre-commit"
