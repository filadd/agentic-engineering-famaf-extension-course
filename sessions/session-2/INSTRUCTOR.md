# Sesión 2 — Planificar y Revisar (Notas para el instructor)

> A cargo: Agus. Estado: en armado. Todo el material de la sesión (estas notas, `slides.md`, `exercise/README.md`) está en español.
>
> 🎞️ **Slides**: `deck/index.html`, un deck HTML animado que se abre en cualquier navegador. Se navega con las flechas (cada click avanza una animación), `F` para pantalla completa y `H` para ocultar la barra de abajo. Dibuja en un lienzo fijo de 1280×720 que se escala a la pantalla, así que se ve igual en cualquier proyector. `slides.md` es el esqueleto con las notas de orador, en el mismo orden.

## Objetivo de la sesión (en una frase)

Que salgan sabiendo **diseñar un cambio y dejarlo escrito antes de que el agente toque una línea**: explorar, diseñar, documentar, y recién ahí implementar. Y después, **verificar que funciona**, con el agente usando lo que construyó.

## Audiencia y supuestos

- **Esta sesión dura 1 h 30.** No hay colchón: proteger la práctica.
- Grupo heterogéneo — estudiantes avanzados de computación y programadores/as junior, cupo de 35. Enseñar al medio, con puerta de entrada para los que arrancan y profundidad para los que ya trabajan.
- **Base de git**: asumir lo básico (commit, push). No hay bloque de git; el ejercicio solo pide arrancar con `git status` limpio.
- **Tests**: sin base previa en la mayoría. Plantearlo como "decidir los casos antes del código", accesible para cualquiera.
- **Con qué llegan**: Pi instalado, un repo git, y un proyecto que corre en el navegador que vibecodearon sin leer una línea. **La mayoría no va a tener test runner.**
- **El estado con el que llegan es disparejo, y está previsto.** La tarea de la Sesión 1 era abierta ("seguí hasta que se te vaya de las manos"). Algunos van a traer una semana de trabajo y otros nada. El ejercicio está escrito para que ambos puedan hacerlo.
- **Herramienta**: **Pi**, la misma que la Sesión 1, más **Plannotator** como ayudita para anotar documentos y diffs, y **agent-browser** para la verificación visual.

## La decisión de herramientas

La Sesión 2 corre sobre **Pi**. No se instala un segundo harness, y plan mode aparece solo como comentario (ver "Setup").

El proceso de la sesión (explorar → diseñar → documentar → implementar) se hace **con prompts comunes**, sin ninguna herramienta especial. Lo único que se agrega es una extensión:

- **`@plannotator/pi-extension`** — se usa como **ayudita**, no como método. Aporta dos comandos: `/plannotator-annotate` para anotar un archivo markdown (el documento de diseño) y `/plannotator-review` para anotar el diff del working tree. En los dos casos el feedback vuelve directo al agente. Se puede hacer lo mismo con un editor y un mensaje; Plannotator lo hace más cómodo.
- **`agent-browser`** — una CLI que le permite al agente abrir un navegador, ver la página como una lista de elementos con referencias, hacer click, completar campos y sacar capturas. Se muestra en la slide de verificación visual y se usa en la práctica, sin profundizar: las herramientas son tema de la Sesión 3. **La herramienta en sí no es lo importante**: cualquier forma de que el agente maneje un navegador sirve (Playwright MCP, Chrome DevTools MCP, la que traiga el harness). Lo que importa es que el agente use lo que construyó. Si alguien ya usa otra, que siga con esa.

Decirlo así en clase: **lo que importa es el proceso, no la herramienta.** Si mañana cambian de harness, el proceso se lleva igual.

## Plan tema por tema

### Recap: ¿Cómo les fue? — abre la sesión

Corto y liviano. Una discusión, no un bloque de slides. Cuatro preguntas:

1. **¿Cómo les fue?**
2. **¿Leyeron el código?** Romper la regla de la Sesión 1 es buena señal: preguntar qué los hizo romperla.
3. **¿Encontraron problemas en la app que armaron?**
4. **¿Entienden qué está pasando por abajo?**

Lo que sale va al pizarrón y alimenta el bloque siguiente. No cerrarlo con conclusión.

**Coordinar con Diego antes de la clase**: con qué estado terminaron realmente la Sesión 1 y qué recolectó en su reality check, para no volver a recolectar lo mismo.

### Vibe coding: qué pasó

Toma lo del pizarrón y lo ordena en una idea: **la IA te lleva a algo que funciona, pero faltan decisiones y detalles, y no sabés dónde ni cuántos.**

**La slide** ("Vibe coding"): una barra de progreso se llena mientras aparecen checkboxes de "anda", se traba cerca del 78%, se mueve para atrás y para adelante, se rompe en pedazos y la llenan signos de pregunta. No es que falte el último tramo: es que no sabés cuánto falta ni dónde. Las decisiones que no tomaste las tomó el agente, en silencio, y no sabés cuáles fueron.

Callback de una línea: eso es la deuda de comprensión que vieron en la clase de vibe coding.

Cerrar con la frase de la sesión:

> *"Hoy no vamos a escribir menos código. Vamos a saber qué código escribimos."*

Avisar también qué se siente: **hoy va a parecer más lento.** Es cierto y es el punto. No tiene slide: se dice sobre la de "Vibe coding".

### Planificar: explorar, diseñar, documentar

El bloque central. **Planificar** es un recorrido con tres paradas antes de la línea de llegada, que es el código (en la slide, cuatro cartas y el personaje saltando de una a otra hasta la bandera de llegada):

1. **Explorar.** Entender el código que ya existe, si existe, antes de decidir nada. El agente lee y te cuenta; vos preguntás de a una cosa. Sin escribir nada todavía. Con un proyecto vibecodeado es además la primera vez que ven qué hay adentro.
2. **Diseñar.** Tomar las decisiones: qué cambia, qué se guarda, qué reglas aplican, qué queda afuera. Las decisiones las tomás vos; el agente te las pregunta de a una y te trae los datos que necesitás para decidir. Cuando el agente diseña por default, pasa lo de la semana pasada.
3. **Documentar.** El diseño queda en un archivo. Algo que podés leer, anotar, versionar, mostrarle a otro y pasarle al agente. Un diseño que solo vive en una conversación no se puede revisar.

Y recién ahí: **el agente implementa, trabajando desde el documento.**

**El diseño puede ser tan liviano o tan profundo como necesites.** La slide tiene un slider manual de "nada de diseño" a "todo diseñado": cada punto pasa una decisión de la fila del agente (?) a la tuya (✓). Abajo, dos gráficos siguen al slider con el tiempo diseñando en el eje x: las chances de retrabajo caen fuerte con las primeras decisiones y después se aplanan, y cuánto entendés lo que salió sube rápido y se satura. El costo es el eje x: más diseño es más tiempo antes de empezar. Para un cambio chico alcanza con tres decisiones escritas; para algo con datos nuevos o reglas complicadas conviene ir más a fondo. La regla práctica: **más diseño, mejores resultados.** Cada decisión que tomaste vos es una que el agente no inventó.

La slide siguiente lo muestra con un ejemplo: agregar recordatorios a una app de tareas. Una conversación con Pi que scrollea en la terminal y prende cada parada del recorrido: explorar cómo se guardan las tareas, diseñar contestando cuatro preguntas de a una (fecha y hora, quién avisa, qué pasa con la pestaña cerrada, qué pasa si la tarea ya está hecha), documentar (pedir un borrador, leerlo, corregirle dos cosas y recién ahí guardarlo en `docs/recordatorios.md`) e implementar desde ese archivo, con los diffs apareciendo archivo por archivo y los tests corriendo al final. El borrador trae un diagrama en texto de qué pasa cuando llega la hora: un diseño no tiene por qué ser solo prosa.

Prompts de ejemplo para decir en voz alta (no son una receta):

- Explorar: *"Contame cómo funciona X en este proyecto. No escribas nada."*
- Diseñar: *"Quiero agregar Y. Preguntame las decisiones que hay que tomar, de a una."*
- Documentar: *"Armame un borrador del diseño, con un diagrama. Todavía no lo guardes."* Corregirlo, y después: *"Guardalo en `docs/y.md`."*
- Implementar: *"Implementá `docs/y.md`."*

### Setup: Plannotator

Todos juntos:

```
pi install npm:@plannotator/pi-extension
```

Presentarlo como **ayudita**: una forma cómoda de anotar el documento de diseño (`/plannotator-annotate docs/y.md`) y, más tarde, el diff (`/plannotator-review`). No es el método; el método es el de recién.

La slide muestra el flujo completo en tres clicks: el comando en la terminal abre el documento en el navegador, se pegan dos anotaciones, se mandan con "Enviar anotaciones", el agente las recibe y el documento se actualiza con líneas nuevas en verde.

**Un comentario, no un paso: plan mode.** Plannotator también trae un plan mode (`pi --plan`, `/plannotator` o `Ctrl+Alt+P`). Mientras está activo, el harness le restringe al agente las herramientas a leer y buscar, bloquea los comandos destructivos y solo lo deja escribir el archivo del plan. No está en la slide. Mencionarlo como un mecanismo que existe y que pueden probar, no como algo para usar siempre ni como el flujo de hoy. Si alguien lo prueba durante la semana, la Sesión 3 explica cómo hace el harness para bloquear.

### Demo: explorar → diseñar → documentar → implementar

Una sola demo continua, sobre el proyecto del instructor:

1. **Explorar.** Preguntarle cómo funciona la parte que vamos a tocar. Dos o tres preguntas, sin que escriba nada.
2. **Diseñar.** Pedirle que pregunte las decisiones de a una. Contestarlas en voz alta, explicando por qué.
3. **Documentar.** Que escriba el documento. Abrirlo con `/plannotator-annotate`, anotar al menos una cosa (algo vago, una decisión que falta, algo que dos personas implementarían distinto) y mandarlo de vuelta.
4. **Implementar** desde el documento. Dejarlo correr mientras seguís hablando.

**Mostrar la profundidad del diseño**: o bien el mismo cambio con un diseño liviano y uno profundo, o al menos decir en voz alta dónde irías más a fondo y por qué.

### Revisar

**Primero, el problema: revisar código es cada vez más difícil.** La slide es un gráfico en el tiempo: una línea plana, "lo que alcanzás a leer", y una curva que se dispara, "lo que se escribe", con robots encima; el espacio entre las dos se sombrea como "sin revisar". Hay más código que nunca, porque el agente escribe mucho más rápido de lo que cualquiera lee. Y es código que no escribió nadie del equipo: no hay a quién preguntarle por qué está así. Leer diffs línea por línea no escala, y la industria todavía está buscando cómo resolverlo. Decirlo con honestidad: no hay una respuesta cerrada. Hay intentos, y en la slide aparecen de a uno: adversarial reviews (otro agente que busca problemas a propósito), cambios más chicos, no revisar nada (existe, y decirlo con la cara seria), **mover la revisión para adelante** y **verificar que funciona**. Al final se destacan los dos últimos: son los que usamos hoy, y el primero ya lo vieron, es el diseño.

**Revisión: antes y después.** La slide muestra dos ciclos de trabajo en una feature, uno por click. Antes, con un colega: *diseño* (una charla) *→ código → verificar* (tests + a mano) *→ revisión* (a mano) *→ ship*. Verificar y revisar pueden encontrar problemas, y cada uno te manda de vuelta al código: en la slide, una flecha de vuelta desde cada uno, honda, varias vueltas. Ahora, con un agente, el mismo ciclo: *diseño* (escrito y anotado) *→ código → verificar* (tests + el agente) *→ revisión liviana* (agente + humano) *→ ship*, con las mismas flechas de vuelta, más cortas. Las vueltas no desaparecen: se achican. Dos cambios:

1. **La revisión grande pasa al diseño.** Con el diseño hecho y anotado, la mayor parte de la revisión ya pasó antes de que existiera el código. Revisar un documento de una página es mucho más barato que revisar el diff de mil líneas que sale de él, y la revisión del código queda más liviana. Leer el código después sirve para **entender qué se hizo** y chequear una cosa: *¿esto coincide con el diseño?* Esa pregunta solo existe porque el diseño está escrito. `/plannotator-review`, `git diff` o el editor: cualquiera sirve.
2. **La verificación que hacías a mano la puede hacer el agente.** Los tests siguen, y lo que antes era "lo pruebo yo en el navegador" ahora lo hace el agente.

### Tests

**Para qué sirven, y la pirámide.** Una slide para poner vocabulario, porque la mayoría no tiene base de tests. A la izquierda, para qué sirven: son código que prueba tu código, dejan escrito qué tiene que hacer, se corren solos cada vez que cambiás algo, y si algo se rompe te enterás vos antes que quien lo usa. Con un click, a la derecha se arma la pirámide de abajo hacia arriba: **unitarios** (una función sola; muchos y rápidos), **integración** (varias piezas juntas: la ruta, la validación y la base), **e2e** (la app entera, como la usaría una persona; pocos y lentos). Para pasar a la siguiente, decirlo como buena noticia: todo esto lo puede escribir el agente.

**El agente escribe muchos, y no sabés si testean lo correcto.** Dicho sin vueltas: **los agentes escriben muchísimos tests, y si no les prestás atención, no sabés si testean lo correcto.** En la slide llueven checkmarks y "142 passed 🎉"; después pasa una lupa y unos dos tercios de los ✓ se convierten en signos de pregunta, mientras el personaje pasa de contento a confundido. Testean la implementación en lugar del comportamiento, afirman cosas triviales, mockean todo, o aflojan el assert hasta que pasa. Un montón de tests en verde no dice nada si nadie decidió qué tenían que probar.

La propuesta: **decidir los casos antes del código**, como parte del diseño. La técnica de base es el **Classification Tree Method** (Grochtmann y Grimm, 1993), que extiende la partición en clases de equivalencia. En versión simplificada:

1. **Qué varía**: las entradas y el estado que cambian el resultado (el input, el estado de partida, quién hace la acción).
2. **Qué valores importan**: cada cosa que varía se parte en clases que el código trata distinto (vacío / uno / muchos; válido / inválido).
3. **Qué combinaciones cubrir**: una fila por caso, eligiendo una clase de cada cosa. Cada clase aparece en al menos una fila.

El agente propone la tabla; **vos confirmás, recortás o agregás.** Cada fila se marca según cómo se verifica: **test**, **agente** (lo verifica el agente usando la app), o las dos. La tabla va en el documento de diseño; el agente escribe los tests desde ahí, y los casos marcados "agente" son los que verifica en el bloque siguiente.

Casi nadie va a tener test runner: **que se lo instale el agente, es mecánico.** Lo que no se delega es decidir los casos. En la slide, el árbol crece nivel por nivel y cada fila de la tabla ilumina las hojas que combina.

### Verificar

**Usar lo que se construyó.** Decir en voz alta que al recorrido de la primera parte (explorar → diseñar → documentar → código) se le suma un quinto paso, **verificar**. Que compile y que pasen los tests no alcanza: alguien tiene que usarlo. Antes ese alguien eras vos, a mano; ahora puede ser el agente. Tres formas, una por carta:

- **La API**: levantar el server y pegarle con `curl`.
- **Los datos**: mirar qué quedó guardado en la base.
- **La pantalla**: abrir el navegador, hacer click, sacar una captura.

La responsabilidad sigue siendo tuya: mirá lo que hizo el agente al verificar (las respuestas de los `curl`, las capturas). Es mucho más barato que leer el diff, y te dice si funciona, que el diff no te lo dice.

**Verificar la API.** A la izquierda la terminal y a la derecha un diagrama de secuencia entre el agente y el server, que se dibuja a medida que pasan las cosas: el server se prende, y cada `curl` aparece como un pedido y su respuesta. Sigue el ejemplo de los recordatorios: se le pide que verifique contra los casos del documento, levanta el server, y hace un `curl` por caso (recordatorio futuro → 200, pasado → 400, sin recordatorio → 200). Cierra con "3 de 3 casos se comportan como dice el doc". El documento de diseño vuelve a aparecer: es contra lo que se verifica.

**Verificar los datos.** Después de los `curl`, mirar qué quedó guardado. En la slide, a la izquierda la terminal y a la derecha la tabla de tareas de `db.json`. El agente consulta la tarea 7 con `jq`, que se ilumina en la tabla: el 400 no escribió nada y el último PATCH dejó `null`. Después pregunta si alguna tarea guarda `vencido`: no, porque el documento dice que se calcula al cargar. Es la verificación que agarra lo que la respuesta de la API no muestra: lo que se escribió (o no) por abajo.

**Verificar la pantalla.** Presentar `agent-browser` en una frase (una CLI para que el agente maneje un navegador) y no profundizar: es una de muchas, no es lo importante, y las herramientas son de la Sesión 3. Lo que sí vale mostrar es cómo "ve" el agente la página: `snapshot -i` la devuelve como una lista de elementos con referencias (`@e1`, `@e2`…), y después hace click y completa campos usando esas referencias. En la slide, a la izquierda la terminal y a la derecha el navegador: el puntero se mueve solo, el recordatorio queda guardado, y la captura cierra con dos chequeos.

## Práctica

Pasos en `exercise/README.md`. En la slide de los pasos, el personaje recorre las etapas solo, a veces se frustra y vuelve una para atrás, llega a la meta y arranca de nuevo; el reloj de la esquina corre desde que se entra a la slide (click para reiniciarlo). Caminar la sala. Lo que hay que hacer cumplir: **que anoten el documento de diseño al menos una vez antes de implementar.** Van a aprobar el primer diseño por cortesía con la máquina, y eso saltea la lección.

Otras cosas para vigilar:

- **El scope de la feature.** Quien elija algo que toca 5 archivos o más no termina. Recortarlos temprano.
- Quien saltee la tabla de casos "porque es más rápido". Preguntarle al final si los tests que escribió el agente prueban algo.
- Quien dé la feature por terminada sin verificarla. Preguntarle qué verificó: el `curl`, la captura. Si `agent-browser` no anda en su máquina, que verifique la API y siga.
- Cuando algo se rompe, la lección es **"leé el código vos antes de pedirle al agente que lo arregle"**. Se dice caminando la sala.

## Cierre: ¿Qué aprendimos?

La última slide es un collage con todo lo que vimos, que cae carta por carta: la barra que no sabés cuánto le falta, el recorrido explorar → diseñar → documentar → código → verificar, más diseño y mejores resultados, anotar el diseño, la pirámide (el agente escribe los tests, vos decidís los casos), verificar la API, verificar la pantalla, y la balanza entre tiempo y entender. Recorrerlo rápido y abrir la discusión: ¿valió la pena diseñar primero? Dejar que digan que para algo chico sobró.

La tarea se dice en voz alta, sin slide: seguir con el flujo, y anotar qué le tuvieron que explicar al agente más de una vez, que es el material de Herramientas y Skills.

## Timing de la sesión (1 h 30)

Pendiente: los tiempos por bloque se ajustan mientras armamos las slides. Lo fijo: **no recortar de la práctica**, y el recap es el bloque elástico.

## Puentes entre sesiones

- **Desde la Sesión 1**: el recap abre con la tarea. Deuda de comprensión se plantó allá; acá recibe el diagnóstico de la barra con signo de pregunta. **Coordinar con Diego antes de la clase.**
- **La tarea de la semana** → Sesión 3 (Diego). "¿Qué le tuviste que explicar más de una vez?" es el material con el que allá se arma `AGENTS.md` y las skills.
- **`agent-browser`** → Sesión 3. Hoy se presenta en una frase y se usa; allá entra en el mapa de herramientas (CLIs, MCP).
- **`AGENTS.md`** → Sesión 3. No se toca hoy.
- **Plan mode** → Sesión 3. Hoy es un comentario; allá, el ejemplo de cómo un harness bloquea herramientas.
- **El documento de diseño** → Sesión 4 (Agus). Hoy es un documento por cambio; allá la documentación del proyecto, que sobrevive a los cambios.
- **Subagentes** → Sesión 4. No se instalan ni se mencionan hoy.

## Herramientas y recursos referenciados

- [Pi](https://pi.dev/docs/latest/quickstart) — el harness del curso. Ya instalado en la Sesión 1.
- [`@plannotator/pi-extension`](https://www.npmjs.com/package/@plannotator/pi-extension) — `pi install npm:@plannotator/pi-extension`. Hoy se usan `/plannotator-annotate` y `/plannotator-review`; plan mode (`pi --plan`) se menciona como opcional. [Fuente](https://github.com/backnotprop/plannotator).
- [`agent-browser`](https://github.com/vercel-labs/agent-browser) — `npm install -g agent-browser`, y `agent-browser install` para bajar el navegador. Hoy se usan `open`, `snapshot -i`, `click`, `fill` y `screenshot`.
- La pirámide de tests — Mike Cohn, *Succeeding with Agile* (2009).
- Classification Tree Method — M. Grochtmann y K. Grimm, *Classification Trees for Partition Testing* (1993).

## Pendientes (para próximas iteraciones)

- **Probar la instalación en una máquina limpia**, incluyendo si la UI de Plannotator abre bien en el navegador con ~35 personas en la red del aula.
- **Elegir el proyecto para la demo** — con suficiente forma como para que el diseño no sea trivial, y seguro de mostrar en el proyector.
- **Elegir la feature de la demo** y decidir si se muestra el contraste diseño liviano / diseño profundo.
- **Empaquetar las fuentes del deck.** Hoy se cargan de Google Fonts; sin internet en el aula cae a las fuentes del sistema.
- **Tener un documento de diseño flojo escrito de antemano**, por si el agente escribe uno demasiado prolijo para anotar.
- **Probar `agent-browser` en una máquina limpia**, sin mucha prioridad: la instalación baja un navegador y puede tardar con la red del aula. Si falla, se verifica la API y listo.
- **Ensayar la demo con reloj.**
- **Confirmar con Diego** con qué estado terminaron realmente la Sesión 1.
