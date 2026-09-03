# Proyecto de respaldo — Session 1 (instructor material)

> ⚠️ **Spoilers.** This README lists the holes on purpose. Don't project it — project `server.js` and `public/index.html` and let the room find them.

## What this is

A small app, vibe-coded and **left exactly as the agent produced it**, for the reality-check block. It's the fallback for when the room's own projects come out too clean: 20-30 vibe-coded projects usually give you material, but "usually" is not a plan when the security moment is on the clock.

Runs with no install — Node stdlib only, so nothing to `npm install` in a classroom with bad wifi:

```
node server.js      # → http://localhost:3000
```

**Don't fix it.** The value is that it looks completely normal: ~100 lines, readable, sensible names, does what it says. This is not obviously bad code, and that is the whole point.

## How to run the block (~5 min)

Project the two files and ask the room the same question the exercise asks about their own code: *¿lo subirías a producción?* Then walk one hole at a time — four is plenty, and **the fourth is the one worth the time**.

Ask before telling. The room finds hole 1 fast, hole 2 with a nudge, and almost never finds 3 and 4 — which is the demonstration.

## The holes

**1. Credenciales hardcodeadas** — `server.js`, `ADMIN_PASSWORD` and `SESSION_SECRET`. In the source, in the repo, in every clone, and in the git history forever. Note that nobody asked for authentication: the agent added a login endpoint on its own, which is also a small lesson about scope.

**2. XSS almacenado** — `public/index.html` builds the list with `innerHTML` and string concatenation, and the server stores whatever arrives without validating it. Live demo, ten seconds, and the room stops arguing:

```
curl -X POST localhost:3000/api/notas -H 'Content-Type: application/json' \
  -d '{"alumno":"x","texto":"<img src=x onerror=alert(1)>"}'
```

Then reload the page. (Reset with `echo '[]' > notas.json`.)

**3. Path traversal** — the static-file branch does `path.join(__dirname, "public", req.url)` with no normalization check, so the source and its credentials go to anyone who asks:

```
curl --path-as-is http://localhost:3000/../server.js
```

**The flag matters**: curl and browsers normalize `/../` before sending, so plain `curl http://localhost:3000/../server.js` returns 404 and makes the server look safe. `--path-as-is` sends it raw, which is what an attacker does. Worth saying out loud — *"it looked fine because your client protected you, not because your server did"* — and then chaining it with hole 1: one bug hands over the other.

**4. Nada valida nada, y nada falla ruidosamente** — `JSON.parse(body)` with no try/catch (a malformed body kills the request), `alumno` and `texto` can be missing, empty or 10 MB, ids come from `notas.length + 1` so deleting a note duplicates ids, `Access-Control-Allow-Origin: *` on everything, and two concurrent writes to `notas.json` lose data.

**Spend the time here.** It's the honest shape of the problem: not one dramatic vulnerability, but a hundred small decisions nobody made.

## The line to close on

None of this is the agent being bad at its job. It's the agent doing exactly what was asked — *"hacé una app donde los alumnos dejen notas"* — and everything nobody asked for getting decided by default.

That's the handoff into Session 2: the fix isn't a better prompt, it's a review step.
