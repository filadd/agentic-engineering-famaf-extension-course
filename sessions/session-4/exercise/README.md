# Sesión 4 — Ejercicio práctico: documentá tu proyecto

## Objetivo

Escribir los documentos de tu proyecto (el problema y la solución, con las decisiones adentro) y usarlos como contexto para planificar e implementar la próxima feature.

## Antes de empezar

- Trabajá sobre **el mismo proyecto** que venís usando desde la Sesión 1.
- Tené a mano **la feature de la tarea**: una que no puedas describir en una frase. Si no la trajiste, elegí una ahora.
- `git status` limpio antes de arrancar.
- No se instala nada.

## Las reglas de hoy

1. **El agente redacta, vos decidís.** Igual que con el plan de la Sesión 2 y el `AGENTS.md` de la Sesión 3.
2. **Las decisiones llevan motivo.** Una decisión sin porqué no está documentada.
3. **Los docs viven en el repo.** Se commitean junto con el código; el chat se pierde, el doc queda.

## Parte 1 — Documentar lo que ya construiste (~25 min)

Dos tipos de documento:

`docs/PROJECT.md`, uno solo:

```markdown
# <Proyecto>

Qué es el proyecto y para quién.

## Objetivo
El objetivo principal: qué tiene que lograr para valer la pena.

## Restricciones
Lo que ya está decidido y no se rediscute por feature:
stack, límites, supuestos.
```

`docs/features/<nombre>.md`, uno por feature existente:

```markdown
# <Feature>

El problema que resuelve: qué necesidad cubre y qué tiene que
poder hacer quien la usa.

## Diseño

### Modelo
Los datos en juego: entidades, campos, relaciones.

### Flujo: <nombre>
Uno por interacción: las pantallas que recorre y qué se puede
hacer en cada una, los pasos, las reglas que se validan, y las
decisiones que se tomaron en el camino, cada una con su motivo.
```

Pedile al agente que arranque él: que explore el código, los commits y los planes de las sesiones anteriores, te muestre un borrador y **te pregunte lo que no puede saber**: el problema que quisiste resolver y el porqué de cada decisión. Eso lo respondés vos; el doc final sale de esa conversación.

<!-- TODO: preparar un prompt/skill para esta exploración interactiva -->

Fijate especialmente en:

- **El problema.** Tiene que describir qué querés resolver con la feature, no cómo está construida. Si arranca con tablas o componentes, quedó en el dominio equivocado.
- **Las decisiones, dentro de cada flujo.** "Elegimos React por su popularidad" no es una decisión, es relleno. Las reales tienen la forma "el estado vive en el server y no en el cliente porque X". Varias de tus decisiones las tomó el agente en la Sesión 1 sin preguntarte: este es el momento de tomarlas vos, en retrospectiva.

Al final, actualizá tu `AGENTS.md` para que **apunte a estos docs**: él lleva lo operativo de cada turno, los docs llevan el entendimiento del proyecto.

## Parte 2 — Documentar la próxima feature e implementarla (~35 min)

Tomá la feature que trajiste. Puede ser una feature nueva o una modificación de una existente; en el segundo caso vas a extender el doc que ya tiene. Escribí (o actualizá) su `docs/features/<nombre>.md` **antes de tocar código**.

**1. No le pidas el documento: pedile que te haga preguntas.**

```
Quiero definir esta feature: <tu descripción, con tus palabras>.

No escribas el documento todavía. Haceme preguntas de a una
hasta que las decisiones importantes estén tomadas.
```

Las preguntas te van a exponer lo que dabas por sentado y no estaba escrito en ningún lado. Ahí está el ejercicio: cada pregunta que no sabés responder es una decisión que todavía no tomaste. El borrador se escribe después, cuando ya están tomadas. Si querés la versión con esteroides, existe [grill-me](https://github.com/mattpocock/skills/blob/main/skills/productivity/grill-me/SKILL.md), un skill que entrevista hasta resolver el árbol de decisiones completo. Es un `SKILL.md` como los de la Sesión 3.

<!-- TODO: escribir un prompt/skill propio de interrogación basado en grill-me -->

**2. El doc es de alto nivel.** Si la feature toca una librería o una API que no conocés, usá context7 (Sesión 3) para entenderla. Pero los detalles de implementación no van al doc: van al plan que viene ahora.

**3. Generá el plan desde el doc.** Entrá a plan mode con el doc como contexto y pedí el plan de la feature. Compará con la Sesión 2: el plan sale con las decisiones ya tomadas. Después ejecutá. En el review tenés dos varas: el plan (¿hizo lo que acordamos?) y el doc (¿respeta las decisiones del proyecto?).

No hace falta terminar la implementación. Llegar al plan generado desde el doc ya es el ejercicio completo; lo que falte se termina en la semana.

## Resultado esperado

- Un `docs/PROJECT.md` corto y específico de tu proyecto.
- Un `docs/features/<nombre>.md` por feature existente, con decisiones que llevan motivo.
- El doc de tu próxima feature (escrito o actualizado vía interrogación) y el plan generado desde él.
- El `AGENTS.md` apuntando a los docs.

Commiteá todo. Los docs son parte del proyecto, igual que el código.

## Para la semana

**La Sesión 5 abre con una hora de demos**: el que quiera muestra su proyecto al grupo, 5 a 7 minutos con preguntas. Es voluntario, no se entrega y no se corrige. Si vas a mostrar, vení con el repo listo y con una idea de qué querés contar — sobre todo **cómo** lo construiste.

Mantené los docs vivos: cada decisión nueva va al doc de su feature. Anotá dos cosas:

1. Cuándo un doc te sirvió (el agente hizo algo bien sin que se lo expliques, un plan salió mejor).
2. Cuándo un doc quedó desactualizado respecto del código, y qué costó eso.
