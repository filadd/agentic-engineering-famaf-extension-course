# kurasu: web rules

verified: 2026-10-19

Answers how kurasu's web is built: how screens share pieces, how they reach the API and where files go.

## Knowledge

- A piece used by both the student and the teacher is one component. The common part is inside it, and what each side adds enters through slots: a `ReactNode` prop for a fixed place, or a function that receives the row (`renderActions`, `renderHand`) for a per-row place. There is no admin flag.
- In program designs, slots follow the notation of the plugin's `component-tree` reference: `<slot>`.
- API access follows the wiki entry `tanstack-query/operation-hooks`: one hook per operation in `apps/web/src/features/<topic>/<hook>.ts`, keys from `queryKeys`, and typed `options` passed through. Each operation hook is built on `useApiQuery` or `useApiMutation` (`apps/web/src/api/`), which call `runApi` with the Effect HttpApi client; a screen never calls `useQuery` or `useMutation` directly. A query whose `queryOptions` are shared with a route guard or another non-hook caller calls `useQuery` over those options instead: `useMe` (shared with the `_app` guard) and `useMaterialFile` (shared with the slides check). `useLogout` still calls `useMutation` directly.
- An operation hook does not list its errors by hand. Its `options` take `EndpointError<"group", "endpoint">` (`apps/web/src/api/api-error.ts`), which reads the error type of that endpoint from the HttpApi client: the endpoint's own errors, its middleware's (`Unauthenticated`, `NoAccess`, `NotTeacher`), `HttpClientError` and `SchemaError`. `useApiQuery` and `useApiMutation` infer the error type from `call` too, so options that name another endpoint's errors fail to typecheck. An endpoint without the login middleware, such as `auth.requestLink`, has no `Unauthenticated` in its errors.
- `useApiMutation` runs the hook's own callbacks before the screen's, and invalidates its `invalidates` keys before the screen's `onSuccess`, so the screen always sees fresh data.
- `useClassroom` handles live classroom updates. Each WebSocket notice invalidates the keys of its topic, and data always comes through the hooks.
- Confirmations and overlays use the shared pieces in `ui/`. `ConfirmAction` takes a `renderTrigger` and an `onConfirm` and wraps `ConfirmDialog`; the dialog closes when `onConfirm` resolves and stays open when it fails. `Backdrop` draws the background of a sheet, an alert or the projected view, and closes on a click outside its content and on Escape.
- Escape closes only the topmost open backdrop. `useCloseOnEscape` keeps one shared stack of closers and one `keydown` listener; with one listener per backdrop, Escape would also close the sheet under a confirmation. The browser runs microtasks between listeners, so by the time the sheet's listener runs, the confirmation is gone and the sheet is on top.
- Folders follow the topic, not the file kind: `features/<topic>/` holds a topic's components and hooks together. Browser state helpers go in `helpers/` (`helpers/local-ui/`), shared UI in `ui/`.
- Each file holds one component or hook, and uses named exports.
- Styles use Tailwind 4; the prototypes' colours and dark mode live in the theme.
- Repeated styles are classes in `@layer components` of `styles.css` (`main-button`, `pill-button`, `input-field`, `paper`, …). A class name must not match a utility Tailwind generates from a theme colour: a `.text-field` class got the `text-field` utility generated from `--color-field` as well, which painted the input's text white on a white field. The input class is `.input-field`.
- The UI is in Spanish; code is in English.

## Sources

- `.scratch/aula-virtual/program-design/kurasu.md`, branches 7 and 8, and its section "Implementación · diferencias con el diseño".
- `app/apps/web/src/api/api-error.ts`, `useApiQuery.ts`, `useApiMutation.ts`, `app/apps/web/src/ui/ConfirmAction.tsx`, `Backdrop.tsx`, `useCloseOnEscape.ts`, `app/apps/web/src/styles.css`.
- `.scratch/aula-virtual/tasks.md`, T19, T21, T23 and T26; `.scratch/aula-virtual/reports/validate/index.html`, F1.
