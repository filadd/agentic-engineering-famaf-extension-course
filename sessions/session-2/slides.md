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

Sesión de 2 horas: ~20 min de recap, ~35 min de teoría, 50 min de práctica, 10 de cierre.
Dicta: Agus.
Herramienta: Pi + la extensión de Plannotator. NO se instala un segundo harness.
-->

# Sesión 2
## Planificar y Revisar

**De Vibe Coding a Agentic Engineering** — FaMAF
Agustín Carrasco

<!-- Slide de portada. Saludar, recordar quién soy (me presenté la semana pasada). Anclar dónde estamos: sesión 2 de 6, mismo proyecto. Hoy son 2 h, no 3. -->

---

## Hoy

<!-- Agenda en una slide: arrancamos charlando de cómo les fue en la semana, después ~35 min de teoría, y 50 min de práctica. Avisar que hoy la práctica es más corta que la teoría sugiere y que el diff review del final NO se saltea. -->

---

# Parte 0 — ¿Cómo les fue?

<!-- Sección de recap. ~20 min. Es discusión, no slides: las 4 que siguen son disparadores, no contenido. Sincronizar con Diego ANTES de la clase: qué recolectó él en sus 12 min al final de la Sesión 1, para no repetir. -->

---

## ¿Se les fue de las manos? ¿Cuándo?

<!-- El disparador principal. La tarea de la semana era seguir vibecodeando sin abrir archivos hasta perder el control, y anotar el momento. Recolectar 4-5 momentos concretos, anotarlos en el pizarrón. Esperables: rompió algo que andaba, el fix empeoró todo, tres intentos para el mismo bug, un archivo que no sabían que existía, el proyecto creció y ya no saben qué hace. -->

---

## ¿Alguien abrió el código?

<!-- Varios rompieron la regla. Es una BUENA respuesta: preguntar qué los hizo abrirlo. Esa necesidad de mirar es el instinto sobre el que está construida toda la sesión de hoy. -->

---

## Las predicciones de la semana pasada

<!-- Diego presentó METR (19% más lentos sintiéndose 20% más rápidos) y el problema del 80% como predicciones a verificar, no como sermón. Cobrarlas ahora: ¿les pasó? ¿El primer 80% llegó rápido y el resto costó más de lo que parecía? NO discutir con quien diga que fue genuinamente más rápido — en un prototipo de una semana probablemente lo fue. Esa honestidad es lo que hace creíble el resto del curso. -->

---

## El cuello de botella se movió

<!-- Nombrar de nuevo comprehension debt (Diego lo plantó la semana pasada) y darle el mecanismo: el cuello de botella dejó de ser ESCRIBIR código y pasó a ser VERIFICARLO. Todo lo de hoy es una forma de pagar esa deuda. -->

---

## Hoy no vamos a escribir menos código

<!-- La frase que hace la transición: "hoy no vamos a escribir menos código, vamos a saber qué código escribimos". Objetivo de la sesión en una línea: salir sabiendo externalizar un plan y revisar un diff antes de aceptar. Mostrar el flujo del día: plan → anotar → test → ejecutar → revisar. -->

---

# Parte 1 — Git con AI

<!-- Sección. ~5 min. Arrancamos con la red de seguridad: todo lo que sigue asume que podés deshacer. -->

---

## La red de seguridad va primero

<!-- Por qué Git abre el bloque: hoy van a ejecutar un plan escrito por un agente, paso por paso. Necesitan saber que pueden tirarlo todo. Sin esa base, el resto no se siente seguro. -->

---

## Spectrum de workflows

<!-- No es un workflow rígido, es un espectro atado al contexto. Repo individual: main está bien. Equipo: branches por feature. Trabajo paralelo: worktrees. AI no cambia git; solo hace que "tirar la branch" sea más barato. -->

---

## El diff review es la puerta antes del merge

<!-- Cualquiera sea tu workflow, el diff revisado es la garantía. No hay rama protegida que reemplace tu lectura. Leer críticamente: ¿coincide con el plan? ¿hay código sin usar? ¿hay smells de seguridad? -->

---

# Parte 2 — Planificar

<!-- Sección. ~15 min contando la demo. -->

---

## El plan siempre existe

<!-- La idea central del bloque: cuando le tirás un prompt en frío, el agente planifica igual — en silencio, adentro de su contexto, y vos te enterás de lo que decidió mirando el destrozo. El plan siempre existe. La única pregunta es si lo podés leer. -->

---

## Externalizar: qué te compra

<!-- Un plan que es un archivo se puede leer, anotar, versionar, commitear, pasarle a un compañero, leer dentro de un año. Cuesta unos minutos. -->

---

## Pi no tiene plan mode

<!-- Decirlo derecho: Pi es un harness mínimo, no trae plan mode. Se lo agregamos con una extensión: `pi install npm:@plannotator/pi-extension`. Y entonces: `pi --plan`, o `/plannotator`, o Ctrl+Alt+P. -->

---

## Y entonces el plan es un archivo desde el minuto cero

<!-- El punto que en otro harness habría que argumentar, acá viene gratis: no existe la versión donde el plan vive solo en la cabeza del agente. Aside de UNA línea: Claude Code lo trae built-in, Pi lo resuelve con una extensión — esa diferencia es el espacio de diseño de los harnesses, y es la Sesión 3. Decirlo y seguir. -->

---

## El harness te obliga

<!-- La slide que Pi nos regala. En plan mode el toolset cambia: solo lectura y búsqueda (grep, find, ls), no puede escribir nada que no sea el archivo del plan, comandos destructivos bloqueados. Mostrar el indicador `⏸ plan`. No es decoración: aunque quieras, no podés saltear la planificación. La disciplina la impone la herramienta. (Semilla para la Sesión 3: permisos y extension points.) -->

---

## Demo: planificar en vivo

<!-- ~7 min sobre el proyecto del instructor. Entrar en plan mode, señalar el toolset restringido, describir una feature, dejarlo explorar y escribir el checklist. Cuando llama a plannotator_submit_plan se abre el navegador. Narrar mientras corre: el plan es un archivo en disco, en una ruta que elegiste vos. -->

---

## Rechazá el primer plan

<!-- EL beat de la sesión. En la demo, NO aprobar en la primera pasada aunque el plan esté bien. Anotar un paso vago, una decisión que dos personas implementarían distinto, un paso que falta. "Deny with annotations". Tener a mano un plan malo pre-escrito por si el agente escribe uno demasiado prolijo. -->

---

## Plan Diff: ¿te entendió?

<!-- Al reenviar, Plannotator marca qué cambió respecto de la versión anterior. Ahí se ve si procesó las anotaciones o si te contestó cualquier cosa. Mostrarlo. Recién después, aprobar: el agente recupera todas sus herramientas y ejecuta. -->

---

## También podés delegar el review del plan

<!-- ~1 min. Podés tener un agente cuyo único trabajo es leer el plan y reportar dónde está flojo, qué falta, qué dos personas implementarían distinto. En Pi es un paquete (pi-subagents), no viene built-in. Mencionar, NO instalar: la profundidad de subagentes es la Sesión 3 (Diego). -->

---

## ¿Y la descomposición de tareas?

<!-- No es un tema aparte: el plan ya salió descompuesto en un checklist. Apuntar al plan de la demo y decir "esto es descomposición". Recorrerlo estilo "entrypoint": arrancar por el archivo principal que toca y ramificar. La descomposición es leer el flujo, no aplicar una rúbrica. -->

---

# Parte 3 — Revisar

<!-- Sección. ~10 min contando la demo. -->

---

## El espectro de superficies de revisión

<!-- No hay una manera correcta de revisar, hay varias superficies. Cuál usás depende del tamaño del cambio y de cuánto confiás en él. Las 5 que siguen, rápido. -->

---

## Estrategia 1: Mirar mientras escribe

<!-- Watch + steer. Frenar al agente en medio del stream cuando ves que va por mal camino. La más barata, agarra la dirección equivocada temprano, se le escapa el detalle. -->

---

## Estrategia 2: Leer en el editor

<!-- Abrir los archivos modificados en el IDE. La más directa; no escala más allá de unos pocos archivos. -->

---

## Estrategia 3: Diff tools

<!-- git diff, y hunk para revisión interactiva hunk por hunk. Cuando el cambio es grande, el diff te da la forma. -->

---

## Estrategia 4: `/plannotator-review`

<!-- Abre los cambios del working tree en la UI de review. Anotás líneas concretas y el feedback vuelve directo al agente. Sirve cuando querés que la revisión SE CONVIERTA en la próxima instrucción, no solo aceptar o rechazar. Demo acá, sobre el diff que produjo el plan de la Parte 2 — cierra el loop. -->

---

## Estrategia 5: Delegar el code review a un subagente

<!-- ~1 min. Igual que con el plan, podés delegar la lectura del diff. Reporta issues, smells, divergencias respecto del plan. Segunda vez que aparece "esto se puede delegar" — profundidad en la Sesión 3. -->

---

## Sidebar de seguridad

<!-- 30 segundos, adentro de la demo de review. Apuntar UN smell concreto en el diff (input sin validar, secret expuesto, falta de auth). No dar clase de OWASP. El punto es que lo noten MIENTRAS revisan. Si en el reality check de la Sesión 1 salió un ejemplo real de la sala, reusarlo. -->

---

## La pregunta que solo podés hacer si escribiste el plan

<!-- El through-line del día: "¿esto coincide con el plan que aprobaste?". Es la pregunta más útil de la revisión y solo existe porque el plan está escrito. El plan aprobado es la especificación contra la que revisás el diff. -->

---

## Bonus: Annai (en construcción)

<!-- Mencionar Annai (案内, "guía") como alternativa con un modelo distinto: interactividad mid-session, submission a GitHub. Contraste con el modelo bloqueante de plannotator. Mostrar que el espacio de herramientas está vivo y que se puede construir en él. -->

---

# Parte 4 — Tests como guardrails

<!-- Sección breve. ~5 min. -->

---

## El test es el contrato que el agente no puede falsear

<!-- Si el agente escribe el código Y el test, te puede engañar: afloja el assert hasta que pase. Si el assert lo escribiste vos antes, tiene que cumplirlo. Framework-agnostic. -->

---

## El runner delegalo; el assert no

<!-- Casi nadie va a tener test runner — vibecodearon una semana sin leer nada. Que se lo instale el agente, es mecánico. Lo que NO se delega es el assert. Decirlo así: "que te lo instale el agente; el expect lo escribís vos". -->

---

## No es TDD estricto

<!-- No vamos a hacer red → green → refactor disciplinado. Solo: existe un test y lo escribiste vos antes de la implementación. El resto es bonus. -->

---

# Hands-on (50 min)

<!-- Transición al bloque práctico. -->

---

## Las reglas de hoy

<!-- Se dan vuelta respecto de la semana pasada. 1) Nada se ejecuta sin plan escrito. 2) Rechazá el primer plan, aunque te parezca bien. 3) No aceptes ningún cambio sin leer el diff. 4) Si algo se rompe, leelo vos primero. Avisar que la 2 da ganas de saltearla y es la que más importa. -->

---

## Los pasos

<!-- Ver exercise/README.md, no leerlos desde la slide. Los 6: elegir feature, entrar en plan mode, planificar y rechazar, test primero, ejecutar, revisar el diff. Insistir en el scope: si toca más de 4-5 archivos, no llegan. -->

---

## Lo que vas a sentir

<!-- Aviso honesto: va a sentirse más lento que la Sesión 1. Esa es la lección, no un efecto secundario. La fricción es el aprendizaje. Al final vamos a comparar. -->

---

# Cierre

<!-- Sección final. ~10 min. -->

---

## ¿Qué cambió respecto de la Sesión 1?

<!-- Pregunta abierta. Que hablen. Buscar específicamente: ¿el plan anotado les mostró algo que se les había escapado? ¿el test que escribieron primero se cumplió, o lo terminaron cambiando para que pase? ¿encontraron en el diff algo que de otra forma se les habría escapado? -->

---

## ¿Cuánto costó? ¿Valió la pena?

<!-- La pregunta honesta. Para una feature chica, el overhead es real y puede no haber valido la pena. Dejar que lo digan. La respuesta interesante no es "siempre vale", es "depende de cuánto te importe poder explicar el código después". -->

---

## Para la semana

<!-- Tarea: seguir con este flujo. Anotar dos cosas: dónde el flujo sobró (cambios donde planificar es puro trámite), y qué le tuvieron que explicar al agente más de una vez. Lo segundo es exactamente el material de la Sesión 3. -->

---

## Próxima sesión: Tooling & Skills (Diego)

<!-- Foreshadow: el subagente que mencioné dos veces hoy, cómo se le escribe documentación al agente para no repetirle lo mismo, MCP, skills propias, y por qué el harness restringía las herramientas en plan mode. OJO: NO prometer AGENTS.md como algo que ya escribieron — ese paso se sacó de la Sesión 1, lo introduce Diego desde cero. -->

---

## Gracias

<!-- Cierre. Quedarse para dudas. -->
