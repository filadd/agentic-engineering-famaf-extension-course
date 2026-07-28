# Sesión 1 — Ejercicio práctico: Vibe coding puro

> 🔴 **TO REVIEW** — generado por Claude, todavía sin revisar por Diego.

## Objetivo

Construir un prototipo que **funcione** (o que parezca funcionar) hablándole al agente, sin abrir ni una vez el código.

El objetivo no es que el código sea bueno. Es que al final de la sesión tengas algo hecho **y no sepas qué hay adentro** — para que la lección de las próximas tres sesiones no sea una opinión del docente, sino algo que ya te pasó.

Este es el proyecto que vas a usar durante las 4 sesiones. Elegí algo que te dé ganas de seguir.

## Antes de empezar

- Tené [Claude Code](https://docs.anthropic.com/en/docs/claude-code) instalado y respondiendo en una terminal.
- Creá un directorio vacío para el proyecto e inicializá un repo git (`git init`) — te va a servir desde la Sesión 2.
- Elegí tu proyecto: uno propio, o uno de los briefs del final de este documento.
- Cerrá el editor. En serio. Hoy no lo vas a necesitar.

## Las reglas de hoy

Estas cuatro reglas son el ejercicio. Van a incomodar, y esa incomodidad es intencional.

1. **Hablale al agente.** Describí lo que querés en lenguaje natural.
2. **No abras los archivos.** Ni en el IDE, ni con `cat`, ni con `git diff`. No leas lo que escribió.
3. **Si algo se rompe, describí el síntoma, no lo diagnostiques.** "El botón no hace nada" está bien. "Falta el event listener en `App.jsx`" está prohibido — para saber eso tendrías que haber leído el código.
4. **Juzgá solo por el output.** ¿Se ve bien? ¿Corre? ¿Hace lo que pediste? Con eso decidís si seguís o iterás.

Si el agente te pregunta algo, contestale. Si te propone opciones, elegí. Todo eso es parte del juego. Lo único vedado es leer.

## Pasos

### 1. Elegí y arrancá (~10 min)

Contale al agente qué querés construir, en una o dos frases. Dejalo empezar. No le des estructura, no le digas qué stack usar salvo que tengas una preferencia fuerte.

### 2. Iterá hasta que funcione (~60-90 min)

Ciclo: pedí algo → mirá el resultado corriendo → describí lo que falta o lo que está mal → repetí.

Cosas que van a pasar y son parte del ejercicio:

- El agente va a romper algo que ya funcionaba. Describí el síntoma y seguí.
- Te vas a tentar con abrir un archivo para entender qué pasó. No lo hagas.
- Vas a querer decirle *cómo* arreglarlo. Limitate a decirle *qué* está mal.

Anotá en un papel (o en un archivo aparte, no en el código) los momentos en que sentiste que perdiste el control. Los vamos a usar en la discusión final.

### 3. Llegá a algo mostrable (~15 min)

Antes de que se termine el bloque, asegurate de tener algo que se pueda demostrar: la app corre y hace al menos una cosa completa de punta a punta.

Si está a medias, está bien igual. No lo arregles a mano.

### 4. Reality check (~10 min, en clase)

Recién ahora: **abrí los archivos.** Leé lo que shippeaste, sin apuro, en silencio.

Mientras leés, buscá:

- ¿Cuántos archivos hay? ¿Sabías que existían todos?
- ¿Hay tests? ¿Hay algo que verifique que funciona además de tu ojo?
- ¿Hay código que no se usa? ¿Funciones duplicadas? ¿Dos maneras distintas de hacer lo mismo?
- ¿Hay secrets, claves o tokens escritos directamente en el código?
- ¿Hay input del usuario que entra sin validarse a ningún lado?
- Elegí el archivo más largo: ¿podrías explicar línea por línea qué hace?

Lo que encuentres lo compartimos con el grupo.

## Resultado esperado

Al final de la sesión deberías tener:

- Un prototipo que corre y hace algo, en un repo git.
- Una lista de cosas que te sorprendieron al abrir el código.
- Una respuesta propia (aunque incómoda) a: *¿lo subirías a producción?*

No hay nada formal para entregar. Guardá el repo: lo seguimos usando las próximas tres sesiones.

## Preguntas para la discusión final

1. ¿En qué momento sentiste que dejaste de tener el control del proyecto?
2. ¿Qué te sorprendió más al abrir los archivos?
3. Si mañana tuvieras que agregarle una feature, ¿por dónde empezarías? ¿Cuánto tardarías en entender lo que ya hay?
4. ¿Lo subirías a producción? ¿Lo mantendrías por un año?

---

## Anexo: proyectos por defecto

Si no traés una idea propia, elegí uno de estos. Todos son alcanzables como prototipo en ~90 minutos y tienen suficiente sustancia para aguantar las 4 sesiones (auth, estado, datos, validación).

**A. Lista de tareas con usuarios**
Registro y login, cada usuario ve solo sus tareas, marcar como completada, filtrar por estado.

**B. Dashboard simple**
Cargar un CSV o consumir una API pública, mostrar 3-4 métricas y un gráfico, filtrar por fecha.

**C. Chat / muro de mensajes**
Publicar mensajes, verlos en tiempo real (o con refresh), borrar los propios, un mínimo de moderación.

Elegí por gusto, no por dificultad: los tres revelan los mismos problemas.
