# Sesión 1 — Ejercicio práctico: Pi (agent harness) + vibe coding

## Objetivo

Dejar **Pi funcionando sobre un proyecto tuyo que corra en el navegador**, y arrancar a construir hablándole al agente **sin abrir el código**.

El objetivo no es que el código sea bueno. Es que salgas de la clase con la herramienta andando y con algo hecho **que no sepas qué tiene adentro**.

Este es el proyecto que vas a usar durante las 6 sesiones. Elegí algo que te dé ganas de seguir.

## Antes de empezar

- Tené **node y npm** instalados (`node --version` tiene que responder).
- Tené una cuenta de **GitHub** y `git` configurado con tu nombre y mail.
- Elegí tu proyecto: uno propio, o uno de los briefs del final de este documento. **Tiene que ser algo que corra en el navegador.**

## Las reglas de hoy

Estas cuatro reglas son el ejercicio. Van a incomodar, y esa incomodidad es intencional.

1. **Hablale al agente.** Describí lo que querés en lenguaje natural.
2. **No abras los archivos.** Ni en el IDE, ni con `cat`, ni con `git diff`. No leas lo que escribió.
3. **Si algo se rompe, describí el síntoma, no lo diagnostiques.** "El botón no hace nada" está bien. "Falta el event listener en `App.jsx`" está prohibido — para saber eso tendrías que haber leído el código.
4. **Juzgá solo por el output.** ¿Se ve bien? ¿Corre? ¿Hace lo que pediste? Con eso decidís si seguís o iterás.

Si el agente te pregunta algo, contestale. Si te propone opciones, elegí. Todo eso es parte del juego. Lo único vedado es leer el código.

> Las reglas aplican desde el paso 3. Los pasos 1 y 2 son setup: ahí sí mirás lo que hacés.

## Pasos

### 1. Instalá Pi

Seguí la guía oficial: **https://pi.dev/docs/latest/quickstart**

Ahí está el comando de instalación y cómo autenticarte (`/login`). No copiamos el comando acá a propósito: la docs oficial es la que se mantiene al día.

Si te trabás, levantá la mano — hay profes de práctico dando vueltas. Si ya lo tenés andando, ayudá al de al lado.

### 2. Creá el proyecto

```
mkdir mi-proyecto
cd mi-proyecto
git init
```

Creá también el repo en GitHub y conectalo (`git remote add origin ...`). Desde la Sesión 2 vamos a usar git como red de seguridad, así que conviene tenerlo desde hoy.

### 3. Arrancá a vibecodear

**Desde acá aplican las 4 reglas.** Cerrá el editor.

**Prerequisito:** Empezá instalando el paquete de Pi para poder correr background processes: **https://pi.dev/packages/@aliou/pi-processes** (te va a servir para levantar, si hace falta, el server local del proyecto en background).

Contale al agente qué querés construir, en una o dos frases. Dejalo empezar. No le des estructura, no le digas qué stack usar salvo que tengas una preferencia fuerte.

Ciclo: pedí algo → mirá el resultado corriendo → describí lo que falta o lo que está mal → repetí.

Para ir viendo el proyecto en el navegador mientras lo vas modificando, tené el servidor corriendo en background (pedile al agente que lo ejecute usando el paquete `pi-processes` para que corra en background).

Cosas que van a pasar y son parte del ejercicio:

- El agente va a romper algo que ya funcionaba. Describí el síntoma y seguí.
- Te vas a tentar con abrir un archivo para entender qué pasó. No lo hagas.
- Vas a querer decirle *cómo* arreglarlo. Limitate a decirle *qué* está mal.

Anotá en un papel (o en un archivo aparte, no en el código) los momentos en que sentiste que perdiste el control.

### 4. Reality check: abrí los archivos (en clase)

Recién ahora: **abrí los archivos.** Leé lo que shippeaste, sin apuro, en silencio.

Mientras leés, fijate si hay prácticas que vos no seguirías, como:

- ¿Cuántos archivos hay? ¿Sabías que existían todos?
- ¿Hay tests? ¿Hay algo que verifique que funciona además de tu ojo?
- ¿Hay código que no se usa? ¿Funciones duplicadas? ¿Dos maneras distintas de hacer lo mismo?
- ¿Hay secrets, claves o tokens escritos directamente en el código?
- ¿Hay input del usuario que entra sin validarse a ningún lado?
- Elegí el archivo más largo: ¿podrías explicar línea por línea qué hace?

Lo que encuentres lo compartimos con el grupo.

## Resultado esperado

Al final de la clase deberías tener:

- Pi instalado y andando.
- Un repo git con tu proyecto.
- Un prototipo que corre y hace algo (aunque sea poco).
- Una lista de cosas que te sorprendieron al abrir el código.

No hay nada formal para entregar. Guardá el repo: lo seguimos usando las próximas cinco sesiones, y **en la Sesión 5 hay una hora para mostrarlo al grupo** — voluntario, sin nota, 5 a 7 minutos.

## Para la semana

Seguí vibecodeando tu proyecto **con las mismas reglas** (sin abrir los archivos) hasta que sientas que se te va de las manos. Anotá cuándo pasa. La Sesión 2 abre con eso.

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
