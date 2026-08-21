---
marp: true
theme: default
paginate: true
title: Sesión 3 — Herramientas y Skills
---

<!--
Skeleton de la presentación de la Sesión 3.
Cada slide tiene un título + una nota de oradora/orador (HTML comment).
El contenido del cuerpo de cada slide está pendiente.

Excepción deliberada: tres slides SÍ traen cuerpo escrito, porque el
contenido tiene que estar en pantalla textual para que la sala lo copie
o lo lea — el hook `{ block: true, reason }`, la tabla de costos de MCP,
el snippet de `.mcp.json` y la tabla de siempre-cargado vs. on-demand.

Sesión de 2 h: 10 recap, 5 intro, 13 anatomía, 11 AGENTS.md, 8 skills,
8 MCP, 7 subagentes, 5 pausa, 45 práctica, 8 cierre.

Da 120 justos, no hay colchón. Si se estira, se recorta del recap.
El material del recap se recolecta con MENTIMETER y la pantalla queda
proyectada toda la clase: se apunta a ella cuatro veces.
-->

# Sesión 3
## Herramientas y Skills

**De Vibe Coding a Agentic Engineering** — FaMAF
Diego Piloni

<!-- Portada. Anclar: sesión 3 de 6, mismo proyecto, 2 h. Hoy se paga la deuda que dejó Agus la semana pasada: por qué el harness les restringía las herramientas en plan mode. -->

---

## Hoy

<!-- Agenda en una slide: cómo les fue, dónde vive cada cosa que repetís, anatomía del harness, AGENTS.md, skills, MCP, subagentes, y 45 min de práctica. Avisar que NO hay bloque de setup: la única instalación nueva la hacemos juntos al arrancar la práctica. -->

---

# ¿Cómo les fue?

<!-- Sección de recap. ~10 min de DISCUSIÓN, no de slides. Coordinar con Agus ANTES de la clase: cómo cerró la Sesión 2 y qué juntó en su reflexión, para no recolectar dos veces lo mismo. Este es el bloque elástico: si el día se estira, se recorta de acá. -->

---

## ¿Les pareció útil planificar? ¿Hubo algo que habrían ejecutado directo?

<!-- Primer disparador. La tarea preguntaba "dónde fue pura ceremonia", que es demasiado abstracto para tirarlo a una sala; preguntarlo así y desbloquearlo con ejemplos concretos: un fix de una línea, un cambio de texto, un color. Lo que buscamos que encuentren es EL UMBRAL DONDE PLANIFICAR DEJA DE PAGAR — eso es criterio, no una regla. Las respuestas honestas ("para esto no me servía") son las buenas. NO DEFENDER EL PROCESO ACÁ. Y el puente al día: la respuesta de hoy a "planificar cada vez sale caro" es escribilo una vez y dejá de planificarlo. -->

---

## ¿Qué le tuviste que explicar más de una vez?

<!-- EL disparador. Va a MENTIMETER: pregunta abierta, todos responden a la vez y en anónimo, y la pantalla queda proyectada toda la clase. Es el insumo de los cinco bloques que siguen y de los cinco pasos de la práctica — sin esto la práctica se queda sin combustible. Juntar seis o siete. Si sale flojo, sembrar ejemplos concretos, redactados como los diría un estudiante: "los tests se corren con pnpm test", "usamos pnpm y npm me rompe el lockfile", "los componentes van en src/components/", "no me toques las migraciones", "no me pongas comentarios que repiten la línea de abajo". Tener el menti armado ANTES de entrar al aula; plan B si falla la red: mano alzada y pizarrón. -->

---

# Qué vamos a ver hoy

<!-- Sección. ~5 min. Toma las respuestas del menti y las ordena. -->

---

## Dónde vive cada cosa que repetís

<!-- La tabla que ordena el día: datos del proyecto → AGENTS.md (siempre cargado); un procedimiento → skill (on demand); un prompt que retipeás → prompt template (on demand); una capacidad que falta → tool/MCP (la definición siempre, el resultado on demand); un subtask entero → subagente (contexto aparte). Ir tomando respuestas del menti en voz alta y diciendo a qué fila cae cada una. Algunas caen en dos filas y está bien: ELEGIR ES EL TEMA DE HOY. La metáfora del curso: la Sesión 2 fue vos poniendo el criterio a mano cada vez; hoy lo escribís una vez y el agente lo lee solo. Es lo que hace un manager cuando deja de repetir la misma corrección en cada 1:1 y escribe el onboarding. -->

---

## "Lo que le explicaste dos veces, escribilo una"

<!-- La frase de la sesión. Que quede escrita a la vista toda la clase. -->

---

## Nada de esto es gratis

<!-- La contracara, y la segunda idea del día: TODO LO QUE LE AGREGÁS AL AGENTE SE PAGA EN CONTEXTO. La columna de la derecha de la tabla anterior es el tema real de la sesión. Elegir qué está siempre cargado y qué se carga on demand es una decisión de ingeniería, no un detalle de configuración. Es la regla del 50% de la Sesión 1, volviendo convertida en presupuesto. -->

---

# Anatomía: tool, harness y extension points

<!-- Sección. ~13 min. TEORÍA CON LA HERRAMIENTA ABIERTA, no con slides — pasar rápido y trabajar en la terminal. Es el bloque que paga la deuda de la Sesión 2. Ensayarlo con reloj. -->

---

## Qué es una tool

<!-- ~4 min. Un nombre, un schema y un handler. Eso es todo. El LLM no "usa" la tool: EMITE UN JSON que dice qué tool quiere y con qué argumentos, y el HARNESS la ejecuta y le devuelve el resultado como texto. Mostrar el toolbelt de Pi en vivo (read, write, edit, bash, grep, find, ls) y abrir una tool call real en la sesión: que vean el JSON. -->

---

## Una tool mejor suele ganarle a un modelo mejor

<!-- La idea que vale la pena que se lleven de este bloque. Un modelo excelente con bash y nada más va a reimplementar grep a mano, mal y caro. Es la razón por la que el resto de la sesión existe. -->

---

## Qué hace el harness

<!-- ~4 min. El programa que envuelve al LLM. Cuatro responsabilidades, en este orden porque es el orden en que las fueron sintiendo: (1) manejo del contexto — qué entra, qué se compacta, qué se tira (Sesión 1, la regla del 50%); (2) dispatch de tools — ejecutar lo que el modelo pidió y devolver el resultado; (3) permisos — decidir qué se ejecuta y qué no; (4) extension points — dejar que otros agreguen cosas. -->

---

## Pi es casi todo extension points

<!-- El regalo de Pi: toolbelt mínimo built-in, y casi todo lo demás enchufado. AGENTS.md = archivos de contexto al arrancar. Skills = SKILL.md con frontmatter. Prompt templates = expansión /nombre. Permisos y plan mode = UN HOOK. MCP = no viene, es una extensión. Subagentes = pi-subagents. Y LA LÍNEA QUE HAY QUE DECIR EN VOZ ALTA: que en Pi MCP venga como extensión y en Claude Code venga de fábrica no es un accidente ni un defecto — es el espacio de diseño de los harnesses. Un harness mínimo te muestra las costuras; uno con baterías incluidas te las esconde. Ninguno está mal. Esa es toda la comparación con Claude Code / Codex / OpenCode: UNA LÍNEA, NO UNA TABLA. -->

---

## El reveal

```ts
onToolCall(({ name }) => {
  if (planMode && !["grep", "find", "ls"].includes(name)) {
    return { block: true, reason: "Estás en plan mode: solo podés leer." }
  }
  // sin return → la tool se ejecuta
})
```

<!-- ~2 min. El punto 4 explica el punto 3, y explica la semana pasada. Pi llama a este hook JUSTO ANTES de ejecutar cada tool call. Si no devolvés nada, la tool corre. Si devolvés { block: true, reason }, LA TOOL NO SE EJECUTA. Eso es todo lo que era el plan mode. La frase: "lo que Plannotator les hizo la semana pasada era tool_call → { block: true }. El mismo hook que van a usar ustedes hoy." Decirla y dejar que caiga. NO convertir esto en una clase de TypeScript. -->

---

## `reason` no es para vos, es para el modelo

<!-- La parte que no es obvia y hay que decir explícita. Cuando bloqueás, Pi le devuelve al modelo el string de `reason` EN EL LUGAR DONDE IRÍA EL RESULTADO DE LA TOOL. Es la única información que el modelo tiene sobre por qué su acción no pasó, y de ahí decide qué hace después. "bloqueado" lo deja reintentando a ciegas; "estás en plan mode, proponé un plan y esperá aprobación" lo hace cambiar de estrategia solo. Escribir buenos reason es, literalmente, prompt engineering. Y el cierre: EL DIÁLOGO DE PERMISOS ES ESTE MISMO HOOK CON UN HUMANO EN EL MEDIO — si decís que no, el modelo recibe exactamente un { block: true, reason }. -->

---

## Seguridad: el único lugar donde decidís antes

<!-- ~3 min, acá y NO en un bloque aparte: los permisos SON un extension point, así que es el mismo material. (1) El allowlist/denylist y el diálogo de permisos no son burocracia: son el único lugar donde decidís antes de que el agente actúe; después ya está hecho. (2) bash es la tool más poderosa del toolbelt y por eso la más peligrosa: un agente con bash sin restricciones puede hacer cualquier cosa que puedas hacer vos en esa terminal. (3) Sandboxing y containerization: Pi tiene docs propias, mención y puntero, sin demo. (4) Y la que se les vuelve relevante en dos sesiones: EL AGENTE LEE TEXTO DE AFUERA (issues, docs, páginas web, resultados de MCP) y ese texto puede contener instrucciones. Nombrarlo y seguir: prompt injection es Sesión 4. -->

---

# `AGENTS.md`

<!-- Sección. ~11 min. DESDE CERO: nadie en la sala escribió uno. El paso que lo pedía en la Sesión 1 se sacó y la Sesión 2 no lo tocó a propósito. No dar por sentado que saben qué es, ni siquiera los que ya usaron otro agente. -->

---

## Un archivo que el agente lee al arrancar, todas las veces

<!-- Qué es. No hay magia: se pega adelante de la conversación. Por eso funciona, y por eso cuesta. -->

---

## Qué va adentro

<!-- Lo que tuvieron que explicar dos veces y NO cambia entre tareas: (1) cómo se corre el proyecto y cómo se corren los tests — LOS COMANDOS DE VERIFICACIÓN SON LO MÁS VALIOSO QUE LE PODÉS PONER, porque son lo que le permite al agente saber si lo que hizo funciona sin preguntarte; (2) el stack y las decisiones ya tomadas ("usamos pnpm", "no agregues dependencias sin preguntar"); (3) dónde van las cosas; (4) el estilo, pero solo lo que un linter no puede decirle. Apuntar al menti mientras se dice cada punto. -->

---

## Qué no va

<!-- Documentación del dominio que cambia todo el tiempo. Cosas que valen para una sola tarea (eso es el prompt). Y la más común: UNA WIKI. Si le escribís 400 líneas, estás pagando 400 líneas en cada turno para siempre. Mostrar acá el AGENTS.md malo que tenemos escrito de antemano — genérico, larguísimo, del tipo "escribí código limpio". -->

---

## Proyecto y global

<!-- Pi los carga y los concatena desde varios lugares: ~/.pi/agent/ (global, tuyo, todos tus proyectos), los directorios padre, y el directorio actual. El ejemplo que lo explica: "prefiero tabs" va en el global; "los tests se corren con pnpm test" va en el del proyecto. Lo global viaja con vos entre proyectos; lo del proyecto viaja con el repo y le sirve a quien lo clone — INCLUIDO EL QUE LO CLONA EN DOS AÑOS, QUE CAPAZ SOS VOS. -->

---

## El costo, dicho de frente

<!-- Está en contexto en CADA TURNO. Es un impuesto que pagás siempre, uses o no esa información. Y dejar la pregunta abierta, porque es exactamente el bloque siguiente: "¿y si el procedimiento que quiero escribir son 60 líneas y lo uso una vez por semana?" -->

---

# Skills y prompt templates

<!-- Sección. ~8 min. -->

---

## El skill es la respuesta a ese impuesto

<!-- Un directorio con un SKILL.md y frontmatter (name, description, y opcionalmente allowed-tools). Vive en .pi/skills/ o .agents/skills/ en el proyecto, o en ~/.pi/agent/skills/ global — el MISMO par proyecto/global que AGENTS.md. -->

---

## Cómo se carga: tres etapas

<!-- El artefacto concreto de toda la sesión. (1) Al arrancar, Pi escanea los skills y se queda con EL NOMBRE Y LA DESCRIPCIÓN de cada uno. (2) En el system prompt entra solo eso: la lista de nombres y descripciones. (3) EL CUERPO DEL SKILL.MD SE CARGA RECIÉN CUANDO LA TAREA LO AMERITA. Es decir: tenés veinte skills instalados y pagás veinte descripciones, no veinte procedimientos. Ese es el truco, y vuelve a aparecer en el bloque de MCP. -->

---

## La descripción no es documentación, es el trigger

<!-- La consecuencia práctica: la description es LO ÚNICO que decide si el skill se usa. Un skill perfecto con una descripción vaga no se carga nunca. Es el error más común cuando escriben el primero. -->

---

## Datos → `AGENTS.md` · Procedimientos → skill

<!-- La regla de dedo de la sesión. Que quede escrita a la vista (pizarrón o slide fija) hasta el final de la práctica. -->

---

## Prompt templates

<!-- ~1 min, la versión liviana. Un texto que expandís con /nombre. Cuando lo que repetís es un prompt y no un procedimiento, no hace falta un skill. También existe /skill:nombre para invocar un skill a mano. Mención y seguir. -->

---

# MCP, y cuánto cuesta

<!-- Sección. ~8 min. El bloque donde la tesis de la sesión consigue su número más duro. -->

---

## Qué es

<!-- ~2 min. El agente gana tools EN TIEMPO DE EJECUCIÓN: un servidor externo publica tools y el harness se las ofrece al modelo. En Pi no viene de fábrica — pi-mcp-adapter. Los servidores se declaran en .mcp.json (mcpServers, con command y args) y se maneja con /mcp setup, /mcp tools y /mcp-auth <server>. -->

---

## Cuánto cuesta

| Servidor MCP | Tools | Tokens | % de la ventana |
|---|---|---|---|
| Playwright MCP | 21 | 13.7k | 6.8% |
| Chrome DevTools MCP | 26 | 18.0k | 9.0% |

<!-- ~2 min. Números del post de Mario Zechner (mariozechner.at/posts/2025-11-02-what-if-you-dont-need-mcp/). VERIFICARLOS EL DÍA DE LA CLASE: son específicos de versiones y pueden haber cambiado; si cambiaron el argumento sigue en pie, actualizar la tabla. Decirlo sin vueltas: eso es contexto gastado ANTES DE QUE EL ESTUDIANTE ESCRIBA UNA SOLA PALABRA. Dos servidores instalados y ya pagaste ~15% de la ventana en capacidades que capaz hoy no usás. Es la regla del 50% comida por configuración. Y el segundo costo, menos obvio y más molesto: CUARENTA TOOLS CONFUNDEN AL MODELO. -->

---

## ¿Y si no necesitás MCP?

<!-- ~3 min, y merece la atención de la sala. MARIO ZECHNER, QUE ES QUIEN ESCRIBE PI, sostiene que muchas veces no lo necesitás. Su alternativa: cuatro scripts de CLI y un README de ~225 TOKENS, porque el modelo ya sabe escribir código y usar bash. Y el argumento más profundo es de composición: la salida de un CLI cae en un archivo y se puede encadenar, mientras que EL RESULTADO DE UNA TOOL MCP TIENE QUE PASAR POR LA VENTANA DE CONTEXTO para servir de algo. NO PRESENTARLO COMO LA RESPUESTA CORRECTA: son dos ingenieros con criterio que no están de acuerdo. Lo que tienen que ver es que "instalá el MCP server" es una decisión con precio, no un default. Decir quién es Zechner: es lo que le da peso. -->

---

## La respuesta de ingeniería: una tool proxy

<!-- ~1 min. pi-mcp-adapter NO expone las tools del servidor: expone UNA SOLA TOOL PROXY DE ~200 TOKENS y va a buscar el resto cuando hace falta. Nombrarlo al pasar — "es exactamente el truco de los skills, aplicado a tools: pagás el nombre, no el cuerpo" — y NO CERRAR ACÁ. La tabla que sintetiza esto va al final del bloque siguiente, cuando ya estén nombrados los subagentes. -->

---

## Docs tools: cuando el agente inventa una API

<!-- El arreglo a una falla que ya sintieron. context7 (context7.com) sirve docs actualizadas de librerías, y SE CONSUME COMO SERVIDOR MCP — por eso en la práctica MCP y context7 son un solo paso. context-hub (github.com/andrewyng/context-hub) hace algo parecido: mención al pasar, sin demo. -->

---

# Subagentes y worktrees

<!-- Sección. ~7 min. Profundidad sobre lo que la Sesión 2 usó dos veces como subtema (revisar el plan, revisar el diff). Ya tienen pi-subagents instalado. -->

---

## La razón honesta: un contexto aparte

<!-- NO ES "MÁS IA". Cuando le pedís a un subagente que explore el repo y te diga dónde está el manejo de sesiones, el subagente se come veinte archivos en SU ventana y te devuelve tres párrafos a LA TUYA. Lo que ganás es que la basura quedó afuera. Es la misma economía de todo el día. -->

---

## Cuándo sirve y cuándo no

<!-- SIRVE cuando la tarea genera mucho material intermedio y poco resultado: explorar, buscar, revisar, resumir. NO SIRVE cuando necesitás el detalle en tu propio contexto para seguir trabajando, o cuando la tarea es corta — delegar cuesta un round-trip. Tipos de agente: research, exploración, code review; que vean que son el mismo mecanismo con distinto prompt y distinto toolset — OTRA VEZ, EXTENSION POINTS. Worktrees en una línea: ejecución paralela aislada, cada agente en su propio checkout, sin pisarse; mención y puntero. Y el límite, explícito porque el programa lo marca: HOY VEMOS EL PRIMITIVO, ORQUESTAR VARIOS AGENTES ES LA SESIÓN 4 (AGUS). No abrir eso. -->

---

## Siempre cargado vs. on demand

| | Siempre cargado | On demand |
|---|---|---|
| Contexto del proyecto | `AGENTS.md` | skill |
| Tools externas | todas las definiciones | la tool proxy |
| Trabajo | tu sesión | subagente |

<!-- EL CIERRE DE LA TEORÍA, y acá sí frenar. Con el subagente ya nombrado, la tercera fila se puede escribir. Tres tecnologías distintas, el mismo movimiento. Si se llevan una sola cosa de la clase, que sea esta tabla. DEJARLA PROYECTADA MIENTRAS ARRANCA LA PRÁCTICA. -->

---

# Pausa (5 min)

<!-- Aprovechar para dejar la tabla anterior en pantalla y abrir la terminal para el paso 0 de la práctica. -->

---

# Práctica (45 min)

<!-- Sección. Cinco pasos, y LOS CINCO ATACAN LA MISMA REPETICIÓN que el estudiante puso en el menti: es un hilo, no cinco mandados. -->

---

## Primero, todos juntos

```
pi install npm:pi-mcp-adapter
```

<!-- Un minuto, la sala entera, en voz alta, ANTES de soltarlos. No se pidió como pre-work a propósito: un pre-work opcional lo hace la mitad de la sala y arrancamos el paso 4 con dos poblaciones distintas. Es un comando, no un setup. Esperar a que confirmen. -->

---

## Los cinco pasos

<!-- Ver exercise/README.md, no leerlos desde la slide. (1) Escribí el AGENTS.md de tu proyecto, a partir de tus notas ~12 min. (2) Probalo: la misma tarea en una sesión nueva ~5 min. (3) Un skill para el procedimiento que repetís ~10 min. (4) Apuntá el adapter a context7 ~10 min. (5) Un subagente sobre tu propio código ~8 min. INSISTIR: el paso 1 sale de sus notas, NO de una plantilla; y EL PASO 2 ES EL QUE NO SE SALTEA. Decir en voz alta que no terminar el paso 5 está bien. -->

---

## Para copiar: context7

```
npx ctx7 setup
```

<!-- El paso 4 es el que se come el reloj: descarga, config, capaz /mcp-auth. Este comando en pantalla es CERO DESCUBRIMIENTO — dejarlo proyectado durante todo el paso 4. VERIFICAR antes de la clase, en la red del aula, si hace falta API key. Después: /mcp tools, y que le pregunten al agente algo sobre una librería que estén usando de verdad. Y pedirles que ABRAN LA CONFIG QUE DEJÓ ESCRITA: es el mismo mcpServers con command y args de la teoría, y hoy se lo escribió un instalador. -->

---

## El costo, en su propia ventana

<!-- El callback para tirar caminando la sala: "fijate cuánto contexto te comió el server que acabás de instalar". Y el remate: pi-mcp-adapter no metió las tools del servidor en su contexto, metió UNA tool proxy. Es el truco del skill, aplicado a tools — la tercera vez que aparece la misma idea en el día. -->

---

# Cierre

<!-- Sección. ~8 min. -->

---

## ¿Qué cambió en el paso 2?

<!-- LA pregunta de la sesión. Que cuenten un caso concreto de algo que el agente hizo solo, sin que se lo dijeran. Sin ese contraste, el AGENTS.md es un archivo que escribieron porque se lo pedimos. Segunda pregunta, abierta, del programa: ¿qué les sorprendió del tooling? — sirve para pescar lo que no cubrimos. Y cerrar volviendo a la tabla de siempre-cargado vs. on-demand: hoy fue AGENTS.md, skills y MCP, pero el criterio se aplica a cualquier harness. Es la idea que sobrevive al curso. -->

---

## Para la semana · Próxima sesión

<!-- Tarea: seguir usando el AGENTS.md y anotar QUÉ LE SIGUIERON EXPLICANDO IGUAL — el archivo crece toda la semana, y lo que no entra en él es lo que Agus va a llamar SPEC. Segunda parte: traer una feature que NO puedan describir en una frase; es el insumo de spec-driven development. La Sesión 4 es de Agus: context engineering, orquestación de agentes y prompt injection, que hoy solo nombramos. -->
