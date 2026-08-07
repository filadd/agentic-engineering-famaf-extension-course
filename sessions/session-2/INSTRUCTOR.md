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

### Recap y debrief (~12 min) — abre la sesión

La versión que hizo Diego al final de la Sesión 1 duró apenas ~12 minutos — una primera pasada sobre 15 minutos de construcción, no un debrief. El material que importa lo generó la tarea: *seguí vibecodeando con las mismas reglas hasta que se te vaya de las manos, y anotá cuándo pasó.* A los estudiantes se les dijo que la Sesión 2 abría exactamente ahí. Abrir ahí.

**Coordinar con Diego antes de la clase** — con qué estado terminaron realmente la Sesión 1, cuántos se fueron con Pi andando, qué salió en sus 12 minutos de recolección. No volver a recolectar lo que él ya juntó.

Manejarlo como discusión, no como slides. Dos disparadores:

1. **"¿Se les fue de las manos? ¿Cuándo?"** El momento es lo que importa. Recolectar cuatro o cinco, anotarlos en el pizarrón. Esperables: el agente rompió algo que andaba, un fix que empeoró todo, tres intentos para el mismo bug, un archivo que no sabían que existía, el proyecto creció hasta que ya no podían decir qué hacía.
2. **"¿Alguien abrió el código durante la semana?"** Varios van a haber roto la regla de no leer. Esa es una *buena* respuesta — preguntar qué los hizo romperla. Esa necesidad de mirar es el instinto sobre el que está construida toda la sesión.

Lo que se junta en el pizarrón es la materia prima del bloque siguiente. No cerrarlo con una conclusión: la conclusión la damos nosotros en la intro.

### Qué vamos a ver hoy (~8 min)

El bloque que le da forma al día. Toma lo que acaba de salir en el pizarrón y lo ordena.

**Primero: por qué pasó lo que pasó.** No como reto, como diagnóstico. Los tres problemas, nombrados:

- **No sabés qué shippeaste.** Es comprehension debt, el término que Diego les dejó la semana pasada. El código existe, anda, y no lo podés explicar. Los intereses se acumulan: cada feature nueva se apoya en algo que no entendés.
- **El cuello de botella se movió.** Escribir código dejó de ser lo caro. Ahora lo caro es *verificar* lo que salió. Y si no verificás, no es que ahorraste tiempo — es que te lo estás debiendo.
- **El 80% llega solo; el 20% es todo el trabajo.** Y es justo la parte donde hace falta entender el código. Por eso la sensación de que arrancó volando y después se empantanó.

**Después: qué hacemos al respecto.** Tres movimientos, que son el esqueleto del día y del resto del curso:

- **Planificar.** Decidir qué se va a hacer *antes* de que se haga, en un momento en el que todavía es barato cambiar de idea. No es burocracia: es el único momento en que corregir cuesta una frase en vez de un refactor.
- **Documentar.** El plan tiene que existir *afuera* de la cabeza del agente, y afuera de la tuya. Un archivo. Algo que puedas leer, anotar, versionar y mostrarle a otro. Un plan que solo existe en una conversación no se puede revisar.
- **Diseñar la solución.** Las decisiones que importan — qué archivos se tocan, qué se rompe, qué queda para después — las tomás vos. El agente ejecuta. Cuando el agente diseña por default, terminás con lo de la semana pasada.

Y el cierre del bloque, que es la frase de la sesión:

> *"Hoy no vamos a escribir menos código. Vamos a saber qué código escribimos."*

Avisar también qué se siente: **hoy va a parecer más lento.** Es cierto y es el punto. Al final comparamos.

### Setup: instalar las extensiones (~5 min)

Al principio, todos juntos, antes de la teoría:

```
pi install npm:@plannotator/pi-extension
pi install npm:pi-subagents
```

Es el único setup del día y está en el camino crítico de la práctica. Hacerlo acá y no al empezar el ejercicio: si alguien se traba, hay una hora de teoría por delante para destrabarlo sin perder tiempo de construcción. Pedirlo también como pre-work, pero **no asumir que lo hicieron**.

### Git con AI (~5 min)

Los cimientos: antes del flujo de planificar y revisar, poner la red de seguridad. Plantearlo como un **espectro atado al contexto**, no como un workflow rígido:

- **Solo, en tu propio repo**: trabajar sobre `main` está bien.
- **En equipo**: branches por feature.
- **Trabajo en paralelo**: worktrees.

Principio clave: la AI no cambia git; solo hace que "tirar la branch" salga más barato. **El diff revisado es la puerta antes del merge** — enseñar explícitamente a leer diffs con ojo crítico (¿coincide con el plan? ¿hay código sin usar? ¿hay smells de seguridad?).

Ponerlo acá fija la expectativa: "todo lo que viene asume que tenés cómo volver atrás". Hoy importa más que de costumbre, porque en la práctica van a ejecutar un plan escrito por un agente paso por paso — necesitan saber que lo pueden tirar entero.

### Planificar: teoría + demo (~18 min)

**Teoría (~6 min).**

**El plan siempre existe. La única pregunta es si lo podés leer.** Cuando le tirás un prompt en frío, el agente planifica igual — en silencio, adentro de su contexto, y vos te enterás de lo que decidió mirando el destrozo. Externalizarlo cuesta unos minutos y te deja un plan que se puede leer, anotar, versionar, commitear y pasarle a otro.

**El harness te obliga.** En plan mode el toolset cambia: solo lectura y búsqueda, sin escritura fuera del archivo del plan, comandos destructivos bloqueados. Mostrar el indicador `⏸ plan`. No es decoración — aunque quieras, no podés saltear la planificación. *La disciplina la impone la herramienta.* (Semilla para la Sesión 3: permisos y extension points.)

**Demo (~12 min), sobre el proyecto del instructor:**

1. **Entrar en plan mode.** Señalar el `⏸ plan` y el toolset restringido. "El harness me está obligando. Aunque quisiera, no puedo saltear esto."
2. **Describir una feature.** Dejarlo explorar el proyecto y escribir el plan como checklist. Mientras corre, narrar: el plan es un archivo en disco, en una ruta que elegiste vos.
3. **Rechazar el plan con anotaciones.** *Este es el beat que importa.* No aprobar en la primera pasada aunque el plan esté bien. Anotar un paso vago, una decisión que dos personas implementarían distinto, un paso que falta. Mandarlo de vuelta.
4. **Mostrar el Plan Diff** en el reenvío — qué cambió respecto de la versión anterior. Ahí se ve si procesó las anotaciones o si contestó cualquier cosa.
5. **Delegar la revisión del plan a un subagente** (~2 min). Que lo lea y reporte huecos: qué está flojo, qué falta, qué dos personas implementarían distinto. Mención corta — la profundidad de subagentes es la Sesión 3.
6. **Aprobar y dejarlo ejecutar.** Recupera todas las herramientas. Dejar que avance mientras seguís hablando; el diff que produzca es el material de la demo siguiente.

**Sobre la descomposición**: no es un tema aparte. El plan ya salió descompuesto en un checklist. Apuntar a la estructura del plan y decir "esto es descomposición", recorriéndolo estilo *entrypoint* (arrancar por el archivo principal que toca y ramificar). Es leer el flujo, no aplicar una rúbrica.

### Revisar: teoría + demo (~12 min)

**Teoría (~4 min).** No dar una checklist: dar el **espectro de superficies**. Cuál usás depende del tamaño del cambio y de cuánto confiás en él.

1. **Mirar mientras escribe**: la revisión pasa *durante* la generación. Frenar al agente en medio del stream y redirigirlo. La más barata; agarra temprano la dirección equivocada, se le escapa el detalle.
2. **Leer en el editor**: abrir los archivos modificados. La más directa; no escala más allá de unos pocos archivos.
3. **Diff tools**: `git diff`, o [hunk](https://github.com/anthropics/hunk) para ir hunk por hunk. Cuando el cambio es grande, el diff te da la forma.
4. **`/plannotator-review`**: abre los cambios del working tree en la UI de review. Anotás líneas concretas y el feedback vuelve directo al agente. Sirve cuando querés que la revisión *se convierta en la próxima instrucción*, no solo aceptar o rechazar.
5. **Delegarlo a un subagente**: que un agente lea el diff y reporte issues, smells y desvíos respecto del plan. Segunda vez que aparece "esto se puede delegar" — profundidad en la Sesión 3.

**Demo (~8 min)**, sobre el diff que dejó la demo anterior:

1. **`/plannotator-review`.** Recorrer el diff, anotar una línea concreta y mandarla de vuelta al agente.
2. **Frenarlo en vivo una vez**, si el momento se da, para mostrar el "mirar mientras escribe" sin una slide aparte.
3. **La pregunta que cierra todo**: *"¿esto coincide con el plan que aprobaste?"* Es la pregunta más útil de la revisión, y solo la podés hacer porque el plan está escrito. Ese es el puente entre los dos bloques: el plan aprobado es la especificación contra la que revisás.

### Tests como guardrails (~5 min)

Agnóstico de framework. Posición: **"el test es la especificación que el agente no puede falsear".** Si le pedís el comportamiento X y el agente escribe el código *y* el test que dice que X anda, te puede engañar: afloja el assert hasta que pase. Si el assert lo escribiste vos antes, tiene que cumplirlo.

Saltear la disciplina estricta de TDD. La ganancia es "existe un test y lo escribiste vos antes de la implementación", no el ciclo red → green → refactor.

> **Una realidad que hay que decir en voz alta**: casi nadie va a tener test runner. Vibecodearon una semana sin leer nada. Que esto no se coma la práctica — **delegarle el setup del runner al agente está bien y es correcto**, es mecánico. Lo que el estudiante no puede delegar es el assert. Decirlo así: *"que te lo instale el agente; el `expect` lo escribís vos"*.

## Práctica (~40 min)

Seis pasos en `exercise/README.md`. Caminar la sala. Lo que hay que hacer cumplir es **el paso 3: que rechacen el plan al menos una vez.** Van a aprobar el primer plan por cortesía con la máquina, y eso saltea toda la lección.

Otras cosas para vigilar:

- **El scope de la feature.** Quien elija algo que toca 5 archivos o más no termina. Recortarlos temprano, en los primeros cinco minutos.
- Quien saltee el test "porque es más rápido". Es cierto y ese es el punto — preguntarle al final si habría agarrado el bug sin él.
- Cuando algo se rompe, la lección es **"leé el código vos antes de pedirle al agente que lo arregle"**. Hoy, a diferencia de la semana pasada, tienen permitido leerlo. No hay bloque de teoría para esto: se dice caminando la sala, cuando pasa.

## Timing de la sesión (~2 h)

| Bloque | Tiempo |
|---|---|
| Recap y debrief de la Sesión 1 | 12 min |
| Qué vamos a ver hoy | 8 min |
| Setup: instalar las dos extensiones | 5 min |
| Teoría: git con AI | 5 min |
| **Planificar: teoría + demo** | **18 min** |
| **Revisar: teoría + demo** | **12 min** |
| Teoría: tests como guardrails | 5 min |
| Pausa | 5 min |
| **Práctica** | **40 min** |
| Cierre: discusión + qué viene | 10 min |

Da 120 justos, así que no hay colchón. **Si se estira, recortar del recap** — es el bloque más elástico. No recortar de la práctica, y nunca del review del diff que la cierra, que es donde aterriza la sesión.

Entre las dos demos hay ~20 minutos de herramienta en vivo. Es lo más frágil del día: ensayarlo con reloj.

## Puentes entre sesiones

- **Desde la Sesión 1**: el debrief de la tarea es el bloque que abre esta sesión. **Coordinar con Diego antes de la clase.** Comprehension debt se plantó allá; acá recibe su mecanismo en la intro.
- **El harness restringe el toolset durante la planificación** → Sesión 3 (Diego). Hoy es algo que *notan*; allá se convierte en permisos y extension points. Plantarlo, no explicarlo.
- **Subagentes** → Sesión 3 (Diego). Hoy aparecen dos veces como subtema (revisar el plan, revisar el diff), instalados pero usados de a poco, para que lleguen con "esto se puede delegar" ya visto. **Coordinar con Diego**: la sesión de hoy fija `pi-subagents` como el paquete del curso.
- **`AGENTS.md`** → Sesión 3 (Diego). **No se toca hoy.** La tarea de la semana ("¿qué le tuviste que explicar más de una vez?") es la que le arma el terreno.
- **El plan como contexto para la AI** → Sesión 4 (Agus). El plan que externalizamos hoy es la especificación que trabajamos allá. Anticiparlo en el cierre.

## Herramientas y recursos referenciados

- [Pi](https://pi.dev/docs/latest/quickstart) — el harness del curso. Ya instalado en la Sesión 1.
- [`@plannotator/pi-extension`](https://www.npmjs.com/package/@plannotator/pi-extension) — `pi install npm:@plannotator/pi-extension`. Aporta `pi --plan`, `/plannotator`, `Ctrl+Alt+P`, `/plannotator-review`, `/plannotator-annotate`. [Fuente](https://github.com/backnotprop/plannotator).
- [`pi-subagents`](https://www.npmjs.com/package/pi-subagents) — `pi install npm:pi-subagents`. Delegación a subagentes. [Fuente](https://github.com/nicobailon/pi-subagents).
- [hunk](https://github.com/anthropics/hunk) — revisión interactiva hunk por hunk.

## Lo que dejamos afuera a propósito

- **Cosas de LIDR** (Decision Closure Rule, tiers de verificación): demasiado sabor corporativo para esta audiencia.
- **Checklist de code review**: reemplazada por el "espectro de superficies de revisión" — estrategias, no rúbrica.
- **Bloque dedicado a debugging**: no hay teoría. Se dice caminando la sala cuando algo se rompe.
- **Sidebar de seguridad**: se sacó. Si aparece un smell concreto durante la demo del diff, nombrarlo al pasar y seguir; no hay bloque reservado.
- **Los números de METR / CodeRabbit**: Diego ya los presentó en la Sesión 1 como predicciones. Acá no se cobran con datos — el diagnóstico de la intro es cualitativo y sale del pizarrón del recap.
- **`AGENTS.md`**: es de la Sesión 3 (Diego). No se toca hoy.
- **Un segundo harness**: se evaluó y se descartó. Una herramienta, un proyecto, seis sesiones.
- **Las capas de configuración de Plannotator** (`plannotator.json`, modelos por fase, `executionMode`): existen y son irrelevantes para un primer contacto. Saltear salvo que alguien pregunte.

## Pendientes (para próximas iteraciones)

- **Pre-work**: pedir que instalen las dos extensiones antes de la clase. Igual reservamos 5 minutos al principio, porque no todos lo van a hacer.
- **Probar las dos instalaciones en una máquina limpia**, incluyendo si la UI de Plannotator abre bien en el navegador con 20-30 personas en la red del aula. La misma disciplina que aplicó Diego con la instalación de Pi.
- **Elegir el proyecto para la demo** — tiene que tener suficiente forma como para que un plan no sea trivial, y ser seguro de mostrar en el proyector. Las dos demos corren sobre el mismo proyecto y la segunda depende del diff que deja la primera.
- **Tener un plan malo escrito de antemano.** La demo depende de que el agente produzca un plan que valga la pena anotar. Si escribe uno prolijo, el beat de "rechazar con anotaciones" se cae — abrir el plan malo en su lugar.
- **Ensayar las dos demos con reloj**, encadenadas. Son ~20 minutos de herramienta en vivo con un navegador de por medio.
- **Confirmar con Diego** con qué estado terminaron realmente la Sesión 1, y qué recolectó en sus 12 minutos de reality check.
