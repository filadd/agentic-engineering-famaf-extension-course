# Sesión 5 — Coding Harness (internals) — Notas para el instructor

> A cargo: Agus. Estado: borrador. Todo el material de la sesión está en español.

## Dónde entra esta hora

La última clase del curso junta la Sesión 5 con el bloque de modelos open-weight de la Sesión 6, que lleva el deck de Diego (`sessions/session-6/deck/index.html`). La Sesión 6 con Ale ya se dio antes, por un conflicto de fechas.

Estas notas cubren solo **la hora del harness**: unos 60 minutos, con el deck `deck/index.html` y su esqueleto con notas de orador en `slides.md`. Las demos de proyectos, el bloque open-weight y el cierre del curso se resuelven aparte, en la misma clase. La versión anterior de esta sesión (2 h 30 con demos, bloques de teoría y una extensión de tarea) queda en el historial de git.

## Objetivo de la hora (en una frase)

Que salgan entendiendo **de qué está hecha la herramienta que usaron todo el curso**, y que las mismas piezas se pueden resolver de otra forma cuando el agente tiene que hacer más que un coding agent.

## El encuadre

**Enseñar el concepto, usar Pi como el espécimen.** Cada slide es una decisión de diseño que cualquier harness tiene que tomar; Pi es el que podemos abrir entero porque es chico.

La base del deck es la charla de BeerJS *Pi: el agente que se construye solo*, que estaba pensada para vender Pi. Dos slides vienen de ese tono: *La misma filosofía* (VS Code vs Vim) y *La diferencia en números*. Decirlas como decisiones distintas, no como un ranking: Claude Code trae todo de fábrica, Pi trae lo mínimo, y ninguno de los dos está mal.

La segunda mitad presenta **pi-durable** con el mismo movimiento: no como un reemplazo de Pi (Earendil dice explícitamente que no lo es), sino como otra respuesta a las mismas decisiones cuando querés guardar la sesión en cualquier lado, correr las tools en otra máquina, sobrevivir a un crash o tener varias personas en la misma sesión.

## Audiencia y supuestos

- Llegan con Pi 1, Plannotator, `pi-subagents`, un servidor MCP, su repo, su `AGENTS.md` y sus skills.
- **No se instala nada y no se escribe código.** Las demos las corre el instructor.
- **No se asume TypeScript.** El código aparece en pantalla para leerlo, no para escribirlo.
- Ya pasaron por la Sesión 6: vieron cambiar el modelo debajo del mismo harness. Esta hora abre lo que quedó arriba de ese modelo.

## Plan slide por slide

Los tiempos son una guía; el detalle de cada slide está en las notas de `slides.md` y en los comentarios del deck.

### Parte 1 — Pi como espécimen (~20 min)

| # | Slide | Tiempo | La idea que tiene que quedar |
|---|---|---|---|
| 1 | Portada | 1 min | Pi "se construye solo": le pedís una capacidad y lee su propio código para escribirse la extensión |
| 2 | Harnesses | 2 min | Un LLM solo predice tokens; el harness (interfaz, loop, tools, memoria, contexto) lo conecta al mundo. La diferencia entre productos es el harness |
| 3 | Ejemplos de harnesses | 1 min | ChatGPT, Lovable y un coding agent: el mismo tipo de modelo con harnesses distintos |
| 4 | Agentes de código | 1 min | El mapa: Claude Code, Codex y los otros. Preguntar quién usó alguno |
| 5 | ¿Qué es Pi? | 2 min | Cuatro tools, prompt de menos de mil tokens, cualquier proveedor, sin permisos, sesiones en árbol |
| 6 | La misma filosofía | 1,5 min | VS Code ≈ Claude Code (todo de fábrica), Vim ≈ Pi (lo mínimo y armás lo tuyo) |
| 7 | La diferencia en números | 2 min | Skills, MCP y code mode en los dos; subagentes, plan mode y memoria en Pi no vienen de fábrica, se agregan |
| 8 | Arquitectura | 2 min | Los cuatro paquetes con la misma estructura de capas que el harness: pi-tui, pi-coding-agent, pi-agent-core, pi-ai. Usás solo las capas que necesitás |
| 9 | Extensiones: la vida de una sesión | 2 min | Una extensión es un archivo TypeScript que escucha eventos; la vista de lejos y los hooks de sesión (switch, fork, compact, tree) |
| 10 | Extensiones: el agent loop | 3 min | El loop como ciclo, un momento por paso. `tool_call` → `{ block: true }` es el plan mode de la Sesión 2, ahora en su lugar |
| 11 | API programática | 2,5 min | Las extensiones no solo miran: cambian modelo y tools, registran capacidades, inyectan mensajes (steer, followUp, nextTurn) y manejan sesiones |

### Demos (~14 min)

| Demo | Tiempo | Qué muestra |
|---|---|---|
| 1 · Una mascota | 3 min | Pi se escribe una extensión en vivo a partir de `demos/demo-1-mascot/PROMPT.md`. Extender es barato y se lee |
| 2 · Subagentes | 6 min | `demos/demo-2-subagents`: `delegate` abre una sesión headless en background y el resultado vuelve como `followUp`; `pipeline` encadena agentes. Menos de trescientas líneas son el mecanismo; el resto es producto |
| 3 · Pi en el navegador | 5 min | `demos/demo-3-browser-agent`: el loop corriendo en el navegador sin backend. El loop es una librería y la terminal es una de sus interfaces |

Cómo correr cada una está en `demos/README.md`. **No tipear en vivo** salvo la demo 1, que es justamente eso.

### Parte 2 — pi-durable (~17 min)

| # | Slide | Tiempo | La idea que tiene que quedar |
|---|---|---|---|
| 13 | ¿Y si queremos más que un coding agent? | 2 min | Un agente pensado para una persona, una terminal y la vida del proceso. Cuatro "y si…" que se salen de eso |
| 14 | Arquitectura de pi-durable | 3 min | La misma estructura de capas. pi-ai abajo; el harness es el marco. Conversaciones, tools y extensiones son las mismas ideas; tareas, entorno de ejecución y storage son nuevos. No trae cliente: lo armás vos |
| 15 | La sesión se guarda donde quieras | 2 min | El harness commitea lo mismo en memoria, IndexedDB, SQLite, JSONL o un Durable Object. El coding agent siempre usa un JSONL |
| 16 | Entornos de ejecución | 2,5 min | El harness está separado de donde actúan las tools. Casos: sandbox, un agente remoto que toca varios sistemas, una sesión que se mueve entre entornos |
| 17 | Durabilidad | 3 min | El "sándwich" de cada efecto: commitear la intención, hacer el efecto, commitear el resultado. Si se cae en el medio, una tool se vuelve a correr solo si es `replay: "safe"`. Las tareas se anidan |
| 18 | Multiplayer | 2,5 min | Varios clientes en una conversación: steer, follow-up, y quien llega tarde arranca de la vista actual |
| 19 | Coding agent vs pi-durable | 2 min | Aspecto por aspecto. No es que uno sea mejor: son respuestas distintas a las mismas decisiones |

**Total: ~51 minutos**, con unos nueve de colchón para preguntas. Si el tiempo aprieta, lo primero que se achica son las demos (la 3 puede quedar en un clip) y después las slides 3 y 4.

## Qué vigilar

- **El tour de features.** La primera mitad viene de una charla que vendía Pi. Si la sala sale pensando "Pi es mejor que Claude Code", el encuadre falló.
- **pi-durable es experimental.** Su README dice que la API cambia sin aviso entre versiones. Presentarlo por las ideas, no como algo para adoptar mañana.
- **El ciclo del loop (slide 10)** es la slide más densa. Ensayarla con reloj.

## Puentes con el resto del curso

- **Sesión 1**: LLM + tool + harness. Hoy se abre el harness entero.
- **Sesión 2**: el plan mode que les restringía las tools aparece en el loop como `tool_call` → `{ block: true }`.
- **Sesión 3**: subagentes como primitiva y MCP de fábrica en Pi 1. Hoy se ve el mecanismo de un subagente en menos de trescientas líneas.
- **Sesión 4**: los subagentes en uso durante la corrida en vivo; acá, cómo están hechos.
- **Sesión 6**: ya cambiaron el modelo debajo del harness. La slide del Qwen adaptado a Pi del deck de Diego muestra el otro sentido: un modelo entrenado para un harness.

## Lo que quedó afuera a propósito

- El árbol de sesión y la compactación en detalle, las tres formas de darle una tool a un modelo, los run modes y el bloque de seguridad del diseño anterior.
- Cómo implementa Pi 1 el MCP (`exposure`, code mode por dentro): solo aparece como una fila de la tabla.
- La propuesta de Diego `propuesta-mcp/` (transportes, code mode y FastMCP): queda en pausa.
- Los documentos de pi-durable: son interesantes pero confunden y no suman a la comparación.
- La extensión como tarea: no hay clase después de esta para revisarla.

## Pendientes

- **Ensayar las tres demos** en la máquina de la clase. La demo 3 usa paquetes de la época de la charla (0.79); probar si siguen andando o actualizarlos.
- **Logos de Amp, Droid, Aider, Cline y Goose** en la slide 4: hoy son texto.
- **Revisar contra las docs de Pi** el texto de la slide 9 (qué aporta `resources_discover` y "puede frenarlo o cambiar cómo se hace") y el parámetro de los modos de entrega de `sendMessage` en la slide 11.
- **Confirmar que Claude Code tiene code mode**, como dice la tabla de la slide 7.
- **`exercise/README.md`** sigue describiendo la extensión de tarea del diseño anterior.
