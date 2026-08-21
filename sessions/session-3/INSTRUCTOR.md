# Sesión 3 — Herramientas y Skills (Notas para el instructor)

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
| Subagentes | extensión `pi-subagents` |

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

**Este va a Mentimeter.** Es literalmente el insumo de todos los bloques que siguen y de los cinco pasos de la práctica. Pregunta abierta, seis o siete respuestas, y **la pantalla queda proyectada toda la clase**: vamos a volver a apuntar a esas respuestas cuatro veces.

Por qué Mentimeter y no levantar la mano: responden todos a la vez y en anónimo, así que aparece lo que nadie diría en voz alta, y queda un artefacto escrito que no hay que transcribir. **Tener el menti armado y la pregunta cargada antes de entrar al aula** — no se arma en vivo. Y un plan B por si la red del aula falla: la misma pregunta a mano alzada y las respuestas al pizarrón.

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
| un subtask entero | subagente | contexto aparte |

Ir tomando respuestas del menti en voz alta y diciendo a qué fila cae cada una. Algunas van a caer en dos filas y está bien: elegir es el tema de hoy.

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

**La consecuencia práctica**: la `description` es lo único que decide si el skill se usa. Un skill perfecto con una descripción vaga no se carga nunca. Decirlo así: *"la descripción no es documentación, es el trigger"*.

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

Nombrarlo al pasar —*"es exactamente el truco de los skills, aplicado a tools: pagás el nombre, no el cuerpo"*— y **no cerrar acá**. La tabla que sintetiza esto va al final del bloque siguiente, cuando ya estén nombrados los subagentes.

**Y las docs tools acá**, porque son el arreglo a una falla que ya sintieron: el agente inventa una API. [context7](https://context7.com/) sirve docs actualizadas de librerías — y se consume **como servidor MCP**, así que en la práctica MCP y context7 son un solo paso. [context-hub](https://github.com/andrewyng/context-hub) existe y hace algo parecido; mención al pasar.

### Subagentes y worktrees (~7 min)

Profundidad sobre lo que la Sesión 2 usó dos veces como subtema (revisar el plan, revisar el diff). Ya tienen `pi-subagents` instalado.

**La razón honesta para usar uno: un contexto aparte.** No es "más IA". Cuando le pedís a un subagente que explore el repo y te diga dónde está el manejo de sesiones, el subagente se come veinte archivos en *su* ventana y te devuelve tres párrafos a *la tuya*. Lo que ganás es que la basura quedó afuera. Es la misma economía de todo el día.

De ahí se deduce cuándo sirve y cuándo no:

- **Sirve** cuando la tarea genera mucho material intermedio y poco resultado: explorar, buscar, revisar, resumir.
- **No sirve** cuando necesitás el detalle en tu propio contexto para seguir trabajando, o cuando la tarea es corta. Delegar cuesta un round-trip.

Tipos de agente: research, exploración, code review. Que vean que son el mismo mecanismo con distinto prompt y distinto toolset — **otra vez, extension points**.

**Worktrees, una línea**: ejecución paralela aislada, cada agente en su propio checkout, sin pisarse. Mención y puntero.

**El cierre de la teoría, y acá sí frenar.** Con el subagente ya nombrado, la tercera fila de la tabla se puede escribir. Es la síntesis de los tres bloques anteriores y el momento de decirlo:

| | Siempre cargado | On demand |
|---|---|---|
| Contexto del proyecto | `AGENTS.md` | skill |
| Tools externas | todas las definiciones | la tool proxy |
| Trabajo | tu sesión | subagente |

*Tres tecnologías distintas, el mismo movimiento.* Si se llevan una sola cosa de la clase, que sea esta tabla. Que quede proyectada mientras arranca la práctica.

Y el límite, dicho explícitamente porque el programa lo marca: **hoy vemos el primitivo. Orquestar varios agentes es la Sesión 4 (Agus).** No abrir eso.

## Práctica (~45 min)

Cinco pasos en `exercise/README.md`, más un paso 0 de un minuto: **el `pi install npm:pi-mcp-adapter`, todos juntos, antes de soltarlos.** Los cinco pasos atacan la misma repetición que el estudiante puso en el menti, así que es un hilo, no cinco mandados.

La economía que hace que cinco entren en 45 minutos: **context7 se consume como servidor MCP**, así que instalar el adapter y apuntarlo a context7 es *un* paso que cubre dos temas.

1. Pedirle al agente que escriba el `AGENTS.md`, con tus notas en el prompt, y **podarlo** (~12 min)
2. Probalo: la misma tarea, en una sesión nueva — el antes y después (~5 min)
3. Un skill para el procedimiento que repetís (~10 min)
4. Apuntar el adapter a context7 — MCP y docs tools en un movimiento (~10 min)
5. Un subagente sobre tu propio código (~8 min)

**Lo que hay que vigilar caminando la sala:**

- **El paso 1 lo escribe el agente, no el estudiante** — que es como se hace en la vida real: el agente lee el `package.json`, los scripts y el árbol de directorios, y saca los datos duros mejor y más rápido. **Lo que el estudiante aporta son sus notas, en el prompt, y la poda después.** El ejercicio de la sesión no es redactar, es *decidir qué se queda*.
- **Y por eso hay que vigilar la poda, que es donde se cae el paso.** El que se queda con la salida cruda tiene un `AGENTS.md` genérico de 200 líneas y no va a ver ningún cambio en el paso 2. Dos cosas para gritar caminando: *"¿el comando de tests que te escribió existe? corrélo"* —un `AGENTS.md` que miente es peor que ninguno— y *"¿están tus notas del menti ahí adentro?"*. Es el mismo movimiento que hicieron con el plan en la Sesión 2: el agente produce, ellos ponen el criterio.
- **El paso 2 es el que no se recorta.** Es donde aterriza la sesión: sesión nueva, misma tarea, y que vean al agente hacer solo lo que antes le tenían que decir. Sin ese contraste, el `AGENTS.md` es un archivo que escribieron porque se lo pedimos.
- **El paso 4 es el que se come el reloj**, y ahora incluye la instalación del adapter (más config, y capaz `/mcp-auth`). Arrancarlo **frenando la práctica un minuto y haciendo el `pi install` todos juntos**, en voz alta, antes de soltarlos: es un comando y conviene que nadie se quede atrás en él. Tener el snippet de `.mcp.json` en una slide, listo para copiar: cero descubrimiento.
- **Decir en voz alta que no terminar el paso 5 está bien.** Ocho minutos son ocho minutos.
- Y el callback a la teoría, para tirarlo mientras caminás: *"fijate cuánto contexto te comió el server que acabás de instalar"*. El costo deja de ser abstracto cuando está en su propia ventana.

## Timing de la sesión (~2 h)

| Bloque | Tiempo |
|---|---|
| Recap y show-and-tell | 10 min |
| Qué vamos a ver hoy | 5 min |
| Anatomía: tool, harness y extension points (+ seguridad) | 13 min |
| `AGENTS.md` | 11 min |
| Skills y prompt templates | 8 min |
| MCP, y cuánto cuesta (+ docs tools) | 8 min |
| Subagentes y worktrees (+ la tabla de cierre) | 7 min |
| Pausa | 5 min |
| **Práctica** | **45 min** |
| Cierre: discusión + qué viene | 8 min |

Da 120 justos, así que no hay colchón. **Si se estira, recortar del recap** — es el bloque más elástico. No recortar de la práctica, y nunca del paso 2, que es donde aterriza la sesión.

Son 52 minutos de teoría en cinco bloques, que es mucho seguido. Están ordenados para que cada uno le deje una pregunta abierta al siguiente (`AGENTS.md` cuesta → skills; los skills cargan on demand → MCP; MCP cuesta → la tool proxy; la tool proxy → subagentes, y ahí recién cierra la tabla). **Si se cae ese encadenado, el día se convierte en un tour de herramientas.** Ensayar las transiciones, no solo los bloques.

## Cierre (~8 min)

- **¿Qué cambió en el paso 2?** Es la pregunta de la sesión. Que cuenten un caso concreto de algo que el agente hizo solo.
- **¿Qué les sorprendió del tooling?** Pregunta abierta del programa; sirve para pescar lo que no cubrimos.
- Cerrar en la tabla de siempre-cargado vs. on-demand. Es la idea que sobrevive al curso: hoy fue `AGENTS.md`, skills y MCP, pero el criterio se aplica a cualquier harness.
- **Tarea para la Sesión 4**: seguir usando el `AGENTS.md` y anotar **qué le siguieron explicando igual** — el archivo crece toda la semana, y lo que no entra en él es lo que Agus va a llamar *spec*. Segunda parte: traer una feature que **no** puedan describir en una frase. Es el insumo de spec-driven development.

## Puentes entre sesiones

- **Desde la Sesión 1**: LLM + tool + harness se plantó allá con la promesa de abrirlo acá (`COURSE_PROGRAM.md:163`). La regla del 50% vuelve convertida en el presupuesto siempre-cargado vs. on-demand. **Reusar la redacción exacta que usó Diego en la Sesión 1** para las tres palabras.
- **Desde la Sesión 2**: la tarea abre la sesión; la restricción del toolset en plan mode se revela como `tool_call` → `{block: true}`; los subagentes pasan de subtema a bloque. **Coordinar con Agus**: cómo cerró la sesión y qué juntó en su reflexión.
- **`pi-subagents` queda confirmado como el paquete del curso** — es lo que pide `COURSE_PROGRAM.md:373`. Cerrarlo hoy.
- **Hacia la Sesión 4 (Agus)**: hoy es el *primitivo* subagente; la orquestación y el patrón Teams son suyos. `AGENTS.md` es contexto siempre presente; las specs por tarea son de él. La tarea de esta semana le arma el terreno. Prompt injection se nombra hoy y se explica allá.
- **Hacia la Sesión 5 (Agus, harness internals)**: ⚠️ **hace falta coordinar y fijar el límite.** Hoy usamos los extension points *desde afuera* (instalar, configurar, registrar una tool). La Sesión 5 abre el loop. La Sesión 5 todavía está en `TBD`, así que este límite es una propuesta hasta que hablemos.

## Herramientas y recursos referenciados

- [Pi](https://pi.dev/docs/latest/) — el harness del curso. Las dos páginas de docs en las que se apoya esta sesión: [Skills](https://pi.dev/docs/latest/skills) y [Extensions](https://pi.dev/docs/latest/extensions).
- [`pi-mcp-adapter`](https://pi.dev/packages/pi-mcp-adapter) — `pi install npm:pi-mcp-adapter`. Una tool proxy (~200 tokens) en lugar de todas las definiciones. Comandos: `/mcp`, `/mcp setup`, `/mcp tools`, `/mcp-auth <server>`. La precedencia de config va `~/.config/mcp/mcp.json` → `~/.agents/mcp.json` → `.mcp.json` → `.pi/mcp.json`.
- [Mario Zechner — "What if you don't need MCP?"](https://mariozechner.at/posts/2025-11-02-what-if-you-dont-need-mcp/) — el contraargumento del bloque de MCP y el mejor número de la sesión. **Es quien escribe Pi**; decirlo, es lo que le da peso en la sala.
- [`pi-subagents`](https://www.npmjs.com/package/pi-subagents) — ya instalado en la Sesión 2, se profundiza hoy. [Fuente](https://github.com/nicobailon/pi-subagents).
- [`@plannotator/pi-extension`](https://www.npmjs.com/package/@plannotator/pi-extension) — de la Sesión 2. Hoy vuelve como ejemplo de `tool_call` interception.
- [context7](https://context7.com/) — docs actualizadas de librerías, se consume como servidor MCP. Por eso MCP y context7 son un solo paso de la práctica.
- [context-hub](https://github.com/andrewyng/context-hub) — alternativa listada en el programa. Mención, sin demo.

## Lo que dejamos afuera a propósito

- **Orquestación de agentes**: es la Sesión 4 (Agus). Hoy el primitivo, nada más. El programa marca ese límite explícitamente.
- **Escribir una extensión de TypeScript**: es territorio de la Sesión 5. Hoy las instalamos y las configuramos. Además no podemos asumir TS en la sala.
- **La tabla comparativa de harnesses** (Claude Code / Codex / OpenCode): reducida a una línea dentro del bloque de anatomía. Comparar harnesses en abstracto no le sirve a nadie que solo usó uno; lo que sí sirve es entender que "viene de fábrica" vs. "viene como extensión" es una decisión de diseño.
- **Worktrees más allá de una mención**: la práctica ya tiene cinco pasos y ninguno los necesita.
- **Profundidad en comandos de verificación / tests**: los tests fueron la Sesión 2. Acá aparecen solo como lo mejor que le podés poner al `AGENTS.md`.
- **Un bloque propio de seguridad**: plegado dentro de anatomía, donde corresponde, porque los permisos *son* un extension point.
- **Sandboxing y containerization en detalle**: mención y puntero a las docs de Pi. No hay tiempo y no es lo que los desbloquea hoy.

## Pendientes (para próximas iteraciones)

- **Armar el Mentimeter antes de la clase** con la pregunta *"¿qué le tuviste que explicar más de una vez?"* y los cuatro o cinco ejemplos concretos listos para sembrar si la nube sale floja. Probar que la pantalla se pueda dejar proyectada mientras seguimos con las slides — vamos a volver a ella cuatro veces.
- **Probar `pi install npm:pi-mcp-adapter` en una máquina limpia** y cronometrarlo. Se instala en clase (paso 4), así que 20-30 instalaciones simultáneas pasan por la red del aula: si tarda más de un par de minutos, el paso 4 no cierra en 10 y hay que reconsiderar el pre-work.
- **Probar context7 en la red del aula con 20-30 personas.** Definir si hace falta API key y, si hace falta, resolverlo antes de la clase y no en el momento.
- **Correr `npx ctx7 setup` en una máquina limpia** y ver **qué archivo de config deja escrito y dónde**. Es el comando que 30 personas van a copiar textual en el paso 4, y el ejercicio les pide después abrir esa config para reconocer el `mcpServers` de la teoría. Si el instalador la deja en un lugar que no es `.mcp.json` en la raíz, ajustar la redacción del paso 4.
- **Verificar los números de Zechner el día de la clase** — son específicos de versiones de Playwright MCP y Chrome DevTools MCP y pueden haber cambiado. Si cambiaron, el argumento sigue en pie; actualizar la tabla.
- **Confirmar `pi-subagents`** como el paquete del curso (`COURSE_PROGRAM.md:373`). Hay al menos seis forks en npm.
- **Elegir el proyecto de la demo.** Tiene que tener suficiente forma como para que un `AGENTS.md` no sea trivial, y ser seguro de mostrar en el proyector.
- **Tener un `AGENTS.md` malo guardado de antemano**, y la mejor manera de conseguirlo es **pedírselo al agente sin darle nada**: sale genérico, largo y con algún comando inventado. Guardar esa salida cruda tal cual. Es exactamente lo que van a ver en el paso 1 antes de podar, así que sirve para el antipatrón sin depender de producirlo en vivo. Si tiene un comando que no existe, mejor: es el punto.
- **Ensayar el bloque de anatomía con reloj**, sobre todo el reveal. Son 13 minutos con la herramienta abierta y el JSON de una tool call en pantalla.
- **Coordinar con Agus** el cierre real de la Sesión 2 y el límite con la Sesión 5.
- **Corregir `COURSE_PROGRAM.md:245`**, que todavía dice que los estudiantes llegan con un `AGENTS.md` de diez líneas escrito en la Sesión 2. Es residuo de antes de que se sacara ese paso.
