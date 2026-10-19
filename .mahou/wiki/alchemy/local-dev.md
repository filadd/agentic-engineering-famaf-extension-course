# Running an Alchemy 2 stack locally with Vite

verified: 2026-10-19

Answers how kurasu's stack runs under `alchemy dev` with Vite in front: which ports it uses, how the classroom WebSocket reaches the API Worker, when the Worker's construction runs, what a Durable Object binding is called and what shape drizzle-kit gives the migrations. The facts come from kurasu's implementation on alchemy 2.0.0 beta.

## Knowledge

- The API Worker declares `dev: { port: 1337 }`, and Vite's proxy forwards `/api` to `http://localhost:1337` with `ws: true`, so the browser sees a single origin as in production. When port 1337 is taken, by another stack for example, the API Worker starts on the first free port and the proxy, still pointed at 1337, never reaches it. Stop the other stack before `pnpm dev`.
- Under `alchemy dev`, `Website.Vite` injects the Cloudflare plugin. That plugin sends every WebSocket upgrade except Vite's HMR to the web's Worker, and the web's Worker answers `/api/classroom` with the SPA's 404 before the proxy gets the request. A dev-only Vite plugin (`apiUpgradesToProxy` in `apps/web/vite.config.ts`, `apply: "serve"`) hands `/api/` upgrades to the proxy's listener only. It relies on Vite registering the proxy's upgrade listener after the `configureServer` hooks and before their post callbacks, so the proxy's listener is the last one when the plugin's post callback runs.
- A Worker's construction (the `Effect.gen` passed to `Cloudflare.Worker`) runs at plan time as well as when the isolate starts, and the bindings exist only in the second. Anything that reads a binding, such as the layers that query D1, is built inside `fetch`.
- A Durable Object binding takes the Durable Object's name, `Aula` in kurasu, which is also its class name. There is no separate binding name such as `AULA`.
- drizzle-kit 1.0 generates each migration as a folder holding `migration.sql` and `snapshot.json` (`migrations/0001_users_and_codes/`), not as a loose `.sql` file. The D1 resource takes the `migrations` folder and applies them.
- The web origin used in links differs per stage: `KURASU_WEB_ORIGIN` is computed in `.env.schema` as `http://localhost:5173` in dev and `https://<domain>` in production, so a link mailed from the local stack opens the local web.

## Sources

- `app/apps/web/vite.config.ts`, `app/apps/api/src/worker.ts`, `app/apps/api/src/classroom/aula.ts`, `app/packages/database/migrations/`, `app/.env.schema`.
- `.scratch/aula-virtual/implement/report-base.md` (T4), `.scratch/aula-virtual/tasks.md` (T20, T21), `.scratch/aula-virtual/reports/validate/index.html` (F2).
