# Sesión 3 — Ejercicio práctico: dejá de repetirte

## Objetivo

Tomar **una cosa que le tuviste que explicar al agente más de una vez** y convertirla en configuración que el agente lee solo.

No se trata de dejar el proyecto configurado "bien" según una plantilla. Se trata de que al final de la hora **veas al agente hacer solo algo que antes le tenías que decir**. Ese momento es toda la sesión.

## Antes de empezar

- Trabajá sobre **el mismo proyecto** que venís usando desde la Sesión 1.
- Tené a mano **tus notas de la tarea de la semana pasada**: qué le tuviste que explicar más de una vez. Si no las trajiste, mirá las respuestas que quedaron proyectadas y elegí las tuyas.
- `git status` limpio antes de arrancar.
- La única instalación nueva la hacemos **todos juntos al principio de la práctica**:

```
pi install npm:pi-mcp-adapter
```

## Las reglas de hoy

1. **El agente escribe el borrador, vos decidís qué sobrevive.** Igual que con el plan de la semana pasada.
2. **Que quede lo mínimo.** Cada línea que dejás se paga en contexto, en todos los turnos, para siempre. Borrar es la parte difícil.
3. **El paso 2 no se saltea.** Es el único paso que te dice si lo que escribiste sirvió.

## Pasos

Son 45 minutos y cuatro pasos. **Terminar los cuatro no es el objetivo** — si llegás hasta el 3 con los tres bien hechos, la clase te sirvió.

### 1. Que el agente escriba el `AGENTS.md`, y vos lo podés (~12 min)

`AGENTS.md` va en la raíz del proyecto y el agente lo lee al arrancar, todas las veces, sin que se lo pidas.

**No lo escribas a mano.** Lo normal —y lo que vas a hacer siempre de acá en adelante— es pedírselo al agente: él ya puede leer tu `package.json`, tus scripts, tu estructura de directorios y tu historial de commits, y saca de ahí los datos duros más rápido y con menos errores que vos de memoria.

Lo que el agente **no** tiene es lo único que importa de verdad: **tus notas de la semana**. Eso se lo das vos en el prompt.

**Pedíselo más o menos así**, con tus notas pegadas adentro:

```
Escribime un AGENTS.md para este proyecto.

Explorá el repo y sacá de ahí los comandos reales: cómo se levanta,
cómo se corren los tests, cómo se lintea. Verificá que existan, no los
adivines.

Además, estas son las cosas que te tuve que explicar más de una vez
esta semana y que quiero que queden escritas:

- <tu nota 1>
- <tu nota 2>
- <tu nota 3>

Reglas: menos de 40 líneas. Solo lo que NO cambia entre tareas. Nada de
consejos genéricos de programación. Si algo no lo pudiste verificar en
el repo, no lo pongas: preguntámelo.
```

**Ahora viene tu parte, que es el ejercicio de verdad: podarlo.**

Leelo línea por línea y borrá sin culpa. La pregunta para cada línea es una sola: *¿esto le sirve al agente en la próxima tarea, o es relleno que voy a pagar en todos los turnos para siempre?*

Buscá específicamente:

- **Lo que inventó.** ¿El comando de tests existe de verdad? Corrélo. Es el error más común y el más caro: un `AGENTS.md` que miente es peor que no tener ninguno.
- **Lo genérico.** "Escribí código limpio", "seguí las buenas prácticas", "usá nombres descriptivos". No le dicen nada que no sepa. Fuera.
- **Lo que ya está en el código.** Si el linter se lo puede decir, no va acá.
- **Lo que le falta**, que es lo que solo vos sabés: ¿están tus tres notas, escritas de manera que se entiendan sin vos al lado?

Esto es lo mismo que hicieron la semana pasada con el plan: el agente produce el borrador, vos ponés el criterio.

Lo que tiene que quedar:

- **Cómo se corre el proyecto y cómo se corren los tests.** Es lo más valioso del archivo: son los comandos que le permiten al agente saber si lo que hizo funciona, sin preguntarte.
- **El stack y las decisiones ya tomadas.** "Usamos pnpm." "No agregues dependencias sin preguntar."
- **Dónde van las cosas.** "Los componentes van en `src/components/`, uno por archivo."
- **El estilo, pero solo lo que un linter no puede decirle.**

Más o menos esto, y de este tamaño:

```markdown
# Proyecto

App de todos en React + Vite. Backend en Express, SQLite.

## Comandos

- `pnpm dev` — levanta el front en :5173 y la API en :3000
- `pnpm test` — vitest. Corrélo antes de decirme que terminaste.
- `pnpm lint` — eslint

## Convenciones

- pnpm, no npm. npm rompe el lockfile.
- Los componentes van en `src/components/`, uno por archivo.
- Las migraciones de `db/migrations/` no se editan: se agrega una nueva.
- No agregues dependencias sin preguntarme.
```

**Lo que NO va, y que el agente te va a querer meter igual:**

- Documentación del dominio que cambia todo el tiempo.
- Cosas que valen para una sola tarea — eso es el prompt, no el archivo.
- **Una wiki.** Si le dejás escribir 400 líneas, estás pagando 400 líneas en cada turno.

> Si tu `AGENTS.md` podría estar en el proyecto de cualquier otra persona de la sala, no lo podaste. Es la salida cruda del agente y todavía no hiciste el ejercicio. Volvé a tus notas.

**Proyecto o global.** Lo que vale para todos tus proyectos va en `~/.pi/agent/AGENTS.md` (por ejemplo "prefiero tabs"). Lo que vale para este repo va en el repo, y le sirve a quien lo clone — incluido vos dentro de dos años.

### 2. Probalo: la misma tarea, en una sesión nueva (~5 min)

**Este es el paso que importa.**

Elegí algo que la semana pasada le tuviste que explicar. Abrí una **sesión nueva** de Pi (contexto limpio, el agente no se acuerda de nada) y pedile la tarea **sin darle esa explicación**.

Mirá qué hace:

- ¿Usó el comando correcto de tests sin que se lo digas?
- ¿Puso el archivo donde va?
- ¿Respetó la decisión que antes le tenías que repetir?

**¿No cambió nada?** Es información, no un fracaso. Andá al `AGENTS.md` y preguntate por qué: ¿lo escribiste demasiado vago? ¿escribiste algo que en realidad nunca le habías explicado? Ajustalo y probá una vez más.

Anotá en una línea qué hizo solo. Es lo que vamos a compartir en el cierre.

### 3. Un skill: el plan de una feature (~10 min)

El `AGENTS.md` se paga en cada turno. Por eso no todo va ahí.

**La regla:** datos → `AGENTS.md`. **Procedimientos → skill.**

Un skill es un directorio con un `SKILL.md` adentro. Se carga en tres etapas: al arrancar, Pi solo lee **el nombre y la descripción**; el cuerpo se carga recién cuando la tarea lo amerita. Podés tener veinte skills instalados y pagar veinte descripciones, no veinte procedimientos.

**El procedimiento que vas a escribir hoy es el de la semana pasada: planificar una feature.**

Acordate de cómo te fue en la Sesión 2. Le describiste la feature, leíste el plan, y lo mandaste de vuelta anotado — probablemente por las mismas cosas de siempre: no preguntó lo que le faltaba, no dijo en qué archivos iba a caer cada paso, no dijo cómo se verifica, o se inventó una decisión que vos nunca le diste.

**Todo eso que le anotaste a mano es el skill.** Escribilo una vez y dejá de anotarlo cada vez.

```
.pi/skills/planear-feature/SKILL.md
```

```markdown
---
name: planear-feature
description: Escribir el plan de una feature antes de implementarla. Usar cuando la tarea sea agregar o cambiar funcionalidad y todavía no haya un plan escrito.
---

# Planificar una feature

Antes de escribir el plan, preguntame lo que no esté en la consigna. No lo adivines:

- ¿Qué pasa en el caso de error, y qué ve el usuario?
- ¿Hace falta tocar la base? ¿Va migración nueva o alcanza con lo que hay?
- ¿Esto cambia algo que ya funciona? ¿Qué no se puede romper?

Después sí, el plan: una checklist, un paso por vez. Cada paso dice

1. **Qué archivos toca**, con la ruta.
2. **Cómo se verifica**: qué test lo cubre y dónde vive. Si un paso no se puede testear, decilo.
3. El orden: primero el test que falla, después el código.

Cerrá el plan con **las decisiones que tomaste vos y yo no te di**. Son las que quiero revisar primero.
```

Ese es el ejemplo, no la plantilla. **El tuyo va a ser distinto**, porque tu stack y tu forma de planificar son otros: las preguntas que a vos te faltan no son las mismas que a la persona de al lado. Sacalas de tus notas y del plan que rechazaste la semana pasada.

Dos cosas para no meter adentro:

- **Lo que ya está en el `AGENTS.md`.** Si ahí dice dónde van los componentes, no lo repitas acá: lo estarías pagando dos veces.
- **La feature de hoy.** El skill vale para todas las features, no para una. Lo que vale para una sola es el prompt.

**Lo más importante del skill es la `description`.** Es lo único que Pi tiene en contexto para decidir si lo carga o no. Un skill perfecto con una descripción vaga **no se usa nunca**.

- Mala: `description: Ayuda a planificar`
- Buena: la de arriba — dice **qué hace** y **cuándo usarlo**.

Probalo: en una sesión nueva, entrá en plan mode y pedile una feature cualquiera de tu proyecto. Fijate si lo carga solo, y sobre todo **si el plan que sale ya trae lo que antes le tenías que anotar**. Si no lo carga, el problema casi siempre está en la descripción. También podés forzarlo con `/skill:planear-feature`.

> El mismo molde sirve para cualquier otra secuencia de pasos que repitas: cómo se hace un release, cómo se agrega una migración, cómo se agrega un componente con su test. Hoy escribimos uno; los otros salen igual.

### 4. Apuntá el adapter a context7 (~10 min)

Este paso cubre dos temas de una: **MCP** y las **docs tools**.

El problema que resuelve ya lo sufriste: el agente inventa una API que no existe, o usa la versión vieja de una librería. context7 sirve documentación actualizada de librerías, y **se consume como servidor MCP**.

Desde la raíz del proyecto:

```
npx ctx7 setup
```

Eso te deja el servidor configurado. Después, desde Pi:

```
/mcp tools
```

**Mirá la config que quedó escrita.** Es un servidor MCP como cualquier otro: un `command` y unos `args` que el harness va a levantar. Lo que hoy te resolvió un instalador, mañana lo vas a escribir a mano para un servidor que no tenga uno.

Ahora pedile algo sobre una librería que estés usando de verdad — algo donde antes te haya inventado la respuesta.

**Fijate cuánto contexto te comió.** Es el número de la teoría, ahora en tu propia ventana. Y notá lo que hizo `pi-mcp-adapter`: no metió todas las tools del servidor en tu contexto, metió **una sola tool proxy** y va a buscar el resto cuando hace falta. Es el mismo truco del skill, aplicado a tools.

> Si te trabás con la instalación o con la autenticación, **levantá la mano en vez de pelearla sola/o**. Este paso es el que más se cuelga y no es donde está el aprendizaje.

## Resultado esperado

Al final del ejercicio deberías tener:

- Un `AGENTS.md` **que solo sirve para tu proyecto**, corto, salido de tus notas.
- Un caso concreto de algo que el agente hizo solo en el paso 2.
- Un skill de planificación con una descripción que efectivamente lo dispara.
- Una idea de cuánto contexto cuesta cada cosa que le enchufaste.

Commiteá el `AGENTS.md`, el skill y el `.mcp.json`. Son parte del proyecto, igual que el código.

## Para la semana

Seguí trabajando con este `AGENTS.md` y **hacelo crecer**. Cada vez que te encuentres explicando algo por segunda vez, decidí dónde vive: ¿dato o procedimiento?

Y la próxima vez que planifiques una feature, **usá el skill y mirá qué le seguís anotando a mano**. Eso que anotaste va al skill.

Anotá dos cosas para la Sesión 4:

1. **Qué le seguiste explicando igual**, aunque estuviera en el `AGENTS.md`. Eso es lo que no entra en un archivo de contexto, y tiene nombre: es lo que Agus va a llamar **spec**.
2. **Traé una feature que NO puedas describir en una frase.** Algo con suficientes decisiones adentro como para que "agregá X" no alcance. Es el insumo de la próxima sesión.
