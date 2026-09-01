# Sesión 5 — Ejercicio práctico: extendé tu agente

> **Esto es la tarea de la semana.** El Paso 0 lo hicimos en clase; el resto lo hacés en casa. Lleva entre 45 y 60 minutos. No se entrega: se trae a la Sesión 6.

## Objetivo

Abrir el archivo donde vive tu propia sesión, y después escribir una extensión de Pi **dirigiendo al agente**, sin escribir TypeScript vos.

## Antes de empezar

- Trabajá sobre **el mismo proyecto** que venís usando desde la Sesión 1.
- Tené a mano tu `AGENTS.md` y tus skills de la Sesión 3.
- `git status` limpio antes de arrancar.
- **No se instala nada.** Todo lo de hoy ya está en tu máquina.

## Las reglas de hoy

1. **No hace falta que sepas TypeScript.** El agente escribe el código; vos lo dirigís, lo probás y decidís si sirve. Es lo mismo que venís haciendo hace cuatro semanas, con un objetivo nuevo: la herramienta.
2. **Pasale las docs antes de pedirle nada.** Pi es chico y reciente: el modelo no lo conoce como conoce React. Si no le das las docs, te va a inventar funciones que no existen.
3. **Que entre en una pantalla.** El ejercicio es el ciclo entre lo que pedís y lo que sale, no el tamaño de lo que sale.

## Paso 0 — Abrí tu sesión (lo hicimos en clase)

Tus sesiones están en `~/.pi/agent/sessions/`, organizadas por directorio de trabajo. Cada una es un archivo **JSONL**: una entrada por línea.

Abrí la de este proyecto y buscá tres cosas:

1. **Los `id` y `parentId`.** Cada entrada apunta a su padre. Eso es el árbol del que hablamos: la conversación no es una lista, es un árbol, y la posición actual es la hoja.
2. **Un punto donde ramificaste.** Si alguna vez usaste `/tree` para volver atrás, hay una entrada con dos hijos. Las dos ramas siguen ahí: volver atrás no borró nada.
3. **Una entrada de compactación**, si tenés. Adentro está el resumen que tu agente viene arrastrando desde entonces. Todo lo que pasó antes de ese punto, el modelo lo conoce solamente por ese texto.

No hay nada que entregar acá. Es para que veas que el contexto es un archivo, no una abstracción.

## Pasos 1 a 3 — Escribí una extensión

### Paso 1 — Elegí qué construir

Elegí **una** de estas. Todas son chicas a propósito:

- **Un `/comando`** que haga algo que hacés seguido a mano.
- **Una tool** que envuelva un CLI que ya usás, para que el agente pueda llamarlo sin pasar por `bash`.
- **Un hook** que avise o bloquee sobre algo que no querés que pase: escribir en `.env`, un `git push`, tocar un directorio.
- **Un widget o una status line** que muestre algo que querés tener siempre a la vista.

Si no se te ocurre ninguna, mirá tus notas de las semanas anteriores: lo que anotaste como fricción suele ser la mejor candidata.

### Paso 2 — Dale contexto y planificá

**Primero las docs.** Pedile que lea la documentación de extensiones de Pi y las extensiones de ejemplo antes de escribir nada:

```
Antes de escribir código: leé la documentación de extensiones de Pi
y mirá los ejemplos que vienen con la instalación.
Después contame qué API vas a usar para <lo que querés hacer>.
```

Si te contesta con nombres de funciones que no aparecen en ninguna de las dos fuentes, **los inventó**. Es el momento más útil del ejercicio: pedile que te muestre dónde lo leyó.

**Después el plan.** Entrá a plan mode (Sesión 2) y pedile el plan de la extensión. Es una pieza chica; el plan tiene que ser corto. Si te sale largo, es que estás pidiendo demasiado.

### Paso 3 — Construí, instalá y probá

Que escriba la extensión en `.pi/extensions/` (solo este proyecto) o en `~/.pi/agent/extensions/` (todos).

Para probarla, `/reload` — no hace falta reiniciar Pi. Iterá ahí: probás, no anda, se lo contás, arregla, `/reload` de nuevo.

**Cuando ande, leela.** No hace falta que entiendas cada línea, pero sí que puedas decir qué hace y en qué momento del loop se engancha. Si no podés, todavía no es tuya.

## Resultado esperado

- Una extensión propia andando, instalada en `.pi/extensions/` o `~/.pi/agent/extensions/`.
- Que puedas explicar en una frase **en qué momento del loop se engancha**: cuando arranca la sesión, antes de una tool, después del resultado, al final del turno.
- Haber visto tu propio archivo de sesión por dentro.

Commiteá la extensión si vive en el proyecto.

## Si terminaste antes

No arranques una segunda. Andá a leer el ejemplo de subagentes que viene con Pi (`examples/extensions/subagent/`) y comparalo con la versión mínima que vimos en la teoría. La pregunta que vale: **¿qué de todo eso es el mecanismo y qué es producto?**

## Preguntas para traer a la Sesión 6

1. ¿Te inventó una función que no existía? ¿En qué momento te diste cuenta, y qué lo arregló?
2. ¿En qué parte del loop terminó enganchada tu extensión, y por qué ahí y no en otra?
3. Ahora que viste el archivo de sesión: ¿cambia en algo cómo pensás `/compact` y `/tree`?

## Para la semana

**Escribila, y después mantenela viva.** Usala, y anotá dos cosas:

1. Qué le tuviste que arreglar cuando la usaste de verdad.
2. Si la volviste a usar, o si la escribiste y nunca más.

**Traela a la Sesión 6.** La semana que viene se cambia el modelo que está abajo de todo esto, y tu extensión es una de las cosas que vamos a ver si sobrevive.
