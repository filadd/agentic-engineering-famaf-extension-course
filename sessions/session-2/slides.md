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

Sesión de 2 horas: 15 recap, 5 setup, 45 teoría (con demo de 20), 5 pausa, 40 práctica, 10 cierre.
Dicta: Agus.
Herramienta: Pi + las extensiones de Plannotator y pi-subagents. NO se instala un segundo harness.
-->

# Sesión 2
## Planificar y Revisar

**De Vibe Coding a Agentic Engineering** — FaMAF
Agustín Carrasco

<!-- Slide de portada. Saludar, recordar quién soy (me presenté la semana pasada). Anclar dónde estamos: sesión 2 de 6, mismo proyecto. Hoy son 2 h, no 3. -->

---

## Hoy

<!-- Agenda en una slide: arrancamos charlando de cómo les fue en la semana, instalamos dos extensiones, ~45 min de teoría con una demo larga en el medio, y 40 min de práctica. Avisar que el diff review del final NO se saltea. -->

---

# Parte 0 — ¿Cómo les fue?

<!-- Sección de recap. ~15 min. Es discusión, no slides: las 4 que siguen son disparadores, no contenido. Sincronizar con Diego ANTES de la clase: qué recolectó él en sus 12 min al final de la Sesión 1, para no repetir. Si la demo después sale fluida, devolverle minutos a este bloque. -->

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

<!-- La frase que hace la transición: "hoy no vamos a escribir menos código, vamos a saber qué código escribimos". Objetivo de la sesión en una línea: salir sabiendo externalizar un plan y revisar un diff antes de aceptar. Mostrar el flujo del día: contexto → plan → anotar → test → ejecutar → revisar. -->

---

## Antes de arrancar: dos extensiones

<!-- 5 min, todos juntos, ANTES de la teoría. `pi install npm:@plannotator/pi-extension` y `pi install npm:pi-subagents`. Es el único setup del día y está en el camino crítico de la práctica: si alguien se traba, hay una hora de teoría por delante para destrabarlo. Se pidió como pre-work, pero no asumir que lo hicieron. -->

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

# Parte 2 — `AGENTS.md`

<!-- Sección. ~5 min. Segundo cimiento. Conecta directo con lo que trajeron del recap. -->

---

## Le explicaste lo mismo toda la semana

<!-- Arrancar por el síntoma que ya nombraron ellos en el recap: cada conversación nueva arranca de cero. El stack, cómo se corre, dónde va cada cosa, qué no tocar. Conectar con la ventana de contexto que Diego explicó la Sesión 1: el contexto NO persiste entre conversaciones. -->

---

## `AGENTS.md`: el contexto que no querés repetir

<!-- Un archivo en la raíz del repo que el agente lee al arrancar. Qué poner: stack y versiones, cómo se levanta, cómo se corren los tests, dos o tres convenciones, qué no tocar. Diez líneas alcanzan para que se note la diferencia. Mostrar uno real, corto. -->

---

## Es un estándar, no una cosa de Pi

<!-- El mismo archivo lo levantan otros agentes. No es lock-in. Mención de una línea. -->

---

## Y hace que el plan salga mejor

<!-- El puente al bloque que sigue: un plan escrito por un agente que ya sabe cómo es el proyecto arranca mucho más cerca de lo que querías. AGENTS.md no es un tema suelto — es lo que hace que el paso siguiente funcione. Decir explícitamente que hoy vemos la versión de diez líneas y que la Sesión 3 (Diego) lo abre en serio: orden de carga, rules files, skills. -->

---

# Parte 3 — Planificar y revisar

<!-- Sección. ~30 min, con la demo de 20 adentro. Se dicta como UNA sola cosa: el plan que aprobás es la especificación contra la que revisás el diff. -->

---

## El plan siempre existe

<!-- La idea central: cuando le tirás un prompt en frío, el agente planifica igual — en silencio, adentro de su contexto, y vos te enterás de lo que decidió mirando el destrozo. El plan siempre existe. La única pregunta es si lo podés leer. -->

---

## Externalizar: qué te compra

<!-- Un plan que es un archivo se puede leer, anotar, versionar, commitear, pasarle a un compañero, leer dentro de un año. Cuesta unos minutos. -->

---

## Pi no tiene plan mode — y eso nos sirve

<!-- Pi es un harness mínimo, no trae plan mode; se lo agregamos con la extensión. Consecuencia: el plan es un archivo desde el minuto cero, no existe la versión donde vive solo en la cabeza del agente. Aside de UNA línea: hay harnesses que lo traen incorporado y otros que lo resuelven con extensiones — ese es el espacio de diseño de los harnesses, y es la Sesión 3. Decirlo y seguir. -->

---

## El harness te obliga

<!-- La slide que Pi nos regala. En plan mode el toolset cambia: solo lectura y búsqueda (grep, find, ls), no puede escribir nada que no sea el archivo del plan, comandos destructivos bloqueados. Mostrar el indicador `⏸ plan`. No es decoración: aunque quieras, no podés saltear la planificación. La disciplina la impone la herramienta. (Semilla para la Sesión 3: permisos y extension points.) -->

---

## El espectro de superficies de revisión

<!-- Antes de la demo, dar el mapa de la parte de revisión: no hay una manera correcta, hay varias superficies, y cuál usás depende del tamaño del cambio y de cuánto confiás en él. Listar las cinco: mirar mientras escribe, leer en el editor, diff tools (git diff / hunk), /plannotator-review, delegarlo a un subagente. Rápido — se ven en vivo en la demo. -->

---

## Demo: el loop completo

<!-- ~20 min sobre el proyecto del instructor. UN solo recorrido de punta a punta, narrado en voz alta. Los pasos están detallados en INSTRUCTOR.md. Esta es la slide donde se apaga el proyector de slides y se prende la terminal. -->

---

## Demo — 1. Entrar en plan mode

<!-- Señalar el `⏸ plan` y el toolset restringido. "El harness me está obligando. Aunque quisiera, no puedo saltear esto." -->

---

## Demo — 2. El agente escribe el plan

<!-- Describir una feature, dejarlo explorar y escribir el checklist. Mientras corre, narrar: el plan es un archivo en disco, en una ruta que elegiste vos. -->

---

## Demo — 3. Rechazá el primer plan

<!-- EL beat de la sesión. NO aprobar en la primera pasada aunque el plan esté bien. Anotar un paso vago, una decisión que dos personas implementarían distinto, un paso que falta. "Deny with annotations". Tener a mano un plan malo pre-escrito por si el agente escribe uno demasiado prolijo. -->

---

## Demo — 4. Plan Diff: ¿te entendió?

<!-- Al reenviar, Plannotator marca qué cambió respecto de la versión anterior. Ahí se ve si procesó las anotaciones o si contestó cualquier cosa. -->

---

## Demo — 5. Delegar el review del plan

<!-- ~2 min. Con pi-subagents, un agente cuyo único trabajo es leer el plan y reportar dónde está flojo, qué falta, qué dos personas implementarían distinto. Mención corta: la profundidad de subagentes es la Sesión 3 (Diego). -->

---

## Demo — 6. Aprobar y ejecutar

<!-- Recupera todas las herramientas y arranca. Mientras avanza, frenarlo UNA vez a propósito para mostrar en vivo el "mirar mientras escribe". -->

---

## Demo — 7. `/plannotator-review` sobre el diff

<!-- Abre los cambios del working tree en la UI de review. Anotar una línea concreta y mandarla de vuelta al agente. Cierra el loop sobre la misma feature: el plan que aprobamos hace 15 minutos es contra lo que estamos revisando ahora. -->

---

## Demo — 8. Sidebar de seguridad

<!-- 30 segundos, adentro de la revisión del diff. Apuntar UN smell concreto (input sin validar, secret expuesto, falta de auth). No dar clase de OWASP. El punto es que lo noten MIENTRAS revisan. Si en el reality check de la Sesión 1 salió un ejemplo real de la sala, reusarlo. -->

---

## La pregunta que solo podés hacer si escribiste el plan

<!-- Cerrar la demo con el through-line: "¿esto coincide con el plan que aprobaste?". Es la pregunta más útil de la revisión y solo existe porque el plan está escrito. El plan aprobado es la especificación contra la que revisás el diff. -->

---

## ¿Y la descomposición de tareas?

<!-- No es un tema aparte: el plan ya salió descompuesto en un checklist. Apuntar al plan de la demo y decir "esto es descomposición". Recorrerlo estilo "entrypoint": arrancar por el archivo principal que toca y ramificar. La descomposición es leer el flujo, no aplicar una rúbrica. -->

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

# Hands-on (40 min)

<!-- Transición al bloque práctico. -->

---

## Las reglas de hoy

<!-- Se dan vuelta respecto de la semana pasada. 1) Nada se ejecuta sin plan escrito. 2) Rechazá el primer plan, aunque te parezca bien. 3) No aceptes ningún cambio sin leer el diff. 4) Si algo se rompe, leelo vos primero. Avisar que la 2 da ganas de saltearla y es la que más importa. -->

---

## Los pasos

<!-- Ver exercise/README.md, no leerlos desde la slide. Los 7: elegir feature, AGENTS.md de diez líneas, entrar en plan mode, planificar y rechazar, test primero, ejecutar, revisar el diff. Insistir en dos cosas: si la feature toca más de 4-5 archivos no llegan, y el AGENTS.md son DIEZ LÍNEAS, no un documento. -->

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

<!-- Tarea: seguir con este flujo. Anotar dos cosas: dónde el flujo sobró (cambios donde planificar es puro trámite), y qué le siguieron explicando al agente aunque estuviera en el AGENTS.md. Lo segundo es exactamente el material de la Sesión 3. -->

---

## Próxima sesión: Tooling & Skills (Diego)

<!-- Foreshadow: el AGENTS.md de diez líneas de hoy convertido en uno que de verdad cambia el comportamiento, los subagentes que usamos de a poco, MCP, skills propias, y por qué el harness restringía las herramientas en plan mode. -->

---

## Gracias

<!-- Cierre. Quedarse para dudas. -->
