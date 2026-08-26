# Sesión 3 — Herramientas y Skills (Notas para el instructor)

> 📊 **Presentación** — recorrido visual de la sesión en lenguaje llano (dónde vive cada repetición, cuánto cuesta cada opción en contexto, el reveal del hook, los cuatro pasos de la práctica): <https://claude.ai/code/artifact/2079f5cb-b5ad-4538-b176-9080c7cc86aa>
> Privada hasta que se comparta desde el menú de la página.

> A cargo: Diego. Estado: en armado. Todo el material de la sesión (estas notas, `slides.md`, `exercise/README.md`) está en español.

## Objetivo de la sesión (en una frase)

Que salgan sabiendo **convertir lo que le explican al agente una y otra vez en configuración que el agente lee solo** — con la idea internalizada de "lo que le explicaste dos veces, escribilo una".

Y con una segunda idea abajo: **todo lo que le agregás al agente se paga en contexto.** Elegir qué está siempre cargado y qué se carga on demand es una decisión de ingeniería, no un detalle de configuración.

## Audiencia y supuestos

- **Esta sesión dura 2 horas.** No hay bloque de setup: llegan con Pi (Sesión 1) y con `@plannotator/pi-extension` y `pi-subagents` (Sesión 2). La única instalación nueva es `pi-mcp-adapter`, y **se instala al empezar la práctica, no antes** — es el primer movimiento del paso 4, con la sala entera haciéndolo junta y nosotros caminando. Ver "La decisión de herramientas".
- Grupo heterogéneo — de primer año a graduados. Enseñar al medio.
- **Con qué llegan**: su proyecto, un plan y un diff de la Sesión 2, y las notas de la tarea. Nada más.
- **`AGENTS.md` se introduce hoy desde cero.** Nadie escribió uno. El paso que lo pedía en la Sesión 1 se sacó y la Sesión 2 no lo tocó a propósito. No dar por sentado que saben qué es, ni siquiera los que ya usaron otro agente.
- **La materia prima de hoy son sus notas de la tarea** ("¿qué le tuviste que explicar más de una vez?"). Es el único insumo que no podemos generar nosotros. **Se recolecta con Mentimeter** — pregunta abierta, respuestas en pantalla, y quedan proyectadas toda la clase. Si la nube sale floja, la práctica se queda sin combustible: tener cuatro o cinco ejemplos concretos listos para sembrarlos nosotros mismos, redactados como los diría un estudiante y no como categorías:
  - *"Los tests se corren con `pnpm test`, no con `npm test`."*
  - *"Usamos pnpm. Cada vez que me instalaba algo con npm me rompía el lockfile."*
  - *"Los componentes van en `src/components/`, uno por archivo."*
  - *"No me toques los archivos de migraciones."*
  - *"No me pongas comentarios que repiten lo que dice la línea de abajo."*
- **Las extensions de Pi son TypeScript.** No asumir TS en la sala. Hoy *instalamos y configuramos* extensions; escribir una es otra cosa y no es de esta sesión.

## La decisión de herramientas

Sigue **Pi**, y esta vez la arquitectura de Pi *es* el contenido de la sesión.

Se agrega una sola extensión, **[`pi-mcp-adapter`](https://pi.dev/packages/pi-mcp-adapter)**:

```
pi install npm:pi-mcp-adapter
```

**No va como pre-work: se instala en clase, al arrancar el paso 4 de la práctica.** El razonamiento es que un pre-work opcional lo hace la mitad de la sala y arrancamos el paso 4 con dos poblaciones distintas; instalándolo todos juntos, con nosotros caminando, los problemas de red y de permisos aparecen cuando los podemos resolver. Es un comando, no un setup. Sí conviene tenerlo instalado y probado en la máquina de la demo desde antes.

**El regalo que nos hace Pi, otra vez.** Pi es deliberadamente mínimo: el toolbelt de base es `read`, `write`, `edit`, `bash`, `grep`, `find`, `ls`, y **casi todo lo demás es un extension point**. Eso hace visible algo que en otros harnesses está tapado:

| Capacidad | Cómo la provee Pi |
|---|---|
| Toolbelt | built-in: `read`, `write`, `edit`, `bash`, `grep`, `find`, `ls` |
| `AGENTS.md` | archivos de contexto cargados al arrancar |
| Skills | `SKILL.md` con frontmatter, carga en tres etapas |
| Prompt templates | expansión `/nombre` |
| Permisos y plan mode | **un hook**: `tool_call` → `{ block: true, reason }` |
| MCP | **no viene** — `pi install npm:pi-mcp-adapter` |
| Subagentes | extensión `pi-subagents` — **solo se nombra hoy**, el bloque es de Agus (Sesión 4) |

Los permisos, el plan mode, los subagentes y MCP **son todos el mismo mecanismo**. Eso es exactamente lo que Agus les prometió la semana pasada cuando el plan mode les restringió el toolset a `["grep", "find", "ls"]` y él dijo "esto lo abre Diego en la Sesión 3". Es la deuda que hay que pagar hoy, y se paga con una sola frase:

> *"Lo que Plannotator les hizo la semana pasada era `tool_call` → `{block: true}`. El mismo hook que van a usar ustedes hoy."*

**Y la línea que hay que decir en voz alta**: que en Pi MCP venga como extensión y en Claude Code venga de fábrica no es un accidente ni un defecto — es el espacio de diseño de los harnesses. Un harness mínimo te muestra las costuras; uno con baterías incluidas te las esconde. Ninguno de los dos está mal. Esa es la comparación con Claude Code / Codex / OpenCode, y con eso alcanza: **no hay bloque de comparación de harnesses.** Es una línea, no una tabla.

## Plan tema por tema

### Recap y show-and-tell (~10 min) — abre la sesión

Discusión, no slides. Dos disparadores, y el segundo es el que importa.

**1. *"¿Les pareció útil planificar? ¿Hubo algún caso en el que lo habrían ejecutado directo, sin plan?"***

La tarea de la Sesión 2 preguntaba esto como "dónde fue pura ceremonia", que es demasiado abstracto para tirarlo a una sala. Preguntarlo así, y desbloquearlo con un ejemplo concreto: un fix de una línea, un cambio de texto, un color. Lo que en realidad les estamos pidiendo que encuentren es **el umbral donde planificar deja de pagar** — y eso es criterio, no una regla. Las respuestas honestas ("para esto no me servía") son las buenas. **No defender el proceso acá.**

Esto arma el día mejor que una ronda de quejas, porque la respuesta de hoy a "planificar cada vez sale caro" es *escribilo una vez y dejá de planificarlo*. `AGENTS.md` y los skills son lo que escribís en lugar de volver a planificar lo mismo.

**2. *"¿Qué le tuviste que explicar más de una vez?"***

**Este va a Mentimeter.** Es literalmente el insumo de todos los bloques que siguen y de los cuatro pasos de la práctica. Pregunta abierta, seis o siete respuestas, y **la pantalla queda proyectada toda la clase**: vamos a volver a apuntar a esas respuestas cuatro veces.

Por qué Mentimeter y no levantar la mano: responden todos a la vez y en anónimo, así que aparece lo que nadie diría en voz alta, y queda un artefacto escrito que no hay que transcribir. **Tener el menti armado y la pregunta cargada antes de entrar al aula** — no se arma en vivo.

#### El menti, listo para copiar

**Tipo**: pregunta abierta (*open ended*), respuestas múltiples por participante, vista de **lista** y no de nube — la nube de palabras rompe las frases, y acá lo que vale es la frase entera.

**La pregunta, textual:**

> **¿Qué le tuviste que explicar al agente más de una vez esta semana?**
> Escribilo como se lo dirías a él. Una cosa por respuesta; mandá todas las que quieras.

Las dos líneas importan las dos: sin la primera responden con categorías (*"convenciones"*, *"el stack"*) y no sirven; sin la segunda mandan una sola.

**Los ejemplos semilla** — sembrarlos si a los noventa segundos hay menos de cuatro respuestas. Se tiran en voz alta ("a mí esta semana me pasó que…"), no se cargan en la pantalla: sembrar la pantalla mata el anonimato del resto.

1. *"Los tests se corren con `pnpm test`, no con `npm test`."*
2. *"Usamos pnpm. Cada vez que me instalaba algo con npm me rompía el lockfile."*
3. *"Los componentes van en `src/components/`, uno por archivo."*
4. *"No me toques los archivos de migraciones."*
5. *"No me pongas comentarios que repiten lo que dice la línea de abajo."*
6. *"Antes de decirme que terminaste, corré los tests."*

Están redactados como los diría un estudiante y no como categorías, a propósito: es el registro que queremos que copien.

**Los cuatro momentos en que se vuelve a la pantalla** — vale tenerlos en la cabeza porque son la razón de dejarla proyectada: (1) la tabla de *dónde vive cada cosa que repetís*, diciendo en voz alta a qué fila cae cada respuesta; (2) *qué va adentro del `AGENTS.md`*; (3) el paso 1 de la práctica, donde esas notas van pegadas dentro del prompt; (4) el paso 3, donde lo que quedó afuera del archivo se vuelve skill.

**Plan B sin red**, y conviene tenerlo decidido y no improvisarlo: la misma pregunta a mano alzada y las respuestas al pizarrón, en la misma redacción. Se pierde el anonimato y se pierden las respuestas de los callados — que son justamente las buenas—, así que si el aula tiene wifi dudoso, probar el menti desde el celular **antes** de que entre la sala.

**Coordinar con Agus antes de la clase**: cómo cerró realmente la Sesión 2, qué juntó él en su bloque de reflexión, y si la tarea se pidió como estaba escrita. No volver a recolectar lo que él ya juntó.

Este es el bloque elástico: **si el día se estira, se recorta de acá** (mismo criterio que la Sesión 2).

### Qué vamos a ver hoy (~5 min)

Toma las respuestas del menti y las ordena. Cada cosa que le explicaron dos veces es un tipo distinto de repetición, y cada tipo tiene un lugar distinto donde vivir:

| Lo que repetís | Dónde vive | Costo de contexto |
|---|---|---|
| datos del proyecto | `AGENTS.md` | siempre cargado |
| un procedimiento | skill (`SKILL.md`) | on demand |
| un prompt que retipeás | prompt template | on demand |
| una capacidad que falta | tool / MCP | la definición siempre, el resultado on demand |
| un subtask entero | subagente *(Sesión 4)* | contexto aparte |

Ir tomando respuestas del menti en voz alta y diciendo a qué fila cae cada una. Algunas van a caer en dos filas y está bien: elegir es el tema de hoy.

**La última fila se nombra y se deja pasar.** Hoy no damos subagentes: los abre Agus la semana que viene, con un caso de uso de documentación. Si una respuesta del menti cae ahí, decirlo así —*"esa es de la próxima"*— y seguir.

En la metáfora del curso: la Sesión 2 fue **vos poniendo el criterio a mano, cada vez**. Hoy lo escribís una vez y el agente lo lee solo. Es lo que hace un manager cuando deja de repetir la misma corrección en cada 1:1 y escribe el onboarding.

La frase de la sesión:

> *"Lo que le explicaste dos veces, escribilo una."*

Y la advertencia honesta, porque es la contracara: **nada de esto es gratis.** La columna de la derecha de esa tabla es el tema real del día.

### Anatomía: tool, harness y extension points (~13 min)

El bloque que paga la deuda de la Sesión 2. Es teoría con la herramienta abierta, no slides.

**Qué es una tool (~4 min).** Un nombre, un schema y un handler. Eso es todo. El LLM no "usa" la tool: emite un JSON que dice qué tool quiere y con qué argumentos, y **el harness la ejecuta y le devuelve el resultado como texto**. Mostrar el toolbelt de Pi en vivo y abrir una tool call real en la sesión — que vean el JSON.

De ahí sale la idea que vale la pena que se lleven: **una tool mejor suele ganarle a un modelo mejor.** Un modelo excelente con `bash` y nada más va a reimplementar `grep` a mano, mal y caro. Es la razón por la que el resto de la sesión existe.

**Qué es el harness (~4 min).** El programa que envuelve al LLM. Cuatro responsabilidades, y conviene nombrarlas en este orden porque es el orden en que las fueron sintiendo en el curso:

1. **Manejo del contexto** — qué entra, qué se compacta, qué se tira (Sesión 1: la regla del 50%)
2. **Dispatch de tools** — ejecutar lo que el modelo pidió y devolver el resultado
3. **Permisos** — decidir qué se ejecuta y qué no
4. **Extension points** — dejar que otros agreguen cosas

**El reveal (~2 min).** El punto 4 explica el punto 3, y explica la semana pasada. Una extensión de Pi puede escuchar `tool_call` y devolver `{ block: true, reason: "..." }`. Eso es todo lo que era el plan mode: una extensión interceptando tool calls. Decir la frase de arriba y dejar que caiga.

**Qué significa exactamente `{ block: true, reason: "..." }`.** Lo que sigue es material de fondo para el instructor: hay que entenderlo entero, pero **en la sala son el snippet y dos frases**, y el bloque sigue durando 2 minutos. No convertirlo en una clase de TypeScript.

El hook `tool_call` es una función que la extensión registra y que **Pi llama justo antes de ejecutar cada tool call**, pasándole el nombre de la tool y sus argumentos. Lo que esa función devuelve decide qué pasa después:

- **No devolver nada** (o devolver un objeto sin `block`) → Pi ejecuta la tool normalmente. Este es el caso del 99% de las tool calls.
- **Devolver `{ block: true, reason: "..." }`** → Pi **no ejecuta la tool**. El `edit` no toca el archivo, el `bash` no corre. En lugar del resultado real, Pi le devuelve al modelo el string de `reason` como si fuera el resultado de la tool.

Los dos campos:

| Campo | Qué hace |
|---|---|
| `block: true` | la orden: *no ejecutes esto*. Es lo que convierte al hook en un veto. |
| `reason: "..."` | el texto que el modelo recibe **en lugar** del resultado |

**La parte que no es obvia y que hay que decir explícitamente: `reason` no es un mensaje de error para el usuario, es un mensaje para el modelo.** Es la única información que el modelo va a tener sobre por qué su acción no pasó, y de ahí decide qué hace a continuación. Por eso el `reason` importa tanto: `"bloqueado"` deja al modelo reintentando a ciegas; `"estás en plan mode, no podés editar archivos — proponé el plan y esperá aprobación"` lo hace cambiar de estrategia solo. Un buen `reason` es, literalmente, prompt engineering.

El ejemplo que ya vivieron, completo:

```ts
// lo que hacía Plannotator en plan mode, en pseudocódigo
onToolCall(({ name }) => {
  if (planMode && !["grep", "find", "ls"].includes(name)) {
    return { block: true, reason: "Estás en plan mode: solo podés leer. Proponé un plan." }
  }
  // sin return → la tool se ejecuta
})
```

Y el cierre del reveal: **el diálogo de permisos es este mismo hook con un humano en el medio.** En lugar de decidir con un `if`, para y te pregunta; si decís que no, lo que el modelo recibe es exactamente un `{ block: true, reason }`. Permisos, plan mode y sandboxing son todos la misma pieza.

**Sidebar de seguridad (~3 min), acá y no en un bloque aparte.** Los permisos *son* un extension point, así que esto es el mismo material, no una digresión:

- El allowlist/denylist y el diálogo de permisos no son burocracia: son **el único lugar donde decidís antes de que el agente actúe.** Después ya está hecho.
- `bash` es la tool más poderosa del toolbelt y por eso es la más peligrosa. Un agente con `bash` sin restricciones puede hacer cualquier cosa que puedas hacer vos en esa terminal.
- Sandboxing y containerization: Pi tiene documentación propia de esto. Mención y puntero, no demo.
- Y la que se les va a volver relevante en dos sesiones: **el agente lee texto de afuera** (issues, docs, páginas web, resultados de MCP) y ese texto puede contener instrucciones. Nombrarlo y seguir: prompt injection es Sesión 4.

### `AGENTS.md` (~11 min)

Desde cero. **Nadie en la sala escribió uno.**

**Qué es.** Un archivo de texto que el agente lee al arrancar, todas las veces. No hay magia: se pega adelante de la conversación. Por eso funciona, y por eso cuesta.

**Qué va adentro.** Lo que tuvieron que explicar dos veces y no cambia entre tareas:

- Cómo se corre el proyecto y cómo se corren los tests — **los comandos de verificación son lo más valioso que le podés poner**, porque son lo que le permite al agente saber si lo que hizo funciona sin preguntarte
- El stack y las decisiones que ya están tomadas ("usamos pnpm", "no agregues dependencias sin preguntar")
- Dónde van las cosas
- El estilo, pero solo lo que un linter no puede decirle

**Qué no va.** Documentación del dominio que cambia todo el tiempo, cosas que valen para una sola tarea (eso es el prompt), y —la más común— **una wiki**. Si le escribís 400 líneas, estás pagando 400 líneas en cada turno para siempre.

**El orden de carga.** Pi los carga y los concatena desde varios lugares: `~/.pi/agent/` (global, tuyo, todos tus proyectos), los directorios padre, y el directorio actual. Eso es la distinción proyecto/global y vale explicarla con un ejemplo: *"prefiero tabs" va en el global; "los tests se corren con `pnpm test`" va en el del proyecto.* Lo global viaja con vos entre proyectos; lo del proyecto viaja con el repo y le sirve a quien lo clone — **incluido el que lo clona en dos años, que capaz sos vos**.

**El costo, dicho de frente.** Está en contexto en cada turno. Es un impuesto que pagás siempre, uses o no esa información. Dejar la pregunta abierta —*"¿y si el procedimiento que quiero escribir son 60 líneas y lo uso una vez por semana?"*— porque es exactamente el bloque siguiente.

### Skills y prompt templates (~8 min)

**El skill es la respuesta al impuesto que acabamos de nombrar.**

Un skill es un directorio con un `SKILL.md` y frontmatter (`name`, `description`, y opcionalmente `allowed-tools`). Vive en `.pi/skills/` o `.agents/skills/` en el proyecto, o en `~/.pi/agent/skills/` global — el mismo par proyecto/global que `AGENTS.md`.

**Lo que hay que mostrar es cómo se carga, en tres etapas.** Es el artefacto concreto de toda la sesión:

1. Al arrancar, Pi escanea los skills y se queda con **el nombre y la descripción** de cada uno
2. En el system prompt entra solo eso: la lista de nombres y descripciones
3. **El cuerpo del `SKILL.md` se carga recién cuando la tarea lo amerita**

Es decir: tenés veinte skills instalados y pagás veinte descripciones, no veinte procedimientos. Ese es el truco, y es la misma idea que va a volver a aparecer en el bloque de MCP.

**Y nada de esto es una particularidad de Pi: es un estándar abierto.** El formato —un directorio con un `SKILL.md`, frontmatter con al menos `name` y `description`, y opcionalmente `scripts/`, `references/` y `assets/` al lado— lo publicó Anthropic como [Agent Skills](https://agentskills.io/) y lo adoptó un montón de herramientas: Claude Code, Cursor, Copilot y VS Code, Codex, Gemini CLI, OpenCode, Goose, Amp — **y Pi**, que figura en la lista de clientes del estándar. Las tres etapas de arriba tampoco son de Pi: el estándar las llama **progressive disclosure** y son exactamente esas tres (*discovery* → *activation* → *execution*). Detalle lindo para señalar al pasar: el `.agents/skills/` que nombramos dos párrafos arriba es justamente el path que no lleva el nombre de ninguna herramienta.

**Por qué decirlo, y por qué es una frase y no un bloque.** El skill que escriben hoy no está atado a Pi: es **la primera cosa del curso que se llevan tal cual a la herramienta que usen en el trabajo el año que viene**. Eso le cambia el peso al paso 3 de la práctica. Pero la sesión da 120 justos, así que son **treinta segundos sobre la slide de las tres etapas, sin abrir el sitio** — el link va en `resources/` y el detalle en estas notas.

Encaja además con la línea que ya decimos en anatomía: que en Pi MCP venga como extensión y en Claude Code de fábrica es espacio de diseño, no defecto. Para los skills la comparación directamente se disuelve — los dos leen el mismo formato.

**La consecuencia práctica**: la `description` es lo único que decide si el skill se usa. Un skill perfecto con una descripción vaga no se carga nunca. Decirlo así: *"la descripción no es documentación, es el trigger"*.

**Un ejemplo para mostrar en pantalla: `eli5`.** Sirve porque es *todo* el archivo — no hay una segunda pantalla con lo importante. Va tal cual está publicado, así que se puede abrir el archivo en el repo y leerlo en vivo: [`anthropics/claude-plugins-community` → `eli5/skills/eli5/SKILL.md`](https://github.com/anthropics/claude-plugins-community/blob/main/eli5/skills/eli5/SKILL.md).

```markdown
---
name: eli5
description: Explain a topic like I'm a 5 year old. Use when the user types /eli5 <topic> or asks for a dead-simple picture explainer of how something works.
---

# eli5

Explain like I'm someone who knows nothing about this topic, using a HTML artifact with big pictures and few words.

Topic: $ARGUMENTS
```

Tres cosas que se ven de una y que son exactamente las del bloque:

- **Nueve líneas.** Mata de entrada la idea de que escribir un skill es un proyecto. El paso 3 de la práctica deja de dar miedo.
- **La `description` hace las dos cosas que les acabamos de pedir**: dice *qué hace* y *cuándo usarlo*, incluso nombrando la forma en que el usuario lo va a pedir. Es el contraste con "Ayuda a planificar" sin tener que inventarlo.
- **El cuerpo es una sola instrucción.** El valor no está en el largo: está en que esa instrucción no se vuelve a tipear nunca más.

Y el recorrido completo del artefacto, que es lo que le da peso: **lo vimos en un tweet** ([trq212](https://x.com/trq212/status/2090884855798407576)), vive en el repo de plugins de la comunidad de Anthropic, se instala con un comando, y corrido sobre el `COURSE_PROGRAM.md` de este mismo repo produjo [este explicador](https://claude.ai/code/artifact/977c4128-625f-42c0-a78d-02e4425a887b). De verlo en Twitter a usarlo sobre material propio no hay un proyecto en el medio — y el paso intermedio es abrir nueve líneas en GitHub y entenderlas enteras.

> ⚠️ **El matiz, y es lo que hace bueno al ejemplo.** El archivo es portable; **lo que el cuerpo del skill pide, no necesariamente.** Este pide publicar un artifact HTML, y esa tool no existe en Pi de fábrica. Pero existe como extensión: **[`pi-artifacts`](https://pi.dev/packages/pi-artifacts)** (`pi install npm:pi-artifacts`) agrega `artifact_create`, `artifact_preview`, `artifact_publish` y un `/artifact gallery`, y publica sobre Cloudflare Workers.
>
> Así que la frase de los treinta segundos queda mejor dicha completa, y en dos tiempos: *el estándar te llevó el archivo tal cual a otra herramienta; las capacidades que el archivo asume te las tenés que conseguir aparte —una extensión y, si acaso, ajustarle una oración al cuerpo.* Eso es exactamente el espacio de diseño de harnesses que ya dijimos en anatomía —viene de fábrica vs. viene como extensión—, apareciendo por segunda vez en el mismo día sobre un caso concreto. **Es la versión fuerte del argumento, no la débil**: si el skill funcionara idéntico en todos lados no habría nada que enseñar.
>
> **Dos cosas para no arruinarlo:**
> - **`pi-artifacts` no lo instala la sala.** La sesión tiene una sola instalación nueva y es `pi-mcp-adapter` en el paso 4; agregar otra rompe el reloj de la práctica. Va en la máquina de la demo, de antes.
> - **El preview por defecto expira en 60 minutos** salvo que se reclame. Para mostrarlo en clase alcanza y sobra; si queremos dejar el link en `resources/`, hay que publicarlo permanente.

**La regla de dedo de la sesión**, y conviene que quede escrita a la vista (esta sí al pizarrón, o en una slide fija):

> **Datos → `AGENTS.md`. Procedimientos → skill.**

**Prompt templates (~1 min)**: la versión liviana. Un texto que expandís con `/nombre`. Cuando lo que repetís es un prompt y no un procedimiento, no hace falta un skill. Mención y seguir. También existe `/skill:nombre` para invocarlo a mano.

### MCP, y cuánto cuesta (~8 min)

El bloque donde la tesis de la sesión consigue su número más duro. Cuatro tiempos.

**1. Qué es (~2 min).** El agente gana tools en tiempo de ejecución: un servidor externo publica tools y el harness se las ofrece al modelo. En Pi no viene de fábrica — `pi-mcp-adapter`, los servidores se declaran en `.mcp.json` (`mcpServers`, con `command` y `args`), y se maneja con `/mcp setup`, `/mcp tools` y `/mcp-auth <server>`.

**2. Cuánto cuesta (~2 min).** Los números, de [el post de Mario Zechner](https://mariozechner.at/posts/2025-11-02-what-if-you-dont-need-mcp/):

| Servidor MCP | Tools | Tokens | % de la ventana |
|---|---|---|---|
| Playwright MCP | 21 | 13.7k | 6.8% |
| Chrome DevTools MCP | 26 | 18.0k | 9.0% |

Decirlo sin vueltas: **eso es contexto gastado antes de que el estudiante escriba una sola palabra.** Dos servidores instalados y ya pagaste ~15% de la ventana en capacidades que capaz hoy no usás. Es la regla del 50% de la Sesión 1, comida por configuración. Y hay un segundo costo, menos obvio y más molesto: cuarenta tools confunden al modelo.

**3. El contraargumento (~3 min), y este merece la atención de la sala.** **Mario Zechner, que es quien escribe Pi**, sostiene que muchas veces no necesitás MCP. Su alternativa: cuatro scripts de CLI y un README de **~225 tokens**, porque el modelo ya sabe escribir código y usar `bash`. Y el argumento más profundo es de composición: la salida de un CLI cae en un archivo y se puede encadenar, mientras que **el resultado de una tool MCP tiene que pasar por la ventana de contexto** para servir de algo.

**No presentarlo como la respuesta correcta.** Presentarlo como dos ingenieros con criterio que no están de acuerdo — y dejar que vean que "instalá el MCP server" es una decisión con precio, no un default. Que el autor del harness que están usando piense esto le da un peso que no tendría un blog cualquiera; decir quién es.

**4. La respuesta de ingeniería (~1 min).** `pi-mcp-adapter` no expone las tools del servidor: expone **una sola tool proxy de ~200 tokens** y va a buscar el resto cuando hace falta.

Nombrarlo al pasar —*"es exactamente el truco de los skills, aplicado a tools: pagás el nombre, no el cuerpo"*— y **no cerrar acá**: quedan las docs tools, y después sí la tabla, que es el cierre de la teoría.

**Y las docs tools acá**, porque son el arreglo a una falla que ya sintieron: el agente inventa una API. [context7](https://context7.com/) sirve docs actualizadas de librerías — y se consume **como servidor MCP**, así que en la práctica MCP y context7 son un solo paso. [context-hub](https://github.com/andrewyng/context-hub) existe y hace algo parecido; mención al pasar.

### La tabla de cierre (~2 min)

**El cierre de la teoría, y acá sí frenar.** Es la síntesis de los tres bloques anteriores y el momento de decirlo:

| | Siempre cargado | On demand |
|---|---|---|
| Contexto del proyecto | `AGENTS.md` | skill |
| Tools externas | todas las definiciones | la tool proxy |
| Trabajo | tu sesión | *(Sesión 4)* |

**La tercera fila se deja abierta a propósito.** El trabajo mismo también se puede mandar a un contexto aparte —eso son los subagentes, que ya tienen instalados desde la Sesión 2— pero **el bloque es de Agus**: lo abre la semana que viene con un caso de uso de documentación. Una línea, el puntero, y seguir. **No dar el tema hoy**: si se abre, se come la práctica y le pisamos la sesión.

*Dos tecnologías distintas, el mismo movimiento —y la tercera fila queda picando.* Si se llevan una sola cosa de la clase, que sea esta tabla. Dejarla proyectada mientras arranca la práctica.

## Práctica (~45 min)

Cuatro pasos en `exercise/README.md`, más un paso 0 de un minuto: **el `pi install npm:pi-mcp-adapter`, todos juntos, antes de soltarlos.** Los cuatro atacan la misma repetición que el estudiante puso en el menti, así que es un hilo, no cuatro mandados.

La economía que hace que entren en 45 minutos: **context7 se consume como servidor MCP**, así que instalar el adapter y apuntarlo a context7 es *un* paso que cubre dos temas.

1. Pedirle al agente que escriba el `AGENTS.md`, con tus notas en el prompt, y **podarlo** (~12 min)
2. Probalo: la misma tarea, en una sesión nueva — el antes y después (~5 min)
3. Un skill para planificar una feature — el procedimiento de la Sesión 2 (~10 min)
4. Apuntar el adapter a context7 — MCP y docs tools en un movimiento (~10 min)

**Lo que hay que vigilar caminando la sala:**

- **El paso 1 lo escribe el agente, no el estudiante** — que es como se hace en la vida real: el agente lee el `package.json`, los scripts y el árbol de directorios, y saca los datos duros mejor y más rápido. **Lo que el estudiante aporta son sus notas, en el prompt, y la poda después.** El ejercicio de la sesión no es redactar, es *decidir qué se queda*.
- **Y por eso hay que vigilar la poda, que es donde se cae el paso.** El que se queda con la salida cruda tiene un `AGENTS.md` genérico de 200 líneas y no va a ver ningún cambio en el paso 2. Dos cosas para gritar caminando: *"¿el comando de tests que te escribió existe? corrélo"* —un `AGENTS.md` que miente es peor que ninguno— y *"¿están tus notas del menti ahí adentro?"*. Es el mismo movimiento que hicieron con el plan en la Sesión 2: el agente produce, ellos ponen el criterio.
- **El paso 2 es el que no se recorta.** Es donde aterriza la sesión: sesión nueva, misma tarea, y que vean al agente hacer solo lo que antes le tenían que decir. Sin ese contraste, el `AGENTS.md` es un archivo que escribieron porque se lo pedimos.
- **El paso 3 es el skill de planificación, y es a propósito.** El procedimiento que todos repiten y todos vivieron la semana pasada es *planificar una feature*: le describís la feature, leés el plan y se lo mandás de vuelta anotado por las mismas cosas de siempre. Escribir eso una vez es literalmente la respuesta del día al recap (*"planificar cada vez sale caro"*). Y es lo suficientemente genérico como para que todos puedan hacerlo, pero **el skill de cada uno va a salir distinto**, porque las preguntas que a cada uno le faltan dependen de su stack y de su forma de planificar.
- **Vigilar que no copien el ejemplo del `README`.** Es el mismo fallo que la poda del paso 1: si el `SKILL.md` podría estar en el proyecto de cualquier otro, no salió de sus notas. La pregunta para tirar caminando: *"¿qué le anotaste al plan la semana pasada? ¿está escrito ahí?"*. La segunda: *"¿esto ya está en tu `AGENTS.md`?"* — si sí, lo están pagando dos veces.
- **El paso 4 es el que se come el reloj**, y ahora incluye la instalación del adapter (más config, y capaz `/mcp-auth`). Arrancarlo **frenando la práctica un minuto y haciendo el `pi install` todos juntos**, en voz alta, antes de soltarlos: es un comando y conviene que nadie se quede atrás en él. Tener el snippet de `.mcp.json` en una slide, listo para copiar: cero descubrimiento.
- **Los cuatro pasos suman ~37 min sobre 45, y eso es a propósito.** El colchón es para el paso 4, que es el que se cuelga. Si a alguien le sobra tiempo: que vuelva a podar el `AGENTS.md` o que le agregue al skill lo que el plan de prueba le siguió faltando — no que empiece algo nuevo.
- Y el callback a la teoría, para tirarlo mientras caminás: *"fijate cuánto contexto te comió el server que acabás de instalar"*. El costo deja de ser abstracto cuando está en su propia ventana.

## Timing de la sesión (~2 h)

| Bloque | Tiempo |
|---|---|
| Recap y show-and-tell | 10 min |
| Qué vamos a ver hoy | 5 min |
| Anatomía: tool, harness y extension points (+ seguridad) | 13 min |
| `AGENTS.md` | 11 min |
| Skills y prompt templates | 8 min |
| MCP, y cuánto cuesta (+ docs tools y la tabla de cierre) | 10 min |
| Pausa | 5 min |
| **Práctica** | **45 min** |
| Cierre: discusión + qué viene | 8 min |

Da 115, así que hay **~5 min de colchón**: el primer destino es la práctica, el segundo el recap. **Si se estira, recortar del recap** — es el bloque más elástico. No recortar de la práctica, y nunca del paso 2, que es donde aterriza la sesión.

Son 47 minutos de teoría en cuatro bloques. Están ordenados para que cada uno le deje una pregunta abierta al siguiente (`AGENTS.md` cuesta → skills; los skills cargan on demand → MCP; MCP cuesta → la tool proxy, y ahí cierra la tabla). **Si se cae ese encadenado, el día se convierte en un tour de herramientas.** Ensayar las transiciones, no solo los bloques.

## Cierre (~8 min)

- **¿Qué cambió en el paso 2?** Es la pregunta de la sesión. Que cuenten un caso concreto de algo que el agente hizo solo.
- **¿Qué les sorprendió del tooling?** Pregunta abierta del programa; sirve para pescar lo que no cubrimos.
- Cerrar en la tabla de siempre-cargado vs. on-demand. Es la idea que sobrevive al curso: hoy fue `AGENTS.md`, skills y MCP, pero el criterio se aplica a cualquier harness. Y dejar la tercera fila picando: *"el trabajo mismo también se puede mandar a otro contexto — eso lo abre Agus la semana que viene"*.
- **Tarea para la Sesión 4**: seguir usando el `AGENTS.md` y anotar **qué le siguieron explicando igual** — el archivo crece toda la semana, y lo que no entra en él es lo que Agus va a llamar *spec*. Segunda parte: traer una feature que **no** puedan describir en una frase. Es el insumo de spec-driven development.

## Puentes entre sesiones

- **Desde la Sesión 1**: LLM + tool + harness se plantó allá con la promesa de abrirlo acá (`COURSE_PROGRAM.md:163`). La regla del 50% vuelve convertida en el presupuesto siempre-cargado vs. on-demand. **Reusar la redacción exacta que usó Diego en la Sesión 1** para las tres palabras.
- **Desde la Sesión 2**: la tarea abre la sesión, y la restricción del toolset en plan mode se revela como `tool_call` → `{block: true}`. **Coordinar con Agus**: cómo cerró la sesión y qué juntó en su reflexión. Ojo con una promesa que quedó hecha allá: la Sesión 2 dijo *"la profundidad de subagentes es la Sesión 3"* — **ya no**, y hay que decirlo en la sala para no dejarlo colgado.
- **Subagentes se fueron enteros a la Sesión 4 (Agus)**, primitivo incluido, porque él los muestra con un caso de uso de documentación y darlos hoy sería darlos dos veces. Hoy solo se nombran: la fila de la tabla de cierre y la fila del extension point.
- **Hacia la Sesión 4 (Agus)**: subagentes y orquestación son suyos. `AGENTS.md` es contexto siempre presente; las specs por tarea son de él. La tarea de esta semana le arma el terreno. Prompt injection se nombra hoy y se explica allá.
- **Hacia la Sesión 6 (Diego, modelos open source)**: el estándar abierto de skills es el primer ensayo de la tesis con la que cierra el curso — *lo que construís sobrevive al cambio de herramienta*. Allá se cambia el modelo y el `AGENTS.md` y los skills de hoy siguen funcionando; acá ya se puede plantar que el formato tampoco depende de Pi. Una frase, sin anticipar la Sesión 6.
- **Hacia la Sesión 5 (Agus, harness internals)**: ⚠️ **hace falta coordinar y fijar el límite.** Hoy usamos los extension points *desde afuera* (instalar, configurar, registrar una tool). La Sesión 5 abre el loop. La Sesión 5 todavía está en `TBD`, así que este límite es una propuesta hasta que hablemos.

## Herramientas y recursos referenciados

- [Pi](https://pi.dev/docs/latest/) — el harness del curso. Las dos páginas de docs en las que se apoya esta sesión: [Skills](https://pi.dev/docs/latest/skills) y [Extensions](https://pi.dev/docs/latest/extensions).
- [`pi-mcp-adapter`](https://pi.dev/packages/pi-mcp-adapter) — `pi install npm:pi-mcp-adapter`. Una tool proxy (~200 tokens) en lugar de todas las definiciones. Comandos: `/mcp`, `/mcp setup`, `/mcp tools`, `/mcp-auth <server>`. La precedencia de config va `~/.config/mcp/mcp.json` → `~/.agents/mcp.json` → `.mcp.json` → `.pi/mcp.json`.
- [Mario Zechner — "What if you don't need MCP?"](https://mariozechner.at/posts/2025-11-02-what-if-you-dont-need-mcp/) — el contraargumento del bloque de MCP y el mejor número de la sesión. **Es quien escribe Pi**; decirlo, es lo que le da peso en la sala.
- [Agent Skills](https://agentskills.io/) — **el estándar abierto detrás del `SKILL.md`.** Formato publicado por Anthropic y adoptado por Claude Code, Cursor, Copilot/VS Code, Codex, Gemini CLI, OpenCode, Goose, Amp y **Pi**, entre muchos otros. Las páginas que valen: la [especificación](https://agentskills.io/specification) y el [quickstart](https://agentskills.io/skill-creation/quickstart), las dos para `resources/`. Desarrollo abierto en [GitHub](https://github.com/agentskills/agentskills).
- **[`eli5`](https://github.com/anthropics/claude-plugins-community/blob/main/eli5/skills/eli5/SKILL.md)** — el skill de ejemplo del bloque de skills, en `anthropics/claude-plugins-community`. Nueve líneas, `SKILL.md` completo arriba. Lo vimos en [un tweet de trq212](https://x.com/trq212/status/2090884855798407576); autor Thariq Shihipar, MIT, se instala como plugin de Claude Code. Salida de muestra sobre nuestro propio programa: [explicador del COURSE_PROGRAM.md](https://claude.ai/code/artifact/977c4128-625f-42c0-a78d-02e4425a887b). **Corrido en Claude Code; falta en Pi.**
- **[Thariq Shihipar — *Lessons from Building Claude Code: How We Use Skills*](https://x.com/trq212/status/2033949937936085378)** — el mejor texto sobre skills que tenemos, y **del mismo autor que `eli5`**: vale decirlo en la sala. Escrito desde adentro del equipo que hace Claude Code (2026-03-17), con cientos de skills en uso diario. Dos cosas que sirven hoy. (1) Rompe la lectura de "un skill es un markdown": es una **carpeta** — `scripts/`, `references/`, `assets/` que el agente puede descubrir, leer y correr—, que es justo el layout del bloque de anatomía, ahora con un motivo para que importe. (2) Su lista de consejos **es el checklist del paso 3 de la práctica**: no escribir lo que el modelo ya sabe (buscar lo que *"lo saca de su manera normal de pensar"*), mantener una sección de *gotchas* hecha de fallas reales, escribir el `description` para que el modelo dispare y no como resumen para humanos, describir intención en vez de sobre-especificar pasos, y adjuntar scripts helper para que el modelo componga en vez de rearmar boilerplate. Nombra además nueve categorías recurrentes de skill (referencia de librería/API, verificación de producto, data, automatización de procesos, scaffolding, code quality y review, CI/CD, runbooks, infra) — **buena semilla para el Mentimeter** si la nube sale floja. ⚠️ x.com pide login: hay [copia en un gist](https://gist.github.com/Danm72/467f6d6cd193d19c0042371866d53b75).
- **[Anthropic Academy — *Introduction to Agent Skills*](https://anthropic.skilljar.com/introduction-to-agent-skills)** — curso gratis, a ritmo propio, seis módulos: qué es un skill, escribir el primero, configuración y skills multi-archivo, skills vs. otras features de Claude Code, cómo compartirlos, y troubleshooting. **Es lo que se les pasa a los que pidan más al final de la clase** — recorre el mismo terreno que la práctica y en el mismo orden: frontmatter y descriptions que disparan, progressive disclosure como higiene de contexto, `allowed-tools`, distribución por repo o plugin, y un módulo entero sobre la falla que la sala va a tener de verdad: el skill que no dispara. El matiz al recomendarlo: está dado **sobre Claude Code, no sobre Pi** — los conceptos viajan tal cual, parte de la plomería no. Es el mismo matiz de `eli5`, otra vez.
- [`pi-subagents`](https://www.npmjs.com/package/pi-subagents) — instalado en la Sesión 2, **se profundiza en la Sesión 4**. Hoy solo se nombra. [Fuente](https://github.com/nicobailon/pi-subagents).
- [`@plannotator/pi-extension`](https://www.npmjs.com/package/@plannotator/pi-extension) — de la Sesión 2. Hoy vuelve como ejemplo de `tool_call` interception.
- [`pi-artifacts`](https://pi.dev/packages/pi-artifacts) — `pi install npm:pi-artifacts`. Le da a Pi las tools de artifacts (`artifact_create`, `artifact_validate`, `artifact_preview`, `artifact_publish`, `artifact_import_url`, y `/artifact gallery`), publicando sobre Cloudflare Workers. Es lo que le falta a Pi para correr `eli5` tal cual. **Solo en la máquina de la demo** — la sala no instala nada más que `pi-mcp-adapter`. Preview temporal: expira a los 60 min si no se reclama. Límites: 1000 archivos, 5 MiB por asset.
- [context7](https://context7.com/) — docs actualizadas de librerías, se consume como servidor MCP. Por eso MCP y context7 son un solo paso de la práctica.
- [context-hub](https://github.com/andrewyng/context-hub) — alternativa listada en el programa. Mención, sin demo.

## Lo que dejamos afuera a propósito

- **Subagentes y orquestación**: son de la Sesión 4 (Agus), que los abre con un caso de uso de documentación. Hoy solo se nombran, en la tercera fila de la tabla de cierre. Darlos hoy sería darlos dos veces.
- **Worktrees**: quedan afuera del curso, no pospuestos. Eran una mención colgada del bloque de subagentes, ninguna práctica los necesita, y el trabajo en paralelo con git ya se nombró en la Sesión 2. Si alguien pregunta: una frase y puntero a las docs.
- **Escribir una extensión de TypeScript**: es territorio de la Sesión 5. Hoy las instalamos y las configuramos. Además no podemos asumir TS en la sala.
- **La tabla comparativa de harnesses** (Claude Code / Codex / OpenCode): reducida a una línea dentro del bloque de anatomía. Comparar harnesses en abstracto no le sirve a nadie que solo usó uno; lo que sí sirve es entender que "viene de fábrica" vs. "viene como extensión" es una decisión de diseño.
- **Profundidad en comandos de verificación / tests**: los tests fueron la Sesión 2. Acá aparecen solo como lo mejor que le podés poner al `AGENTS.md`.
- **Un bloque propio de seguridad**: plegado dentro de anatomía, donde corresponde, porque los permisos *son* un extension point.
- **Sandboxing y containerization en detalle**: mención y puntero a las docs de Pi. No hay tiempo y no es lo que los desbloquea hoy.

## Pendientes (para próximas iteraciones)

- ~~Redactar el Mentimeter~~ → **escrito**, en el bloque de recap: tipo de pregunta, la pregunta textual, seis ejemplos semilla y el plan B sin red. Queda **cargarlo en Mentimeter** antes de la clase y **probar que la pantalla se pueda dejar proyectada** mientras seguimos con las slides — se vuelve a ella cuatro veces, y esos cuatro momentos están listados ahí.
- **Probar `pi install npm:pi-mcp-adapter` en una máquina limpia** y cronometrarlo. **La instalación se queda en clase — decidido**, mismo criterio que la Sesión 1: un pre-work opcional lo hace la mitad de la sala y arrancaríamos el paso 4 con dos poblaciones. Lo que cambia según el cronómetro no es *dónde* se instala sino *cuánto dura el paso 4*: si 20-30 instalaciones simultáneas contra la red del aula tardan más de un par de minutos, el paso 4 no cierra en 10 y hay que recortarlo, no adelantarlo.
- **Probar context7 en la red del aula con 20-30 personas.** Definir si hace falta API key y, si hace falta, resolverlo antes de la clase y no en el momento.
- **Correr `npx ctx7 setup` en una máquina limpia** y ver **qué archivo de config deja escrito y dónde**. Es el comando que 30 personas van a copiar textual en el paso 4, y el ejercicio les pide después abrir esa config para reconocer el `mcpServers` de la teoría. Si el instalador la deja en un lugar que no es `.mcp.json` en la raíz, ajustar la redacción del paso 4.
- **Verificar la lista de clientes de [Agent Skills](https://agentskills.io/) la semana de la clase.** Crece rápido y la frase que decimos en la sala nombra media docena de herramientas: si alguna cambió, la frase queda vieja. Chequear en particular que **Pi siga figurando** — es lo que hace que la línea funcione en esta sesión y no es un dato que controlemos nosotros.
- **Verificar los números de Zechner el día de la clase** — son específicos de versiones de Playwright MCP y Chrome DevTools MCP y pueden haber cambiado. Si cambiaron, el argumento sigue en pie; actualizar la tabla.
- **Confirmar con Agus que subagentes son suyos** (Sesión 4, con el caso de uso de documentación) y que el paquete del curso sigue siendo `pi-subagents` — hay al menos seis forks en npm. Hoy no se dan: si él prefiere que se nombren de otra manera, ajustar la fila de la tabla de cierre. **Worktrees quedan afuera del curso**; avisarle por si los quería usar.
- **Correr `eli5` en Pi de punta a punta, en la máquina de la demo.** Camino propuesto: copiar el `SKILL.md` a `.pi/skills/eli5/` e instalar [`pi-artifacts`](https://pi.dev/packages/pi-artifacts). Lo que hay que averiguar probándolo: (a) si el cuerpo dispara solo o hay que nombrarle la tool —`artifact_create` / `artifact_publish` no se llaman igual que en Claude Code—, y (b) si hace falta cuenta de Cloudflare para el preview temporal. **Anotar el ajuste exacto que haya que hacerle al archivo, aunque sea una palabra**: ese diff *es* el material del matiz, y mostrarlo en pantalla vale más que contarlo. Si no llegamos a probarlo, mostrar el ejemplo igual pero diciendo que está corrido en Claude Code — no afirmarlo sobre Pi.
- ~~Elegir el proyecto de la demo~~ → **decidido: el repo del curso**, abierto en Pi en la máquina de la demo durante toda la teoría. Es el que se usa en los tres momentos en que hay algo en pantalla: el toolbelt y el JSON de una tool call en el bloque de anatomía, el `AGENTS.md` malo que se le pide al agente en vivo, y `eli5`. Por qué cierra: tiene forma de verdad (un directorio por sesión, tres archivos por sesión), **convenciones que no se deducen del código** —material de estudiantes en español, notas de instructor en inglés— que es exactamente lo que un `AGENTS.md` tiene que capturar, el `CLAUDE.md` ya *es* un `AGENTS.md` que se puede abrir y leer en treinta segundos, y es seguro de proyectar. Y el chiste funciona solo: el `AGENTS.md` del curso sobre agentes.

  **Dos cosas para tener en cuenta antes de la clase, y la primera es de contenido:**

  1. **Este repo no tiene tests ni build**, y el bloque de `AGENTS.md` dice que *los comandos de verificación son lo más valioso que le podés poner*. Si la demo corre sobre un repo sin comandos, el punto más importante del bloque se queda sin ejemplo. **Nombrar el hueco en voz alta y usarlo** — *"a este repo le falta justamente lo más valioso; al de ustedes no"*— y apuntar a que el suyo sí los tiene. La otra opción, si preferís no dar esa explicación, es abrir un segundo repo solo para ese bullet.
  2. **Revisar qué se ve en pantalla**: `.pi/` y cualquier `models.json` con una key quedan fuera del proyector. Vale hacer un `ls -a` antes de compartir pantalla, sobre todo en la Sesión 6, donde el mismo directorio aparece de nuevo.
- **El `AGENTS.md` malo se le pide al agente en el momento** — decidido: no se guarda uno escrito de antemano. Se le pide sin darle nada y sale genérico, largo y con algún comando inventado; si tiene un comando que no existe, mejor, porque ése *es* el punto. El costo de esta decisión hay que asumirlo: **si ese día sale bueno, el antipatrón se cae**. Mitigación barata, y no es lo mismo que tener uno escrito: correr el prompt en la máquina de la demo **el día anterior** y, si la salida sirve, dejar la sesión abierta.
- **Ensayar el bloque de anatomía con reloj**, sobre todo el reveal. Son 13 minutos con la herramienta abierta y el JSON de una tool call en pantalla.
- **Coordinar con Agus** el cierre real de la Sesión 2 y el límite con la Sesión 5.
- ~~Corregir el residuo de `COURSE_PROGRAM.md` que decía que llegan con un `AGENTS.md` de diez líneas de la Sesión 2~~ → **corregido**: ahora dice que se escribe acá desde cero y que llegan con la motivación, no con el archivo.
