# Sesión 5 — Demos

Las tres demos de la slide *Demo* del deck (`../deck/index.html`). Vienen de la charla de BeerJS *Pi: el agente que se construye solo* (2026-06-25). Van de la más chica a la más grande.

## 1 · Una mascota (`demo-1-mascot/`)

No hay código: la demo es pedirle a Pi, en vivo, que se escriba la extensión. `PROMPT.md` tiene el pedido: una mascota ASCII que camina debajo del input y festeja cuando corrés un comando con `!`, en un solo archivo TypeScript y sin dependencias.

- Correr Pi en un directorio vacío y pegarle el prompt.
- Probar con `/reload`, sin reiniciar.
- Lo que muestra: extender el harness es barato y el resultado se lee.

## 2 · Subagentes (`demo-2-subagents/`)

Una extensión de proyecto en `.pi/extensions/subagents.ts` con dos tools:

- **`delegate`** abre una sesión de Pi headless con su propio contexto, devuelve el control enseguida y, cuando termina, inyecta el resultado como `followUp`. Un widget muestra los subagentes activos.
- **`pipeline`** corre una lista de agentes en secuencia; cada uno recibe la salida del anterior (por ejemplo research → implement → review).

La sesión hija carga la misma extensión; la variable `PI_SUBAGENT_CHILD` evita que delegue de nuevo. Para correrla: `cd demo-2-subagents && pi` (Pi carga las extensiones de `.pi/extensions/` del proyecto).

## 3 · Pi en el navegador (`demo-3-browser-agent/`)

`pi-ai` y `pi-agent-core` corriendo en el navegador, sin backend: un chat a la izquierda y, a la derecha, la página que escribe el agente en un filesystem en memoria, renderizada en vivo. `PLAN.md` tiene el diseño completo.

```
cd demo-3-browser-agent
npm install
npm run dev
```

El modelo (`proveedor/modelo`, por defecto `zai/glm-5.2`) y la API key se cargan desde el engranaje de la app y quedan en el `localStorage` del navegador. El pedido de la charla: *"armame una landing page para una cafetería"*.

Las versiones de los paquetes (`@earendil-works/pi-ai` y `pi-agent-core` 0.79) son las de la charla; con Pi 1 puede hacer falta actualizarlas.
