# Sesión 2 — Planificar y Revisar (Notas para el instructor)

> A cargo: Agus. Estado: en armado. Todo el material de la sesión (estas notas, `slides.md`, `exercise/README.md`) está en español.

## Objetivo de la sesión (en una frase)

Que salgan sabiendo **externalizar un plan y revisar un diff antes de aceptar** — con la idea internalizada de "no aceptes lo que no externalizaste y no revisaste".

## Audiencia y supuestos

- **Esta sesión dura 2 horas.** La Sesión 1 duró 3; esa hora extra pagó las presentaciones y la instalación de Pi. Acá no hay hora de setup: proteger el bloque de práctica.
- Grupo heterogéneo — de primer año a graduados. Enseñar al medio, con puerta de entrada para los que arrancan y profundidad para los avanzados.
- **Base de git**: asumir lo básico (commit, push). Enseñar explícitamente a leer diffs con ojo crítico y a usar branches como red de seguridad.
- **Tests**: sin base previa. Plantearlo como "tests como guardrails", accesible para primer año.
- **Con qué llegan**: Pi instalado, un repo git, y un proyecto que corre en el navegador que vibecodearon sin leer una línea. **La mayoría no va a tener test runner** — ver la nota en el bloque de tests.
- **El estado con el que llegan es disparejo, y está previsto.** La tarea de la Sesión 1 era abierta ("seguí hasta que se te vaya de las manos"). Algunos van a traer una semana de trabajo y otros nada. El recap absorbe esa varianza y el ejercicio está escrito para que ambos puedan hacerlo.
- **Herramienta**: **Pi**, la misma que la Sesión 1, más dos extensiones que se instalan al principio de la clase.

## La decisión de herramientas

La Sesión 2 corre sobre **Pi**. No se instala un segundo harness.

Sobre Pi se agregan dos extensiones, al principio de la clase (ver "Setup" abajo):

- **`@plannotator/pi-extension`** — le agrega a Pi un plan mode basado en archivos: `pi --plan`, `/plannotator`, `Ctrl+Alt+P`, y `/plannotator-review` para revisar el diff del working tree.
- **`pi-subagents`** — delegación a subagentes, que hoy se usa dos veces como subtema (revisar el plan, revisar el diff).

**Pi no trae plan mode propio, así que la extensión *es* el plan mode — y el plan es un archivo desde el minuto cero.** No existe la versión del flujo de hoy donde el plan vive solamente en la cabeza del agente. La tesis de la sesión deja de ser una recomendación y pasa a ser el único camino disponible.

**El regalo que nos hace Pi.** La fase de planificación reconfigura el harness: cambia el toolset activo a `["grep", "find", "ls"]`, bloquea los comandos destructivos, y restringe la escritura al archivo del plan. Literalmente no podés ejecutar mientras planificás. Eso se merece una slide propia — *la disciplina la impone la herramienta* — y planta la semilla de permisos y extension points que Diego abre en la Sesión 3.

**Un comentario de una línea que vale decir en voz alta**: hay harnesses que traen plan mode incorporado y otros, como Pi, que lo resuelven con una extensión. Esa diferencia no es un accidente, es el espacio de diseño de los harnesses — y es la Sesión 3. Decirlo y seguir; no enseñarlo hoy.

## Plan tema por tema

### Recap y debrief (~15 min) — abre la sesión

**Este es el verdadero reality check del curso.** La versión que hizo Diego al final de la Sesión 1 duró apenas ~12 minutos — una primera pasada sobre 15 minutos de construcción, no un debrief. El material que importa lo generó la tarea: *seguí vibecodeando con las mismas reglas hasta que se te vaya de las manos, y anotá cuándo pasó.* A los estudiantes se les dijo que la Sesión 2 abría exactamente ahí. Abrir ahí.

**Coordinar con Diego antes de la clase** — con qué estado terminaron realmente la Sesión 1, cuántos se fueron con Pi andando, qué salió en sus 12 minutos de recolección. No volver a recolectar lo que él ya juntó.

Manejarlo como discusión, no como slides:

1. **"¿Se les fue de las manos? ¿Cuándo?"** El momento es lo que importa. Recolectar cuatro o cinco, anotarlos en el pizarrón. Esperables: el agente rompió algo que andaba, un fix que empeoró todo, tres intentos para el mismo bug, un archivo que no sabían que existía, el proyecto creció hasta que ya no podían decir qué hacía.
2. **"¿Alguien abrió el código durante la semana?"** Varios van a haber roto la regla de no leer. Esa es una *buena* respuesta — preguntar qué los hizo romperla. Esa necesidad de mirar es el instinto sobre el que está construida toda la sesión.
3. **Cobrar las predicciones.** Diego presentó METR (19% más lentos sintiéndose 20% más rápidos) y el problema del 80% como *predicciones a verificar contra la propia experiencia*, antes de la práctica y no después. Ahora preguntar: ¿les pasó? ¿El primer 80% llegó rápido y el resto costó más de lo que todo el asunto parecía que iba a costar? No discutir con quien diga que fue genuinamente más rápido — para un prototipo de una semana probablemente lo fue. Esa es la versión honesta del hallazgo y es lo que hace creíble el resto del curso.
4. **Nombrar comprehension debt de nuevo.** Diego plantó el término en la Sesión 1. Hoy recibe su mecanismo: el cuello de botella se movió de *escribir* código a *verificarlo*. Todo lo de esta sesión es una forma de pagar esa deuda.

Y ahí la transición: *"Hoy no vamos a escribir menos código. Vamos a saber qué código escribimos."*

### Setup: instalar las extensiones (~5 min)

Al principio, todos juntos, antes de cualquier teoría:

```
pi install npm:@plannotator/pi-extension
pi install npm:pi-subagents
```

Es el único setup del día y está en el camino crítico de la práctica. Hacerlo acá y no al empezar el ejercicio: si alguien se traba, hay una hora de teoría por delante para destrabarlo sin perder tiempo de construcción. Pedirlo también como pre-work, pero **no asumir que lo hicieron**.

### Git con AI (~5 min) — abre el bloque de teoría

Primero los cimientos: antes de recorrer el flujo de planificar y revisar, poner la red de seguridad. Plantearlo como un **espectro atado al contexto**, no como un workflow rígido:

- **Solo, en tu propio repo**: trabajar sobre `main` está bien.
- **En equipo**: branches por feature.
- **Trabajo en paralelo**: worktrees.

Principio clave: la AI no cambia git; solo hace que "tirar la branch" salga más barato. **El diff revisado es la puerta antes del merge** — enseñar explícitamente a leer diffs con ojo crítico (¿coincide con el plan? ¿hay código sin usar? ¿hay smells de seguridad?).

Ponerlo primero fija la expectativa: "todo lo que viene asume que tenés cómo volver atrás". Hoy importa más que de costumbre, porque en la práctica van a ejecutar un plan escrito por un agente paso por paso — necesitan saber que lo pueden tirar entero.

### `AGENTS.md`: el contexto que no querés repetir (~5 min)

Segundo cimiento, y la respuesta a algo que van a traer del recap: durante la semana le explicaron lo mismo al agente una y otra vez. El stack del proyecto, cómo se corre, dónde va cada cosa, qué no tocar. Cada conversación nueva arranca de cero, porque **el contexto no persiste entre conversaciones** (Diego lo planteó como propiedad de la ventana de contexto en la Sesión 1; acá aparece la primera herramienta para hacer algo al respecto).

`AGENTS.md` es un archivo en la raíz del repo que el agente lee al arrancar. Es el lugar donde vive lo que no querés volver a escribir.

Qué mostrar, sin profundizar:

- **Qué poner**: stack y versiones, cómo se levanta el proyecto, cómo se corren los tests, convenciones que te importan, y lo que está prohibido tocar. Diez líneas alcanzan para que se note.
- **Que es un estándar, no una cosa de Pi.** El mismo archivo lo levantan otros harnesses. No es lock-in.
- **La conexión con el resto del día**: un plan escrito por un agente que ya sabe cómo es el proyecto arranca mucho más cerca de lo que querías. `AGENTS.md` no es un tema suelto — es lo que hace que el paso siguiente funcione mejor.

**Dónde parar.** Hoy es primer contacto: qué es, dónde va, qué poner adentro. **La Sesión 3 (Diego) lo abre en serio** — orden de carga entre directorios, rules files, cómo se relaciona con skills y slash commands. Decir explícitamente que hoy vemos la versión de diez líneas. **Coordinar con Diego**: su sesión ahora profundiza algo que ya existe en los proyectos, en lugar de introducirlo desde cero.

### Planificar y revisar (~30 min, con demo de 20)

El bloque central. Se dicta como **una sola cosa**, porque en la práctica es un solo loop: el plan que aprobás es la especificación contra la que después revisás el diff.

**El encuadre (~5 min antes de la demo):**

**El plan siempre existe. La única pregunta es si lo podés leer.** Cuando le tirás un prompt en frío, el agente planifica igual — en silencio, adentro de su contexto, y vos te enterás de lo que decidió mirando el destrozo. Externalizarlo cuesta unos minutos y te deja un plan que se puede leer, anotar, versionar, commitear y pasarle a otro.

Del lado de la revisión, presentar el **espectro de superficies** — no una checklist. Cuál usás depende del tamaño del cambio y de cuánto confiás en él:

1. **Mirar mientras escribe**: la revisión pasa *durante* la generación. Frenar al agente en medio del stream y redirigirlo. La más barata; agarra temprano la dirección equivocada, se le escapa el detalle.
2. **Leer en el editor**: abrir los archivos modificados. La más directa; no escala más allá de unos pocos archivos.
3. **Diff tools**: `git diff`, o [hunk](https://github.com/anthropics/hunk) para ir hunk por hunk. Cuando el cambio es grande, el diff te da la forma.
4. **`/plannotator-review`**: abre los cambios del working tree en la UI de review. Anotás líneas concretas y el feedback vuelve directo al agente. Sirve cuando querés que la revisión *se convierta en la próxima instrucción*, no solo aceptar o rechazar.
5. **Delegarlo a un subagente**: que un agente lea el plan (o el diff) y reporte qué está flojo, qué falta, dónde se desvió. Aparece dos veces hoy — una de cada lado del loop.

**La demo (~20 min), sobre el proyecto del instructor.** Es el corazón de la sesión: un solo recorrido completo, narrado en voz alta, de punta a punta.

1. **Entrar en plan mode.** Señalar el indicador `⏸ plan` y qué le pasó al toolset — solo lectura y búsqueda, sin escritura fuera del archivo del plan, comandos destructivos bloqueados. "El harness me está obligando. Aunque quisiera, no puedo saltear esto."
2. **Describir una feature.** Dejarlo explorar el proyecto y escribir el plan como checklist. Mientras corre, narrar: el plan es un archivo en disco, en una ruta que elegiste vos.
3. **Rechazar el plan con anotaciones.** *Este es el beat que importa.* No aprobar en la primera pasada aunque el plan esté bien. Anotar un paso vago, una decisión que dos personas implementarían distinto, un paso que falta. Mandarlo de vuelta.
4. **Mostrar el Plan Diff** en el reenvío — qué cambió respecto de la versión anterior. Ahí se ve si procesó las anotaciones o si contestó cualquier cosa.
5. **Delegar la revisión del plan a un subagente** (~2 min). Que lo lea y reporte huecos. Mención corta: la profundidad de subagentes es la Sesión 3.
6. **Aprobar y dejarlo ejecutar.** Recupera todas las herramientas. Mientras avanza, frenarlo una vez a propósito para mostrar el "mirar mientras escribe".
7. **`/plannotator-review` sobre el diff que produjo.** Anotar una línea concreta y mandarla de vuelta. Cierra el loop sobre la misma feature.
8. **Sidebar de seguridad (~30 seg)**, acá adentro: apuntar un smell concreto del diff (input sin validar, secret expuesto, falta de auth). No dar clase de OWASP. El punto es que lo noten *mientras revisan*. Si en el reality check de la Sesión 1 apareció un ejemplo real de la sala, reusarlo.

**La frase que hay que decir explícitamente**: *"¿esto coincide con el plan que aprobaste?"* es la pregunta más útil de la revisión, y solo la podés hacer porque el plan está escrito.

**Sobre la descomposición**: no es un tema aparte. El plan ya salió descompuesto en un checklist. Apuntar a la estructura del plan y decir "esto es descomposición", recorriéndolo estilo *entrypoint* (arrancar por el archivo principal que toca y ramificar). Es leer el flujo, no aplicar una rúbrica.

### Tests como guardrails (~5 min)

Agnóstico de framework. Posición: **"el test es la especificación que el agente no puede falsear".** Si le pedís el comportamiento X y el agente escribe el código *y* el test que dice que X anda, te puede engañar: afloja el assert hasta que pase. Si el assert lo escribiste vos antes, tiene que cumplirlo.

Saltear la disciplina estricta de TDD. La ganancia es "existe un test y lo escribiste vos antes de la implementación", no el ciclo red → green → refactor.

> **Una realidad que hay que decir en voz alta**: casi nadie va a tener test runner. Vibecodearon una semana sin leer nada. Que esto no se coma la práctica — **delegarle el setup del runner al agente está bien y es correcto**, es mecánico. Lo que el estudiante no puede delegar es el assert. Decirlo así: *"que te lo instale el agente; el `expect` lo escribís vos"*.

### Debuggear código generado

**Sin bloque de teoría.** Se cubre orgánicamente en la práctica, cuando algo se rompe. El instructor y los profes de práctico caminan la sala. La lección es "leé el código vos antes de pedirle al agente que lo arregle" — y hoy, a diferencia de la semana pasada, tienen permitido leerlo.

## Práctica (~40 min)

Siete pasos en `exercise/README.md`. Caminar la sala. Lo que hay que hacer cumplir es **el paso 4: que rechacen el plan al menos una vez.** Van a aprobar el primer plan por cortesía con la máquina, y eso saltea toda la lección.

Otras cosas para vigilar:

- **El scope de la feature.** Quien elija algo que toca 5 archivos o más no termina. Recortarlos temprano, en los primeros cinco minutos.
- **El `AGENTS.md` de diez líneas.** Algunos se van a poner a escribir un documento. Cortarlos: diez líneas, y a planificar.
- Quien saltee el test "porque es más rápido". Es cierto y ese es el punto — preguntarle al final si habría agarrado el bug sin él.

## Timing de la sesión (~2 h)

| Bloque | Tiempo |
|---|---|
| Recap y debrief de la Sesión 1 | 15 min |
| Setup: instalar las dos extensiones | 5 min |
| Teoría: git con AI | 5 min |
| Teoría: `AGENTS.md` | 5 min |
| **Teoría: planificar y revisar (incluye demo de 20 min)** | **30 min** |
| Teoría: tests como guardrails | 5 min |
| Pausa | 5 min |
| **Práctica** | **40 min** |
| Cierre: discusión + qué viene | 10 min |

Da 120 justos, así que no hay colchón. **Si se estira, recortar del recap** — es el bloque más elástico. No recortar de la práctica, y nunca del review del diff que la cierra, que es donde aterriza la sesión. Si la demo sale fluida y sobran minutos, devolvérselos al recap.

## Puentes entre sesiones

- **Desde la Sesión 1**: el debrief de la tarea es el bloque que abre esta sesión. **Coordinar con Diego antes de la clase.** Comprehension debt y las predicciones de METR / el 80% se plantaron allá a propósito para cobrarlas acá.
- **`AGENTS.md`** → Sesión 3 (Diego). Hoy es primer contacto, diez líneas. Allá se abre en serio. **Este puente cambió**: la Sesión 3 ahora profundiza algo que ya existe en los proyectos de los estudiantes, en vez de introducirlo desde cero. Confirmarlo con Diego.
- **El harness restringe el toolset durante la planificación** → Sesión 3 (Diego). Hoy es algo que *notan*; allá se convierte en permisos y extension points. Plantarlo, no explicarlo.
- **Subagentes** → Sesión 3 (Diego). Hoy aparecen dos veces como subtema (revisar el plan, revisar el diff), instalados pero usados de a poco, para que lleguen con "esto se puede delegar" ya visto. **Coordinar con Diego**: la sesión de hoy fija `pi-subagents` como el paquete del curso.
- **El plan como contexto para la AI** → Sesión 4 (Agus). El plan que externalizamos hoy es la especificación que trabajamos allá. Anticiparlo en el cierre.

## Herramientas y recursos referenciados

- [Pi](https://pi.dev/docs/latest/quickstart) — el harness del curso. Ya instalado en la Sesión 1.
- [`@plannotator/pi-extension`](https://www.npmjs.com/package/@plannotator/pi-extension) — `pi install npm:@plannotator/pi-extension`. Aporta `pi --plan`, `/plannotator`, `Ctrl+Alt+P`, `/plannotator-review`, `/plannotator-annotate`. [Fuente](https://github.com/backnotprop/plannotator).
- [`pi-subagents`](https://www.npmjs.com/package/pi-subagents) — `pi install npm:pi-subagents`. Delegación a subagentes. [Fuente](https://github.com/nicobailon/pi-subagents).
- [hunk](https://github.com/anthropics/hunk) — revisión interactiva hunk por hunk.

## Lo que dejamos afuera a propósito

- **Cosas de LIDR** (Decision Closure Rule, tiers de verificación): demasiado sabor corporativo para esta audiencia.
- **Checklist de code review**: reemplazada por el "espectro de superficies de revisión" — estrategias, no rúbrica.
- **Bloque dedicado a debugging**: se cubre orgánicamente en la práctica.
- **Un segundo harness**: se evaluó y se descartó. Una herramienta, un proyecto, seis sesiones.
- **Las capas de configuración de Plannotator** (`plannotator.json`, modelos por fase, `executionMode`): existen y son irrelevantes para un primer contacto. Saltear salvo que alguien pregunte.
- **`AGENTS.md` en profundidad** (orden de carga, rules files): es de la Sesión 3. Hoy, diez líneas y seguimos.

## Pendientes (para próximas iteraciones)

- **Pre-work**: pedir que instalen las dos extensiones antes de la clase. Igual reservamos 5 minutos al principio, porque no todos lo van a hacer.
- **Probar las dos instalaciones en una máquina limpia**, incluyendo si la UI de Plannotator abre bien en el navegador con 20-30 personas en la red del aula. La misma disciplina que aplicó Diego con la instalación de Pi.
- **Elegir el proyecto para la demo** — tiene que tener suficiente forma como para que un plan no sea trivial, y ser seguro de mostrar en el proyector. Con 20 minutos de demo, esto pasó de ser un detalle a ser la decisión más importante de la preparación.
- **Tener un plan malo escrito de antemano.** La demo depende de que el agente produzca un plan que valga la pena anotar. Si escribe uno prolijo, el beat de "rechazar con anotaciones" se cae — abrir el plan malo en su lugar.
- **Ensayar la demo entera con reloj.** 20 minutos de demo en vivo con dos herramientas y un navegador de por medio es lo más frágil de la sesión.
- **Confirmar con Diego** con qué estado terminaron realmente la Sesión 1, y qué recolectó en sus 12 minutos de reality check.
- **Confirmar con Diego el traspaso de `AGENTS.md`**: hoy es primer contacto, su sesión profundiza.
