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

Sesión de 2 h: 12 recap, 8 intro, 5 setup, 5 git, 18 planificar, 12 revisar,
5 tests, 5 pausa, 40 práctica, 10 cierre.

Deck mínimo a propósito: el peso de la sesión está en las dos demos en vivo
(~20 min combinados), no en las slides. Todo lo que se puede mostrar en la
terminal no tiene slide.
-->

# Sesión 2
## Planificar y Revisar

**De Vibe Coding a Agentic Engineering** — FaMAF
Agustín Carrasco

<!-- Portada. Anclar: sesión 2 de 6, mismo proyecto, hoy son 2 h. -->

---

## Hoy

<!-- Agenda en una slide: cómo les fue en la semana, qué vamos a ver, dos extensiones para instalar, dos demos, y 40 min de práctica. Avisar que el diff review del final no se saltea. -->

---

# ¿Cómo les fue?

<!-- Sección de recap. ~12 min de DISCUSIÓN, no de slides. Sincronizar con Diego antes de la clase para no repetir lo que él ya recolectó en sus 12 min de la Sesión 1. Lo que salga va al pizarrón: es la materia prima del bloque siguiente. NO cerrar con conclusión — la conclusión la damos en la intro. -->

---

## ¿Se les fue de las manos? ¿Cuándo?

<!-- El disparador principal. La tarea era seguir vibecodeando sin abrir archivos hasta perder el control, y anotar el momento. Recolectar 4-5, anotarlos en el pizarrón. Esperables: rompió algo que andaba, el fix empeoró todo, tres intentos para el mismo bug, un archivo que no sabían que existía, el proyecto creció y ya no saben qué hace. Preguntar también quién abrió el código durante la semana — romper la regla es buena señal, preguntar qué los hizo romperla. -->

---

# Qué vamos a ver hoy

<!-- Sección. ~8 min. Toma lo del pizarrón y lo ordena: primero el diagnóstico, después los tres movimientos. -->

---

## Por qué pasó lo que pasó

<!-- Diagnóstico, no reto. Tres problemas: (1) No sabés qué shippeaste — comprehension debt, el término de Diego; los intereses se acumulan porque cada feature nueva se apoya en algo que no entendés. (2) El cuello de botella se movió: escribir dejó de ser lo caro, ahora lo caro es verificar; si no verificás no ahorraste tiempo, te lo estás debiendo. (3) El 80% llega solo y el 20% es todo el trabajo — justo la parte donde hace falta entender el código. Cualitativo: los números de METR ya los dio Diego la semana pasada. -->

---

## Planificar · Documentar · Diseñar

<!-- Los tres movimientos, que son el esqueleto del día y del resto del curso. PLANIFICAR: decidir qué se va a hacer antes de que se haga, cuando corregir cuesta una frase en vez de un refactor. DOCUMENTAR: el plan tiene que existir afuera de la cabeza del agente y de la tuya — un archivo que puedas leer, anotar, versionar y mostrar; un plan que solo vive en una conversación no se puede revisar. DISEÑAR: las decisiones que importan (qué archivos se tocan, qué se rompe, qué queda para después) las tomás vos; el agente ejecuta. Cuando el agente diseña por default, pasa lo de la semana pasada. -->

---

## Hoy no vamos a escribir menos código

<!-- La frase de la sesión: "hoy no vamos a escribir menos código, vamos a saber qué código escribimos". Avisar también qué se siente: hoy va a parecer más lento. Es cierto y es el punto; al final comparamos. -->

---

## Antes de arrancar: dos extensiones

<!-- 5 min, todos juntos. `pi install npm:@plannotator/pi-extension` y `pi install npm:pi-subagents`. Único setup del día y está en el camino crítico de la práctica: hacerlo acá deja una hora de teoría para destrabar a quien se cuelgue. Se pidió como pre-work; no asumir que lo hicieron. -->

---

# Git con AI

<!-- Sección. ~5 min. La red de seguridad, antes de todo lo demás. -->

---

## Todo lo que sigue asume que podés volver atrás

<!-- Un espectro atado al contexto, no un workflow rígido: solo en tu repo, main está bien; en equipo, branches por feature; trabajo paralelo, worktrees. La AI no cambia git, solo hace que tirar la branch salga más barato. Y el diff revisado es la puerta antes del merge: no hay rama protegida que reemplace tu lectura. Hoy importa más que de costumbre porque en la práctica van a ejecutar un plan paso por paso. -->

---

# Planificar

<!-- Sección. ~18 min: ~6 de teoría, ~12 de demo. -->

---

## El plan siempre existe

<!-- Cuando le tirás un prompt en frío, el agente planifica igual — en silencio, adentro de su contexto, y te enterás de lo que decidió mirando el destrozo. El plan siempre existe; la única pregunta es si lo podés leer. Externalizarlo cuesta unos minutos y te deja algo que se puede leer, anotar, versionar, commitear y pasarle a otro. Pi no trae plan mode: se lo agregamos con la extensión, y por eso el plan es un archivo desde el minuto cero. -->

---

## El harness te obliga

<!-- En plan mode el toolset cambia: solo lectura y búsqueda, sin escritura fuera del archivo del plan, comandos destructivos bloqueados. Mostrar el indicador `⏸ plan`. No es decoración — aunque quieras, no podés saltear la planificación. La disciplina la impone la herramienta. Semilla para la Sesión 3: permisos y extension points. -->

---

## Demo: planificar

<!-- ~12 min sobre el proyecto del instructor. Acá se apaga el proyector de slides y se prende la terminal. Pasos en INSTRUCTOR.md: entrar en plan mode → describir la feature → RECHAZAR el plan con anotaciones (el beat de la sesión, no aprobar en la primera pasada aunque esté bien) → Plan Diff → delegar el review del plan a un subagente (~2 min) → aprobar y dejarlo ejecutar. El diff que produzca es el material de la demo siguiente. Tener un plan malo pre-escrito por si el agente escribe uno demasiado prolijo. -->

---

# Revisar

<!-- Sección. ~12 min: ~4 de teoría, ~8 de demo. -->

---

## El espectro de superficies de revisión

<!-- No hay una manera correcta de revisar, hay varias superficies; cuál usás depende del tamaño del cambio y de cuánto confiás en él. Las cinco, rápido: (1) mirar mientras escribe — frenar el stream y redirigir; (2) leer en el editor; (3) diff tools, git diff o hunk; (4) /plannotator-review, que anota líneas y manda el feedback de vuelta al agente; (5) delegarlo a un subagente. Se ven en vivo en la demo, no hace falta una slide por cada una. -->

---

## Demo: revisar el diff

<!-- ~8 min, sobre el diff que dejó la demo anterior. `/plannotator-review`: recorrer, anotar una línea concreta, mandarla de vuelta. Si el momento se da, frenar al agente en vivo una vez para mostrar el "mirar mientras escribe". Si aparece un smell de seguridad concreto, nombrarlo al pasar y seguir — no hay bloque reservado para eso. Cerrar con la pregunta que une los dos bloques: "¿esto coincide con el plan que aprobaste?" — la pregunta más útil de la revisión, y solo la podés hacer porque el plan está escrito. -->

---

# Tests como guardrails

<!-- Sección. ~5 min. -->

---

## El test es el contrato que el agente no puede falsear

<!-- Si el agente escribe el código Y el test, te puede engañar: afloja el assert hasta que pase. Si el assert lo escribiste vos antes, tiene que cumplirlo. Agnóstico de framework, y no es TDD estricto: la ganancia es "existe un test y lo escribiste vos antes", no red → green → refactor. Casi nadie va a tener test runner: que se lo instale el agente, es mecánico. Lo que NO se delega es el assert. Decirlo así: "que te lo instale el agente; el expect lo escribís vos". -->

---

# Práctica (40 min)

<!-- Sección. -->

---

## Las reglas de hoy

<!-- Se dan vuelta respecto de la semana pasada. 1) Nada se ejecuta sin plan escrito. 2) Rechazá el primer plan, aunque te parezca bien. 3) No aceptes ningún cambio sin leer el diff. 4) Si algo se rompe, leelo vos primero. La 2 da ganas de saltearla y es la que más importa. -->

---

## Los pasos

<!-- Ver exercise/README.md, no leerlos desde la slide. Los 6: elegir feature, entrar en plan mode, planificar y rechazar, test primero, ejecutar, revisar el diff. Insistir con el scope: si toca más de 4-5 archivos, no llegan. -->

---

# Cierre

<!-- Sección. ~10 min. -->

---

## ¿Qué cambió? ¿Valió la pena?

<!-- Discusión abierta. Buscar: ¿el plan anotado les mostró algo que se les había escapado? ¿el test se cumplió o lo terminaron cambiando para que pase? ¿encontraron en el diff algo que se les habría escapado? Y la pregunta honesta sobre el overhead: para una feature chica puede no haber valido la pena, dejar que lo digan. La respuesta interesante no es "siempre vale", es "depende de cuánto te importe poder explicar el código después". -->

---

## Para la semana · Próxima sesión

<!-- Tarea: seguir con este flujo (plan escrito, plan anotado, test primero, diff revisado). Anotar dos cosas: dónde el flujo sobró, y qué le tuvieron que explicar al agente más de una vez. Lo segundo es exactamente el material de la Sesión 3 (Diego): AGENTS.md, skills, MCP, y por qué el harness restringía las herramientas en plan mode. Subagentes en serio es la Sesión 4 (Agus). -->
