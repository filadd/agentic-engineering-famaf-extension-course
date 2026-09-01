# Sesión 5 — Coding Harness (internals) — Notas para el instructor

> A cargo: Agus. Estado: borrador. Todo el material de la sesión está en español.

## Objetivo de la sesión (en una frase)

Que salgan entendiendo **de qué está hecha la herramienta que vienen usando hace cinco semanas**, y con una extensión propia andando que escribieron dirigiendo al agente.

## El encuadre que sostiene la sesión

**Enseñar el concepto, usar Pi como el espécimen.** Cada bloque de hoy es una decisión de diseño que *cualquier* harness tiene que tomar. Pi es el que podemos abrir, no el que estamos vendiendo.

Eso importa porque es la tesis con la que cierra el curso: lo que construís sobrevive al cambio de herramienta. La Sesión 6 la cobra cambiando el modelo; hoy la ensayamos una semana antes, mostrando que las piezas tienen nombre en todos lados aunque cada producto las resuelva distinto.

**El riesgo de la clase es que se convierta en un tour por las features de Pi.** No hay bloque que no pueda caer en eso. El antídoto es decir el encuadre en voz alta al empezar y volver a él en cada bloque: *"esto lo tiene que resolver cualquier harness; miremos cómo lo resuelve éste"*.

## Audiencia y supuestos

- **Dura 2 h 30 y no se instala nada.** La primera hora es de demos: la sala muestra lo que construyó. Es además la única sesión del curso sin riesgo de setup, y conviene aprovecharlo: el tiempo que las otras sesiones pierden en instalaciones acá es tiempo de clase.
- **Con qué llegan**: Pi con Plannotator y `pi-subagents` (Sesión 2) y `pi-mcp-adapter` (Sesión 3), su repo, su `AGENTS.md`, sus skills y los docs que escribieron en la Sesión 4. Todo eso es insumo de la práctica.
- **No se asume TypeScript.** Es una restricción real, marcada por Diego en la Sesión 3, y **la práctica está diseñada alrededor de ella**: la extensión la escribe el agente. Ver "La tarea de la semana".
- Grupo heterogéneo, de primer año a graduados. El menú de la práctica existe para que cada uno elija su nivel.
- **Esta sesión abre el tramo avanzado.** Las cuatro anteriores agregaban una capa de estructura cada una; ésta no tiene que agregar ninguna. Y el cierre del curso es de la Sesión 6, así que acá no hay despedida.

## La decisión de herramientas

Sigue **Pi**, y no se instala nada nuevo. Lo que cambia es qué miramos: hoy el material de la clase **es Pi mismo**.

Dos cosas que ya están en la máquina de todos y que casi nadie abrió:

- **Las docs**, que vienen con la instalación. Las que se usan hoy: `extensions.md`, `compaction.md`, `sessions.md`, `session-format.md`, `security.md`, `sdk.md`.
- **Las extensiones de ejemplo**, unas ochenta, en `examples/extensions/`. Son el material de lectura de la práctica y la fuente de la mitad de los ejemplos de la teoría.

Decirlo explícitamente en el bloque de apertura: *"todo lo que vamos a mirar hoy ya está instalado en su máquina"*. Es la primera vez en el curso que la herramienta es el objeto de estudio y no el instrumento.

## Plan tema por tema

### Demo de proyectos (~60 min)

**Abre la sesión.** Es la primera vez en el curso que la sala ve lo que construyó el resto. Se anunció en la Sesión 1 y se recordó en el cierre de la Sesión 4, así que llegan sabiendo.

Cómo corre:

- **Los primeros dos minutos son para armar la lista.** Quién quiere mostrar y en qué orden. **Voluntarios**, no lista de clase: no es una entrega y no se corrige.
- **Unos ocho turnos de 5 a 7 minutos**: 4 o 5 de mostrar, 2 de preguntas. Proyector, cada uno abre su repo. Cronómetro a la vista y corte amable a los 7.
- **Qué muestran**: el proyecto que vienen arrastrando desde la Sesión 1. Y no solo qué construyeron: **cómo**. El plan de la Sesión 2, el `AGENTS.md` y los skills de la Sesión 3, los docs de la Sesión 4.
- **La pregunta que se repite en cada turno**: *"¿qué decidiste vos y qué decidió el agente?"* Es el hilo del curso entero y acá se cobra.

**El recap de la Sesión 4 va acá adentro, sin bloque aparte.** La tarea era mantener los docs vivos durante la semana y anotar dos cosas, y son las dos preguntas que se le hacen a quien muestra:

1. **Cuándo un doc sirvió.** Que cuenten un caso concreto: el agente hizo algo bien sin que se lo expliquen, un plan salió distinto.
2. **Cuándo un doc quedó desactualizado** respecto del código, y qué costó eso.

El segundo es el más interesante y el que más va a aparecer. No hace falta resolverlo hoy; es material del cierre del curso.

**Este es el bloque elástico**, el rol que en el diseño anterior tenía el recap. Si el día se estira, se recortan turnos.

**Plan B**: si no se levantan ocho manos, Diego y Agus eligen —tienen los repos desde la Sesión 1— o el bloque se acorta y el tiempo vuelve a la teoría, que hoy tiene colchón.

### Qué vamos a ver hoy (~3 min)

Cinco semanas manejando la herramienta. Hoy la abrimos.

Nombrar el cambio de tramo, que ya anunciaron en la Sesión 1 y volvió a nombrarse en el cierre de la Sesión 4: **las últimas dos sesiones desarman la máquina**. Hoy el harness por adentro; la que viene, el modelo que tiene abajo.

Y el encuadre, en una frase: *"no vinimos a aprender Pi. Vinimos a ver qué problemas tiene que resolver cualquier harness, usando el único que podemos abrir."*

### Qué es un harness, y los otros (~10 min)

**El diagrama, primero.** Cuatro capas, de arriba hacia abajo:

```
┌────────────────────────────────────────┐
│  Interfaz    (chat · terminal · web)   │
├────────────────────────────────────────┤
│  Agent loop  (pensar → actuar → mirar) │
├──────────┬───────────┬─────────────────┤
│  Tools   │  Memoria  │  Contexto       │
│  (files, │  (convo,  │  (proyecto,     │
│   web…)  │   estado) │   reglas)       │
├──────────┴───────────┴─────────────────┤
│               LLM                      │
└────────────────────────────────────────┘
```

La idea que tiene que quedar: **un LLM solo predice tokens y no puede hacer nada.** El harness es lo que lo conecta al mundo. Todo producto de IA que usaron es un modelo más un harness, y **la diferencia entre productos casi nunca es el modelo**.

Es vocabulario que ya tienen: Diego plantó "LLM + tool + harness" en la Sesión 1 y lo abrió desde afuera en la Sesión 3. Acá se retoma en treinta segundos, no se reconstruye.

**Y después, los otros (~5 min).** Claude Code, Codex, el harness de DeepSeek, opencode.

**Esto no es una comparación y no hay tabla.** Comparar harnesses en abstracto no le sirve a nadie que usó uno solo. Lo que sí sirve es que salgan con los ejes en la cabeza, porque son las preguntas que van a hacerle a la próxima herramienta que agarren:

- **¿Es abierto o cerrado?** ¿Podés leer el código del harness que corre en tu máquina?
- **¿Qué viene de fábrica y qué agregás vos?** Pi trae cuatro tools y casi nada más; Claude Code trae veinticinco tools, permisos, plan mode, subagentes y memoria. Ninguno de los dos está mal: es la diferencia entre un editor mínimo y uno con baterías incluidas.
- **¿Se puede extender, y hasta dónde llega esa extensión?** Hay harnesses sin ningún punto de extensión, otros con hooks, otros donde casi todo es un punto de extensión.
- **¿Quién controla el system prompt?** ¿Lo podés leer? ¿Lo podés cambiar? ¿Cambia solo entre versiones sin que te enteres?

Cerrar el bloque con la línea que ordena todo lo que sigue: **cada una de esas es una decisión que alguien tomó.** Hoy vamos a ver las de Pi, que es el que tenemos abierto.

### El loop y las partes de Pi (~14 min)

**El bloque más denso del día.** Es el que hay que ensayar con reloj.

**Primero el loop (~9 min).** Cómo corre un turno, paso a paso. Se construye en pantalla, no aparece entero:

Vista general de la sesión:

```
session_start → resources_discover → [ agent loop ] → session_shutdown
```

Zoom al loop:

```
input → before_agent_start → turn_start → context → LLM call
      → tool_execution_start → tool_call → tool_result
      → tool_execution_end → turn_end → agent_end
```

Qué es cada momento, en una línea:

| Momento | Qué pasa |
|---|---|
| `session_start` | Se crea la sesión y arranca todo |
| `resources_discover` | Se descubren extensiones, skills y servidores MCP |
| `input` | Llega el mensaje del usuario |
| `before_agent_start` | Último momento antes de arrancar: acá se inyecta o se modifica el system prompt |
| `turn_start` | Empieza un turno dentro del loop |
| `context` | Se arman los mensajes que se le mandan al modelo |
| `LLM call` | Se llama al modelo |
| `tool_call` | Antes de ejecutar una tool: se puede bloquear o modificar los argumentos |
| `tool_result` | Después de ejecutarla: se puede modificar lo que el modelo recibe |
| `turn_end` | Termina el turno; el loop sigue hasta que el agente esté listo |
| `agent_end` | El agente terminó |
| `session_shutdown` | Se cierra la sesión |

**Y la línea que convierte el diagrama en algo que pueden usar**: todos esos momentos son escuchables. `pi.on(evento, handler)`, y desde ahí se bloquea, se modifica o se inyecta.

Acá se paga la deuda que quedó de la Sesión 2. Aquella semana el plan mode les restringió el toolset y Diego lo explicó en la Sesión 3 como un hook. Hoy se ve el hook en su lugar del diagrama: **`tool_call` → `{ block: true }`**. Es la misma pieza, mirada por tercera vez y ahora desde adentro.

**Después las partes (~5 min).** Cuatro paquetes, de la base a la superficie:

```
pi-ai  →  pi-agent-core  →  pi-coding-agent  →  pi-tui
```

- **`pi-ai`**: API unificada de modelos. Habla con cualquier proveedor. La base.
- **`pi-agent-core`**: el loop, el bus de eventos, la ejecución de tools. Genérico: no es solo para código.
- **`pi-coding-agent`**: la capa de coding. El CLI, las sesiones, las extensiones, las cuatro tools.
- **`pi-tui`**: la interfaz de terminal. Editor, temas, atajos. Lo único que el usuario ve.

Y la idea que hay que dejar picando porque vuelve en el bloque de run modes: **usás solo las capas que necesitás.** El agente entero no depende de que haya una terminal.

### El árbol de sesión, y steering vs follow-up (~7 min)

Dos comportamientos del loop, rápido. Ninguno de los dos es un bloque; son dos vistazos.

**El árbol (~4 min).** Las sesiones de Pi no son una lista de mensajes: son un **árbol**. Cada entrada tiene un `id` y un `parentId`, la posición actual es la hoja activa, y todo el árbol vive en **un solo archivo JSONL**.

Por eso `/tree` es barato: **movés un puntero, no borrás nada.** Las ramas que dejaste atrás siguen ahí.

Es la respuesta al `/tree` de la Sesión 1, donde se vendió como el antídoto contra los errores en cascada: cuando el agente lleva tres intentos fallidos, cada intento nuevo arrastra la basura de los anteriores, y volver a antes del pozo sale más barato que seguir cavando. Hoy se ve por qué eso no cuesta nada.

Y la distinción de las tres operaciones, en una tabla corta:

| | `/tree` | `/fork` | `/clone` |
|---|---|---|---|
| Resultado | El mismo archivo | Archivo nuevo | Archivo nuevo |
| Vista | El árbol completo | Selector de mensajes del usuario | La rama activa |
| Para qué | Explorar alternativas sin perderlas | Arrancar de nuevo desde un punto | Duplicar antes de seguir |

**Steering vs follow-up (~3 min).** Concepto general, y de los que casi nadie se hace la pregunta hasta que la ve escrita: **¿cuándo le llega información nueva a un agente que ya está corriendo?**

Hay tres respuestas posibles y todas tienen sentido en algún caso:

- **Interrumpirlo en el medio** del stream, para corregir el rumbo antes de que siga.
- **Esperar a que termine** lo que está haciendo y recién ahí entregarle el mensaje.
- **Encolarlo** para el próximo turno.

Cualquier harness tiene que decidir esto. La mayoría lo resuelve por adentro y no te lo cuenta. Pi les puso nombre a los tres (`steer`, `followUp`, `nextTurn`) y por eso sirve para mostrarlo: cuando algo tiene nombre, se puede elegir.

### Pausa (~5 min)

### Tres formas de darle una tool a un modelo, y subagentes (~13 min)

**Las tres formas (~7 min).** Este es el bloque más transferible de la sesión, y **no es sobre Pi**: es una decisión de diseño que van a tomar cada vez que quieran que un agente pueda hacer algo nuevo.

| Forma | Qué te da | Qué te cuesta |
|---|---|---|
| **Extensión** | Llega a las entrañas del harness: hooks, UI, comportamiento, no solo una función más | Sirve para ese harness y ninguno más. La escribís en su lenguaje y se rompe cuando ellos cambian |
| **CLI** | Lo más simple que funciona, y anda en **cualquier** harness que tenga una shell. Se prueba solo, se compone con todo lo demás | No hay historia de autenticación ni de permisos. Y el agente tiene que enterarse de que existe |
| **MCP** | Para tools que usan *otras personas*: distribución, auth y OAuth, servicios remotos | Contexto (las definiciones viven en el prompt), un servidor que mantener, y una indirección más |

**La pregunta que decide es quién es el consumidor.** Sos vos solo: un CLI. Sos vos y necesitás meterte con el harness: una extensión. Son otros, o hace falta auth, o el servicio es remoto: MCP.

Dos conexiones para tirar acá:

- **El CLI y el `AGENTS.md`.** El punto flojo del CLI es que el agente no sabe que existe. La solución ya la escribieron en la Sesión 3: una línea en el `AGENTS.md`.
- **El contraargumento tiene autor.** Mario Zechner, que es quien escribe Pi, publicó ["What if you don't need MCP?"](https://mariozechner.at/posts/2025-11-02-what-if-you-dont-need-mcp/), que Diego ya usó en la Sesión 3. Vale recordarlo: la persona que hizo el harness que estamos abriendo piensa que en muchos casos alcanza con un CLI.

**Subagentes (~6 min).** Acá se da el **mecanismo**; el caso de uso lo abrió Agus en la Sesión 4 con documentación.

Qué es un subagente, sin misterio: **un contexto aparte, con su propio transcript, cuyo resultado completo vuelve al agente padre como un solo mensaje.**

Esa última parte es todo el punto. El padre no ve los treinta turnos que el hijo necesitó: ve el informe. **La razón honesta para usarlos es economía de contexto**, no "más IA".

Mostrar el ejemplo de la charla de BeerJS: una extensión de unas doscientas líneas que registra una tool `delegate`, abre una sesión aislada, y **devuelve el control enseguida** mientras el subagente sigue corriendo en background. Cuando termina, su resultado se inyecta como `followUp` — el concepto de hace dos bloques, ahora en uso.

Y después, para dónde crece: el ejemplo oficial de Pi (`examples/extensions/subagent/`) define los agentes como **archivos markdown con frontmatter** (nombre, descripción, tools, modelo), trae cuatro de muestra (`scout` en un modelo chico para reconocimiento, `planner`, `reviewer`, `worker`), y permite correrlos en paralelo o encadenados.

La línea de cierre del bloque: **doscientas líneas es el mecanismo, y el resto es producto.**

### Compactación (~7 min)

La deuda más vieja del curso. En la Sesión 1 les dieron `/compact` como uno de cuatro comandos de higiene de contexto, y Diego dijo explícitamente que era operación y no mecanismo. Hoy se abre.

**Cuándo se dispara**, en una línea:

```
contextTokens > contextWindow - reserveTokens
```

`reserveTokens` son 16384 por defecto: el espacio que se le deja al modelo para responder. Cuando cruzás eso, Pi compacta.

**Qué hace**, en cuatro pasos:

1. **Encuentra el corte.** Camina para atrás desde el mensaje más nuevo, sumando tokens, hasta juntar `keepRecentTokens` (20k por defecto). Eso es lo que se conserva tal cual.
2. **Junta lo viejo.** Todo lo anterior al corte.
3. **Lo resume.** Una llamada al modelo, con un formato estructurado (objetivo, restricciones, progreso, decisiones, próximos pasos).
4. **Guarda una entrada** con el resumen y el `id` de la primera entrada conservada. El contexto de ahí en adelante se arma como resumen + mensajes conservados.

```
Antes:
  ┌─────┬─────┬─────┬──────┬─────┬─────┬──────┬─────┐
  │ hdr │ usr │ ass │ tool │ usr │ ass │ tool │ ass │
  └─────┴─────┴─────┴──────┴─────┴─────┴──────┴─────┘
        └──────── se resume ───────┘ └── se conserva ──┘
                                    ↑
                             primera conservada

Después:  [ resumen ] + [ mensajes conservados ]
```

**Las dos cosas que tienen que quedar:**

1. **La compactación es lossy y es una llamada más al modelo.** Lo que se resumió mal, se perdió mal. Por eso `/compact` acepta instrucciones: podés decirle qué te importa que sobreviva.
2. **También es interceptable.** `session_before_compact` puede cancelarla o devolver un resumen escrito por vos. Es el mismo mecanismo que todo lo demás de hoy.

Y el callback a la Sesión 1: la regla del 50% que Diego les dio como higiene tiene un número atrás, y es éste.

### Abrí tu sesión, y la tarea de la semana (~10 min)

**~5 min en vivo: el Paso 0.** Que abran su propio archivo de sesión. Es el único paso del ejercicio que se hace en clase, porque es el que necesita la sala. Está detallado abajo, en su propia sección.

**~5 min: presentar la tarea.** El menú, las tres reglas y dónde se instala. Escribir la extensión se lo llevan a la semana. Ver `exercise/README.md`.

### Run modes (~4 min)

Corto y conceptual. **Un harness se puede correr de más de una forma**, y las formas son más o menos las mismas en todos:

- **Interactivo**: la TUI que vienen usando hace cinco semanas.
- **Headless, de un tiro**: le pasás un prompt, hace el trabajo, imprime y se va. Es lo que corre en un CI.
- **Como librería, embebido**: importás el agente adentro de tu programa. Un servidor web, un bot, una app de escritorio.
- **Como servicio, atrás de un protocolo**: el agente corre y le hablás por un canal estructurado.

**El punto que sostiene el bloque**: el agent loop es una librería, y la terminal es una de sus interfaces. No es la herramienta. Por eso existen los agentes en CI, los bots y los agentes que corren adentro de una página web.

Es el callback directo al bloque de paquetes: `pi-tui` es una capa, y es la única que se puede sacar.

### Seguridad (~9 min)

**Va después de la práctica a propósito, y ése es todo el diseño del bloque.** Acaban de escribir una extensión y de instalarla. Recién ahí se les cuenta con qué permisos corre.

General primero, Pi como ejemplo:

**1. Modelos de amenaza (~3 min).** La pregunta que casi nunca se hace: **¿contra qué te estás defendiendo?** No es una sola cosa y no tienen la misma respuesta:

- **Prompt injection** desde el contenido del repo: un README, un comentario, la salida de un build.
- **Una extensión, un skill o un servidor MCP maliciosos.**
- **Los errores destructivos del propio agente**, sin malicia de nadie.
- **Que se te vayan las credenciales** por la puerta de atrás.

**2. Modelos de permisos (~3 min).** El espacio de diseño, que ya vieron sin nombrarlo: listas de permitidos y de bloqueados, preguntar siempre, autonomía total, modos de solo lectura. El plan mode de la Sesión 2 era uno de éstos.

**3. La escalera de sandbox (~3 min).**

```
nada → in-process → contenedor → micro-VM → máquina aparte
```

Y el argumento que vale la pena decir en voz alta porque es contraintuitivo: **un sandbox parcial es peor que ninguno.** Parece un límite, y mientras tanto sigue apoyado en tu shell, tu filesystem, tus gestores de paquetes y tus credenciales. El aislamiento de verdad lo da el sistema operativo, no el programa.

**Pi como ejemplo**: no trae sandbox, y es a propósito, por exactamente ese argumento. Lo que sí trae es *project trust*, que **decide qué se carga, no qué se puede hacer**. No es un límite de seguridad y sus propias docs lo dicen.

**Y el remate, que es la razón de que el bloque vaya acá:** las docs de Pi lo dicen en una línea — *las extensiones corren con todos tus permisos y pueden ejecutar código arbitrario*. Vienen instalando extensiones desde la Sesión 2.

### Cierre (~5 min)

- **¿Qué les sorprendió de abrir la máquina?** Pregunta abierta. Sirve para pescar lo que no cubrimos.
- **Cerrar en el encuadre**: hoy vieron el loop, la compactación, el árbol, las tres formas de dar una tool, los subagentes y los run modes. Ninguna de esas cosas es de Pi. Pi es donde las pudimos mirar.
- **Nombrar la transición**: la semana que viene se cambia el modelo que está abajo de todo esto, y vamos a ver qué sobrevive.
- **Tarea**: el ejercicio. Escribir la extensión en casa, dirigiendo al agente, y después mantenerla viva el resto de la semana: anotar qué le tuvieron que arreglar y si la volvieron a usar. **La Sesión 6 no la revisa**: no hay recap ni bloque de extensión ahí. La tarea vale por sí sola, y las dudas van al canal del curso durante la semana.

## Timing de la sesión (~2 h 30)

| Bloque | Tiempo |
|---|---|
| **Demo de proyectos** | **60 min** |
| Qué vamos a ver hoy | 3 min |
| Qué es un harness, y los otros | 10 min |
| El loop y las partes de Pi | 14 min |
| El árbol de sesión, y steering vs follow-up | 7 min |
| Pausa | 5 min |
| Tres formas de darle una tool, y subagentes | 13 min |
| Compactación | 7 min |
| Abrí tu sesión, y la tarea de la semana | 10 min |
| Run modes | 4 min |
| Seguridad | 9 min |
| Cierre | 5 min |

Da **147 sobre 150: tres minutos de colchón y nada más**. Dos consecuencias:

- **El bloque elástico es la demo**, que además es el que más limpio se recorta: son turnos, no ideas. Después, run modes. Después, el árbol o steering. **El bloque de seguridad no se toca.**
- **Los dos bloques de 13 y 14 hay que ensayarlos con reloj.** El del loop es el que se va de largo: son once momentos y un diagrama que se construye en pantalla.

Si el aula resulta ser de 2 h 15 y no de 2 h 30, **la demo baja a 45 y la teoría queda intacta**. Esa decisión se toma antes de la clase, no durante.

## La tarea de la semana — que el agente extienda al agente

Cuatro pasos en `exercise/README.md`. **El Paso 0 se hace en clase (~5 min); los otros tres se los llevan.**

**Paso 0 (~5 min): abrir su propio archivo de sesión.** Las sesiones viven en `~/.pi/agent/sessions/`, organizadas por directorio de trabajo, un JSONL cada una. Que abran la suya, encuentren sus entradas, miren los pares `id` / `parentId`, ubiquen un punto donde ramificaron.

**Si alguien tiene una entrada de compactación, proyectarla.** El resumen que viene arrastrando hace semanas es una línea en un archivo. Es el mejor momento del bloque y no cuesta nada.

**Pasos 1 a 3 (~30 min): elegir un objetivo y dirigir al agente.** Un menú, para que la sala heterogénea se auto-seleccione:

- un `/comando` que haga algo chico y propio
- una tool que envuelva un CLI que ya usan
- un hook que avise o bloquee sobre algo (escribir en `.env`, un `git push`)
- un widget o una status line

**No hace falta saber TypeScript, y eso es el ejercicio.** Llevan cuatro semanas aprendiendo a dirigir a un agente; hoy el objetivo es la herramienta misma. Se instala en `.pi/extensions/` o `~/.pi/agent/extensions/` y se itera con `/reload`, sin reiniciar.

Es la primera vez que todo lo que aprendieron apunta al harness: el plan de la Sesión 2, el `AGENTS.md` y los skills de la Sesión 3, y el movimiento de research de la Sesión 4, que acá significa **apuntarle a las docs de Pi y a `examples/extensions/` antes de que escriba una línea**.

### Qué vigilar caminando la sala

- **El agente va a alucinar la API de Pi, y es lo mejor que puede pasar.** Pi es chico y reciente: no está en el entrenamiento del modelo como está React. Le va a pasar a casi toda la sala, sin que hagamos nada, y demuestra lo que el curso viene diciendo sobre grounding mejor que cualquier slide. **No prevenirlo.** Dejar que pase y después arreglarlo como en la Sesión 4, con las docs en el contexto.
- **Vigilar el tamaño de lo que piden.** El modo de fallar es pedir una extensión grande. Empujar hacia algo que entre en una pantalla: el ejercicio es el ciclo entre dirección y resultado, no la pieza.
- **El que termina no arranca una segunda.** Mandarlo a leer `examples/extensions/subagent/` y a compararlo con la versión de doscientas líneas de la charla.
- **La pregunta para tirar caminando**: *"¿le pasaste las docs antes o después de que inventara la función?"*

## Puentes entre sesiones

- **Desde la Sesión 1**: esta sesión existe, en parte, para pagar lo que se prometió allá. La higiene de contexto se enseñó como cuatro comandos, explícitamente "operación, no mecanismo". Hoy `/compact` y `/tree` reciben su mecanismo. **Reusar la redacción exacta de Diego** al retomarlo.
- **Desde la Sesión 2**: el plan mode que les restringió el toolset vuelve por tercera y última vez, ahora ubicado en el diagrama del loop: `tool_call` → `{ block: true }`.
- **Desde la Sesión 3**: allá los puntos de extensión se usan **desde afuera** (instalar, configurar, registrar); acá se abre el loop. Diego dejó ese límite marcado como una propuesta hasta que lo hablemos: **esta sesión lo cierra así**. También quedó parkeado acá "escribir una extensión de TypeScript", que se mantiene, con el agente tecleando.
- **Desde la Sesión 4**: los subagentes se **abren** allá con el caso de uso de documentación, como se acordó con Diego. Acá reciben el **mecanismo**. Es el mismo reparto que la Sesión 1 hace con la higiene de contexto: nombrar la operación temprano, abrir la maquinaria en la 5.
- **Hacia la Sesión 6 (Diego)**: **no hay handoff, y está decidido así.** El diseño original asumía que de acá salía un cliente propio para apuntar a otro endpoint; no sale ninguno, sale una extensión. Y la Sesión 6, tal como quedó armada con Ale y Agus, **no tiene recap ni bloque de extensión**: sus cinco bloques dan 150 exactos. Así que **la tarea no se revisa la semana que viene**. Sigue teniendo valor propio —mantener una extensión viva una semana es el ejercicio—, pero acá no se promete un lugar de llegada: las dudas van al canal del curso. ⚠️ **Pendiente con Agus: el canal de dudas de la semana** (un grupo de Google Chat o un Discord). Es principalmente para que se ayuden entre ellos, **sin prometer que nosotros estamos atentos**, y reemplaza quedarse después de clase. Si sale, se anuncia en la Sesión 1 y se repite acá.

## Lo que dejamos afuera a propósito

- **Los internals del plan mode.** Pi trae un plan mode como extensión de ejemplo y es tentador abrirlo, pero es el tercer paso por el mismo hilo y no agrega nada que el diagrama del loop no diga.
- **Los hooks de proveedor** (`before_provider_request` y compañía). Se puede leer y reescribir el payload HTTP que sale hacia el modelo. Es un buen puente hacia la Sesión 6 y no entra en dos horas.
- **MCP como una extensión más.** Es cierto —el adaptador es una extensión que registra una tool proxy— pero el bloque de las tres formas ya deja MCP en su lugar sin necesitar el detalle.
- **El catálogo de ejemplos como argumento.** Ochenta extensiones de ejemplo prueban que el punto de extensión es ancho de verdad, pero solo le hablan a alguien que ya se interesó por Pi.
- **Escribir una extensión a mano, sin agente.** No se puede asumir TypeScript, y además el ejercicio bueno es el otro.

## Herramientas y recursos referenciados

- Nada nuevo que instalar. Todo lo de hoy ya está en la máquina.
- **Las docs de Pi**, que vienen con la instalación: `extensions.md`, `compaction.md`, `sessions.md`, `session-format.md`, `security.md`, `sdk.md`. Online en [pi.dev/docs](https://pi.dev/docs/latest/).
- **`examples/extensions/`**, unas ochenta extensiones de ejemplo. Las que se usan hoy: `subagent/` (el mecanismo, en su versión de producto), `custom-compaction.ts`, `permission-gate.ts`, `protected-paths.ts`, `tool-override.ts`, `truncated-tool.ts`.
- [Mario Zechner — *The Pi coding agent*](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/) — el harness desmontado por quien lo escribió, que es exactamente el movimiento de esta sesión.
- [Mario Zechner — *What if you don't need MCP?*](https://mariozechner.at/posts/2025-11-02-what-if-you-dont-need-mcp/) — ya citado en la Sesión 3, vuelve en el bloque de las tres formas.
- [Sebastian Raschka — *The Components of a Coding Agent*](https://magazine.sebastianraschka.com/p/components-of-a-coding-agent) — citado en la Sesión 1 como preparación del instructor. Sus componentes 4 y 5 (reducción de contexto, memoria de sesión) son material de hoy.
- La charla de BeerJS *"Pi, the self-building agent"* (2026-06-25): de ahí salen el diagrama de capas, el del loop, el de paquetes y la extensión de subagentes.

## Pendientes (para próximas iteraciones)

- **Escribir las slides.** Es el trabajo más grande que queda. Cuatro diagramas de la charla de BeerJS se reusan casi tal cual (capas, loop, paquetes, API programática), pero **hay que revisarlos con el encuadre nuevo**: la charla vendía Pi, esta sesión lo usa como espécimen.
- **Decidir el plan B de la práctica.** Todas las otras sesiones tienen uno y ésta todavía no. Si el agente no llega a producir una extensión que ande en treinta minutos, o la red del aula se cae, hace falta **una extensión ya escrita para leer y modificar**. Sirve también para el que se traba a mitad de camino.
- **Probar la práctica en una máquina limpia y cronometrarla.** La pregunta abierta es cuánto tarda el agente en producir una extensión **que ande** con las docs en contexto. Si se pasa de unos quince minutos, lo que se achica es el menú, no el bloque.
- **Pre-construir una extensión de referencia por cada opción del menú**, para no dejar a nadie en el minuto 30 con las manos vacías.
- **Decidir qué queda proyectado durante la teoría.** La Sesión 3 decidió que su proyecto de demo es el repo del curso; esta sesión necesita la misma decisión. Lo más probable: las docs y el código de Pi, más una sesión viva para los bloques del árbol y de compactación.
- **Decidir qué bloques se muestran en vivo** en vez de en diagrama. El loop, el árbol y la compactación piden pantalla. Grabar un clip de respaldo de cada uno.
- **Recortar el bloque de seguridad a nueve minutos de verdad.** Suelto se va a veinte fácil.
- **Coordinar con Diego**: el límite con la Sesión 3. (El handoff hacia la Sesión 6 ya está resuelto: no hay, y la tarea no se revisa allá.)
