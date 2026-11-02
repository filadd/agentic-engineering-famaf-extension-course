# Sesión 4 — Context Engineering (Notas para el instructor)

> A cargo: Agus. Estado: borrador. Todo el material de la sesión está en español.

## Objetivo de la sesión (en una frase)

Que vean, sobre un proyecto real y en vivo, cómo se separa el problema de la solución, cómo se mantienen documentos vivos que registran las decisiones y cómo esos documentos y los subagentes sostienen el contexto del agente, para que lo repliquen en su proyecto durante la semana.

## Formato

La sesión es una **demostración en vivo con slides de conceptos**. No hay práctica en clase: la práctica es la tarea.

- **El deck** (`deck/index.html`) lleva solo conceptos. No menciona las partes en vivo y se puede mirar después como resumen.
- **La parte en vivo** es una feature nueva de kurasu, el aula virtual del curso: **un chat en el aula de la sesión destacada**. Se trabaja con los skills de mahou (explore, shape, design, write-documentation y, si da el tiempo, program design o implement), proyectando la terminal y el canvas.
- **Se alterna**: un bloque de slides presenta un concepto y enseguida se lo ve aplicado en el trabajo en vivo.
- **Las preguntas se contestan cuando salen.** Los ratos en que el agente está trabajando son el momento natural para hacerlo.

## Audiencia y supuestos

- **Dura 2 horas y no se instala nada.**
- **Con qué llegan**: su proyecto, un `AGENTS.md`, al menos un skill, las notas de la tarea de la Sesión 3 (qué le tuvieron que explicar igual al agente) y una feature que no pueden describir en una frase. Las dos últimas alimentan la tarea de esta semana.
- Grupo heterogéneo, de primer año a graduados.
- **Ya vieron kurasu**: es el aula donde siguen las slides, y la Sesión 2 mostró la grabación de cómo se construyó. Hoy ven el proceso en vivo, con las decisiones tomándose en el momento.

## Plan tema por tema

### Recap

Slides 1 a 3. Discusión, no slides. Tres disparadores:

1. **¿Creaste o encontraste un skill nuevo?** Dos o tres casos. Preguntar por el criterio: qué convirtieron en skill y qué dejaron en el `AGENTS.md`.
2. **¿Qué le tuviste que explicar igual?** Es la tarea de la Sesión 3. Lo que sale acá es justo lo que hoy va a los docs: anotar dos o tres respuestas y volver a ellas en el bloque del proyecto.
3. **¿Qué dudas quedaron de la Sesión 3?** MCP y subagentes suelen dejar preguntas sueltas. Las de subagentes se pueden guardar para el bloque de subagentes.

### Encuadre

Slide 4. Deuda cognitiva y rendición cognitiva, y la frase de la sesión: *"Documentar es pensar antes de construir."* Los dos conceptos vuelven en el cierre.

### El proyecto

Slides 5 y 6, y después en vivo.

**Concepto.** El `AGENTS.md` como índice. La Sesión 3 lo dejó anunciado en la slide *Cuando un proyecto es muy grande* ("Agus lo cuenta en la próxima clase"). Lo de cada turno va en el `AGENTS.md` y el resto queda a un link de distancia. Después, qué va en cada lugar: `AGENTS.md`, `docs/` y wiki.

**En vivo.** Recorrer la estructura de kurasu, en el editor o en GitHub:

- `app/AGENTS.md`: unas pocas líneas que dicen dónde están los docs y qué nota agregar cuando cambia algo. Es el índice de la slide 5.
- `app/docs/README.md`: la carta de los docs. Qué tiene cada carpeta, cómo se nombra una nota, cómo se escribe (primero cómo funciona, y el porqué en un callout al lado de lo que justifica).
- `app/docs/architecture/README.md`: el índice de las notas, una fila por nota. Abrir una que conozcan desde el lado de usuario, por ejemplo `tiempo-real-del-aula.md` o `feedback-de-sesion.md`.
- `app/docs/prototipos/`: los prototipos HTML de cada pantalla, linkeados desde su nota.
- `.mahou/wiki/INDEX.md`: la wiki del agente. Abrir `architecture.md` o `web.md` para mostrar la diferencia con los docs: los docs explican el sistema, la wiki explica cómo trabajar en este código.
- `.mahou/*.md`: la configuración que los skills leen del proyecto (dónde van las tareas, cómo se escribe la documentación).

Cerrar con las respuestas del recap: ¿en cuál de estos lugares iría cada cosa que tuvieron que explicar igual?

### El problema

Slides 7 y 8, y después en vivo.

**Concepto.** Slide 7: problema y solución en general, sin ejemplo. El problema es qué necesita quien lo va a usar y se describe sin nombrar el sistema; la solución es una de muchas formas de atenderlo. Dos ideas tienen que quedar:

1. **El mismo problema admite muchas soluciones.** Si arrancás por la solución, tomás decisiones sin haber considerado el problema, y muchas las termina tomando el agente, que por defecto devuelve la respuesta promedio de todo lo que ya vio.
2. **La distinción importa con o sin IA.** Es la separación de siempre entre requerimientos y diseño.

Slide 8: definir el problema es mapear la realidad (actores, entidades, procesos, reglas). La slide dice que muchas veces esto lo hace un equipo de producto, y llega como requerimiento. Decir en voz alta que en su proyecto no hay equipo de producto: lo hacen ellos, con el agente preguntándoles.

Las slides no nombran la feature del chat. El ejemplo de los dos conceptos es lo que se hace en vivo a continuación.

**En vivo.** Arrancar el chat del aula con explore y después shape.

- **Explore**: contarle al agente el problema con palabras propias y preguntarle cómo funcionan hoy el aula, las preguntas y el tiempo real. Los scouts que despacha son subagentes: nombrarlo y dejarlo para el bloque de subagentes.
- **Shape**: el árbol de decisiones a nivel de comportamiento. **Las preguntas las responde la sala.** Leer cada pregunta en voz alta y decidir con ellos, a mano alzada o con una encuesta en kurasu. Es el momento en que ven la interrogación desde el lado de quien decide.
- Preguntas que seguramente aparecen: quién puede escribir, si el profe modera o borra mensajes, si los mensajes quedan después de la sesión, en qué se diferencia un mensaje de una pregunta del aula (el backlog de kurasu tiene una idea de mensajes privados al profe que se superpone con esto), si hay reacciones o respuestas.
- **Acotar desde el principio**: "chat en el aula de la sesión destacada". Un chat completo puede ocupar toda la clase en shape.

Qué remarcar mientras pasa: cada vez que alguien de la sala propone una solución ("con un WebSocket", "una tabla de mensajes") cuando la pregunta es de comportamiento, señalarlo: es el otro dominio, y todavía no toca. Al cerrar shape, mostrar cómo quedaron los actores, entidades, procesos y reglas de la slide 8 para el chat.

### La solución

Slide 9, y después en vivo.

**Concepto.** Lo que buscamos decidir antes de escribir código, cada decisión con su porqué: modelo, flujos, estados, componentes, pantallas y prototipos. Es una de las soluciones posibles al problema que acaban de definir.

**En vivo.** Design sobre el árbol de shape, recorriendo las mismas seis cosas de la slide: el modelo de datos del chat, cómo viaja un mensaje por el aula en tiempo real (el Durable Object de cada sesión ya existe), los estados de un mensaje y del chat, qué componente hace cada parte, las pantallas del panel con sus estados de carga y error, y un prototipo del panel para reaccionar. Las decisiones con alternativas reales se las sigue planteando a la sala.

Cuando la sala no se pone de acuerdo sobre cómo se ve algo, mirar el prototipo: decide más rápido que la descripción.

### Documentar

Slide 10, y después en vivo.

**Concepto.** Documentos vivos: doc → código → review → reconciliar, y en el próximo cambio el doc se lee al explorar. El review hace dos preguntas. ¿Hizo lo que acordamos? Se chequea contra la documentación de lo que decidimos, para validar que lo que se hizo es lo que pedimos. ¿Hubo cambios durante la implementación? Implementar a veces destapa problemas que no estaban claros en el diseño: hay que cubrirlos y llevarlos al doc, y eso es reconciliar.

**En vivo.** Write-documentation con lo que salió del design: una nota nueva en `app/docs/architecture/` para el chat, las notas existentes que cambian (modelo de datos, tiempo real del aula) y la fila nueva en el índice. Mostrar el diff de los docs, no solo el resultado: los docs cambian con la feature, y la nota nueva sigue la carta de `docs/README.md`.

### Subagentes

Slide 11, y después en vivo si da el tiempo.

**Concepto.** Un contexto por trabajo: el subagente se lleva el trabajo entero y vuelve solo la conclusión. Decir de palabra que el brief es todo lo que sabe el subagente, y que los docs en el repo son la fuente de verdad que comparten todos. La Sesión 3 presentó la primitiva y `pi-subagents`; acá se ve el uso.

**En vivo.** Según cuánto quede:

- **Siempre**: volver a los scouts del explore y mostrar qué pidió el agente principal y qué le volvió.
- **Si queda tiempo**: arrancar program design o implement. Implement despacha un subagente por repo con las tareas, las notas del diseño y las reglas del repo, y después reviewers por faceta. No hace falta que termine: alcanza con ver el brief que recibe cada uno y cómo crece el contexto del agente principal mientras ellos trabajan.

### Cierre

Slides 12 a 15. Lo que viene después de la slide 15 se dice de palabra: el deck no lo tiene.

- **Todo tiene un costo.** Plata, contexto y tu atención. Si la herramienta lo muestra, enseñar cuánto contexto y cuántos tokens usó la corrida en vivo.
- **Cuándo no usar IA.** La IA amplifica lo que ya sabés; sin los fundamentos, amplifica la confusión. "Don't use AI as a crutch" (MIT Missing Semester). Nombrar la atrofia: lo que dejás de hacer, lo dejás de saber hacer.
- **Ser dueño.** Entender, decidir, discutir, mantener. Volver a deuda y rendición: hoy la sala tomó las decisiones del chat; el agente escribió, pero no pensó por ellos.
- **¿Qué aprendimos?** Las ocho cartas del recap.
- **Lo que viene**, de palabra:
  - **Tarea**: documentar su proyecto (qué es, para quién y su objetivo, y un doc por feature con el problema arriba y la solución abajo), con el agente preguntándoles lo que no puede saber (el problema que quisieron resolver y el porqué de cada decisión). Después, la feature que trajeron: su doc vía interrogación antes de tocar código. Mantener los docs vivos durante la semana y anotar cuándo sirvieron y cuándo quedaron desactualizados. El detalle está en `exercise/README.md`.
  - **Demos**: la Sesión 5 abre con una hora de demos del proyecto. Se anunció en la Sesión 1 y ésta es la última clase antes. Voluntario, sin nota, 5 a 7 minutos, con el repo listo.
  - **La transición**: termina el tramo de "cómo trabajo bien con esta herramienta". La Sesión 5 abre el harness por adentro y la Sesión 6 cambia el modelo que tiene abajo.

## Antes de la clase

- **Ensayar la corrida entera una vez** sobre una rama aparte, con el mismo pedido inicial. Sirve para saber dónde se traba y cuánto tarda cada etapa.
- **Guardar los artefactos del ensayo** (`.scratch/` y la rama). Si la corrida en vivo se cuelga (red, modelo lento, una discusión que se alarga), se sigue desde lo que dejó el ensayo.
- **Preparar el pedido inicial** del chat, para no improvisarlo frente a la sala.
- **Deployar kurasu** si se va a usar una encuesta para que la sala responda las preguntas de shape: los logs de los PRs #18 y #19 dejaron el deploy pendiente.
- **Pantalla**: terminal y canvas con letra grande; nada de `.env*`, `models.json` ni tokens a la vista.

## Herramientas y recursos referenciados

- **kurasu** (`app/` en este repo, https://kurasu.asermax.com): el proyecto de la parte en vivo y el aula donde la sala sigue el deck.
- **mahou**: los skills de la parte en vivo (explore, shape, design, write-documentation, program design, implement) y su wiki por proyecto en `.mahou/wiki/`.
- [`pi-subagents`](https://www.npmjs.com/package/pi-subagents), instalado en la Sesión 3.
- [grill-me](https://github.com/mattpocock/skills/blob/main/skills/productivity/grill-me/SKILL.md), el skill de Matt Pocock que entrevista sobre una idea hasta resolver el árbol de decisiones. Es la versión liviana de shape para que la usen en la tarea.
- "Your Brain on ChatGPT: Accumulation of Cognitive Debt when Using an AI Assistant for Essay Writing Task" (MIT Media Lab, 2025), la fuente del término deuda cognitiva. Es un estudio chico y sobre ensayos, no sobre código: usar el término, no sobrevender el paper.
- MIT Missing Semester 2026, clase de agentic coding: "don't use AI as a crutch", ya citado en la Sesión 1.
- La charla interna de Filadd "Documentando para entender" (2026-08-14), la fuente del framework de dos dominios. No es material público.

## Pendientes (para próximas iteraciones)

- **Actualizar `exercise/README.md`** al formato nuevo: sigue describiendo los dos bloques de práctica en clase, y ahora son la tarea. Las plantillas de `PROJECT.md` y `features/<nombre>.md` salieron del deck y quedan ahí.
- **Hacer el ensayo** de la corrida en vivo y anotar acá dónde se trabó y qué etapa conviene cortar si falta tiempo.
- **Probar grill-me en Pi** con un proyecto chico, para recomendarlo en la tarea con confianza.
- **Alinear `COURSE_PROGRAM.md`**: todavía dice que esta sesión abre los subagentes y la trata como práctica en clase.
