---
marp: true
theme: default
paginate: true
title: Sesión 2 — Planificar y Revisar
---

<!--
Skeleton de la presentación de la Sesión 2.
Cada slide tiene un título + una nota de oradora/orador (HTML comment).
El contenido del cuerpo de cada slide está pendiente.
-->

# Sesión 2
## Planificar y Revisar

**De Vibe Coding a Agentic Engineering** — FaMAF
Agustín Carrasco

<!-- Slide de portada. Saludar, repasar quién soy, anclar dónde estamos en el curso (sesión 2 de 4). -->

---

## ¿Dónde quedamos?

<!-- Recap de Sesión 1: vibe coding sin estructura, qué problemas aparecieron, qué se sintió. Abrir el show-and-tell: "¿Qué pasó con su código durante la semana? ¿Alguien lo abrió?". 15-20 min de discusión, no de slides. -->

---

## Lo que vamos a hacer hoy

<!-- Anclar el objetivo en una frase: "salir sabiendo cómo externalizar un plan y revisar un diff antes de aceptar". Mostrar el flujo: plan → externalizar → test → implementar → revisar. -->

---

# Parte 1 — Git con AI

<!-- Sección. Arrancamos con la red de seguridad: antes de meternos en el flujo de planificación y revisión, asegurémonos de que cualquier cosa que salga mal se pueda deshacer. -->

---

## La red de seguridad va primero

<!-- Por qué Git arranca el bloque: todo lo que viene asume que podés tirar lo que el agente hizo y volver atrás. Sin esa base, el resto del flujo no se siente seguro. -->

---

## Spectrum de workflows

<!-- Repo individual: main está bien. Equipo: branches. Trabajo paralelo: worktrees. AI no cambia git; solo hace que "tirar la branch" sea más barato. -->

---

## El diff review es la puerta antes del merge

<!-- Cualquiera sea tu workflow, el diff revisado es la garantía. No hay rama protegida que reemplace tu lectura. -->

---

# Parte 2 — Planificar

<!-- Sección. Transición al primer bloque de planificación y revisión. -->

---

## El problema: el plan vive en la cabeza del agente

<!-- Por qué importa planificar antes de ejecutar con un agente. Concepto: el plan existe; la pregunta es dónde vive y quién lo puede leer. -->

---

## Plan mode

<!-- Qué es plan mode en Claude Code, cómo se activa (Shift+Tab x2), qué hace. El plan sigue viviendo dentro del agente, pero ahora vos lo iterás antes de ejecutar. -->

---

## Demo: plan mode en vivo

<!-- Demo en vivo sobre el proyecto del instructor. Activar plan mode, describir una feature, iterar el plan. ~5 min. -->

---

## Plannotator: el mismo plan, mejor UX

<!-- Plannotator hace lo mismo conceptualmente que plan mode, pero el plan vive como un archivo que podés anotar, compartir, versionar. La idea es la misma; la diferencia es UX. -->

---

## Demo: plannotator en vivo

<!-- Mismo plan del demo anterior, ahora abierto en plannotator. Anotar puntos vagos, ambigüedades, suposiciones del agente. ~5 min. -->

---

## También podés delegar el review del plan

<!-- Subagentes como subtema dentro de planificar: podés tener un agente cuyo único trabajo es leer el plan y reportar dónde está flojo, qué falta, qué dos personas implementarían distinto. Mención corta — la profundidad de subagentes es Sesión 3 (Diego). -->

---

## ¿Y la descomposición de tareas?

<!-- No es un tema aparte: cuando el plan está bien hecho, ya viene descompuesto en pasos revisables. Mostrarlo apuntando al plan del demo. Una línea sobre estilo "entrypoint" para recorrer la descomposición de afuera para adentro. -->

---

# Parte 3 — Revisar

<!-- Sección. Transición al bloque de revisión. -->

---

## El cuello de botella es la verificación

<!-- Cuando el agente produce código rápido, el cuello de botella se mueve a la revisión. Comprehension debt: shipping código que no entendés. -->

---

## El espectro de superficies de revisión

<!-- Introducir la idea: no hay una manera correcta de revisar, hay varias superficies. Sirve elegir la que corresponde al contexto. -->

---

## Estrategia 1: Mirar mientras escribe

<!-- Watch + steer. Frenar al agente en medio del stream cuando ves que va por mal camino. Revisión en tiempo real. -->

---

## Estrategia 2: Leer en el editor

<!-- Abrir los archivos modificados en el IDE. La revisión más básica y la más directa. -->

---

## Estrategia 3: Diff tools

<!-- git diff y hunk para revisión interactiva hunk por hunk. Cuando el cambio es grande, el diff te da el panorama. -->

---

## Estrategia 4: Plannotator (modo review)

<!-- Pasar el diff por plannotator y anotarlo igual que el plan. Útil cuando querés dejar un registro de la revisión, no solo aceptar o rechazar. -->

---

## Estrategia 5: Delegar el code review a un subagente

<!-- Subagentes como subtema dentro de revisar: igual que con el plan, podés delegar la lectura del diff a un agente especializado. Reporta issues, smells, divergencias. Mención corta — profundidad en Sesión 3. -->

---

## Bonus: Annai (en construcción)

<!-- Mencionar Annai como alternativa con modelo distinto (interactividad mid-session, submission a GitHub). Mostrar que el espacio de herramientas está vivo. -->

---

## Sidebar de seguridad

<!-- Mientras se revisa el diff del demo, apuntar un smell concreto (input sin validar, secret expuesto, falta de auth). 30 segundos. -->

---

# Parte 4 — Tests como guardrails

<!-- Sección breve. -->

---

## El test es el contrato que el agente no puede falsear

<!-- Si vos escribís el test primero, el agente tiene que cumplirlo. Si el agente lo escribe después, te puede engañar (cambia el assert para que pase). Framework-agnostic. -->

---

## No es TDD estricto

<!-- No vamos a hacer red → green → refactor disciplinado. Solo: tests existen, vos los escribiste antes. El resto es bonus. -->

---

# Hands-on (75 min)

<!-- Transición al bloque práctico. -->

---

## Los pasos

<!-- Listar los 6 pasos del ejercicio (ver exercise/README.md): elegir feature, plan mode, plannotator, test primero, implementar, revisar diff. -->

---

## Lo que vas a sentir

<!-- Avisar: va a sentirse más lento que la Sesión 1. Esa es la lección. La fricción es el aprendizaje. -->

---

# Cierre

<!-- Sección final. -->

---

## Preguntas para llevarse

<!-- Mostrar las 4 preguntas del exercise/README.md como prompts de reflexión. ~5 min de discusión en grupo. -->

---

## ¿Qué cambió respecto a la Sesión 1?

<!-- Pregunta abierta. Que hablen. -->

---

## Próxima sesión: Tooling & Skills (Diego)

<!-- Foreshadow: el subagente que mencioné, el AGENTS.md en serio, MCP, skills personalizadas — todo eso es Sesión 3. -->

---

## Gracias

<!-- Cierre. -->
