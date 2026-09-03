---
marp: true
theme: default
paginate: true
title: Sesión 4 — Context Engineering
---

<!--
Skeleton de la presentación de la Sesión 4.
Cada slide tiene un título + una nota de oradora/orador (HTML comment).
El contenido del cuerpo de cada slide está pendiente.

Excepción deliberada: traen cuerpo escrito las slides que la sala tiene
que copiar o leer textual — las dos plantillas, la frase de la sesión y
el prompt de interrogación.

Sesión de 2 h: 10 recap, 5 intro, 15 dos dominios, 30 documentar lo
construido (5 plantillas + 25 trabajo), 5 pausa, 40 documentar la
próxima feature e implementarla (5 explicación + 35 trabajo), 15 cierre.
-->

# Sesión 4
## Context Engineering

**De Vibe Coding a Agentic Engineering** — FaMAF
Agustín Carrasco

<!-- Portada. Anclar: sesión 4 de 6, mismo proyecto, 2 h, y hoy no se instala nada. -->

---

## Hoy

<!-- Agenda en una slide: cómo les fue, dos dominios, documentar lo que ya construyeron, documentar la próxima feature e implementarla, cierre. Los dos bloques grandes son de trabajo: hoy se escribe y se construye, no se escucha. -->

---

# ¿Cómo les fue?

<!-- Sección de recap. ~10 min de DISCUSIÓN, no de slides. -->

---

## ¿Alguien creó o encontró un skill nuevo?

<!-- Primer disparador. Dos o tres casos contados en voz alta alcanzan. Preguntar por el criterio: qué convirtieron en skill y qué dejaron en el AGENTS.md. -->

---

## ¿Qué dudas quedaron de la Sesión 3?

<!-- Segundo disparador, pregunta abierta. MCP y subagentes suelen dejar preguntas sueltas. -->

---

# Qué vamos a ver hoy

<!-- Sección. ~5 min. El encuadre: en la Sesión 2 escribieron un plan por tarea, en la Sesión 3 la configuración que no cambia. Hoy: documentos del proyecto que alimentan los planes y registran las decisiones. -->

---

## Deuda cognitiva y rendición cognitiva

<!-- Los dos conceptos que enmarcan la sesión; se presentan acá y vuelven en el cierre. DEUDA COGNITIVA: el costo mental de delegar de forma repetida el razonamiento, la memoria y la resolución de problemas en la IA. Cada decisión que no tomaste vos es una decisión que no entendés. RENDICIÓN COGNITIVA: el paso siguiente: aceptar lo que el agente produce sin leerlo de verdad y adoptar sus decisiones como propias. Cuando no entendés el problema en profundidad, las respuestas del agente se convierten en tu opinión, porque no tenés con qué contrastarlas. Referencia de deuda cognitiva: "Your Brain on ChatGPT" (MIT Media Lab, 2025); usar el término sin sobrevender el paper. -->

---

## "Documentar es pensar antes de construir"

<!-- La frase de la sesión. Que quede a la vista. -->

---

# Dos dominios

<!-- Sección. ~15 min. Ejemplo primero, concepto después. El ejemplo es UNA SOLA FEATURE: agregar soporte multi-usuario a la lista de tareas (el proyecto A de la Sesión 1, el mismo de la demo de la Sesión 3). -->

---

## El problema: multi-usuario

<!-- La feature descrita desde el dominio del problema: la necesidad. Varias personas quieren usar la lista y cada una quiere ver solo lo suyo. Detallar con las herramientas de este lado: ACTORES (usuario registrado, visitante), DATOS Y RELACIONES (usuario, tarea, cada tarea pertenece a un usuario), PROCESOS (registrarse, entrar, trabajar sobre sus tareas). Todo en términos del problema, sin hablar del sistema. -->

---

## La solución: multi-usuario

<!-- La MISMA feature desde el dominio de la solución: el sistema. Detallar con las herramientas de este lado: DIAGRAMA DE DATOS (tabla users, user_id en tasks), BREADBOARDS O BOCETOS de pantallas (registro, login, header con la sesión), FLUJOS (el usuario entra, la sesión se valida, la lista se filtra). Y la línea clave: esta es UNA de las muchas formas posibles de resolver esa necesidad. -->

---

## Mismo problema, muchas soluciones

<!-- La primera idea del bloque. Si arrancás por la solución, el riesgo es doble: tomás decisiones sin haber considerado el problema en profundidad, y muchas de esas decisiones las termina derivando el agente, que por defecto devuelve la respuesta promedio de todo el conocimiento que ya tiene. -->

---

## Con o sin IA

<!-- La segunda idea. La distinción problema/solución es la separación de siempre entre requerimientos y diseño: importa con o sin IA. Y la pregunta que cierra el bloque, a la sala: ¿dónde vive esta distinción en el proyecto de ustedes hoy? En ningún lado: el código es todo dominio de la solución y el problema quedó en el historial de chats. Eso abre el bloque siguiente. -->

---

# Documentar lo que ya construiste

<!-- Sección. ~30 min: ~5 de plantillas, ~25 de trabajo. -->

---

## `docs/PROJECT.md` — uno solo

```markdown
# <Proyecto>

Qué es el proyecto y para quién.

## Objetivo
El objetivo principal: qué tiene que lograr para valer la pena.

## Restricciones
Lo que ya está decidido y no se rediscute por feature:
stack, límites, supuestos.
```

<!-- La primera plantilla, para copiar. La descripción general del proyecto. -->

---

## `docs/features/<nombre>.md` — uno por feature

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

<!-- La segunda plantilla. Cada feature lleva los dos dominios adentro: el problema arriba y el diseño abajo, con el modelo y un flujo por interacción. El flujo carga todo: pantallas, pasos, reglas y las decisiones con su motivo. Dos aclaraciones: (1) SON PLANTILLAS, NO FORMULARIOS: cada proyecto las adapta, el error es dejarlas como vinieron. (2) Relación con el AGENTS.md: algo de superposición puede haber, pero idealmente el AGENTS.md APUNTA a estos documentos: él lleva lo operativo de cada turno y referencia los docs para el entendimiento del proyecto. -->

---

## Manos a la obra (~25 min)

<!-- El trabajo, interactivo: el agente explora el código, los commits y los planes anteriores, muestra un borrador del PROJECT.md y de un doc por feature existente, y PREGUNTA lo que no puede saber: el problema que se quiso resolver y el porqué de cada decisión. El estudiante responde y el doc final sale de esa conversación. Caminando la sala, vigilar: (1) EL PROBLEMA, primero: tiene que describir qué se quiere resolver con la feature, no cómo está construida; si arranca con tablas o componentes, quedó en el dominio equivocado. (2) LAS DECISIONES: si no hay o dicen generalidades ("elegimos React por su popularidad"), el ejercicio no se hizo; las reales tienen la forma "el estado vive en el server porque X". Varias las tomó el agente en la Sesión 1: se deciden ahora, en retrospectiva. -->

---

# Pausa (5 min)

<!-- Dejar proyectadas las plantillas. -->

---

# Documentar la próxima feature e implementarla

<!-- Sección. ~40 min: ~5 de explicación, ~35 de trabajo continuo: doc → plan → implementación. Toman la feature de la tarea, la que no entra en una frase. Puede ser nueva o una modificación de una existente; en el segundo caso extienden el doc que esa feature ya tiene. -->

---

## Pedile que te pregunte

```
Quiero definir esta feature: <tu descripción, con tus palabras>.

No escribas el documento todavía. Haceme preguntas de a una
hasta que las decisiones importantes estén tomadas.
```

<!-- La primera instrucción, con el prompt para copiar. No le pidas el documento: contale el problema y que te interrogue. Las preguntas exponen lo que dabas por sentado y no estaba escrito. El borrador se escribe después, cuando las decisiones están tomadas. Mencionar grill-me de Matt Pocock: un skill hecho exactamente para esto, entrevista hasta resolver el árbol de decisiones, y es un SKILL.md como los de la Sesión 3. -->

---

## El doc es de alto nivel

<!-- La segunda instrucción. Si la feature toca una librería o una API, context7 (Sesión 3) sirve para entenderla, pero los detalles de implementación no van al doc: van al plan que sale después. -->

---

## doc → plan → implementación → review

<!-- La tercera instrucción, y el callback a la Sesión 2. El plan sale con las decisiones ya tomadas, y el review ahora compara contra dos cosas: el plan (¿hizo lo que acordamos?) y el doc (¿respeta las decisiones del proyecto?). Después, a trabajar: escribir el doc de la feature vía interrogación, generar el plan con Plannotator partiendo del doc, ejecutar. No hace falta terminar la implementación; alcanza con generar el plan desde el doc. Caminando la sala: ¿qué pregunta te hizo el agente que no tenías respondida? Si no hay ninguna, no hubo interrogación. Y que el plan cite el doc. -->

---

## Extra: orquestación

<!-- Slide fija mientras trabajan, para los que van rápido. Con los docs en el repo hay una fuente de verdad compartida, y eso habilita varios agentes a la vez: un subagente implementa mientras otro revisa contra el doc, o dos features en paralelo con worktrees. -->

---

# Cierre

<!-- Sección. ~15 min. -->

---

## ¿Qué cambió cuando el agente tuvo el doc?

<!-- Casos concretos: qué preguntó el agente en la interrogación, qué hizo el plan distinto. -->

---

## Deuda y rendición, de vuelta

<!-- Los dos conceptos del arranque, ahora con la clase encima. La diferencia entre delegar la escritura y delegar el pensamiento: si el doc lo escribió el agente sin preguntarte nada, delegaste las dos cosas. Y cuándo no usar IA: amplifica lo que ya sabés; sin los fundamentos, amplifica la confusión. "Don't use AI as a crutch" (MIT Missing Semester). -->

---

## Ser dueño

<!-- Entender, decidir, discutir, mantener. Si no podés explicar tu sistema sin abrir el código, no sos dueño del sistema. -->

---

## Lo que viene

<!-- RECORDAR LA DEMO, que se anunció en la Sesión 1 y ésta es la última clase antes: la Sesión 5 ABRE CON UNA HORA DE DEMOS del proyecto. Voluntario, sin nota, 5 a 7 minutos con preguntas. Que vengan con el repo listo y sepan qué quieren contar — y que lo interesante es CÓMO lo construyeron, no solo qué. Nombrar la transición: con esta sesión termina el tramo de "cómo trabajo bien con esta herramienta". Las próximas dos desarman la máquina: la Sesión 5 abre el harness por adentro y la Sesión 6 cambia el modelo que tiene abajo. TAREA: mantener los docs vivos durante la semana; cada decisión nueva va al doc de su feature; anotar cuándo los docs sirvieron y cuándo quedaron desactualizados respecto del código. -->
