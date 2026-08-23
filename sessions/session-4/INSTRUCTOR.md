# Sesión 4 — Context Engineering (Notas para el instructor)

> A cargo: Agus. Estado: borrador. Todo el material de la sesión está en español.

## Objetivo de la sesión (en una frase)

Que salgan sabiendo **mantener documentos vivos del proyecto**, que separan el problema de la solución y registran las decisiones, y usarlos como contexto para planificar y construir.

## Audiencia y supuestos

- **Dura 2 horas y no se instala nada.**
- **Con qué llegan**: su proyecto, un `AGENTS.md`, al menos un skill, y la feature de la tarea de la Sesión 3: una que no pueden describir en una frase. Si alguien no la trajo, que la elija durante el recap.
- Grupo heterogéneo, de primer año a graduados.
- El riesgo de la clase no es técnico: es que documentar se sienta como tarea escolar. Los dos bloques prácticos terminan con el agente usando los docs; ese contraste es lo que lo evita.

## Plan tema por tema

### Recap (~10 min)

Discusión, no slides. Dos disparadores:

**1. Show-and-tell de skills.** ¿Alguien creó un skill nuevo durante la semana? ¿Encontró alguno hecho que le sirvió? Dos o tres casos alcanzan. Preguntar por el criterio: qué convirtieron en skill y qué dejaron en el `AGENTS.md`.

**2. ¿Qué dudas quedaron de la Sesión 3?** Pregunta abierta. MCP y subagentes suelen dejar preguntas sueltas.

### Qué vamos a ver hoy (~5 min)

El encuadre: en la Sesión 2 escribieron un plan por tarea, en la Sesión 3 la configuración que no cambia. Hoy escriben documentos del proyecto que alimentan los planes y registran las decisiones.

Los dos conceptos que enmarcan la sesión, presentados acá y retomados en el cierre:

- **Deuda cognitiva**: el costo mental de delegar de forma repetida el razonamiento, la memoria y la resolución de problemas en la IA. Cada decisión que no tomaste vos es una decisión que no entendés.
- **Rendición cognitiva**: el paso siguiente: aceptar lo que el agente produce sin leerlo de verdad, y adoptar sus decisiones como propias. Cuando no entendés el problema en profundidad, las respuestas del agente se convierten en tu opinión, porque no tenés con qué contrastarlas.

La frase de la sesión:

> *"Documentar es pensar antes de construir."*

### Dos dominios (~15 min)

Ejemplo primero, concepto después. El ejemplo es **una sola feature**: agregar soporte multi-usuario a la lista de tareas (el proyecto A de la Sesión 1, el mismo del ejercicio de la Sesión 3). La misma feature descrita dos veces:

- **Dominio del problema**: la necesidad. Varias personas quieren usar la lista y cada una quiere ver solo lo suyo. Se detalla con herramientas del lado del problema:
  - **Actores**: quién usa el sistema (usuario registrado, visitante).
  - **Datos y relaciones**: qué cosas existen y cómo se conectan (usuario, tarea, cada tarea pertenece a un usuario).
  - **Procesos**: qué hace cada actor (registrarse, entrar, trabajar sobre sus tareas).

  Todo en términos del problema, sin hablar del sistema. La charla que originó el framework hablaba de procesos del día a día porque la audiencia no era técnica; acá la audiencia es técnica y los problemas son problemas en general, no solo procesos.

- **Dominio de la solución**: el sistema que resuelve esa necesidad. Se detalla con herramientas del lado de la solución:
  - **Diagramas de datos**: la tabla `users`, el `user_id` en `tasks`.
  - **Breadboards o bocetos de pantallas**: registro, login, el header con la sesión.
  - **Flujos**: el usuario entra, la sesión se valida, la lista se filtra.

  Es **una** de las muchas formas posibles de resolver esa necesidad.

Las dos ideas que tienen que quedar:

1. **El mismo problema admite muchas soluciones.** Si arrancás por la solución, el riesgo es doble: tomás decisiones sin haber considerado el problema en profundidad, y muchas de esas decisiones las termina derivando el agente, que por defecto devuelve la respuesta promedio de todo el conocimiento que ya tiene.
2. **La distinción importa con o sin IA.** Es la separación de siempre entre requerimientos y diseño.

Cierre del bloque, pregunta a la sala: ¿dónde vive esta distinción en el proyecto de ustedes hoy? En ningún lado: el código es todo dominio de la solución, y el problema quedó en el historial de chats. Eso abre el bloque siguiente.

### Documentar lo que ya construiste (~30 min)

~5 de plantillas, ~25 de práctica.

**Las plantillas (~5 min).** Dos tipos de documento, commiteados en el repo:

`docs/PROJECT.md`, uno solo. La descripción general del proyecto:

```markdown
# <Proyecto>

Qué es el proyecto y para quién.

## Objetivo
El objetivo principal: qué tiene que lograr para valer la pena.

## Restricciones
Lo que ya está decidido y no se rediscute por feature:
stack, límites, supuestos.
```

`docs/features/<nombre>.md`, uno por feature:

```markdown
# <Feature>

El problema que resuelve: qué necesidad cubre y qué tiene que
poder hacer quien la usa.

## Diseño

### Modelo
Los datos en juego: entidades, campos, relaciones.

### Flujo: <nombre>
Uno por interacción: las pantallas que recorre y qué se puede
hacer en cada una, los pasos, las reglas que se validan, y las
decisiones que se tomaron en el camino, cada una con su motivo.
```

Dos cosas para decir sobre las plantillas:

- **Son plantillas, no formularios.** Cada proyecto las adapta: se borran secciones que sobran, se agregan las que faltan. El error es dejarlas como vinieron.
- **Relación con el `AGENTS.md`.** Algo de superposición puede haber, pero idealmente el `AGENTS.md` apunta a estos documentos: él lleva lo operativo de cada turno (comandos, convenciones) y referencia los docs para el entendimiento del proyecto.

**El trabajo (~25 min).** Documentar el proyecto que ya tienen, de forma interactiva: el agente explora el código, el historial de commits y los planes de las sesiones anteriores, muestra un borrador del `PROJECT.md` y de un `<feature>.md` por cada feature existente, y pregunta lo que no puede saber: el problema que se quiso resolver y el porqué de cada decisión. El estudiante responde y el doc final sale de esa conversación.

Qué vigilar caminando la sala:

- **El problema, primero.** Tiene que describir qué se quiere resolver con la feature, no cómo está construida. Si arranca con tablas o componentes, quedó en el dominio equivocado.
- **Las decisiones, dentro de cada flujo.** Si no hay ninguna o dicen generalidades ("elegimos React por su popularidad"), el ejercicio no se hizo. Las decisiones reales tienen la forma "el estado vive en el server y no en el cliente porque X". Varias ni las tomaron ellos: las tomó el agente en la Sesión 1. Eso se decide ahora, en retrospectiva.

### Pausa (~5 min)

Dejar proyectadas las plantillas.

### Documentar la próxima feature e implementarla (~40 min)

Explicación corta (~5) y el resto trabajo continuo: doc → plan → implementación.

**La explicación (~5 min).** Toman la feature que trajeron. Puede ser nueva o una modificación de una existente; en el segundo caso extienden el doc que esa feature ya tiene. Escriben o actualizan su `docs/features/<nombre>.md` antes de tocar código. Tres instrucciones:

1. **No le pidas el documento: pedile que te haga preguntas.** Contale el problema con tus palabras y que te interrogue. Las preguntas exponen lo que dabas por sentado y no estaba escrito. El borrador se escribe después, cuando las decisiones están tomadas. Hay un skill hecho para esto: [grill-me](https://github.com/mattpocock/skills/blob/main/skills/productivity/grill-me/SKILL.md) de Matt Pocock, que entrevista hasta resolver el árbol de decisiones. Es un `SKILL.md` como los de la Sesión 3.
2. **El documento es de alto nivel.** Si la feature toca una librería o una API, context7 (Sesión 3) sirve para entenderla, pero los detalles de implementación no van al doc: van al plan que sale después.
3. **El doc alimenta el plan.** La cadena completa: doc → plan → implementación → review. El plan sale con las decisiones ya tomadas, y el review compara contra dos cosas: el plan (¿hizo lo que acordamos?) y el doc (¿respeta las decisiones del proyecto?).

**El trabajo (~35 min).** Escribir el doc de la feature vía interrogación, generar el plan con Plannotator partiendo del doc, ejecutar. No hace falta terminar la implementación; alcanza con generar el plan desde el doc.

Qué vigilar caminando la sala:

- Que la interrogación sea real. Preguntarle al estudiante: ¿qué pregunta te hizo el agente que no tenías respondida? Si no hay ninguna, le pidió el documento directo y no hay ninguna decisión propia adentro.
- Que el plan cite el doc. Si el plan contradice una decisión escrita, mostrarlo: es el doc funcionando como criterio de review.

**Extra: orquestación (~5 min, opcional, mientras trabajan).** Una vuelta por la sala o una slide fija para los que van rápido. Con los docs en el repo hay una fuente de verdad compartida, y eso habilita varios agentes a la vez: un subagente implementa mientras otro revisa contra el doc, o dos features en paralelo con worktrees.

### Cierre (~15 min)

- **¿Qué cambió cuando el agente tuvo el doc?** Casos concretos: qué preguntó el agente en la interrogación, qué hizo el plan distinto.
- **Deuda y rendición cognitiva, de vuelta.** La diferencia entre delegar la escritura y delegar el pensamiento. Si el doc lo escribió el agente sin preguntarte nada, delegaste las dos cosas.
- **Cuándo no usar IA.** La IA amplifica lo que ya sabés; sin los fundamentos, amplifica la confusión. "Don't use AI as a crutch" (MIT Missing Semester).
- **Ser dueño.** Entender, decidir, discutir, mantener. Si no podés explicar tu sistema sin abrir el código, no sos dueño del sistema.
- **Nombrar la transición**: con esta sesión termina el tramo de "cómo trabajo bien con esta herramienta". Las próximas dos desarman la máquina: la Sesión 5 abre el harness por adentro y la Sesión 6 cambia el modelo que tiene abajo.
- **Tarea**: mantener los docs vivos durante la semana. Cada decisión nueva va al doc de su feature; anotar cuándo los docs sirvieron y cuándo quedaron desactualizados respecto del código.

## Timing de la sesión (~2 h)

| Bloque | Tiempo |
|---|---|
| Recap | 10 min |
| Qué vamos a ver hoy | 5 min |
| Dos dominios | 15 min |
| Documentar lo que ya construiste (plantillas + trabajo) | 30 min |
| Pausa | 5 min |
| Documentar la próxima feature e implementarla | 40 min |
| Cierre | 15 min |

## Herramientas y recursos referenciados

- Nada nuevo que instalar. Se usan [Plannotator](https://www.npmjs.com/package/@plannotator/pi-extension) (Sesión 2), [`pi-subagents`](https://www.npmjs.com/package/pi-subagents) (Sesión 2) y [context7](https://context7.com/) vía `pi-mcp-adapter` (Sesión 3).
- [grill-me](https://github.com/mattpocock/skills/blob/main/skills/productivity/grill-me/SKILL.md), el skill de Matt Pocock que entrevista sobre una idea hasta resolver el árbol de decisiones. Opcional para el bloque de 40.
- "Your Brain on ChatGPT: Accumulation of Cognitive Debt when Using an AI Assistant for Essay Writing Task" (MIT Media Lab, 2025), la fuente del término deuda cognitiva. Es un estudio chico y sobre ensayos, no sobre código: usar el término, no sobrevender el paper.
- MIT Missing Semester 2026, clase de agentic coding: "don't use AI as a crutch", ya citado en la Sesión 1.
- La charla interna de Filadd "Documentando para entender" (2026-08-14), la fuente del framework de dos dominios. No es material público.

## Pendientes (para próximas iteraciones)

- **Preparar el ejemplo de dos dominios** (multi-usuario en la lista de tareas) sobre el proyecto demo, con los diagramas y breadboards de los dos lados listos para mostrar.
- **Probar grill-me en Pi** con el proyecto demo: confirmar que el skill carga y que la interrogación funciona como en Claude Code.
- **Escribir los dos prompts/skills de la sesión** (los TODO del ejercicio): el de exploración interactiva de la Parte 1 (el agente explora, muestra un borrador y pregunta lo que no puede saber) y el de interrogación de la Parte 2, basado en grill-me.
