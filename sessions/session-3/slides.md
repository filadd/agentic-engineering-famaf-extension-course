---
marp: true
theme: default
paginate: true
title: Sesión 3 — Herramientas y Skills
---

<!--
Guion de la presentación de la Sesión 3. Sigue slide por slide al deck animado
de deck/index.html: cada slide tiene su título, el contenido mínimo que tiene que
estar en pantalla y la nota de orador (HTML comment).

Sesión de 2 h: 8 recap, 5 intro, 15 AGENTS.md, 7 skills, 18 MCP (con codemode),
7 subagentes, 2 tabla de cierre, 5 pausa, 45 práctica, 3 cierre. Da 115: quedan
5 min de colchón, y si algo se estira sale del recap.

Pi 1.0 trae MCP de fábrica. Subagentes se dan al final de la teoría, con la
extensión pi-subagents (pide Pi 1.2.0 o más nueva: confirmar la versión de la
sala). Code mode por dentro y FastMCP quedaron como propuesta para la Sesión 5 (FastMCP
solo se nombra en la práctica, como avanzado opcional)
(../session-5/propuesta-mcp/). El material del recap se recolecta con
MENTIMETER y la pantalla queda proyectada toda la clase.
-->

# Sesión 3
## Herramientas y Skills

**De Vibe Coding a Agentic Engineering** — FaMAF
Diego Piloni

`AGENTS.md` · Skills · `MCP` · Subagents

<!-- Portada. Anclar: sesión 3 de 6, mismo proyecto, 2 h. -->

---

## Hoy

¿cómo les fue? → AGENTS.md → skills → MCP → subagentes → práctica → cierre

<!-- Agenda en una slide. No hay bloque de setup: MCP viene en Pi 1.0, y lo único que se instala es pi-subagents, en la práctica. -->

---

## ¿Cómo les fue?

- ¿Les sirvió planificar? ¿Hubo algo que habrían ejecutado directo?
- ¿Qué le tuviste que explicar **más de una vez**? → Encuesta en el aula virtual
  *ej: ¿cómo se levanta el server? ¿cómo se corren los tests?*

<!-- ~8 min de DISCUSIÓN, no de slides. Coordinar con Agus ANTES de la clase cómo cerró la Sesión 2. Primer disparador: desbloquearlo con ejemplos concretos (un fix de una línea, un cambio de texto, un color). Lo que buscamos es EL UMBRAL DONDE PLANIFICAR DEJA DE PAGAR. NO DEFENDER EL PROCESO ACÁ. Segundo disparador: va a MENTIMETER, pregunta abierta, vista de lista; es el insumo de los bloques que siguen y de la práctica. Juntar seis o siete. Semillas y plan B en INSTRUCTOR.md. Este es el bloque elástico. -->

---

## "Lo que le explicaste dos veces, escribilo una"

- lunes: *los tests se corren con pnpm test* · *antes de terminar, corré pnpm lint*
- miércoles: *antes de terminar, corré pnpm lint* · *los componentes van en src/components*
- viernes: *los tests se corren con pnpm test* · *¿otra vez guardaste componentes fuera de src/components? 😤*

```
AGENTS.md
- tests: pnpm test
- lint: pnpm lint
- componentes en src/components/
```

<!-- La frase de la sesión. Tres terminales con las mismas correcciones repetidas que, con un click, colapsan en un AGENTS.md de tres líneas: cada línea sale de algo que se repitió. Que la frase quede escrita a la vista. -->

---

# `AGENTS.md`

un archivo que el agente lee al arrancar, todas las veces

un README para agentes · estándar abierto · [agents.md](https://agents.md/) · lo donó OpenAI a la [AAIF](https://aaif.io/news/linux-foundation-announces-formation-of-aaif) (Agentic AI Foundation, Linux Foundation)

<!-- Sección. ~15 min. DESDE CERO: nadie en la sala escribió uno. Es un README para agentes: el README explica el proyecto a personas, el AGENTS.md le dice al agente lo que no puede deducir del código, y puede apuntar al README en vez de copiarlo. OpenAI lo donó a la Agentic AI Foundation (AAIF), dentro de la Linux Foundation, cuando se formó (dic 2025). Es el mismo hogar que MCP (donado por Anthropic en ese momento) y que Agent Skills (donado por Anthropic en oct 2026), que vienen en los bloques siguientes. Ninguno de los tres es de una sola empresa: lo donaron empresas que compiten entre sí. Decirlo acá una vez y nombrarlo de pasada en las otras dos portadas. -->

---

## Qué va adentro

1. cómo se corre y cómo se verifica
2. stack y decisiones ya tomadas
3. dónde va cada cosa
4. estilo, solo lo que un linter no puede decirle
5. boundaries: siempre · nunca · preguntar primero
6. no arranques de cero: pedile al agente un primer AGENTS.md, y después podalo

```
## Boundaries
Siempre:
- Corré `pnpm test` antes de decir que terminaste
Nunca:
- Uses npm: rompe el lockfile
- Agregues una base de datos: los datos viven en `db.json`
Preguntar primero:
- No agregues dependencias sin preguntar
```

<!-- En el deck, el AGENTS.md del todo-app con cada sección resaltada por paso; en el 6 se resalta entero. LOS COMANDOS DE VERIFICACIÓN SON LO MÁS VALIOSO QUE LE PODÉS PONER: le permiten al agente saber si lo que hizo funciona sin preguntarte. Boundaries: qué puede hacer solo, qué nunca y qué tiene que consultar; es la sección que tienen los AGENTS.md reales (Cloudflare la llama always / ask first / never). El paso 6 anticipa el paso 1 de la práctica: el agente lee scripts y carpetas mejor que vos; lo tuyo es la poda. Apuntar al menti mientras se dice cada punto. -->

---

## Instrucciones vagas vs. usables

La especificidad sirve cuando le saca una decisión que el agente tendría que tomar.

| Vaga | Qué falta | Más usable |
|---|---|---|
| "Corré los tests." | ¿Qué tests, dónde y cuándo? | Desde `services/api`, corré el archivo de pytest afectado mientras iterás. Corré `pytest tests/` antes de terminar un cambio en la API. |
| "No edites el código generado." | ¿Qué código es generado? | No edites `packages/client/generated/`. Cambiá `schemas/openapi.yaml` y corré `pnpm generate:client`. |
| "Seguí los patrones existentes." | ¿Cuál es la implementación de referencia? | Los handlers HTTP nuevos siguen a `services/api/routes/users.py`, incluida la validación y el manejo de errores. |
| "Respetá la arquitectura." | ¿Qué límite hay que preservar? | `packages/core` no puede importar de `packages/ui`. El código compartido va en `packages/core`. |
| "Usá el proceso de build estándar." | ¿Qué es lo estándar acá? | Corré `make build` desde la raíz del repo. No uses `go build`: el wrapper agrega metadata que el build necesita. |

<!-- Tabla traducida de AAIF, "Writing an effective AGENTS.md" (2026), link abajo a la derecha (se esconde en la última fila). Una fila por click. La columna del medio es la que hay que señalar: cada instrucción vaga deja una pregunta abierta, y el agente la contesta adivinando. Cerrar con el criterio para cada línea del AGENTS.md, dicho en voz alta: "¿SABERLO CAMBIA LO QUE HACE EL AGENTE?". Si no cambia nada, sobra. Y la contracara, QUÉ NO VA: consejos genéricos ("escribí código limpio"), lo que vale para una sola tarea (eso es el prompt), documentación del dominio que cambia todo el tiempo, lo que ya hace cumplir un linter o CI (va en la config de la herramienta), secretos y credenciales, y la más común: UNA WIKI. Un AGENTS.md de 400 líneas son ~6.000 tokens, × 40 turnos de una sesión = ~240.000 tokens. -->

---

## Cuando un proyecto es muy grande

- `AGENTS.md` gigante: todo cargado, todo el tiempo
- `AGENTS.md` como índice: lo esencial más links a otros documentos (`docs/api.md`, `docs/db.md`…), que el agente lee cuando los necesita
- 👉 Agus lo cuenta en la próxima clase

<!-- Eventualmente, en proyectos más grandes, un AGENTS.md gigante no es muy útil: conviene tenerlo más como un índice a otros documentos. NO DESARROLLARLO ACÁ: lo explica Agus en la Sesión 4 (Context Engineering). Alcanza con plantar la idea. -->

---

## Dos AGENTS.md de verdad

- **[cloudflare/agents](https://github.com/cloudflare/agents/blob/main/AGENTS.md)** · monorepo TypeScript, un AGENTS.md por paquete
- **[googleworkspace/go-samples](https://github.com/googleworkspace/go-samples/blob/main/AGENTS.md)** · samples sueltos, corto

<!-- Solo los links, uno por click: se abren y se recorren en vivo en la clase. NO LEERLOS ENTEROS: señalar una cosa de cada uno. Cloudflare: `pnpm run check` antes de terminar, `nx affected -t test`, `env.d.ts` generado con `wrangler types` (no se edita a mano) y los límites en tres niveles, always · ask first · never (la misma sección de Boundaries de dos slides atrás). Go: es corto y está bien que lo sea; `test -z $(gofmt -l .)` y `go build -v -a ./...` son los mismos comandos que corre CI. Cerrar con: comandos exactos, excepciones y límites; ninguno explica qué es Go o TypeScript, cosas que el agente ya sabe. Si piden un tercero: apache/airflow, ~250 líneas sin relleno (link en INSTRUCTOR.md). -->

---

## Cómo los encuentra Pi

Arrancando `pi` en `~/src/todo-app/web`:

```
~/.pi/agent/        AGENTS.md   global
/  /home/  ~/src/   —           se saltean
~/src/todo-app/     AGENTS.md   repo
~/src/todo-app/web/ AGENTS.md   acá arrancaste
…/web/api/          AGENTS.md   nunca: no baja a subcarpetas
```

1. global, y de `/` hasta donde arrancaste: no frena en la raíz del repo
2. se pegan todos al system prompt, cada uno en `<project_instructions path="…">`: se suman; si chocan, gana el más cercano (y tu prompt, a todos)
3. se leen al arrancar: aunque después abra archivos en `api/`, ese no entra · si editás uno, `/reload`

<!-- No son un archivo que el modelo decide leer: son instrucciones fijas en el system prompt. El global vive en ~/.pi/agent/ (configurable con PI_CODING_AGENT_DIR). Lo de "gana el más cercano" es la convención de agents.md: Pi los pega todos y es el modelo el que la respeta. El paso 3 es el que los muerde: si arrancan Pi en la raíz del repo, el AGENTS.md de una subcarpeta no existe para el agente. AGENTS.override.md existe pero NO se nombra. Cerrar con la pregunta abierta: "¿y si tengo un procedimiento largo y lo uso en situaciones específicas?". -->

---

# Skills

¿y si tenés un procedimiento largo y lo usás en situaciones específicas?

estándar abierto · [agentskills.io](https://agentskills.io/) · lo donó Anthropic a la AAIF (Linux Foundation)

<!-- Sección. ~7 min. El skill es la respuesta al impuesto del AGENTS.md. Y ESTO NO ES DE PI: es un estándar abierto, que Anthropic donó a la AAIF en octubre de 2026. TREINTA SEGUNDOS, no abrir el sitio. -->

---

## Un skill es una carpeta

```
verificar-api/
├── SKILL.md        obligatorio
├── scripts/
├── references/
└── assets/
```

<!-- Vive en .pi/skills/ (proyecto) o ~/.pi/agent/skills/ (global): el mismo par que AGENTS.md. En el primer click se iluminan las líneas 1-7 con la etiqueta "frontmatter": nombrarlo así, y decir que tiene dos campos obligatorios, name y description. El SKILL.md de ejemplo es un procedimiento de la Sesión 2 (verificar la API), y es la misma idea que el skill del paso 3 de la práctica. -->

---

## Cómo se carga: tres etapas

1. descubrimiento — `name` + `description` de todos (~100 tokens c/u)
2. activación — el `SKILL.md` entero (< 5.000 tokens)
3. ejecución — `references/`, `scripts/`, solo si hace falta

Las tres etapas tienen nombre: **Progressive Disclosure**.

<!-- El artefacto concreto de toda la sesión. Tenés veinte skills instalados y pagás veinte descripciones, no veinte procedimientos. El estándar lo llama PROGRESSIVE DISCLOSURE: no es una optimización de Pi. Y la consecuencia que importa: EL SKILL QUE ESCRIBEN HOY NO ESTÁ ATADO A PI. El truco vuelve en el bloque de MCP, como descubrimiento progresivo. -->

---

## La descripción no es documentación: es el trigger

> verificá que la ruta nueva de recordatorios ande

- `planificar-feature` · *description: Ayuda a planificar ...* → nunca se carga
- `verificar-api` · *description: Levanta el server y prueba la API con curl… Usar después de implementar o cambiar una ruta, o cuando el usuario pida verificar…* → se activa
- En Pi también es un comando: `/skill:verificar-api` · ¿solo a mano? en el frontmatter: `disable-model-invocation: true`

<!-- La description es LO ÚNICO que decide si el skill se usa. Un skill perfecto con una descripción vaga no se carga nunca. Es el error más común cuando escriben el primero. En el segundo click se resaltan las palabras del pedido que aparecen en la buena. El tercero muestra la otra puerta: en Pi todo skill se invoca a mano con /skill:nombre, y con disable-model-invocation: true en el frontmatter el modelo deja de verlo y queda solo como comando (sirve para procedimientos que no querés que el agente dispare solo, como un deploy). -->

---

## Dos repos de skills de verdad

- **[asermax/claude-plugins](https://github.com/asermax/claude-plugins/tree/master/mahou/skills)** · Agus · mahou: 41 skills, del diseño al PR
- **[mattpocock/skills](https://github.com/mattpocock/skills/tree/main/skills)** · Matt Pocock · por categoría: tdd, diagnosing-bugs, code-review…

<!-- Solo los links, uno por click: se abren y se recorren en vivo. NO LEERLOS ENTEROS: abrir un SKILL.md de cada uno y mirar la description, que es lo que acabamos de ver. -->

---

## Datos → `AGENTS.md` · Procedimientos → skill

<!-- La regla de dedo de la sesión: que quede escrita a la vista hasta el final de la práctica. -->

---

# MCP

Model Context Protocol: el agente gana tools en tiempo de ejecución · estándar abierto · [modelcontextprotocol.io](https://modelcontextprotocol.io/) · donado por Anthropic a la AAIF (Linux Foundation) · en Pi 1.0 viene de fábrica

<!-- Sección. ~18 min, UN MINUTO Y MEDIO POR SLIDE. Tercer estándar de la AAIF del día: AGENTS.md, skills y MCP no son de ninguna herramienta, por eso lo que aprenden hoy sirve en cualquier harness. Es el bloque que más se estira sin darse cuenta. -->

---

## El problema: N × M

4 hosts × 5 servicios = 20 integraciones → con MCP, 4 + 5 = 9

<!-- Una frase. Si el bloque viene atrasado, es la primera que se dice de pasada. -->

---

## Host, cliente y servidor

El host (Pi) crea un cliente por servidor. Local por stdio, remoto por Streamable HTTP.

<!-- El servidor puede vivir en tu máquina (el host lo lanza como proceso) o en internet (HTTP, con OAuth). Las tools son las mismas de siempre: MCP es la forma estándar de traerlas de afuera. -->

---

## Lo que puede ofrecer un servidor

- **tools** — las elige el modelo
- **resources** — las elige la aplicación
- **prompts** — los elige el usuario
- y al revés: **elicitation**, el servidor le pregunta al usuario

<!-- Las primitivas de modelcontextprotocol.io. Sampling quedó deprecado en el protocolo 2026-07-28: no nombrarlo. -->

---

## Un ejemplo de cada una: planear un viaje

- **tool** · `searchFlights` con su `inputSchema` (origin, destination, date) → el modelo la llama
- **resource** · el template `weather://forecast/{city}/{date}` → la aplicación lo lee
- **prompt** · `plan-vacation` con sus argumentos (destination, duration, budget, interests) → el usuario lo elige con `/plan-vacation`

Ejemplos recortados de [MCP, Understanding MCP servers](https://modelcontextprotocol.io/docs/2026-07-28/learn/server-concepts).

<!-- Un click por tarjeta. Las tres son del mismo escenario de la doc oficial, así se ve que trabajan juntas: el usuario arranca con el prompt, la aplicación suma el pronóstico como resource y el modelo llama a searchFlights. Mostrar en la tool que el inputSchema es JSON Schema: es lo que el modelo ve para armar la llamada, igual que la description de un skill. Los JSON están recortados para que entren: la doc tiene descripciones por campo y otro template de vuelos. -->

---

## Más allá del núcleo: extensiones

- **Authorization** — OAuth máquina a máquina y acceso centralizado para empresas (`ext-auth`)
- **Apps** — el servidor muestra UI interactiva dentro del chat (`ext-apps`)
- **Tasks** — operaciones largas: consultar el estado, pasar datos a mitad de camino, retomar
- **Skills over MCP** — un servidor publica skills como resources (`ext-skills`)

opcionales y apagadas por defecto · cliente y servidor las anuncian en sus capabilities · si el otro no la soporta, se vuelve al protocolo base · [MCP, Extensions](https://modelcontextprotocol.io/extensions/overview)

<!-- Un click por tarjeta, UN MINUTO EN TOTAL: es un mapa, no un tema. Lo que tiene que quedar: el núcleo del protocolo es chico y lo demás se agrega como extensión que ambos lados tienen que soportar. Skills over MCP es el gancho con el bloque anterior: el mismo estándar de skills, servido desde un servidor en vez de una carpeta. Si el bloque viene atrasado, nombrar solo Skills over MCP y seguir. -->

---

## Una conversación MCP

`server/discover` → `tools/list` → `tools/call` → `notifications/tools/list_changed`

<!-- Cada click muestra un mensaje en el diagrama de secuencia y su JSON-RPC real al lado. Protocolo 2026-07-28: sin estado, cada request lleva su versión y capacidades en _meta (ya no hay initialize). Solo decirlo si alguien leyó una versión vieja. -->

---

## Desde la terminal: `pi mcp add`

```bash
pi mcp add context7 --url https://mcp.context7.com/mcp

export CONTEXT7_API_KEY="tu-api-key"
pi mcp add context7 --url https://mcp.context7.com/mcp --bearer-token-env-var CONTEXT7_API_KEY

pi mcp list

pi mcp add --local context7 --url https://mcp.context7.com/mcp
```

1. global por defecto: se guarda en `~/.pi/agent/mcp.json`
2. con API key: límites de uso más altos (context7.com/dashboard); Pi guarda el nombre de la variable, no su valor
3. verificar y usar: `pi mcp list` · `/reload` si la sesión ya estaba abierta · `/mcp` para inspeccionar → *"Usá Context7 para consultar cómo configurar routing en Next.js 16."*
4. solo este proyecto: `--local` desde la raíz del repo → `.pi/mcp.json`

<!-- Una terminal que se arma en cuatro clicks, con una tarjeta por click a la izquierda. La variable de la API key tiene que estar definida CUANDO ARRANCA PI, no cuando se corre pi mcp add. Las líneas con · de la terminal son explicación, no salida real del comando. -->

---

## Enchufar un servidor: `.pi/mcp.json`

```json
{
  "mcpServers": {
    "context7": { "command": "npx", "args": ["-y", "@upstash/context7-mcp"] },
    "notion": { "url": "https://mcp.notion.com/mcp", "description": "Páginas y bases del workspace" }
  }
}
```

`/mcp` · `/mcp login <server>` · `pi mcp add` · `pi mcp list` · `/reload`

<!-- Local: command + args. Remoto: url, y /mcp login si pide OAuth (Notion lo pide). ~/.pi/agent/mcp.json para lo global. context7 = docs actualizadas de librerías, el arreglo a "me inventa la API": es el que enchufan en la práctica. -->

---

## Buena práctica 1: descubrimiento progresivo

todo de entrada ~150.000 tokens → progresivo ~2.000

1. **catálogo**: `search_tools({ query: "update salesforce record" })` → nombres y una línea (`salesforce_updateRecord`, `salesforce_upsertRecord`)
2. **inspeccionar**: `get_tool_details({ name: "salesforce_updateRecord" })` → el schema de esa tool sola
3. **ejecutar**: `salesforce_updateRecord({ objectType: "Account", recordId: "001xx0001", data: { Phone: "555-0100" } })`

<!-- La primera buena práctica de cliente de la spec de MCP, con su ejemplo de Salesforce (link abajo en la slide). El switch del deck pasa de un número al otro. "Es exactamente el truco de los skills, aplicado a tools: pagás el nombre, no el cuerpo". En Pi 1.0: exposure deferred. El schema del paso 2 está simplificado y el código del paso 3 es nuestro: la spec no trae la llamada. -->

---

## Pi dijo que no a MCP… y después que sí

- **nov 2025 · Zechner**, [*What if you don't need MCP at all?*](https://mariozechner.at/posts/2025-11-02-what-if-you-dont-need-mcp/): CLI + README de ~225 tokens. *"MCP servers also aren't composable."*
- **sep 2026 · Earendil**, [*You Said No MCP!*](https://earendil.com/posts/you-said-no-mcp/): MCP entra al núcleo de Pi, con codemode. *"The biggest issue with MCP continues to be that it's hard to compose."*

<!-- ~3 min, y merece la atención de la sala. La crítica no se retiró: SE CONVIRTIÓ EN DISEÑO. El costo → descubrimiento progresivo; la composición → code mode (el modelo escribe un script que llama a las tools y solo el resultado vuelve al contexto). "Instalá el MCP" sigue siendo una decisión con precio, no un default; lo que cambió es que ahora el precio lo administra el harness. Los títulos de los dos posts son links. -->

---

## Pi 1.0: cómo le llega cada tool al modelo

| `exposure` | Qué ve el modelo |
|---|---|
| `codemode` (default) | nada declarado: las tools se llaman desde un script |
| `deferred` | `tool_search` |
| `direct` | todas las definiciones |
| `hidden` | nada, y no se pueden usar |

<!-- Selector en vivo en el deck. Con direct aparecen diez tools de Notion. toolExposure hace lo mismo tool por tool. Las dos slides que siguen muestran codemode, el default, en acción. -->

---

## Codemode en acción: llamar un MCP

```js
const orgs = await tools.mcp__sentry__find_organizations({});
const { organizations } = orgs.structuredContent;
const results = await Promise.allSettled(organizations.map(org =>
  tools.mcp__sentry__find_projects({ organizationSlug: org.slug, regionUrl: org.regionUrl })
));
return organizations.map((org, i) => { /* arma { org, projects } o { org, error } */ });
```

1. una tool MCP es una función: `tools.mcp__sentry__…`, no se le declara al modelo ni se descubre antes
2. en paralelo: una llamada a `find_projects` por organización, con `Promise.allSettled`
3. al modelo vuelve solo esto: el script arma el resultado y maneja los errores

<!-- Código de Armin Ronacher, "What is Codemode" (oct 2026), link en la slide. Cada click resalta las líneas de un punto. El agente llama al MCP de Sentry sin descubrir sus tools: le alcanza con lo que sabe y lo que dice el system prompt. Las respuestas crudas no pasan por el contexto. -->

---

## Codemode en acción: clasificar con Jev

```js
const jev = await models.getModelOfType("classifier", "typesafe", "jev-latest");
const r = await tools.bash({ command: "gh issue list --state open --limit 100 --json number,title,body,comments" });
const issues = JSON.parse(r.output);
const results = await Promise.all(issues.map(async (issue) => {
  const res = await models.classify(jev, { state: { /* title, body, comments */ },
    questions: { sentiment: { /* choice */ }, frustration: { /* score */ }, kind: { /* choice */ } } });
  /* … */
}));
store("sentiment_results", results);
return results.filter(r => !r.error).sort(/* por frustración */).slice(0, 12).map(/* una línea por issue */);
```

1. un modelo clasificador: Jev (typesafe) no es una tool, se usa desde el código con `models.getModelOfType`
2. los datos entran por bash: `gh issue list`, 100 issues en JSON que nunca pasan por el contexto
3. clasificar cada issue: `models.classify` con sentimiento, frustración y tipo, en paralelo (Pi corre 4 a la vez)
4. filtrar antes de volver: `filter` · `sort` · `slice`, vuelven 12 líneas y no 100 issues; `store()` guarda el resto en la sesión

<!-- Código de Armin Ronacher, "What is Codemode" (oct 2026). El deck muestra el script completo y resalta un bloque por click. El "filter" es el .filter() de JavaScript que arma el resultado. La idea: el modelo escribe el programa, el programa hace el trabajo pesado y al contexto vuelve solo lo que importa. -->

---

# Subagentes

un subtask entero, en otro contexto · Pi no los trae de fábrica: se agregan con una extensión · por ejemplo [pi-subagents](https://pi.dev/packages/pi-subagents) · `pi install npm:pi-subagents`

<!-- Sección. ~7 min. Decirlo explícito: a diferencia de MCP, que en Pi 1.0 viene de fábrica, los subagentes NO son nativos; la funcionalidad se agrega con una extensión, y pi-subagents es una que ya existe (Pi 1.2.0 o más nueva). La idea en una línea: así como el skill saca un procedimiento del contexto hasta que hace falta, el subagente saca UN TRABAJO ENTERO de tu contexto. -->

---

## Investigar ensucia el contexto

"¿Cómo maneja el login este repo?": 30 `read` y 12 `grep` para quedarte con un párrafo.

| | tu sesión | contexto aparte |
|---|---|---|
| sin subagente | ~56k | — |
| con subagente | ~3k | ~53k, se descarta |

Tu sesión ve **el resumen**, no la búsqueda.

<!-- Tres clicks: la barra sin subagente, las dos con subagente, y la frase. Es la regla del 50% otra vez: lo que no entra en tu ventana no te degrada el agente. Los números son ilustrativos. -->

---

## Cómo funciona

1. le pasás una tarea, no tu conversación: el prompt es todo lo que sabe
2. contexto, transcript y tools propios
3. vuelve un solo mensaje: el resultado

<!-- En el deck, a la derecha, una sesión de Pi que delega la exploración del login y recibe un solo mensaje de vuelta. EL PUNTO 1 ES EL QUE LOS VA A MORDER: el subagente no vio nada de lo que hablaron, así que una tarea mal escrita vuelve con un resultado malo. Escribirle la tarea es escribir un prompt. Con pi-subagents se pide en lenguaje natural ("usá scout para explorar cómo funciona el login"); la tool se llama subagent y trae agentes de fábrica: scout, researcher, worker, reviewer, oracle. El pedido termina en "Usá un subagente para explorar.": la delegación se pide explícita, no se espera que el agente la decida solo. -->

---

## En paralelo: tres a la vez

1. tareas independientes: cada subagente recibe su estilo y no sabe de los otros
2. tarda lo que el más lento, no la suma
3. vuelven tres resultados para comparar

<!-- En el deck, a la derecha, una sesión de Pi que pide tres alternativas de la slide de título (minimalista, ilustrada, terminal), un subagente por estilo; los tres corren a la vez y a la izquierda aparecen las tres miniaturas. El punto: cuando las tareas no dependen entre sí, el paralelo te da varios intentos en el tiempo de uno, y elegir entre tres es más fácil que corregir uno. Los tiempos son ilustrativos. No es orquestación (eso es de la Sesión 4): no se coordinan ni comparten nada, cada uno hace lo suyo y vuelve. -->

---

## Dos agentes de verdad

Un agente es un markdown: frontmatter YAML arriba, system prompt abajo.

- **[mahou · reuse-reviewer](https://github.com/asermax/claude-plugins/blob/master/mahou/agents/reuse-reviewer.md)** · Agus · busca código que reimplementa algo que ya existe, no edita nada
- **[pi-subagents · researcher](https://github.com/nicobailon/pi-subagents/blob/main/agents/researcher.md)** · de fábrica en pi-subagents, investiga en la web y escribe `research.md`

Dónde viven en Pi:

```
builtin    ~/.pi/agent/extensions/subagent/agents/
usuario    ~/.pi/agent/agents/**/*.md
proyecto   .pi/agents/**/*.md
```

<!-- Un link por click, se abren en vivo. Mirar el frontmatter: es el mismo formato que un skill (name y description), más lo que define al especialista que corre como sesión hija: qué tools tiene (reuse-reviewer: solo lectura y git; researcher: búsqueda web), qué modelo y dónde deja el resultado. El cuerpo es el system prompt. El tercer click: los mismos tres niveles que AGENTS.md y skills — de fábrica, tuyos para todo proyecto, y del repo. -->

---

## Cuándo sí y cuándo no

| delegá | hacelo en tu sesión |
|---|---|
| explorar o investigar mucho para quedarte con poco | cuando querés ver el razonamiento o decidir a mitad de camino |
| revisar con ojos frescos: no vio cómo lo escribiste | trabajo que depende de lo que ya hablaron |
| tareas independientes, en paralelo | |

<!-- Dos clicks, una columna cada uno. Decirlo en voz alta aunque ya no esté en la slide: el subagente no es "más IA", es economía de contexto; en total se gastan MÁS tokens, no menos. -->

---

## Siempre cargado vs. on demand

| | Siempre cargado | On demand |
|---|---|---|
| Contexto del proyecto | `AGENTS.md` | skill |
| Tools externas | todas las definiciones (`direct`) | `deferred` · `codemode` |
| Trabajo | tu sesión | subagente |

<!-- EL CIERRE DE LA TEORÍA, y acá sí frenar. Una fila por click. Tres tecnologías distintas, el mismo movimiento: lo que no hace falta en cada turno sale de la ventana hasta que hace falta. Si se llevan una sola cosa de la clase, que sea esta tabla. DEJARLA PROYECTADA MIENTRAS ARRANCA LA PRÁCTICA. Después: pausa de 5 min. -->

---

## Práctica (45 min)

1. `AGENTS.md` (y podarlo)
2. probarlo en una sesión nueva
3. un skill para verificar que tu app anda
4. context7 por MCP
5. delegar a un subagente

`context7 → .pi/mcp.json` · `/reload · /mcp` · `pi install npm:pi-subagents`

avanzado, si te sobra tiempo · tu propio servidor o cliente MCP en Python con [FastMCP](https://gofastmcp.com/)

<!-- Ver exercise/README.md, no leerlos desde la slide. El timer del deck arranca al entrar a la slide (click para reiniciar). INSISTIR EN DOS COSAS: el paso 1 lo escribe el agente pero LA PODA ES EL EJERCICIO, y EL PASO 2 NO SE SALTEA. Por qué la poda, con datos (los cita la AAIF en "Writing an effective AGENTS.md", 2026): Gloaguen et al. encontró que los AGENTS.md generados por un LLM casi no mejoran el resultado y suben el costo, que los escritos por devs rinden más, y que los resúmenes del repo no ayudan al agente a encontrar código; así que el árbol de directorios se va. Del lado bueno, con un archivo cuidado: Lulla et al. midió −29% de tiempo y −17% de tokens de salida (124 tareas, 10 repos; mide eficiencia, no si el cambio está bien), y en la prueba de la AAIF 2 de 5 corridas sin AGENTS.md hicieron un build de producción que nadie pidió, contra 0 de 5 con el archivo. Para el paso 2: si el agente tropieza dos veces con lo mismo, es una línea nueva; una advertencia vieja es peor que ninguna. Paso 3: el skill dice cómo levantar la app y cómo comprobar que anda (tests, un curl, abrirla); la description tiene que nombrar cuándo usarlo. Paso 4: el archivo va en .pi/ (o pi mcp add --local), aceptar project trust, y /reload. Paso 5: pedirle a un subagente que explore algo del repo (scout) o que revise el diff (reviewer), y comparar cuánto contexto gastó la sesión principal. FastMCP es solo para quien termine antes: nombrarlo, no enseñarlo; armar un servidor por dentro es tema de la Sesión 5. -->

---

## ¿Qué aprendimos?

Siete tarjetas: escribilo una vez · `AGENTS.md` corto · skills on demand · la description es el trigger · host/cliente/servidor · descubrimiento progresivo · subagentes: un trabajo entero, en otro contexto.

<!-- Recap visual, y es la última slide. No leerla: dejarla un momento y abrir la discusión de cierre (¿qué cambió en el paso 2? ¿qué les sorprendió del tooling?). -->
