# Sesión 1 — Ejercicio práctico: Pi (agent harness) + vibe coding

## Objetivo

Dejar **Pi funcionando sobre un proyecto tuyo**, con un `AGENTS.md` propio, y arrancar a construir hablándole al agente **sin abrir el código**.

El objetivo no es que el código sea bueno. Es que salgas de la clase con la herramienta andando y con algo hecho **que no sepas qué tiene adentro**.

Este es el proyecto que vas a usar durante las 6 sesiones. Elegí algo que te dé ganas de seguir.

## Antes de empezar

- Tené **node y npm** instalados (`node --version` tiene que responder).
- Tené una cuenta de **GitHub** y `git` configurado con tu nombre y mail.
- Elegí tu proyecto: uno propio, o uno de los briefs del final de este documento.

## Las reglas de hoy

Estas cuatro reglas son el ejercicio. Van a incomodar, y esa incomodidad es intencional.

1. **Hablale al agente.** Describí lo que querés en lenguaje natural.
2. **No abras los archivos.** Ni en el IDE, ni con `cat`, ni con `git diff`. No leas lo que escribió.
3. **Si algo se rompe, describí el síntoma, no lo diagnostiques.** "El botón no hace nada" está bien. "Falta el event listener en `App.jsx`" está prohibido — para saber eso tendrías que haber leído el código.
4. **Juzgá solo por el output.** ¿Se ve bien? ¿Corre? ¿Hace lo que pediste? Con eso decidís si seguís o iterás.

Si el agente te pregunta algo, contestale. Si te propone opciones, elegí. Todo eso es parte del juego. Lo único vedado es leer el código.

> Las reglas aplican desde el paso 6. Los pasos 1 a 5 son setup: ahí sí mirás lo que hacés.

## Pasos

### 1. Instalá Pi (~8 min)

Seguí la guía oficial: **https://pi.dev/docs/latest/quickstart**

Ahí está el comando de instalación y cómo autenticarte (`/login`). No copiamos el comando acá a propósito: la docs oficial es la que se mantiene al día.

Si te trabás, levantá la mano — hay profes de práctico dando vueltas. Si ya lo tenés andando, ayudá al de al lado.

### 2. Creá el proyecto (~4 min)

```
mkdir mi-proyecto
cd mi-proyecto
git init
```

Creá también el repo en GitHub y conectalo (`git remote add origin ...`). Desde la Sesión 2 vamos a usar git como red de seguridad, así que conviene tenerlo desde hoy.

### 3. Probá los comandos de base (~8 min)

Arrancá Pi dentro de la carpeta del proyecto (`pi`) y probá:

- `/model` — ver y cambiar el modelo que estás usando. Fijate en la ventana de contexto que soporta.
- `/new` y `/resume` — empezar una conversación nueva y volver a una anterior. Acordate: **cada conversación arranca en blanco**.
- `@archivo` — referenciar un archivo en tu mensaje.
- `!comando` — correr un comando de shell sin salir de Pi.
- `Shift+Tab` — cambiar cuánto "piensa" el modelo antes de responder.

Probalos aunque el proyecto todavía esté vacío. La idea es que el agente no sea una caja negra.

### 4. Escribí tu AGENTS.md (~8 min)

`AGENTS.md` es el archivo donde le explicás tu proyecto al agente. Pi lo carga al arrancar, junto con los de los directorios de arriba.

1. Copiá [`AGENTS.md.template`](./AGENTS.md.template) a la raíz de tu proyecto, con el nombre `AGENTS.md`.
2. Completá los `TODO` que puedas: qué es el proyecto, en qué lenguaje/stack lo vas a hacer.
3. **Pedile a Pi que le agregue una línea.** Por ejemplo: "agregá a AGENTS.md una línea que diga que todos los mensajes de commit van en español". Mirá cómo lo edita.

Esta es la primera vez que el agente escribe su propio contexto. En la Sesión 3 vamos a volver sobre esto en serio.

### 5. Reiniciá Pi y mirá el contexto (~4 min)

El `AGENTS.md` que acabás de escribir **todavía no está cargado**: Pi lee los archivos de contexto al arrancar.

Salí y volvé a entrar (o usá `/reload`). Fijate qué te dice Pi sobre el contexto que cargó: cuántos archivos, de dónde. Esa es la memoria de trabajo con la que va a razonar todo lo que le pidas.

### 6. Arrancá a vibecodear (~15 min)

**Desde acá aplican las 4 reglas.** Cerrá el editor.

Contale al agente qué querés construir, en una o dos frases. Dejalo empezar. No le des estructura, no le digas qué stack usar salvo que tengas una preferencia fuerte.

Ciclo: pedí algo → mirá el resultado corriendo → describí lo que falta o lo que está mal → repetí.

Cosas que van a pasar y son parte del ejercicio:

- El agente va a romper algo que ya funcionaba. Describí el síntoma y seguí.
- Te vas a tentar con abrir un archivo para entender qué pasó. No lo hagas.
- Vas a querer decirle *cómo* arreglarlo. Limitate a decirle *qué* está mal.

Anotá en un papel (o en un archivo aparte, no en el código) los momentos en que sentiste que perdiste el control.

### 7. Reality check: abrí los archivos (~12 min, en clase)

Recién ahora: **abrí los archivos.** Leé lo que shippeaste, sin apuro, en silencio.

Mientras leés, buscá:

- ¿Cuántos archivos hay? ¿Sabías que existían todos?
- ¿Hay tests? ¿Hay algo que verifique que funciona además de tu ojo?
- ¿Hay código que no se usa? ¿Funciones duplicadas? ¿Dos maneras distintas de hacer lo mismo?
- ¿Hay secrets, claves o tokens escritos directamente en el código?
- ¿Hay input del usuario que entra sin validarse a ningún lado?
- Elegí el archivo más largo: ¿podrías explicar línea por línea qué hace?
- ¿Cazaste alguno de los tres modos de falla que vimos? (cascading errors, "los tests pasan", scope creep)

Lo que encuentres lo compartimos con el grupo.

## Resultado esperado

Al final de la clase deberías tener:

- Pi instalado y andando.
- Un repo git con tu proyecto y un `AGENTS.md` propio.
- Un prototipo que corre y hace algo (aunque sea poco).
- Una lista de cosas que te sorprendieron al abrir el código.

No hay nada formal para entregar. Guardá el repo: lo seguimos usando las próximas cinco sesiones.

## Para la semana

Seguí vibecodeando tu proyecto **con las mismas reglas** (sin abrir los archivos) hasta que sientas que se te va de las manos. Anotá cuándo pasa. La Sesión 2 abre con eso.

## Preguntas para la discusión final

1. ¿En qué momento sentiste que dejaste de tener el control del proyecto?
2. ¿Qué te sorprendió más al abrir los archivos?
3. Si mañana tuvieras que agregarle una feature, ¿por dónde empezarías? ¿Cuánto tardarías en entender lo que ya hay?
4. ¿Lo subirías a producción? ¿Lo mantendrías por un año?

---

## Anexo: proyectos por defecto

Si no traés una idea propia, elegí uno de estos. Todos arrancan como prototipo en poco tiempo y tienen suficiente sustancia para aguantar las 6 sesiones (auth, estado, datos, validación).

**A. Lista de tareas con usuarios**
Registro y login, cada usuario ve solo sus tareas, marcar como completada, filtrar por estado.

**B. Dashboard simple**
Cargar un CSV o consumir una API pública, mostrar 3-4 métricas y un gráfico, filtrar por fecha.

**C. Chat / muro de mensajes**
Publicar mensajes, verlos en tiempo real (o con refresh), borrar los propios, un mínimo de moderación.

Elegí por gusto, no por dificultad: los tres revelan los mismos problemas.
