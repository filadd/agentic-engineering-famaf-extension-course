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

1. **Todo lo que escribas tiene que salir de tus notas.** Si escribís algo que no le explicaste nunca al agente, lo estás inventando.
2. **Escribí lo mínimo.** Cada línea que agregás se paga en contexto, en todos los turnos, para siempre.
3. **El paso 2 no se saltea.** Es el único paso que te dice si lo que escribiste sirvió.

## Pasos

Son 45 minutos y cinco pasos. **Terminar los cinco no es el objetivo** — si llegás hasta el 3 con los tres bien hechos, la clase te sirvió.

### 1. Escribí el `AGENTS.md` de tu proyecto (~12 min)

Creá un archivo `AGENTS.md` en la raíz del proyecto. El agente lo lee al arrancar, todas las veces, sin que se lo pidas.

Releé tus notas y pasá al archivo **solo lo que no cambia entre tareas**:

- **Cómo se corre el proyecto y cómo se corren los tests.** Es lo más valioso que le podés poner: son los comandos que le permiten al agente saber si lo que hizo funciona, sin preguntarte.
- **El stack y las decisiones ya tomadas.** "Usamos pnpm." "No agregues dependencias sin preguntar."
- **Dónde van las cosas.** "Los componentes van en `src/components/`, uno por archivo."
- **El estilo, pero solo lo que un linter no puede decirle.**

Un ejemplo de la forma que tiene que tener:

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

**Lo que NO va:**

- Documentación del dominio que cambia todo el tiempo.
- Cosas que valen para una sola tarea — eso es el prompt, no el archivo.
- **Una wiki.** Si escribís 400 líneas, estás pagando 400 líneas en cada turno.

> Si tu `AGENTS.md` podría estar en el proyecto de cualquier otra persona de la sala, lo hiciste al revés. "Escribí código limpio" y "usá buenas prácticas" no le dicen nada al agente que no sepa. Volvé a tus notas.

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

### 3. Un skill para el procedimiento que repetís (~10 min)

El `AGENTS.md` se paga en cada turno. Por eso no todo va ahí.

**La regla:** datos → `AGENTS.md`. **Procedimientos → skill.**

Un skill es un directorio con un `SKILL.md` adentro. Se carga en tres etapas: al arrancar, Pi solo lee **el nombre y la descripción**; el cuerpo se carga recién cuando la tarea lo amerita. Podés tener veinte skills instalados y pagar veinte descripciones, no veinte procedimientos.

Buscá en tus notas algo que sea **una secuencia de pasos** y no un dato: cómo agregás un endpoint nuevo, cómo creás una migración, cómo se hace un release, cómo se agrega un componente con su test.

```
.pi/skills/nuevo-endpoint/SKILL.md
```

```markdown
---
name: nuevo-endpoint
description: Agregar un endpoint nuevo a la API. Usar cuando haya que exponer una ruta nueva en Express, incluyendo su validación y su test.
---

# Agregar un endpoint

1. Definí la ruta en `src/api/routes/`, un archivo por recurso.
2. Validá el body con zod antes de tocar la base.
3. El handler no habla con SQLite directo: pasa por `src/db/queries/`.
4. Agregá un test en `tests/api/` que cubra el caso feliz y un 400.
5. Corré `pnpm test` antes de dar por terminado.
```

**Lo más importante del skill es la `description`.** Es lo único que Pi tiene en contexto para decidir si lo carga o no. Un skill perfecto con una descripción vaga **no se usa nunca**.

- Mala: `description: Cosas de la API`
- Buena: la de arriba — dice **qué hace** y **cuándo usarlo**.

Probalo: en una sesión nueva, pedile algo que debería dispararlo y fijate si lo carga. Si no lo carga, el problema casi siempre está en la descripción. También podés forzarlo con `/skill:nuevo-endpoint`.

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

### 5. Un subagente sobre tu propio código (~8 min)

**Si no llegás, está bien.** Es lo primero que se recorta.

Pedile a un subagente que explore algo de tu proyecto y te devuelva un resumen. Por ejemplo: *"¿dónde se maneja el estado de los todos?"*, o *"revisá el diff de hoy y decime si hay algo que no coincide con el AGENTS.md"*.

Lo que tenés que mirar no es el resultado, es **dónde quedó el laburo**: el subagente se comió diez archivos en *su* contexto y te devolvió tres párrafos al *tuyo*. Esa es la razón para usarlo. No es "más IA": es basura que quedó afuera de tu ventana.

Cuándo **no** sirve: cuando necesitás el detalle en tu propio contexto para seguir trabajando, o cuando la tarea es corta. Delegar cuesta un round-trip.

## Resultado esperado

Al final del ejercicio deberías tener:

- Un `AGENTS.md` **que solo sirve para tu proyecto**, corto, salido de tus notas.
- Un caso concreto de algo que el agente hizo solo en el paso 2.
- Un skill con una descripción que efectivamente lo dispara.
- Una idea de cuánto contexto cuesta cada cosa que le enchufaste.

Commiteá el `AGENTS.md`, el skill y el `.mcp.json`. Son parte del proyecto, igual que el código.

## Para la semana

Seguí trabajando con este `AGENTS.md` y **hacelo crecer**. Cada vez que te encuentres explicando algo por segunda vez, decidí dónde vive: ¿dato o procedimiento?

Anotá dos cosas para la Sesión 4:

1. **Qué le seguiste explicando igual**, aunque estuviera en el `AGENTS.md`. Eso es lo que no entra en un archivo de contexto, y tiene nombre: es lo que Agus va a llamar **spec**.
2. **Traé una feature que NO puedas describir en una frase.** Algo con suficientes decisiones adentro como para que "agregá X" no alcance. Es el insumo de la próxima sesión.
