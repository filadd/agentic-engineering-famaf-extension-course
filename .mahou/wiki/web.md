# kurasu: web rules

verified: 2026-10-18

Answers how kurasu's web is built: how screens share pieces, how they reach the API and where files go.

## Knowledge

- A piece used by both the student and the teacher is one component. The common part is inside it, and what each side adds enters through slots: a `ReactNode` prop for a fixed place, or a function that receives the row (`renderActions`, `renderHand`) for a per-row place. There is no admin flag.
- In program designs, slots follow the notation of the plugin's `component-tree` reference: `<slot>`.
- API access follows the wiki entry `tanstack-query/operation-hooks`: one hook per operation in `apps/web/src/features/<topic>/<hook>.ts`, keys from `queryKeys`, the call through `runApi` with the Effect HttpApi client, and typed `options` passed through.
- `useClassroom` handles live classroom updates. Each WebSocket notice invalidates the keys of its topic, and data always comes through the hooks.
- Folders follow the topic, not the file kind: `features/<topic>/` holds a topic's components and hooks together. Browser state helpers go in `helpers/` (`helpers/local-ui/`), shared UI in `ui/`.
- Each file holds one component or hook, and uses named exports.
- Styles use Tailwind 4; the prototypes' colours and dark mode live in the theme.
- The UI is in Spanish; code is in English.

## Sources

- `.scratch/aula-virtual/program-design/kurasu.md`, branches 7 and 8.
