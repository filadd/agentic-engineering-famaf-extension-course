# Sesión 3 — Herramientas y Skills (Notas para el instructor)

> 🎞️ **Deck de la clase**: [`deck/index.html`](deck/index.html) — animado e interactivo, se abre directo en el navegador (← → para avanzar, `F` pantalla completa). `slides.md` sigue el mismo orden, slide por slide, con las notas de orador.
>
> 📊 **Presentación** — recorrido visual de la sesión en lenguaje llano: <https://claude.ai/code/artifact/2079f5cb-b5ad-4538-b176-9080c7cc86aa>
> Privada hasta que se comparta desde el menú de la página. ⚠️ Es anterior al cambio a Pi 1.0 y a la reestructuración de octubre: todavía habla de `pi-mcp-adapter` y del reveal del hook, y no tiene subagentes.

> A cargo: Diego. Estado: en armado. Todo el material de la sesión (estas notas, `slides.md`, `exercise/README.md`) está en español.

## Objetivo de la sesión (en una frase)

Que salgan sabiendo **convertir lo que le explican al agente una y otra vez en configuración que el agente lee solo** — con la idea internalizada de "lo que le explicaste dos veces, escribilo una".

Y con una segunda idea abajo: **todo lo que le agregás al agente se paga en contexto.** Elegir qué está siempre cargado y qué se carga on demand es una decisión de ingeniería, no un detalle de configuración.

## Audiencia y supuestos

- **Esta sesión dura 2 horas.** No hay bloque de setup: llegan con Pi 1.0 (Sesión 1) y con `@plannotator/pi-extension` (Sesión 2). MCP viene de fábrica en Pi 1.0. Lo único que se instala hoy es **`pi-subagents`**, en el paso 5 de la práctica (`pi install npm:pi-subagents`). ⚠️ Esa extensión pide **Pi 1.2.0 o más nueva**: ver "Pendientes".
- Grupo heterogéneo — de primer año a graduados. Enseñar al medio.
- **Con qué llegan**: su proyecto, un plan y un diff de la Sesión 2, y las notas de la tarea. Nada más.
- **`AGENTS.md` se introduce hoy desde cero.** Nadie escribió uno. El paso que lo pedía en la Sesión 1 se sacó y la Sesión 2 no lo tocó a propósito. No dar por sentado que saben qué es, ni siquiera los que ya usaron otro agente.
- **La materia prima de hoy son sus notas de la tarea** ("¿qué le tuviste que explicar más de una vez?"). Es el único insumo que no podemos generar nosotros. **Se recolecta con Mentimeter** — pregunta abierta, respuestas en pantalla, y quedan proyectadas toda la clase. Si la nube sale floja, la práctica se queda sin combustible: tener cuatro o cinco ejemplos concretos listos para sembrarlos nosotros mismos (están en el bloque de recap).
- **Las extensions de Pi son TypeScript.** No asumir TS en la sala. Hoy *instalamos* una extensión; escribir una es otra cosa y no es de esta sesión.

## La decisión de herramientas

Sigue **Pi**, y esta vez la arquitectura de Pi *es* el contenido de la sesión.

**El curso usa Pi 1.0, que trae MCP de fábrica.** No se agrega ninguna extensión para MCP: los servidores se declaran en `.pi/mcp.json` (proyecto) o `~/.pi/agent/mcp.json` (global), con la misma forma `mcpServers` que en cualquier otro host, y se manejan con `/mcp`, `/mcp login <server>` y `/reload`, o desde la shell con `pi mcp add` / `pi mcp list`. Detalle en [las docs de MCP de Pi](https://pi.dev/docs/latest/mcp).

Lo que importa para la sesión es **cómo le llegan las tools al modelo**, que Pi controla con `exposure` por servidor (y `toolExposure` por tool):

| `exposure` | Qué ve el modelo |
|---|---|
| `codemode` *(default)* | nada declarado: las tools se llaman desde un script JS (`codemode`) y al contexto vuelve solo el resultado |
| `deferred` | `tool_search`, que declara la tool que matchea para la próxima llamada |
| `direct` | todas las definiciones, como una tool más — es lo que cuesta los 13.7k de Playwright |
| `hidden` | registradas, pero inalcanzables |

Pi 1.0 implementa de fábrica las dos buenas prácticas de cliente que recomienda la spec de MCP: descubrimiento progresivo (`deferred`) y code mode (`codemode`).

**Los tres formatos de hoy son estándares abiertos, y de la misma casa.** `AGENTS.md`, Agent Skills y MCP están en la [Agentic AI Foundation (AAIF)](https://aaif.io/), dentro de la Linux Foundation. OpenAI donó `AGENTS.md` y Anthropic donó MCP cuando se formó la fundación ([9 de diciembre de 2025](https://aaif.io/news/linux-foundation-announces-formation-of-aaif)); Anthropic donó Agent Skills el 22 de octubre de 2026. Las tres portadas de sección lo dicen en la línea chica: se cuenta entero en la de `AGENTS.md` y se nombra al pasar en las otras dos. El punto para la sala: **nada de lo que escriben hoy está atado a Pi**, y lo donaron empresas que compiten entre sí.

**Lo que salió de esta sesión: la anatomía.** El bloque de tool, harness y extension points —con el reveal de que el plan mode de la Sesión 2 era un hook `tool_call` → `{ block: true, reason }`, el `reason` como mensaje para el modelo y el sidebar de permisos y seguridad— se sacó del deck para hacerles lugar a los subagentes. La deuda que dejó la Sesión 2 (*"esto lo abre Diego en la Sesión 3"*) **ya no se paga acá**: el mecanismo es contenido de la Sesión 5, que abre el loop con sus extension points. Si alguien pregunta en la sala: *"eso se abre en la Sesión 5"*. Ver "Puentes".

## Plan tema por tema

### Recap y show-and-tell (~8 min) — abre la sesión

Discusión, no slides. Dos disparadores, y el segundo es el que importa.

**1. *"¿Les pareció útil planificar? ¿Hubo algún caso en el que lo habrían ejecutado directo, sin plan?"***

La tarea de la Sesión 2 preguntaba esto como "dónde fue pura ceremonia", que es demasiado abstracto para tirarlo a una sala. Preguntarlo así, y desbloquearlo con un ejemplo concreto: un fix de una línea, un cambio de texto, un color. Lo que en realidad les estamos pidiendo que encuentren es **el umbral donde planificar deja de pagar** — y eso es criterio, no una regla. Las respuestas honestas ("para esto no me servía") son las buenas. **No defender el proceso acá.**

Esto arma el día mejor que una ronda de quejas, porque la respuesta de hoy a "planificar cada vez sale caro" es *escribilo una vez y dejá de repetirlo*.

**2. *"¿Qué le tuviste que explicar más de una vez?"***

En el deck, la tarjeta trae dos ejemplos para desbloquearla: *¿cómo se levanta el server? ¿cómo se corren los tests?*

**Este va a Mentimeter.** Es el insumo de los bloques que siguen y de la práctica. Pregunta abierta, seis o siete respuestas, y **la pantalla queda proyectada toda la clase**.

Por qué Mentimeter y no levantar la mano: responden todos a la vez y en anónimo, así que aparece lo que nadie diría en voz alta, y queda un artefacto escrito que no hay que transcribir. **Tener el menti armado y la pregunta cargada antes de entrar al aula** — no se arma en vivo.

#### El menti, listo para copiar

**Tipo**: pregunta abierta (*open ended*), respuestas múltiples por participante, vista de **lista** y no de nube — la nube de palabras rompe las frases, y acá lo que vale es la frase entera.

**La pregunta, textual:**

> **¿Qué le tuviste que explicar al agente más de una vez esta semana?**
> Escribilo como se lo dirías a él. Una cosa por respuesta; mandá todas las que quieras.

Las dos líneas importan las dos: sin la primera responden con categorías (*"convenciones"*, *"el stack"*) y no sirven; sin la segunda mandan una sola.

**Los ejemplos semilla** — sembrarlos si a los noventa segundos hay menos de cuatro respuestas. Se tiran en voz alta ("a mí esta semana me pasó que…"), no se cargan en la pantalla: sembrar la pantalla mata el anonimato del resto.

1. *"Los tests se corren con `pnpm test`, no con `npm test`."*
2. *"Antes de terminar, corré `pnpm lint`."*
3. *"Los componentes van en `src/components/`, uno por archivo."*
4. *"No me toques los archivos de migraciones."*
5. *"No me pongas comentarios que repiten lo que dice la línea de abajo."*
6. *"Antes de decirme que terminaste, corré los tests."*

Están redactados como los diría un estudiante y no como categorías, a propósito: es el registro que queremos que copien.

**Los tres momentos en que se vuelve a la pantalla** — son la razón de dejarla proyectada: (1) *qué va adentro del `AGENTS.md`*, diciendo en voz alta a qué sección cae cada respuesta; (2) el paso 1 de la práctica, donde esas notas van pegadas dentro del prompt; (3) el paso 3, donde lo que quedó afuera del archivo se vuelve skill.

**Plan B sin red**, y conviene tenerlo decidido y no improvisarlo: la misma pregunta a mano alzada y las respuestas al pizarrón, en la misma redacción. Se pierde el anonimato y se pierden las respuestas de los callados — que son justamente las buenas—, así que si el aula tiene wifi dudoso, probar el menti desde el celular **antes** de que entre la sala.

**Coordinar con Agus antes de la clase**: cómo cerró realmente la Sesión 2, qué juntó él en su bloque de reflexión, y si la tarea se pidió como estaba escrita. No volver a recolectar lo que él ya juntó.

Este es el bloque elástico: **si el día se estira, se recorta de acá** (mismo criterio que la Sesión 2).

### Qué vamos a ver hoy (~5 min)

Dos slides después del recap, y las dos plantan el día.

**"Lo que le explicaste dos veces, escribilo una."** Tres terminales (lunes, miércoles, viernes) con las mismas correcciones —*los tests se corren con `pnpm test`*, *antes de terminar, corré `pnpm lint`*, *¿otra vez guardaste componentes fuera de `src/components`?*— que con un click colapsan en un `AGENTS.md` de tres líneas. Cada línea del archivo sale de algo que se repitió. Es la frase de la sesión; que quede escrita a la vista.

En la metáfora del curso: la Sesión 2 fue **vos poniendo el criterio a mano, cada vez**. Hoy lo escribís una vez y el agente lo lee solo. Es lo que hace un manager cuando deja de repetir la misma corrección en cada 1:1 y escribe el onboarding.

**Nada de esto es gratis.** La contracara, y el tema real del día: todo lo que le agregás al agente se paga en contexto. En el deck es una barra de la ventana (200k) con la línea del 50%, y tres clicks prenden filas: el `AGENTS.md` global (`~/.pi/agent/AGENTS.md`, ~500 tokens: el tuyo, para todos tus proyectos) y el del repo (~1.500); las descripciones de 20 skills (~2.000); Playwright MCP (~13.700) y Context7 MCP (~2.000). Con todo prendido marca ~11%, y lo que más pesa es Playwright. Separar el global del del repo es a propósito: planta desde el principio que hay dos, y vuelve en *Cómo los encuentra Pi*. Es la regla del 50% de la Sesión 1, vuelta presupuesto.

### `AGENTS.md` (~15 min)

Desde cero. **Nadie en la sala escribió uno.**

**Qué es.** Un archivo de texto que el agente lee al arrancar, todas las veces: un README para agentes. El README le explica el proyecto a personas; el `AGENTS.md` le dice al agente lo que no puede deducir del código, y puede apuntar al README en vez de copiarlo. Es un estándar abierto ([agents.md](https://agents.md/)) que OpenAI donó a la AAIF: la portada lo dice, y acá se cuenta la historia de los tres estándares (ver "La decisión de herramientas").

**Qué va adentro** — una slide con el `AGENTS.md` del todo-app a la izquierda y una tarjeta por paso a la derecha:

1. **Cómo se corre y cómo se verifica** — **los comandos de verificación son lo más valioso que le podés poner**, porque son lo que le permite al agente saber si lo que hizo funciona sin preguntarte.
2. **Stack y decisiones ya tomadas** — "Node + Express, sin framework", "los datos viven en `db.json`".
3. **Dónde va cada cosa** — para que no invente carpetas nuevas.
4. **Estilo** — solo lo que un linter no puede decirle.
5. **Boundaries** — siempre · nunca · preguntar primero. En el ejemplo: *siempre* corré `pnpm test` antes de decir que terminaste; *nunca* uses npm (rompe el lockfile) ni agregues una base de datos; *preguntá primero* antes de agregar dependencias. Es la sección que tienen los `AGENTS.md` de verdad (Cloudflare la llama *always / ask first / never*).
6. **No arranques de cero** — pedile al agente un primer `AGENTS.md`: lee los scripts y las carpetas mejor que vos. Después lo podás. Anticipa el paso 1 de la práctica.

**Instrucciones vagas vs. usables.** La tabla de [*Writing an effective AGENTS.md*](https://aaif.io/blog/writing-an-effective-agents-md) (AAIF, 2026), traducida, una fila por click: cinco instrucciones vagas (*"corré los tests"*, *"no edites el código generado"*, *"seguí los patrones existentes"*, *"respetá la arquitectura"*, *"usá el proceso de build estándar"*), **qué les falta** y la versión usable. La columna del medio es la que hay que señalar: cada instrucción vaga deja una pregunta abierta, y el agente la contesta adivinando. *La especificidad sirve cuando le saca una decisión que el agente tendría que tomar.*

Y el criterio para cada línea, dicho en voz alta: **"¿saberlo cambia lo que hace el agente?"** Si no cambia nada, sobra.

**Qué no va** — sin slide propia, se dice sobre la misma tabla: consejos genéricos (*"escribí código limpio"*), lo que vale para una sola tarea (eso es el prompt), documentación del dominio que cambia todo el tiempo, lo que ya hace cumplir un linter o CI (va en la config de la herramienta), secretos y credenciales, y —la más común— **una wiki**. Un `AGENTS.md` de 400 líneas son ~6.000 tokens; en 40 turnos de una sesión, ~240.000.

**Dos `AGENTS.md` de verdad.** Una columna por click; los nombres de los repos son links al archivo. No leerlas enteras: señalar una cosa de cada una.

- [**cloudflare/agents**](https://github.com/cloudflare/agents/blob/main/AGENTS.md) — monorepo TypeScript, un `AGENTS.md` por paquete: `pnpm run check` antes de terminar, `nx affected -t test` para testear solo lo que tocaste, `env.d.ts` generado por `wrangler types` (no se edita a mano), y los límites en tres niveles (*never*: force push a main).
- [**googleworkspace/go-samples**](https://github.com/googleworkspace/go-samples/blob/main/AGENTS.md) — corto, y está bien que lo sea: `test -z $(gofmt -l .)`, el mismo chequeo que corre CI, y `go build -v -a ./...` para que el cache no esconda nada.

El remate: *comandos exactos, excepciones y límites. Ninguno explica qué es Go o TypeScript (cosas que el agente ya sabe).* Si piden un tercero: [apache/airflow](https://github.com/apache/airflow/blob/main/AGENTS.md), ~250 líneas sin relleno, con límites de arquitectura y reglas que el agente no podría deducir.

**Cómo los encuentra Pi.** No es un archivo que el modelo decide leer: son instrucciones fijas en el system prompt. La slide arranca `pi` en `~/src/todo-app/web` y muestra la búsqueda en tres pasos:

1. **El global, y después de `/` hasta donde arrancaste.** Primero `~/.pi/agent/AGENTS.md` (el directorio se cambia con `PI_CODING_AGENT_DIR`), después cada directorio desde la raíz del filesystem hasta el de trabajo, en ese orden. Los que faltan se saltean y **no frena en la raíz del repo**.
2. **Se pegan todos al system prompt**, cada uno envuelto en `<project_instructions path="…">`. Se suman: el hijo no reemplaza al padre. Si dos se contradicen, la convención de agents.md es que gana el más cercano, y lo que pidas en el prompt les gana a todos. Ojo: eso lo respeta el modelo, no es un mecanismo de Pi.
3. **Se leen al arrancar.** No hay descubrimiento hacia abajo: si arrancás Pi en la raíz del repo, el `AGENTS.md` de `web/api/` no entra aunque después el agente abra archivos ahí. Si editás uno, `/reload`.

El paso 3 es el que los muerde. `AGENTS.override.md` existe (en cada carpeta le gana a `AGENTS.md`), pero **no se nombra**: salió de la slide a propósito. La distinción global/repo con un ejemplo: *"prefiero tabs" va en el global; "los tests se corren con `pnpm test`" va en el del repo.* Lo del repo viaja con el repo y le sirve a quien lo clone — **incluido el que lo clona en dos años, que capaz sos vos**.

**El costo, dicho de frente.** Está en contexto en cada turno. Es un impuesto que pagás siempre, uses o no esa información. Dejar la pregunta abierta —*"¿y si tengo un procedimiento largo y lo uso en situaciones específicas?"*— porque es exactamente el bloque siguiente.

### Skills (~7 min)

**El skill es la respuesta al impuesto que acabamos de nombrar.**

Un skill es un directorio con un `SKILL.md` y frontmatter (`name` y `description` obligatorios, y opcionalmente `allowed-tools`), con `scripts/`, `references/` y `assets/` al lado. Vive en `.pi/skills/` o `.agents/skills/` en el proyecto, o en `~/.pi/agent/skills/` global — el mismo par proyecto/global que `AGENTS.md`. El frontmatter ya no tiene slide propia: en el primer click de la slide de la carpeta se iluminan sus líneas con la etiqueta "frontmatter"; nombrarlo ahí y decir los dos campos obligatorios.

**Lo que hay que mostrar es cómo se carga, en tres etapas.** Es el artefacto concreto de toda la sesión:

1. Al arrancar, Pi escanea los skills y se queda con **el nombre y la descripción** de cada uno
2. En el system prompt entra solo eso: la lista de nombres y descripciones
3. **El cuerpo del `SKILL.md` se carga recién cuando la tarea lo amerita**, y `references/` o `scripts/` solo si hacen falta

Tenés veinte skills instalados y pagás veinte descripciones, no veinte procedimientos. La slide lo dice abajo: **las tres etapas tienen nombre, Progressive Disclosure.** Es la misma idea que vuelve en el bloque de MCP como descubrimiento progresivo.

**Y nada de esto es una particularidad de Pi: es un estándar abierto.** El formato lo publicó Anthropic como [Agent Skills](https://agentskills.io/), **lo donó a la AAIF el 22 de octubre de 2026** (la misma casa que `AGENTS.md` y MCP), y lo adoptaron un montón de herramientas: Claude Code, Cursor, Copilot y VS Code, Codex, Gemini CLI, OpenCode, Goose, Amp — **y Pi**. Detalle para señalar al pasar: el `.agents/skills/` es justamente el path que no lleva el nombre de ninguna herramienta. **Treinta segundos, sin abrir el sitio**: el skill que escriben hoy es la primera cosa del curso que se llevan tal cual a la herramienta que usen el año que viene.

**La consecuencia práctica**: la `description` es lo único que decide si el skill se usa. Un skill perfecto con una descripción vaga no se carga nunca. La slide lo muestra con el pedido *"verificá que la ruta nueva de recordatorios ande"*: `planificar-feature` (*"Ayuda a planificar ..."*) nunca se carga; `verificar-api`, con una descripción que dice qué hace y cuándo usarlo, se activa. Decirlo así: *"la descripción no es documentación, es el trigger"*.

El tercer click muestra la otra puerta: en Pi todo skill también se invoca a mano como comando, `/skill:verificar-api`. Y si no querés que el modelo lo dispare solo (un deploy, algo destructivo), `disable-model-invocation: true` en el frontmatter lo saca de la lista que ve el modelo y queda solo como comando.

**La regla de dedo de la sesión**, que queda a la vista en una slide fija:

> **Datos → `AGENTS.md`. Procedimientos → skill.**

Los prompt templates ya no están en el deck. Si alguien pregunta: son la versión liviana del skill, un texto que expandís con `/nombre`. También existe `/skill:nombre` para invocar un skill a mano.

### MCP, y codemode (~18 min)

El bloque donde la tesis de la sesión consigue su número más duro, y donde la tesis se vuelve diseño. **El ritmo es de un minuto y medio por slide**: es el bloque que más se puede estirar sin darse cuenta.

**1. Qué es (~5 min).** El agente gana tools en tiempo de ejecución: un servidor externo publica tools y el harness se las ofrece al modelo. Anthropic lo donó a la AAIF en diciembre de 2025: la portada lo nombra al pasar, como tercer estándar del día. Cuatro slides cortas, con lo mínimo de [modelcontextprotocol.io](https://modelcontextprotocol.io/docs/learn/architecture):

- **N × M → N + M.** Sin un protocolo común, cada host integra cada servicio a mano; con MCP, cada host implementa un cliente y cada servicio un servidor. Una frase.
- **Host, cliente y servidor.** El host (Pi) crea **un cliente por servidor**. El servidor puede ser local (stdio: el host lo lanza como proceso) o remoto (Streamable HTTP, con OAuth). Las tools son las mismas de siempre: MCP es la forma estándar de traerlas de afuera.
- **Primitivas.** Un servidor ofrece **tools** (las elige el modelo), **resources** (las elige la aplicación) y **prompts** (los elige el usuario). Y al revés, el servidor le puede pedir al usuario con **elicitation**. Sampling quedó deprecado en la versión `2026-07-28` del protocolo: no nombrarlo.
- **Un ejemplo de cada una.** La slide siguiente baja las tres primitivas a JSON con el escenario de viajes de la [doc oficial](https://modelcontextprotocol.io/docs/2026-07-28/learn/server-concepts): la tool `searchFlights` (con su `inputSchema`, que es lo que el modelo ve para armar la llamada), el resource template `weather://forecast/{city}/{date}` y el prompt `plan-vacation`, que el usuario elige como `/plan-vacation`. Que vean que las tres trabajan juntas: el prompt arranca, el resource da contexto, la tool actúa.
- **Una conversación.** `server/discover` → `tools/list` → `tools/call` → `notifications/tools/list_changed`, con el JSON-RPC real en pantalla. La versión `2026-07-28` es **sin estado**: ya no hay `initialize`. No hace falta decirlo salvo que alguien haya leído una versión vieja.

**2. Cómo se enchufa en Pi 1.0 (~3 min).** Dos slides:

- **`.pi/mcp.json`**: `mcpServers`, `command` + `args` para uno local, `url` para uno remoto (`/mcp login <server>` si pide OAuth).
- **`pi mcp add`**, con el ejemplo de Context7 en una terminal que se arma en cuatro clicks: `pi mcp add context7 --url https://mcp.context7.com/mcp` (global por defecto, en `~/.pi/agent/mcp.json`); con API key, `--bearer-token-env-var CONTEXT7_API_KEY` (límites de uso más altos; la key sale de context7.com/dashboard, y Pi guarda el nombre de la variable, no su valor, así que tiene que estar definida cuando arranca Pi); `pi mcp list`, `/reload` si la sesión ya estaba abierta y `/mcp` para inspeccionar, con el pedido *"Usá Context7 para consultar cómo configurar routing en Next.js 16"*; y `--local` desde la raíz del repo para que quede en `.pi/mcp.json`. Las líneas con `·` de la terminal son explicación, no salida real del comando.

[Context7](https://context7.com/) sirve docs actualizadas de librerías —el arreglo a "me inventa la API"— y se consume **como servidor MCP**: es el que enchufan en la práctica. [context-hub](https://github.com/andrewyng/context-hub) existe y hace algo parecido; mención al pasar.

**3. Descubrimiento progresivo (~2 min).** La primera de las dos [buenas prácticas de cliente de la spec](https://modelcontextprotocol.io/docs/2026-07-28/develop/clients/client-best-practices#using-progressive-discovery): el host no le declara las definiciones al modelo; le da una tool de búsqueda y carga solo la que hace falta. La spec lo ilustra con **~150.000 tokens de definiciones contra ~2.000**, y la slide usa su ejemplo de Salesforce en tres capas: **catálogo** (`search_tools({ query: "update salesforce record" })` devuelve nombres y una línea), **inspeccionar** (`get_tool_details` trae el schema de esa tool sola) y **ejecutar** (`salesforce_updateRecord({...})`). El schema del paso 2 está simplificado y la llamada del paso 3 es nuestra: la spec no la trae. *"Es exactamente el truco de los skills, aplicado a tools: pagás el nombre, no el cuerpo."* En Pi 1.0: `exposure: deferred`.

**4. Pi dijo que no, y después que sí (~3 min). Este merece la atención de la sala.** Dos posts del mismo harness, con diez meses de diferencia (los títulos son links en la slide):

- **Nov 2025 — Mario Zechner, [*What if you don't need MCP at all?*](https://mariozechner.at/posts/2025-11-02-what-if-you-dont-need-mcp/).** Sostiene que muchas veces no lo necesitás. Su alternativa: cuatro scripts de CLI y un README de **~225 tokens**, porque el modelo ya sabe escribir código y usar `bash`. Y el argumento más profundo es de composición: la salida de un CLI cae en un archivo y se encadena, mientras que **el resultado de una tool MCP tiene que pasar por la ventana de contexto**. *"MCP servers also aren't composable."* Es quien escribe Pi: decirlo, es lo que le da peso en la sala.
- **Sep 2026 — Earendil, [*You Said No MCP!*](https://earendil.com/posts/you-said-no-mcp/).** MCP entra al núcleo de Pi. No retiran el diagnóstico —*"The biggest issue with MCP continues to be that it's hard to compose"*—: lo resuelven en el diseño. Las tools no se le declaran al modelo; se llaman desde **codemode**, un sandbox de JavaScript que corre del lado del harness, y al contexto vuelve solo el resultado.

La línea para decir: **la crítica no se retiró, se convirtió en diseño** — el costo se resuelve con descubrimiento progresivo, la composición con code mode. "Instalá el MCP" sigue siendo una decisión con precio, no un default. Lo que cambió es que ahora el precio lo administra el harness.

**5. Cómo lo hace Pi 1.0: `exposure` (~1 min).** La slide tiene un selector en vivo: `codemode` (default), `deferred`, `direct`, `hidden`, y muestra qué tiene declarado el modelo en cada caso. Con `direct` aparecen las diez tools de Linear; con `codemode`, ninguna.

**6. Codemode en acción (~4 min).** Dos slides con código real de Armin Ronacher, [*What is Codemode*](https://lucumr.pocoo.org/2026/10/6/codemode/) (oct 2026), link en cada una. Cada click resalta las líneas que hacen una cosa y suma una tarjeta que la explica.

- **Llamar un MCP (Sentry).** (1) `tools.mcp__sentry__find_organizations`: una tool MCP es una función, que no se le declara al modelo ni se descubre antes; (2) `Promise.allSettled` con `find_projects`: una llamada por organización, en paralelo; (3) el `return`: el script arma el resultado y maneja los errores, y al modelo vuelve solo eso.
- **Clasificar con Jev.** (1) `models.getModelOfType`: Jev (typesafe) es un modelo clasificador, no una tool; (2) `gh issue list` por `bash`: los datos entran sin pasar por el contexto; (3) `models.classify` con tres preguntas (sentimiento, frustración y tipo), en paralelo — Pi corre cuatro a la vez; (4) `store()` y `.filter` / `.sort` / `.slice`: vuelven 12 líneas y no 100 issues.

La idea que tienen que llevarse: **el modelo escribe el programa, el programa hace el trabajo pesado, y al contexto vuelve solo lo que importa.** El detalle de code mode por dentro (el sandbox, sus reglas) **no va hoy**: quedó como propuesta para la Sesión 5, ver "Puentes".

### Subagentes (~7 min)

**Volvieron a esta sesión.** El programa los había mandado a la Sesión 4; ahora se dan acá, al final de la teoría, con la extensión [`pi-subagents`](https://pi.dev/packages/pi-subagents). La idea en una línea: así como el skill saca un procedimiento del contexto hasta que hace falta, **el subagente saca un trabajo entero de tu contexto**.

Cuatro slides:

1. **Portada**: *un subtask entero, en otro contexto.*
2. **Investigar ensucia el contexto.** El ejemplo: *"¿cómo maneja el login este repo?"* son 30 `read` y 12 `grep` para quedarte con un párrafo. Tres barras: sin subagente tu sesión carga ~56k; con subagente carga ~3k, y los ~53k de la búsqueda quedan en el contexto del subagente, que se descarta al terminar. La frase: **tu sesión ve el resumen, no la búsqueda.** Los números son ilustrativos.
3. **Cómo funciona.** Tres ideas, con una sesión de Pi animada al lado que delega la exploración y recibe un solo mensaje de vuelta: (1) le pasás una tarea, no tu conversación — **el prompt es todo lo que sabe**; (2) tiene contexto, transcript y tools propios; (3) vuelve un solo mensaje, que entra a tu sesión como una respuesta más. **El punto 1 es el que los va a morder**: el subagente no vio nada de lo que hablaron, así que una tarea mal escrita vuelve con un resultado malo. Escribirle la tarea es escribir un prompt. El pedido de la demo termina en *"Usá un subagente para explorar."*: la delegación se pide explícita.
4. **En paralelo.** Una sesión de Pi pide tres alternativas de la slide de título, un subagente por estilo (minimalista, ilustrada, terminal). Los tres corren a la vez, y al final aparecen las tres miniaturas a la izquierda. Dos ideas: si las tareas no dependen entre sí, **tarda lo que el más lento, no la suma**; y elegir entre tres es más fácil que corregir uno. Los tiempos son ilustrativos. Si alguien pregunta por coordinar agentes: eso es orquestación y es de la Sesión 4; acá cada uno hace lo suyo y vuelve.
5. **Cuándo sí y cuándo no.** Delegá: explorar o investigar mucho para quedarte con poco, revisar con ojos frescos (no vio cómo lo escribiste), tareas independientes en paralelo. Hacelo en tu sesión: cuando querés ver el razonamiento o decidir a mitad de camino, y trabajo que depende de lo que ya hablaron. Decirlo en voz alta aunque ya no esté escrito: el subagente no es "más IA", es economía de contexto; en total se gastan **más** tokens, no menos.

**Cómo se usa `pi-subagents`**, para la práctica: se pide en lenguaje natural y Pi decide si llama a la tool `subagent`. Trae agentes de fábrica: **scout** (reconocimiento rápido del código), **researcher** (web y docs, necesita `pi-web-access`), **worker** (implementa), **reviewer** (revisa contra la tarea y los tests), **oracle** (segunda opinión, no edita) y **delegate**. Pedidos de ejemplo: *"Use reviewer to review this diff"*, *"Run parallel reviewers: one for correctness, one for tests…"*. Comandos útiles: `/subagents-doctor` para chequear la instalación y `/subagents-fleet` para ver los que están corriendo.

⚠️ En las terminales del deck (*Cómo funciona* y *En paralelo*) la llamada aparece como `→ subagente · "…"`, no con la forma real de `pi-subagents`. Ver "Pendientes".

### La tabla de cierre (~2 min)

**El cierre de la teoría, y acá sí frenar.** Una fila por click:

| | Siempre cargado | On demand |
|---|---|---|
| Contexto del proyecto | `AGENTS.md` | skill |
| Tools externas | todas las definiciones (`direct`) | `deferred` · `codemode` |
| Trabajo | tu sesión | subagente |

Tres tecnologías distintas, el mismo movimiento: lo que no hace falta en cada turno sale de la ventana hasta que hace falta. Si se llevan una sola cosa de la clase, que sea esta tabla. **Dejarla proyectada mientras arranca la práctica.** Después, la pausa.

## Práctica (~45 min)

Cinco pasos en `exercise/README.md`. Los cinco atacan la misma repetición que el estudiante puso en el menti, así que es un hilo, no cinco mandados.

1. Pedirle al agente que escriba el `AGENTS.md`, con tus notas en el prompt, y **podarlo** (~10 min)
2. Probalo: la misma tarea, en una sesión nueva — el antes y después (~5 min)
3. Un skill para **verificar que tu app funciona** (~10 min)
4. Enchufar context7 por MCP — MCP y docs tools en un movimiento (~8 min)
5. Delegar a un subagente (~7 min)

En la slide: `context7 → .pi/mcp.json` · `/reload · /mcp` · `pi install npm:pi-subagents`.

**Lo que hay que vigilar caminando la sala:**

- **El paso 1 lo escribe el agente, no el estudiante** — que es como se hace en la vida real: el agente lee el `package.json`, los scripts y el árbol de directorios, y saca los datos duros mejor y más rápido. **Lo que el estudiante aporta son sus notas, en el prompt, y la poda después.** El ejercicio de la sesión no es redactar, es *decidir qué se queda*.
- **Y por eso hay que vigilar la poda, que es donde se cae el paso.** El que se queda con la salida cruda tiene un `AGENTS.md` genérico de 200 líneas y no va a ver ningún cambio en el paso 2. Dos cosas para gritar caminando: *"¿el comando de tests que te escribió existe? corrélo"* —un `AGENTS.md` que miente es peor que ninguno— y *"¿están tus notas del menti ahí adentro?"*. Es el mismo movimiento que hicieron con el plan en la Sesión 2: el agente produce, ellos ponen el criterio.
- **Por qué la poda, con datos** (los cita la AAIF en [*Writing an effective AGENTS.md*](https://aaif.io/blog/writing-an-effective-agents-md)): Gloaguen et al. encontró que los `AGENTS.md` generados por un LLM casi no mejoran el resultado y suben el costo, que los escritos por devs rinden más, y que los resúmenes del repo no ayudan al agente a encontrar código — el árbol de directorios se va. Con un archivo cuidado, Lulla et al. midió −29% de tiempo y −17% de tokens de salida (124 tareas, 10 repos; mide eficiencia, no si el cambio está bien), y en la prueba de la AAIF 2 de 5 corridas sin `AGENTS.md` hicieron un build de producción que nadie pidió, contra 0 de 5 con el archivo. Para el paso 2: si el agente tropieza dos veces con lo mismo, es una línea nueva; una advertencia vieja es peor que ninguna.
- **El paso 2 es el que no se recorta.** Es donde aterriza la sesión: sesión nueva, misma tarea, y que vean al agente hacer solo lo que antes le tenían que decir. Sin ese contraste, el `AGENTS.md` es un archivo que escribieron porque se lo pedimos.
- **El paso 3 es un skill para verificar que la app funciona**: cómo levantarla, qué comprobar (los tests, un `curl` a una ruta, abrirla en el navegador) y qué cuenta como "anda". Es el procedimiento que todos repiten después de cada cambio, y es el `verificar-api` del deck llevado a su proyecto. **La `description` tiene que decir cuándo usarlo** —*"después de implementar o cambiar algo, o cuando pida verificar"*—: si no, no se carga nunca, que es justo lo que vieron en la slide del trigger. Vigilar que no copien el ejemplo: si el `SKILL.md` podría estar en el proyecto de cualquier otro, no salió de sus notas. Y la pregunta para tirar caminando: *"¿esto ya está en tu `AGENTS.md`?"* — si sí, lo están pagando dos veces.
- **El paso 4 es el que se come el reloj**: la primera corrida de `npx` baja el paquete, y la config del proyecto se carga recién después de aceptar *project trust*. Tener el snippet de `.pi/mcp.json` en pantalla, o el `pi mcp add --local context7 --url https://mcp.context7.com/mcp`, listo para copiar. Lo que más va a fallar: el archivo en la raíz en vez de en `.pi/`, y olvidarse del `/reload`. El callback a la teoría, para tirarlo mientras caminás: *"fijate cuánto contexto te comió el server que acabás de enchufar — y cambiale la exposure a `direct` para comparar"*.
- **El paso 5 es delegar**: `pi install npm:pi-subagents` y pedirle a un subagente algo que ensucie el contexto —*"usá scout para explorar cómo funciona X"*— o que revise el diff de la sesión (*reviewer*). Lo que tienen que mirar: cuánto contexto gastó la sesión principal, y si la tarea que le escribieron alcanzaba para que el subagente la hiciera sin haber visto la conversación. Si no tienen Pi 1.2.0, este paso no corre: resolverlo antes de la clase.
- **Los cinco pasos suman ~40 min sobre 45.** El colchón es para el paso 4, que es el que se cuelga. Si a alguien le sobra tiempo: que vuelva a podar el `AGENTS.md` o que le agregue al skill lo que la verificación le siguió faltando — no que empiece algo nuevo.

## Timing de la sesión (~2 h)

| Bloque | Tiempo |
|---|---|
| Recap y show-and-tell | 8 min |
| Qué vamos a ver hoy | 5 min |
| `AGENTS.md` | 15 min |
| Skills | 7 min |
| MCP, y codemode | 18 min |
| Subagentes | 7 min |
| La tabla de cierre | 2 min |
| Pausa | 5 min |
| **Práctica** | **45 min** |
| Cierre | 3 min |

Da 115: **quedan 5 min de colchón**, y si algo se estira sale primero del recap, que es el bloque más elástico. Si MCP se estira, se recorta de las cuatro slides de "qué es" (la de N × M se puede decir en una frase), nunca de Pi dijo que no / `exposure` / codemode. No recortar de la práctica, y nunca del paso 2, que es donde aterriza la sesión.

Son 49 minutos de teoría en cinco bloques. Están ordenados para que cada uno le deje una pregunta abierta al siguiente (`AGENTS.md` cuesta → skills; los skills cargan on demand → MCP; MCP cuesta → descubrimiento progresivo, `exposure` y codemode; el mismo movimiento aplicado al trabajo → subagentes, y ahí cierra la tabla). **Si se cae ese encadenado, el día se convierte en un tour de herramientas.** Ensayar las transiciones, no solo los bloques.

## Cierre (~3 min)

El deck termina en **¿Qué aprendimos?**: siete tarjetas (escribilo una vez, `AGENTS.md` corto, skills on demand, la description es el trigger, host/cliente/servidor, descubrimiento progresivo, subagentes). No leerla: dejarla un momento y abrir la discusión.

- **¿Qué cambió en el paso 2?** Es la pregunta de la sesión, aunque ya no tenga slide. Que cuenten un caso concreto de algo que el agente hizo solo.
- **¿Qué les sorprendió del tooling?** Pregunta abierta del programa; sirve para pescar lo que no cubrimos.
- **Tarea para la Sesión 4** (ya no está en el deck; decirla o mandarla por el canal del curso): seguir usando el `AGENTS.md` y anotar **qué le siguieron explicando igual** —lo que no entra en él es lo que Agus va a llamar *spec*—, y traer una feature que **no** puedan describir en una frase, que es el insumo de spec-driven development.

## Puentes entre sesiones

- **Desde la Sesión 1**: LLM + tool + harness se plantó allá con la promesa de abrirlo acá (`COURSE_PROGRAM.md:163`). Con la anatomía afuera, esa promesa pasa a la Sesión 5. La regla del 50% vuelve convertida en el presupuesto siempre-cargado vs. on-demand.
- **Desde la Sesión 2**: la tarea abre la sesión. **Coordinar con Agus**: cómo cerró la sesión y qué juntó en su reflexión. Dos promesas quedaron hechas allá. *"La profundidad de subagentes es la Sesión 3"* **vuelve a ser cierta**: se dan hoy. *"Esto lo abre Diego en la Sesión 3"*, sobre la restricción de plan mode, **ya no**: la anatomía salió del deck y el mecanismo (`tool_call` → `{ block: true }`) queda para la Sesión 5. Si alguien pregunta, decirlo así.
- ⚠️ **Subagentes volvieron a la Sesión 3, y eso contradice el resto del material.** `COURSE_PROGRAM.md` y `sessions/session-4/` los ponen en la Sesión 4 (Agus, con un caso de uso de documentación), y además no coinciden entre sí sobre cuándo se instala `pi-subagents`: el `README.md` dice Sesión 2, `COURSE_PROGRAM.md` dice Sesión 4. Hoy se instala en la práctica. **Hablarlo con Agus antes de tocar esos archivos**: si él los sigue dando, se dan dos veces.
- **Hacia la Sesión 4 (Agus)**: `AGENTS.md` es contexto siempre presente; las specs por tarea son de él, y la orquestación también. La tarea de esta semana le arma el terreno. Prompt injection es suyo: con el sidebar de seguridad afuera, hoy ni se nombra.
- **Hacia la Sesión 6 (Diego, modelos open source)**: los estándares abiertos de hoy son el primer ensayo de lo que allá se comprueba con las manos — *lo que construís sobrevive al cambio de modelo*. Acá ya se puede plantar que el formato tampoco depende de Pi. Una frase, sin anticipar la Sesión 6.
- **Hacia la Sesión 5 (Agus, harness internals)**: ⚠️ **hace falta coordinar y fijar el límite.** La anatomía (tool, harness, extension points, plan mode como `tool_call` → `{ block: true }`, permisos y seguridad) salió de este deck, y todo eso es territorio de la Sesión 5. **Su sesión ya está escrita** (`sessions/session-5/INSTRUCTOR.md`): confirmar contra el material que cubre el plan mode como hook, porque es la deuda que dejó la Sesión 2 y ahora no la paga nadie más.
- **Propuesta para la Sesión 5: [`../session-5/propuesta-mcp/`](../session-5/propuesta-mcp/index.html).** Al pasar a Pi 1.0 salieron de este deck las slides de MCP por dentro: transportes (stdio vs. Streamable HTTP), code mode por dentro (el script, la carrera de tokens, el sandbox y sus reglas) y FastMCP (servidor, cliente, tests en memoria, `mount`/proxy, los transforms `BM25SearchTransform` y `CodeMode`). Hoy codemode se ve solo desde afuera, con los dos ejemplos de Ronacher. **No están en su plan**: es una propuesta para hablar con él, no un cambio a su sesión.

## Herramientas y recursos referenciados

- [Pi](https://pi.dev/docs/latest/) — el harness del curso. Las páginas en las que se apoya esta sesión: [Skills](https://pi.dev/docs/latest/skills) y [MCP](https://pi.dev/docs/latest/mcp).
- [MCP en Pi](https://pi.dev/docs/latest/mcp) — de fábrica en Pi 1.0. Config en `.pi/mcp.json` (proyecto, después de *project trust*) o `~/.pi/agent/mcp.json` (global), clave `mcpServers`; `command`/`args` para stdio, `url` para remoto. Comandos: `/mcp`, `/mcp login <server>`, `/reload`; desde la shell `pi mcp add` (con `--url`, `--bearer-token-env-var`, `--local`) y `pi mcp list`. `exposure`: `codemode` (default), `deferred`, `direct`, `hidden`.
- [`pi-subagents`](https://pi.dev/packages/pi-subagents) — `pi install npm:pi-subagents`, **Pi 1.2.0 o más nueva**. La tool `subagent`, los agentes de fábrica (scout, researcher, evidence-auditor, worker, reviewer, oracle, delegate) y `/subagents-doctor`. [Fuente](https://github.com/nicobailon/pi-subagents).
- [AAIF — *Linux Foundation Announces the Formation of the Agentic AI Foundation*](https://aaif.io/news/linux-foundation-announces-formation-of-aaif) (9 dic 2025) — los proyectos fundadores: MCP (Anthropic), goose (Block) y `AGENTS.md` (OpenAI). Agent Skills se sumó el 22 de octubre de 2026, donado por Anthropic.
- [agents.md](https://agents.md/) — el sitio del estándar: el README para agentes, las secciones sugeridas, archivos anidados para monorepos (si chocan, gana el más cercano) y la lista de herramientas que lo leen.
- [AAIF — *Writing an effective AGENTS.md*](https://aaif.io/blog/writing-an-effective-agents-md) (Steve Kearns, 2026-08-13) — de acá salen la tabla de instrucciones vagas vs. usables, el criterio *"¿saberlo cambia lo que hace el agente?"*, la lista de qué no va y los tres estudios de la nota de la práctica.
- **Tres `AGENTS.md` reales**: [cloudflare/agents](https://github.com/cloudflare/agents/blob/main/AGENTS.md) y [googleworkspace/go-samples](https://github.com/googleworkspace/go-samples/blob/main/AGENTS.md) están en el deck; [apache/airflow](https://github.com/apache/airflow/blob/main/AGENTS.md) (~250 líneas sin relleno) queda para el que pida más.
- [Agent Skills](https://agentskills.io/) — **el estándar abierto detrás del `SKILL.md`.** Formato publicado por Anthropic, donado a la AAIF en octubre de 2026 y adoptado por Claude Code, Cursor, Copilot/VS Code, Codex, Gemini CLI, OpenCode, Goose, Amp y **Pi**, entre muchos otros. Las páginas que valen: la [especificación](https://agentskills.io/specification) y el [quickstart](https://agentskills.io/skill-creation/quickstart). Desarrollo abierto en [GitHub](https://github.com/agentskills/agentskills).
- **[Thariq Shihipar — *Lessons from Building Claude Code: How We Use Skills*](https://x.com/trq212/status/2033949937936085378)** — el mejor texto sobre skills que tenemos. Escrito desde adentro del equipo que hace Claude Code (2026-03-17), con cientos de skills en uso diario. Dos cosas que sirven hoy. (1) Rompe la lectura de "un skill es un markdown": es una **carpeta** — `scripts/`, `references/`, `assets/` que el agente puede descubrir, leer y correr—, que es justo la slide *Un skill es una carpeta*, ahora con un motivo para que importe. (2) Su lista de consejos **es el checklist del paso 3 de la práctica**: no escribir lo que el modelo ya sabe, mantener una sección de *gotchas* hecha de fallas reales, escribir el `description` para que el modelo dispare y no como resumen para humanos, describir intención en vez de sobre-especificar pasos, y adjuntar scripts helper. Nombra además nueve categorías recurrentes de skill — entre ellas **verificación de producto**, que es justo el skill del paso 3 — y es **buena semilla para el Mentimeter** si la nube sale floja. ⚠️ x.com pide login: hay [copia en un gist](https://gist.github.com/Danm72/467f6d6cd193d19c0042371866d53b75).
- **[Anthropic Academy — *Introduction to Agent Skills*](https://anthropic.skilljar.com/introduction-to-agent-skills)** — curso gratis, a ritmo propio, seis módulos. **Es lo que se les pasa a los que pidan más al final de la clase** — recorre el mismo terreno que la práctica: frontmatter y descriptions que disparan, progressive disclosure como higiene de contexto, `allowed-tools`, distribución por repo o plugin, y un módulo entero sobre la falla que la sala va a tener de verdad: el skill que no dispara. El matiz al recomendarlo: está dado **sobre Claude Code, no sobre Pi** — los conceptos viajan tal cual, parte de la plomería no.
- [MCP — *Client Best Practices*](https://modelcontextprotocol.io/docs/2026-07-28/develop/clients/client-best-practices#using-progressive-discovery) — descubrimiento progresivo y code mode, con los números de ~150.000 vs ~2.000 tokens y el ejemplo de Salesforce de la slide.
- [Mario Zechner — "What if you don't need MCP at all?"](https://mariozechner.at/posts/2025-11-02-what-if-you-dont-need-mcp/) (nov 2025) — el contraargumento del bloque de MCP y el número de Playwright. **Es quien escribe Pi**.
- [Earendil — *You Said No MCP!*](https://earendil.com/posts/you-said-no-mcp/) (sep 2026) — por qué Pi pasó de no tener MCP a traerlo de fábrica, y por qué con codemode. La segunda mitad del contrapunto con Zechner.
- [Armin Ronacher — *What is Codemode*](https://lucumr.pocoo.org/2026/10/6/codemode/) (oct 2026) — de acá salen los dos ejemplos de codemode (Sentry y Jev). El post tiene además ejemplos de generación de imágenes y de debugging de un juego.
- [context7](https://context7.com/) — docs actualizadas de librerías, se consume como servidor MCP. La API key (opcional, para límites más altos) sale de context7.com/dashboard.
- [context-hub](https://github.com/andrewyng/context-hub) — alternativa listada en el programa. Mención, sin demo.

## Lo que dejamos afuera a propósito

- **La anatomía: tool, harness y extension points.** Incluye el reveal del plan mode como `tool_call` → `{ block: true, reason }`, el `reason` como mensaje para el modelo y el sidebar de permisos y seguridad. Salió del deck para hacerles lugar a los subagentes; es territorio de la Sesión 5 (ver "Puentes").
- **Orquestación**: es de la Sesión 4 (Agus). Hoy los subagentes se dan como primitivo; varios agentes coordinados sobre docs compartidos es suyo.
- **Worktrees**: quedan afuera del curso, no pospuestos. Si alguien pregunta: una frase y puntero a las docs.
- **Escribir una extensión de TypeScript**: es territorio de la Sesión 5. Hoy se instala una.
- **La tabla comparativa de harnesses** (Claude Code / Codex / OpenCode): afuera. Comparar harnesses en abstracto no le sirve a nadie que solo usó uno.
- **Profundidad en comandos de verificación / tests**: los tests fueron la Sesión 2. Acá aparecen como lo mejor que le podés poner al `AGENTS.md` y como el skill del paso 3.
- **Code mode por dentro y FastMCP**: hoy codemode se ve desde afuera, con dos ejemplos. El sandbox y escribir un servidor propio quedaron como propuesta para la Sesión 5.
- **Sandboxing, containerization y prompt injection**: afuera, con la anatomía.
- **`AGENTS.override.md`**: existe, pero se sacó de *Cómo los encuentra Pi* para no sumar un concepto más.
- **`eli5` como ejemplo de skill**, y con él el matiz que enseñaba (el archivo viaja tal cual, lo que pide no) y la extensión `pi-artifacts`.
- **Prompt templates en el deck**: salieron de la regla de dedo. Quedan como respuesta si alguien pregunta.
- **Slides que salieron del deck y dónde quedó lo que importaba**: *No hay magia: se pega adelante* (el costo por turno vive en *Nada de esto es gratis*); *Proyecto y global* (en *Nada de esto es gratis* y *Cómo los encuentra Pi*); *Qué no va: una wiki* y *¿Sirve de algo?* (en la nota de la tabla de vagas vs. usables y en la de la práctica); *El frontmatter* (se dice sobre *Un skill es una carpeta*); *Cuánto cuesta* (el número de Playwright está en *Nada de esto es gratis*); *Dónde vive cada cosa que repetís*; *¿Qué cambió en el paso 2?*, *Para la semana* y *Para leer* (las preguntas de cierre y la tarea están en "Cierre"; los links, en las slides donde se usa cada fuente y en esta sección de recursos).

## Pendientes (para próximas iteraciones)

- **Actualizar `exercise/README.md`**: sigue con el skill de planificación en el paso 3 y no tiene el paso 5 de subagentes. Tiene que coincidir con la slide de práctica.
- **Confirmar la versión de Pi de la sala.** `pi-subagents` pide **Pi 1.2.0 o más nueva**, y todo el material dice Pi 1.0. Si la sala tiene la 1.0, el paso 5 no corre: o se les pide actualizar (y se revisa lo que decimos de "Pi 1.0"), o el paso 5 se hace en vivo desde la máquina de la demo.
- ~~Redactar el Mentimeter~~ → **escrito**, en el bloque de recap. Queda **cargarlo en Mentimeter** antes de la clase y **probar que la pantalla se pueda dejar proyectada** mientras seguimos con las slides.
- **Probar el paso 4 en una máquina limpia** y cronometrarlo: con `pi mcp add --local` y con `.pi/mcp.json` a mano, aceptar *project trust*, `/reload`, `/mcp`. Mirar cuánto tarda la primera corrida y si el prompt de *project trust* aparece donde lo esperamos. Y probar que cambiar la exposure a `direct` desde `/mcp` funciona.
- **Probar context7 en la red del aula con 20-30 personas.** Definir si hace falta API key y, si hace falta, resolverlo antes de la clase y no en el momento.
- **Medir el costo de Context7 y verificar el de Playwright.** El ~2.000 de Context7 en *Nada de esto es gratis* es una estimación nuestra: medirlo con `/mcp` y la exposure en `direct`. El 13.7k de Playwright es de Zechner y depende de la versión.
- **Poner la llamada real de `pi-subagents` en la slide *Cómo funciona*.** Hoy la terminal muestra `→ subagente · "…"`. Correr una delegación con `scout` en la máquina de la demo y copiar cómo se ve.
- **Revisar la slide del trigger.** El pedido es *"verificá que la ruta nueva de recordatorios ande"* y la tarjeta vaga es `planificar-feature`: ese skill no se activaría aunque tuviera una buena descripción, así que el contraste se debilita. Opciones: cambiar el pedido a uno de planificación, o poner un `planificar-feature` bien escrito a la derecha.
- **Confirmar la donación de Agent Skills a la AAIF** con el anuncio oficial antes de decirlo en la sala: es del 22 de octubre de 2026, muy reciente.
- **Verificar la lista de clientes de [Agent Skills](https://agentskills.io/) la semana de la clase**, y en particular que **Pi siga figurando**.
- **Confirmar los detalles de MCP en Pi 1.0 contra la versión instalada** (`exposure`, `/mcp`, `pi mcp add`, `.pi/mcp.json`): salen de las docs de Pi, no de una corrida nuestra.
- **Hablar con Agus de subagentes**: volvieron a esta sesión. Decidir qué queda en la Sesión 4 y después actualizar `COURSE_PROGRAM.md`, `README.md` y `sessions/session-4/`. Confirmar que el paquete del curso sigue siendo `pi-subagents` — hay al menos seis forks en npm. **Worktrees quedan afuera del curso**; avisarle por si los quería usar.
- ~~Elegir el proyecto de la demo~~ → **decidido: el repo del curso**, abierto en Pi en la máquina de la demo durante toda la teoría. Es el que se usa en el momento en que hay algo en vivo en pantalla: el `AGENTS.md` malo que se le pide al agente. Por qué cierra: tiene forma de verdad (un directorio por sesión, tres archivos por sesión), **convenciones que no se deducen del código** —material de estudiantes en español, notas de instructor en inglés— que es exactamente lo que un `AGENTS.md` tiene que capturar, y es seguro de proyectar. Y el chiste funciona solo: el `AGENTS.md` del curso sobre agentes.

  **Dos cosas para tener en cuenta antes de la clase, y la primera es de contenido:**

  1. **Este repo no tiene tests ni build**, y el bloque de `AGENTS.md` dice que *los comandos de verificación son lo más valioso que le podés poner*. **Nombrar el hueco en voz alta y usarlo** — *"a este repo le falta justamente lo más valioso; al de ustedes no"*.
  2. **Revisar qué se ve en pantalla**: `.pi/` y cualquier `models.json` con una key quedan fuera del proyector. Vale hacer un `ls -a` antes de compartir pantalla.
- **El `AGENTS.md` malo se le pide al agente en el momento**, sobre la slide de instrucciones vagas vs. usables — decidido: no se guarda uno escrito de antemano. Se le pide sin darle nada y sale genérico, largo y con algún comando inventado; si tiene un comando que no existe, mejor, porque ése *es* el punto. **Si ese día sale bueno, el antipatrón se cae**: correr el prompt en la máquina de la demo **el día anterior** y, si la salida sirve, dejar la sesión abierta.
- **Ensayar con reloj** el bloque de MCP, que creció a 18 minutos con las dos slides de codemode, y el de subagentes, que es nuevo.
- **Coordinar con Agus** el cierre real de la Sesión 2, los subagentes y el límite con la Sesión 5, que ahora hereda la anatomía.
- ~~Corregir el residuo de `COURSE_PROGRAM.md` que decía que llegan con un `AGENTS.md` de diez líneas de la Sesión 2~~ → **corregido**.
