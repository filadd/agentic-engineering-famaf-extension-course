---
marp: true
theme: default
paginate: true
title: Sesión 5 — Coding Harness (internals)
---

<!--
Skeleton de la presentación de la Sesión 5.
Cada slide tiene un título + una nota de oradora/orador (HTML comment).

Excepción deliberada, misma regla que la Sesión 4: traen cuerpo escrito
las slides que la sala tiene que LEER o COPIAR textual — los cuatro
diagramas (capas, loop, paquetes, compactación), las tres tablas
(tree/fork/clone, las tres formas de dar una tool, la escalera de
sandbox) y el menú de la práctica. El resto es título + nota.

Sesión de 2 h 30: 60 demo, 3 intro, 10 harness y los otros, 14 loop y
partes, 7 árbol y steering, 5 pausa, 13 tres formas y subagentes,
7 compactación, 10 abrí tu sesión + la tarea, 4 run modes, 9 seguridad,
5 cierre. Da 147 sobre 150. La práctica de escribir la extensión pasó
a ser tarea; en clase queda solo el Paso 0.

Cuatro diagramas vienen de la charla de BeerJS "Pi, the self-building
agent" (2026-06-25). Ojo al reusarlos: aquella charla VENDÍA Pi, ésta
lo usa como espécimen. Revisar el tono de cada uno.
-->

# Sesión 5
## Coding Harness (internals)

**De Vibe Coding a Agentic Engineering** — FaMAF
Agustín Carrasco

<!-- Portada. Anclar: sesión 5 de 6, arranca el tramo avanzado, 2 h 30, LA PRIMERA HORA ES DE DEMOS, y hoy no se instala NADA. Es la única sesión del curso sin riesgo de setup. -->

---

## Hoy

<!-- Agenda en una slide: UNA HORA DE DEMOS para arrancar, qué es un harness y cuáles hay, el loop por dentro, el árbol y el steering, pausa, cómo se le agrega una tool a un modelo, compactación, abrir el archivo de sesión propio, run modes, seguridad, cierre. Avisar dos cosas: que hoy la herramienta es el OBJETO DE ESTUDIO y no el instrumento, y que la práctica de escribir una extensión ES LA TAREA DE LA SEMANA, no se hace en clase. -->

---

# Demos

<!-- Sección. ~60 MIN, y abre la sesión. Voluntarios, unos OCHO TURNOS DE 5 A 7 MIN: 4 o 5 de mostrar, 2 de preguntas. Proyector, cada uno abre su repo. Cronómetro a la vista y corte amable a los 7. NO ES UNA ENTREGA Y NO SE CORRIGE — se anunció en la Sesión 1 y se recordó en el cierre de la Sesión 4. ESTE ES EL BLOQUE ELÁSTICO: si el día se estira, se recortan turnos. PLAN B: si no se levantan ocho manos, elegimos nosotros, o el bloque se acorta. -->

---

## ¿Quién muestra?

<!-- Los primeros DOS MINUTOS son para armar la lista: quién quiere mostrar y en qué orden. Anotarla en el pizarrón. Qué muestran: el proyecto que vienen arrastrando desde la Sesión 1, y no solo QUÉ construyeron sino CÓMO — el plan de la Sesión 2, el AGENTS.md y los skills de la Sesión 3, los docs de la Sesión 4. LA PREGUNTA QUE SE REPITE EN CADA TURNO: "¿qué decidiste vos y qué decidió el agente?" -->

---

## ¿Cómo les fue?

<!-- El recap de la Sesión 4 VA ACÁ ADENTRO, sin bloque aparte: son las dos preguntas que se le hacen a quien está mostrando. -->

---

## ¿Cuándo les sirvió un doc? ¿Cuándo quedó viejo?

<!-- Los dos disparadores de la tarea de la Sesión 4. El segundo es el que más va a aparecer y el más interesante: el doc que quedó desactualizado respecto del código. No hace falta resolverlo hoy, es material del cierre del curso. -->

---

# Qué vamos a ver hoy

<!-- Sección. ~3 min. Cinco semanas manejando la herramienta; hoy la abrimos. Nombrar el cambio de tramo: ya lo anunciaron en la Sesión 1 y volvió en el cierre de la Sesión 4. Las últimas dos sesiones desarman la máquina: hoy el harness, la que viene el modelo. -->

---

## "No vinimos a aprender Pi"

<!-- LA FRASE QUE ENMARCA TODO EL DÍA, y hay que decirla completa: no vinimos a aprender Pi, vinimos a ver qué problemas tiene que resolver cualquier harness, usando el único que podemos abrir. El riesgo de esta clase es que se convierta en un tour de features; ésta es la vacuna. Volver a esta idea al empezar cada bloque. -->

---

# ¿Qué es un harness?

<!-- Sección. ~10 min los dos bloques (qué es + los otros). -->

---

## Las capas

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

<!-- Diagrama de la charla de BeerJS. LA IDEA: un LLM solo predice tokens y no puede hacer NADA. El harness es lo que lo conecta al mundo. Todo producto de IA que usaron es un modelo + un harness, y la diferencia entre productos casi nunca es el modelo. Es vocabulario que YA TIENEN: Diego plantó LLM + tool + harness en la Sesión 1 y lo abrió desde afuera en la Sesión 3. Retomar en 30 segundos, no reconstruir. -->

---

## Y hay otros

<!-- Claude Code, Codex, el harness de DeepSeek, opencode. NO ES UNA COMPARACIÓN Y NO HAY TABLA: comparar harnesses en abstracto no le sirve a nadie que usó uno solo. Mano alzada rápida: ¿quién usó otro? -->

---

## Las preguntas que le hacés a cualquier harness

<!-- Los cuatro ejes, que son lo único que se llevan de este bloque porque son las preguntas que le van a hacer a la PRÓXIMA herramienta que agarren. (1) ¿ABIERTO O CERRADO? ¿podés leer el código del que corre en tu máquina? (2) ¿QUÉ VIENE DE FÁBRICA Y QUÉ AGREGÁS VOS? Pi trae cuatro tools y casi nada más; Claude Code trae veinticinco, permisos, plan mode, subagentes y memoria. Ninguno está mal: es editor mínimo contra baterías incluidas. (3) ¿SE PUEDE EXTENDER, Y HASTA DÓNDE LLEGA? Hay harnesses sin ningún punto de extensión, otros con hooks, otros donde casi todo lo es. (4) ¿QUIÉN CONTROLA EL SYSTEM PROMPT? ¿Lo podés leer? ¿cambiar? ¿cambia solo entre versiones? CERRAR CON: cada una de esas es una decisión que alguien tomó. Hoy vemos las de Pi, que es el que tenemos abierto. -->

---

# El loop

<!-- Sección. ~14 min con las partes. EL BLOQUE MÁS DENSO DEL DÍA: ensayarlo con reloj, es el que se va de largo. -->

---

## Un turno, de punta a punta

```
session_start → resources_discover → [ agent loop ] → session_shutdown
```

```
input → before_agent_start → turn_start → context → LLM call
      → tool_execution_start → tool_call → tool_result
      → tool_execution_end → turn_end → agent_end
```

<!-- Diagrama de la charla de BeerJS. SE CONSTRUYE EN PANTALLA, no aparece entero: primero la vista de sesión, después zoom al loop, paso por paso. Recorrer cada momento en una línea (la tabla está en INSTRUCTOR.md). Los que importan: before_agent_start (inyectar o modificar el system prompt), context (armar los mensajes que se mandan), tool_call (bloquear o modificar argumentos), tool_result (modificar lo que el modelo recibe). -->

---

## Todos esos momentos son escuchables

<!-- pi.on(evento, handler), y desde ahí se BLOQUEA, se MODIFICA o se INYECTA. Es la línea que convierte el diagrama en algo que pueden usar, y es lo que van a hacer en la tarea de la semana. -->

---

## `tool_call` → `{ block: true }`

<!-- ACÁ SE PAGA LA DEUDA DE LA SESIÓN 2. Aquella semana el plan mode les restringió el toolset a grep/find/ls y Agus dijo "esto lo abre Diego"; Diego lo explicó en la Sesión 3 como un hook. Hoy se ve el hook EN SU LUGAR DEL DIAGRAMA. Es la misma pieza mirada por tercera vez, ahora desde adentro. Decirlo en voz alta: lo que Plannotator les hizo en la Sesión 2 es esta línea. -->

---

## Las partes de Pi

```
pi-ai  →  pi-agent-core  →  pi-coding-agent  →  pi-tui
```

<!-- Diagrama de la charla de BeerJS. ~5 min. De la base a la superficie. pi-ai: API unificada de modelos, habla con cualquier proveedor. pi-agent-core: el loop, el bus de eventos, la ejecución de tools — GENÉRICO, no es solo para código. pi-coding-agent: la capa de coding, el CLI, las sesiones, las extensiones, las cuatro tools. pi-tui: la terminal, editor, temas, atajos — lo único que el usuario ve. DEJAR PICANDO: usás solo las capas que necesitás. El agente entero no depende de que haya una terminal. Vuelve en el bloque de run modes. -->

---

# El árbol de sesión

<!-- Sección. ~7 min los dos bloques (árbol + steering). Son dos vistazos, no dos bloques. -->

---

## Tu conversación no es una lista

<!-- Es un ÁRBOL. Cada entrada tiene un id y un parentId, la posición actual es la hoja activa, y todo el árbol vive en UN SOLO archivo JSONL. POR ESO /tree ES BARATO: movés un puntero, no borrás nada. Las ramas que dejaste atrás siguen ahí. Es la respuesta al /tree de la Sesión 1, donde se vendió como el antídoto contra los errores en cascada: cuando el agente lleva tres intentos fallidos, cada intento arrastra la basura de los anteriores, y volver a antes del pozo sale más barato que seguir cavando. Hoy se ve por qué no cuesta nada. -->

---

## `/tree`, `/fork` y `/clone`

| | `/tree` | `/fork` | `/clone` |
|---|---|---|---|
| Resultado | El mismo archivo | Archivo nuevo | Archivo nuevo |
| Vista | El árbol completo | Selector de mensajes | La rama activa |
| Para qué | Explorar sin perder | Arrancar desde un punto | Duplicar antes de seguir |

<!-- Tabla corta, para leer. La distinción práctica: /tree cuando querés que las alternativas queden juntas; /fork o /clone cuando querés un archivo aparte. -->

---

## ¿Cuándo le llega un mensaje a un agente que ya está corriendo?

<!-- CONCEPTO GENERAL, ~3 min, y de los que casi nadie se hace la pregunta hasta que la ve escrita. Tres respuestas posibles y las tres tienen sentido en algún caso: INTERRUMPIRLO en el medio del stream para corregir el rumbo antes de que siga; ESPERAR a que termine lo que está haciendo; ENCOLARLO para el próximo turno. Cualquier harness tiene que decidir esto y la mayoría lo resuelve por adentro sin contarte. Pi les puso nombre a los tres (steer, followUp, nextTurn) y por eso sirve para mostrarlo: cuando algo tiene nombre, se puede elegir. VUELVE en el bloque de subagentes. -->

---

# Pausa

<!-- ~5 min. -->

---

# ¿Cómo le das una tool a un modelo?

<!-- Sección. ~13 min con subagentes. EL BLOQUE MÁS TRANSFERIBLE DE LA SESIÓN, y no es sobre Pi: es una decisión de diseño que van a tomar cada vez que quieran que un agente haga algo nuevo. -->

---

## Tres formas

| Forma | Qué te da | Qué te cuesta |
|---|---|---|
| **Extensión** | Llega a las entrañas del harness: hooks, UI, comportamiento | Sirve para ese harness y ninguno más |
| **CLI** | Lo más simple que funciona, y anda en cualquier harness con shell | No hay auth ni permisos, y el agente tiene que enterarse |
| **MCP** | Para tools que usan otros: distribución, auth, servicios remotos | Contexto, un servidor que mantener, una indirección más |

<!-- Tabla para leer y discutir. LA PREGUNTA QUE DECIDE ES QUIÉN ES EL CONSUMIDOR: sos vos solo, un CLI. Sos vos y necesitás meterte con el harness, una extensión. Son otros, o hace falta auth, o el servicio es remoto: MCP. DOS CONEXIONES: (1) el punto flojo del CLI es que el agente no sabe que existe, y la solución ya la escribieron en la Sesión 3, una línea en el AGENTS.md. (2) El contraargumento tiene autor: Mario Zechner, que ESCRIBE PI, publicó "What if you don't need MCP?", que Diego ya usó en la Sesión 3. Vale decir que quien hizo el harness que estamos abriendo piensa que muchas veces alcanza con un CLI. -->

---

## Subagentes: qué son, sin misterio

<!-- ~6 min. El CASO DE USO lo abrió Agus en la Sesión 4 con documentación; hoy se da el MECANISMO. Definición: un contexto aparte, con su propio transcript, cuyo resultado completo vuelve al agente padre COMO UN SOLO MENSAJE. Esa última parte es todo el punto: el padre no ve los treinta turnos que el hijo necesitó, ve el informe. LA RAZÓN HONESTA PARA USARLOS ES ECONOMÍA DE CONTEXTO, no "más IA". -->

---

## Doscientas líneas

<!-- Mostrar la extensión de subagentes de la charla de BeerJS: registra una tool `delegate`, abre una sesión aislada, y DEVUELVE EL CONTROL ENSEGUIDA mientras el subagente sigue corriendo en background. Cuando termina, su resultado se inyecta como followUp — el concepto de dos bloques atrás, ahora en uso. Después mostrar para dónde crece: el ejemplo oficial de Pi define los agentes como ARCHIVOS MARKDOWN con frontmatter (nombre, descripción, tools, modelo), trae cuatro de muestra (scout en un modelo chico, planner, reviewer, worker), y los corre en paralelo o encadenados. REMATE: doscientas líneas es el mecanismo, el resto es producto. -->

---

# Compactación

<!-- Sección. ~7 min. LA DEUDA MÁS VIEJA DEL CURSO: en la Sesión 1 les dieron /compact como uno de cuatro comandos de higiene y Diego dijo explícitamente que era operación y no mecanismo. Hoy se abre. -->

---

## Cuándo se dispara

```
contextTokens > contextWindow - reserveTokens
```

<!-- Una línea, y alcanza. reserveTokens son 16384 por defecto: el espacio que se le deja al modelo para responder. Cuando cruzás eso, Pi compacta. CALLBACK A LA SESIÓN 1: la regla del 50% que Diego les dio como higiene tiene un número atrás, y es éste. -->

---

## Qué hace

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

<!-- Los cuatro pasos, recorriendo el diagrama: (1) ENCUENTRA EL CORTE caminando para atrás desde lo más nuevo, sumando tokens, hasta juntar keepRecentTokens (20k por defecto). (2) JUNTA LO VIEJO, todo lo anterior al corte. (3) LO RESUME con una llamada al modelo, en formato estructurado: objetivo, restricciones, progreso, decisiones, próximos pasos. (4) GUARDA UNA ENTRADA con el resumen y el id de la primera conservada. De ahí en adelante el contexto se arma como resumen + mensajes conservados. -->

---

## Dos cosas que tienen que quedar

<!-- (1) LA COMPACTACIÓN ES LOSSY Y ES UNA LLAMADA MÁS AL MODELO. Lo que se resumió mal, se perdió mal. Por eso /compact acepta instrucciones: podés decirle qué te importa que sobreviva. (2) TAMBIÉN ES INTERCEPTABLE: session_before_compact puede cancelarla o devolver un resumen escrito por vos. Es el mismo mecanismo que todo lo demás de hoy. -->

---

# Abrí tu sesión, y la tarea de la semana

<!-- Sección. ~10 min: 5 de abrir el archivo de sesión EN VIVO y 5 de presentar la tarea. ESCRIBIR LA EXTENSIÓN NO SE HACE EN CLASE: es el ejercicio de la semana. Ver exercise/README.md. -->

---

## Paso 0: abrí tu propia sesión

`~/.pi/agent/sessions/`

<!-- EL ÚNICO PASO QUE SE HACE EN CLASE, porque es el que necesita la sala. ~5 min, y NO MÁS. Que abran su JSONL y busquen tres cosas: los pares id/parentId (el árbol del que hablamos), un punto donde ramificaron (las dos ramas siguen ahí), y una entrada de compactación si tienen. SI ALGUIEN TIENE UNA ENTRADA DE COMPACTACIÓN, PROYECTARLA: el resumen que viene arrastrando hace semanas es una línea en un archivo. Es el mejor momento del bloque y no cuesta nada. Acá todo lo de la teoría deja de ser un diagrama. -->

---

## Elegí una

- un `/comando` que haga algo chico y propio
- una tool que envuelva un CLI que ya usás
- un hook que avise o bloquee sobre algo (`.env`, `git push`)
- un widget o una status line

<!-- El menú, PARA COPIAR Y LLEVARSE: la extensión se escribe en casa. Existe para que la sala heterogénea se auto-seleccione. Si a alguien no se le ocurre nada: que mire sus notas de las semanas anteriores, lo que anotaron como fricción suele ser la mejor candidata. -->

---

## No hace falta que sepas TypeScript

<!-- Y ESO ES EL EJERCICIO DE LA SEMANA. Llevan cuatro semanas aprendiendo a dirigir a un agente; ahora el objetivo es la herramienta misma. Se instala en .pi/extensions/ o ~/.pi/agent/extensions/ y se itera con /reload, sin reiniciar. Es la primera vez que TODO lo que aprendieron apunta al harness: el plan de la Sesión 2, el AGENTS.md y los skills de la Sesión 3, y el research de la Sesión 4 — que acá significa apuntarle a las docs de Pi y a examples/extensions/ ANTES de que escriba una línea. -->

---

## Pasale las docs primero

<!-- LA REGLA QUE HAY QUE REPETIR CAMINANDO. Pi es chico y reciente: no está en el entrenamiento del modelo como está React. VA A ALUCINAR LA API, y es lo mejor que puede pasar — le va a pasar a casi toda la sala sin que hagamos nada, y demuestra lo que el curso viene diciendo sobre grounding mejor que cualquier slide. NO PREVENIRLO: dejar que pase y arreglarlo como en la Sesión 4, con las docs en contexto. COMO AHORA LES PASA EN CASA Y NO CON NOSOTROS AL LADO, pedirles que lo anoten: "¿le pasaste las docs antes o después de que inventara la función?" es la primera pregunta del recap de la Sesión 6. -->

---

# Run modes

<!-- Sección. ~4 min. Corto y conceptual. -->

---

## El loop es una librería

<!-- Un harness se puede correr de más de una forma, y las formas son más o menos las mismas en todos: INTERACTIVO (la TUI que vienen usando hace cinco semanas), HEADLESS DE UN TIRO (le pasás un prompt, trabaja, imprime y se va — es lo que corre en un CI), COMO LIBRERÍA EMBEBIDO (importás el agente adentro de tu programa: un servidor web, un bot, una app de escritorio), COMO SERVICIO ATRÁS DE UN PROTOCOLO. EL PUNTO: el agent loop es una librería y la terminal es una de sus interfaces, no la herramienta. Por eso existen los agentes en CI, los bots, y los agentes que corren adentro de una página. CALLBACK DIRECTO al diagrama de paquetes: pi-tui es una capa, y es la única que se puede sacar. -->

---

# Seguridad

<!-- Sección. ~9 min. VA DESPUÉS DE LA PRÁCTICA A PROPÓSITO, Y ÉSE ES TODO EL DISEÑO DEL BLOQUE: acaban de escribir una extensión y de instalarla. Recién ahora se les cuenta con qué permisos corre. General primero, Pi como ejemplo. Suelto este bloque se va a 20 minutos: tenerlo recortado de antes. -->

---

## ¿Contra qué te estás defendiendo?

<!-- ~3 min. LA PREGUNTA QUE CASI NUNCA SE HACE, y no es una sola cosa: PROMPT INJECTION desde el contenido del repo (un README, un comentario, la salida de un build); UNA EXTENSIÓN, UN SKILL O UN SERVIDOR MCP MALICIOSOS; LOS ERRORES DESTRUCTIVOS DEL PROPIO AGENTE, sin malicia de nadie; QUE SE TE VAYAN LAS CREDENCIALES. Cuatro problemas distintos, y no tienen la misma respuesta. Eso es lo que hace útil la pregunta. -->

---

## Modelos de permisos

<!-- ~3 min. El espacio de diseño, que YA VIERON sin que nadie se lo nombrara: listas de permitidos y de bloqueados, preguntar siempre, autonomía total, modos de solo lectura. El plan mode de la Sesión 2 era uno de éstos. -->

---

## La escalera

```
nada → in-process → contenedor → micro-VM → máquina aparte
```

<!-- ~3 min. Y EL ARGUMENTO QUE HAY QUE DECIR EN VOZ ALTA PORQUE ES CONTRAINTUITIVO: un sandbox parcial es PEOR que ninguno. Parece un límite, y mientras tanto sigue apoyado en tu shell, tu filesystem, tus gestores de paquetes y tus credenciales. El aislamiento de verdad lo da el sistema operativo, no el programa. PI COMO EJEMPLO: no trae sandbox, y es a propósito, por exactamente ese argumento. Lo que sí trae es project trust, que decide QUÉ SE CARGA, no qué se puede hacer: no es un límite de seguridad, y sus propias docs lo dicen. -->

---

## Las extensiones corren con todos tus permisos

<!-- EL REMATE, Y LA RAZÓN DE QUE EL BLOQUE VAYA ACÁ. Está textual en las docs de Pi: las extensiones corren con todos tus permisos y pueden ejecutar código arbitrario. Acaban de escribir una e instalarla. Y vienen instalando extensiones desde la Sesión 2. Dejar que aterrice, no suavizarlo. -->

---

# Cierre

<!-- ~5 min. -->

---

## ¿Qué les sorprendió de abrir la máquina?

<!-- Pregunta abierta. Sirve para pescar lo que no cubrimos. -->

---

## Nada de esto era de Pi

<!-- CERRAR EN EL ENCUADRE, que es donde abrimos: hoy vieron el loop, la compactación, el árbol, las tres formas de dar una tool, los subagentes y los run modes. Ninguna de esas cosas es de Pi. Pi es donde las pudimos mirar. -->

---

## Para la semana · Próxima sesión

<!-- TAREA: escribir la extensión (el ejercicio completo, en casa) y después mantenerla viva. Usarla, y anotar dos cosas — qué le tuvieron que arreglar cuando la usaron de verdad, y si la volvieron a usar o si la escribieron y nunca más. LA SESIÓN 6 NO LA REVISA: decirlo tal cual, para que nadie llegue esperando mostrarla. Las dudas van al canal del curso durante la semana. NOMBRAR LA TRANSICIÓN: la semana que viene se cambia el modelo que está abajo de todo esto y vamos a ver qué sobrevive. La sesión la da Diego, con Ale Silva del CCAD de invitado. -->
