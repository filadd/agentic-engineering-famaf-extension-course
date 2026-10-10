# Sesión 2 — Planificar y Revisar (Notas para el instructor)

> A cargo: Agus. Estado: en armado. Todo el material de la sesión (estas notas, `slides.md`, `exercise/README.md`) está en español.
>
> 🎞️ **Slides**: `deck/index.html`, un deck HTML animado que se abre en cualquier navegador. Se navega con las flechas (cada click avanza una animación), `F` para pantalla completa y `H` para ocultar la barra de abajo. Dibuja en un lienzo fijo de 1280×720 que se escala a la pantalla, así que se ve igual en cualquier proyector. `slides.md` es el esqueleto con las notas de orador, en el mismo orden.

## Objetivo de la sesión (en una frase)

Que salgan sabiendo **diseñar un cambio y dejarlo escrito antes de que el agente toque una línea**: explorar, diseñar, documentar, y recién ahí implementar.

## Audiencia y supuestos

- **Esta sesión dura 1 h 30.** No hay colchón: proteger la práctica.
- Grupo heterogéneo — estudiantes avanzados de computación y programadores/as junior, cupo de 35. Enseñar al medio, con puerta de entrada para los que arrancan y profundidad para los que ya trabajan.
- **Base de git**: asumir lo básico (commit, push). No hay bloque de git; el ejercicio solo pide arrancar con `git status` limpio.
- **Tests**: sin base previa en la mayoría. Plantearlo como "decidir los casos antes del código", accesible para cualquiera.
- **Con qué llegan**: Pi instalado, un repo git, y un proyecto que corre en el navegador que vibecodearon sin leer una línea. **La mayoría no va a tener test runner.**
- **El estado con el que llegan es disparejo, y está previsto.** La tarea de la Sesión 1 era abierta ("seguí hasta que se te vaya de las manos"). Algunos van a traer una semana de trabajo y otros nada. El ejercicio está escrito para que ambos puedan hacerlo.
- **Herramienta**: **Pi**, la misma que la Sesión 1, más **Plannotator** como ayudita para anotar documentos y diffs.

## La decisión de herramientas

La Sesión 2 corre sobre **Pi**. No se instala un segundo harness, y plan mode aparece solo como comentario (ver "Setup").

El proceso de la sesión (explorar → diseñar → documentar → implementar) se hace **con prompts comunes**, sin ninguna herramienta especial. Lo único que se agrega es una extensión:

- **`@plannotator/pi-extension`** — se usa como **ayudita**, no como método. Aporta dos comandos: `/plannotator-annotate` para anotar un archivo markdown (el documento de diseño) y `/plannotator-review` para anotar el diff del working tree. En los dos casos el feedback vuelve directo al agente. Se puede hacer lo mismo con un editor y un mensaje; Plannotator lo hace más cómodo.

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

Avisar también qué se siente: **hoy va a parecer más lento.** Es cierto y es el punto. En la slide, "menos código" se tacha a mano, entra un caracol desde la izquierda con "hoy va a parecer más lento…", y cae un sello de "¡A PROPÓSITO!".

### Planificar: explorar, diseñar, documentar

El bloque central. **Planificar** es un recorrido con tres paradas antes de la línea de llegada, que es el código (en la slide, cuatro cartas y el personaje saltando de una a otra hasta la bandera de llegada):

1. **Explorar.** Entender el código que ya existe, si existe, antes de decidir nada. El agente lee y te cuenta; vos preguntás de a una cosa. Sin escribir nada todavía. Con un proyecto vibecodeado es además la primera vez que ven qué hay adentro.
2. **Diseñar.** Tomar las decisiones: qué cambia, qué se guarda, qué reglas aplican, qué queda afuera. Las decisiones las tomás vos; el agente te las pregunta de a una y te trae los datos que necesitás para decidir. Cuando el agente diseña por default, pasa lo de la semana pasada.
3. **Documentar.** El diseño queda en un archivo. Algo que podés leer, anotar, versionar, mostrarle a otro y pasarle al agente. Un diseño que solo vive en una conversación no se puede revisar.

Y recién ahí: **el agente implementa, trabajando desde el documento.**

**El diseño puede ser tan liviano o tan profundo como necesites.** La slide tiene un slider manual de "liviano" a "profundo": cada punto pasa una decisión de la fila del agente (?) a la tuya (✓). Para un cambio chico alcanza con tres decisiones escritas; para algo con datos nuevos o reglas complicadas conviene ir más a fondo. La regla práctica: **más diseño, mejores resultados.** Cada decisión que tomaste vos es una que el agente no inventó.

Prompts de ejemplo para la slide o para decir en voz alta (no son una receta):

- Explorar: *"Contame cómo funciona X en este proyecto. No escribas nada."*
- Diseñar: *"Quiero agregar Y. Preguntame las decisiones que hay que tomar, de a una."*
- Documentar: *"Escribí el diseño que acordamos en `docs/y.md`."*
- Implementar: *"Implementá `docs/y.md`."*

### Setup: Plannotator

Todos juntos:

```
pi install npm:@plannotator/pi-extension
```

Presentarlo como **ayudita**: una forma cómoda de anotar el documento de diseño (`/plannotator-annotate docs/y.md`) y, más tarde, el diff (`/plannotator-review`). No es el método; el método es el de recién.

La slide muestra el flujo completo en cuatro clicks: el comando en la terminal abre el documento en el navegador, se pegan dos anotaciones, se mandan con "Enviar anotaciones", el agente las recibe y el documento se actualiza con líneas nuevas en verde.

**Un comentario, no un paso: plan mode.** Plannotator también trae un plan mode (`pi --plan`, `/plannotator` o `Ctrl+Alt+P`). Mientras está activo, el harness le restringe al agente las herramientas a leer y buscar, bloquea los comandos destructivos y solo lo deja escribir el archivo del plan. Mencionarlo como un mecanismo que existe y que pueden probar, no como algo para usar siempre ni como el flujo de hoy. Si alguien lo prueba durante la semana, la Sesión 3 explica cómo hace el harness para bloquear.

### Demo: explorar → diseñar → documentar → implementar

Una sola demo continua, sobre el proyecto del instructor:

1. **Explorar.** Preguntarle cómo funciona la parte que vamos a tocar. Dos o tres preguntas, sin que escriba nada.
2. **Diseñar.** Pedirle que pregunte las decisiones de a una. Contestarlas en voz alta, explicando por qué.
3. **Documentar.** Que escriba el documento. Abrirlo con `/plannotator-annotate`, anotar al menos una cosa (algo vago, una decisión que falta, algo que dos personas implementarían distinto) y mandarlo de vuelta.
4. **Implementar** desde el documento. Dejarlo correr mientras seguís hablando.

**Mostrar la profundidad del diseño**: o bien el mismo cambio con un diseño liviano y uno profundo, o al menos decir en voz alta dónde irías más a fondo y por qué.

### Tests: el agente escribe muchos, y no sabés si testean lo correcto

El problema, dicho sin vueltas: **los agentes escriben muchísimos tests, y si no les prestás atención, no sabés si testean lo correcto.** En la slide llueven checkmarks y "142 passed 🎉"; después pasa una lupa y unos dos tercios de los ✓ se convierten en signos de pregunta, mientras el personaje pasa de contento a confundido. Testean la implementación en lugar del comportamiento, afirman cosas triviales, mockean todo, o aflojan el assert hasta que pasa. Un montón de tests en verde no dice nada si nadie decidió qué tenían que probar.

La propuesta: **decidir los casos antes del código**, como parte del diseño. La técnica de base es el **Classification Tree Method** (Grochtmann y Grimm, 1993), que extiende la partición en clases de equivalencia. En versión simplificada:

1. **Qué varía**: las entradas y el estado que cambian el resultado (el input, el estado de partida, quién hace la acción).
2. **Qué valores importan**: cada cosa que varía se parte en clases que el código trata distinto (vacío / uno / muchos; válido / inválido).
3. **Qué combinaciones cubrir**: una fila por caso, eligiendo una clase de cada cosa. Cada clase aparece en al menos una fila.

El agente propone la tabla; **vos confirmás, recortás o agregás.** Cada fila se marca como test automático, verificación manual, o las dos. La tabla va en el documento de diseño y el agente escribe los tests desde ahí.

Casi nadie va a tener test runner: **que se lo instale el agente, es mecánico.** Lo que no se delega es decidir los casos. En la slide, el árbol crece nivel por nivel y cada fila de la tabla ilumina las hojas que combina.

### Revisar

**Primero, el problema: revisar código es cada vez más difícil.** La slide es un gráfico en el tiempo: una línea plana, "lo que alcanzás a leer", y una curva que se dispara, "lo que se escribe", con robots encima; el espacio entre las dos se sombrea como "sin revisar". Hay más código que nunca, porque el agente escribe mucho más rápido de lo que cualquiera lee. Y es código que no escribió nadie del equipo: no hay a quién preguntarle por qué está así. Leer diffs línea por línea no escala, y la industria todavía está buscando cómo resolverlo. Decirlo con honestidad: no hay una respuesta cerrada. Hay intentos: agentes que revisan, diffs más chicos, tests que prueban lo que importa, y **mover la revisión para adelante**. Hoy usamos este último.

**Mover la revisión para adelante.** En la slide, de a un bloque por click: antes, *código → revisar* ("mil líneas de diff"); ahora, *diseño → revisar* ("una página de diseño") *→ código*. Prioridad más baja que antes para la revisión del código, y decirlo: con el diseño hecho y anotado, la mayor parte de la revisión ya pasó antes de que existiera el código. Revisar un documento de diseño de una página es mucho más barato que revisar el diff de mil líneas que sale de él.

Leer el código ahora sirve para **entender qué se hizo** y chequear una cosa: *¿esto coincide con el diseño?* Esa pregunta solo existe porque el diseño está escrito. `/plannotator-review`, `git diff` o el editor: cualquiera sirve.

**Capturar aprendizajes.** Cuando en la revisión le corregís algo al agente, esa corrección vale más que el fix: si no la capturás, la próxima conversación arranca de cero y el agente vuelve a cometer el mismo error. El concepto: **ir juntando lo que aprendés mientras trabajás**, para que la próxima vez esté escrito.

La slide compara los dos casos, de a un bloque por click. Sin capturar: *corregís → chat nuevo → "uso fetch acá" 🔁*, el mismo error. Capturando: *corregís → lo anotás → chat nuevo → "uso el cliente de api/" ✓*, porque lo leyó del archivo.

**Adelanto, sin profundizar**: se puede automatizar con una skill que al final de una sesión de trabajo lee la conversación, encuentra los puntos donde tuviste que corregir al agente, y propone una regla o una skill para cada uno. Mostrarla como adelanto y seguir. Las skills son Herramientas y Skills; hoy importa el concepto.

## Práctica

Pasos en `exercise/README.md`. En la slide de los pasos, el personaje recorre las etapas solo, a veces se frustra y vuelve una para atrás, llega a la meta y arranca de nuevo; el reloj de la esquina corre desde que se entra a la slide (click para reiniciarlo). Caminar la sala. Lo que hay que hacer cumplir: **que anoten el documento de diseño al menos una vez antes de implementar.** Van a aprobar el primer diseño por cortesía con la máquina, y eso saltea la lección.

Otras cosas para vigilar:

- **El scope de la feature.** Quien elija algo que toca 5 archivos o más no termina. Recortarlos temprano.
- Quien saltee la tabla de casos "porque es más rápido". Preguntarle al final si los tests que escribió el agente prueban algo.
- Cuando algo se rompe, la lección es **"leé el código vos antes de pedirle al agente que lo arregle"**. Se dice caminando la sala.

## Cierre: ¿Qué aprendimos?

La última slide es un collage con todo lo que vimos, que cae carta por carta: la barra que no sabés cuánto le falta, el recorrido explorar → diseñar → documentar → código, más diseño y mejores resultados, anotar el diseño, los casos antes del código, la revisión para adelante, capturar lo que corregís, y el caracol del "más lento, a propósito". Recorrerlo rápido y abrir la discusión: ¿valió la pena diseñar primero? Dejar que digan que para algo chico sobró.

El segundo click deja la tarea abajo: seguir con el flujo, y anotar qué le tuvieron que explicar al agente más de una vez, que es el material de Herramientas y Skills.

## Timing de la sesión (1 h 30)

Pendiente: los tiempos por bloque se ajustan mientras armamos las slides. Lo fijo: **no recortar de la práctica**, y el recap es el bloque elástico.

## Puentes entre sesiones

- **Desde la Sesión 1**: el recap abre con la tarea. Deuda de comprensión se plantó allá; acá recibe el diagnóstico de la barra con signo de pregunta. **Coordinar con Diego antes de la clase.**
- **La captura de aprendizajes** → Sesión 3 (Diego). Hoy es el concepto y un adelanto; allá se convierte en `AGENTS.md` y skills. La tarea de la semana ("¿qué le tuviste que explicar más de una vez?") le arma el terreno.
- **`AGENTS.md`** → Sesión 3. No se toca hoy.
- **Plan mode** → Sesión 3. Hoy es un comentario; allá, el ejemplo de cómo un harness bloquea herramientas.
- **El documento de diseño** → Sesión 4 (Agus). Hoy es un documento por cambio; allá la documentación del proyecto, que sobrevive a los cambios.
- **Subagentes** → Sesión 4. No se instalan ni se mencionan hoy.

## Herramientas y recursos referenciados

- [Pi](https://pi.dev/docs/latest/quickstart) — el harness del curso. Ya instalado en la Sesión 1.
- [`@plannotator/pi-extension`](https://www.npmjs.com/package/@plannotator/pi-extension) — `pi install npm:@plannotator/pi-extension`. Hoy se usan `/plannotator-annotate` y `/plannotator-review`; plan mode (`pi --plan`) se menciona como opcional. [Fuente](https://github.com/backnotprop/plannotator).
- Classification Tree Method — M. Grochtmann y K. Grimm, *Classification Trees for Partition Testing* (1993).

## Pendientes (para próximas iteraciones)

- **Probar la instalación en una máquina limpia**, incluyendo si la UI de Plannotator abre bien en el navegador con ~35 personas en la red del aula.
- **Elegir el proyecto para la demo** — con suficiente forma como para que el diseño no sea trivial, y seguro de mostrar en el proyector.
- **Elegir la feature de la demo** y decidir si se muestra el contraste diseño liviano / diseño profundo.
- **Empaquetar las fuentes del deck.** Hoy se cargan de Google Fonts; sin internet en el aula cae a las fuentes del sistema.
- **Tener un documento de diseño flojo escrito de antemano**, por si el agente escribe uno demasiado prolijo para anotar.
- **Preparar el adelanto de la skill de aprendizajes**: qué se muestra y cuánto dura.
- **Ensayar la demo con reloj.**
- **Confirmar con Diego** con qué estado terminaron realmente la Sesión 1.
