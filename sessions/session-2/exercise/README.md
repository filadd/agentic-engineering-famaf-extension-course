# Sesión 2 — Ejercicio práctico: Planificar y revisar

## Objetivo

Agregar **una feature** a tu proyecto con un plan escrito que vos revisaste antes de que el agente toque una línea, y revisar el diff antes de aceptarlo.

El objetivo no es que la feature sea grande ni perfecta. Es que **sientas la diferencia** entre tirarle un prompt al agente y aceptar lo que salga (Sesión 1) y trabajar con intención.

## Antes de empezar

- Trabajá sobre **el mismo proyecto** que venís usando desde la Sesión 1.
- Tené Pi andando sobre ese proyecto.
- Instalá la extensión de Plannotator:

```
pi install npm:@plannotator/pi-extension
```

- Asegurate de tener todo commiteado antes de arrancar (`git status` limpio). El diff del final tiene que mostrar **solo** lo de hoy.

## Las reglas de hoy

La semana pasada la regla era *no abras los archivos*. Hoy se da vuelta:

1. **Nada se ejecuta sin un plan escrito.** El plan es un archivo, no una idea en la cabeza del agente.
2. **Rechazá el primer plan.** Aunque te parezca bien. Buscá qué le falta y mandáselo de vuelta anotado.
3. **No aceptes ningún cambio sin leer el diff.** Ninguno.
4. **Si algo se rompe, leelo vos primero.** Recién después pedile al agente que lo arregle.

La regla 2 va a dar ganas de saltearla. Es la que más importa.

## Pasos

### 1. Elegí una feature (~5 min)

Algo chico que puedas terminar en ~45 minutos *incluyendo* la planificación y la revisión.

Buenos ejemplos:
- Agregar un campo "completado el" a tus todos.
- Filtrar la lista por estado.
- Validar el input de un formulario.
- Agregar un endpoint nuevo.

Malos ejemplos: cualquier cosa que toque autenticación de cero, refactors grandes, o features que tocan más de 4-5 archivos. Si dudás, elegí lo más chico: el ejercicio es el flujo, no la feature.

### 2. Entrá en plan mode (~5 min)

```
pi --plan
```

(o `/plannotator`, o `Ctrl+Alt+P` si ya estás en una sesión)

**Antes de escribir nada, mirá qué cambió.** El indicador de estado dice `⏸ plan` y el agente se quedó con un conjunto de herramientas mucho más chico: puede leer y buscar, no puede escribir nada que no sea el archivo del plan, y los comandos destructivos están bloqueados.

Eso no es decoración. **Aunque quieras, no podés saltear la planificación.** El harness te lo impide.

### 3. Planificá — y rechazá el primer plan (~12 min)

Describile la feature. Dejá que explore el proyecto y escriba el plan como checklist.

Cuando termina, se abre Plannotator en el navegador. **No apruebes todavía.** Leé el plan paso por paso y anotá:

- ¿Qué está suponiendo que vos no dijiste?
- ¿Hay algún paso que dos personas implementarían distinto? Si la respuesta es sí, ahí hay un hueco.
- ¿Falta algo? ¿Sobra algo?
- ¿Toca archivos que no esperabas?

Después **"Deny with annotations"**: mandáselo de vuelta con tus comentarios.

Cuando lo reescriba, mirá el **Plan Diff** — te marca qué cambió respecto de la versión anterior. Ahí se ve si te entendió o si te contestó cualquier cosa.

Iterá hasta que el plan **te sirva a vos**. Recién ahí, aprobá.

> Si el primer plan te salió genial y no encontrás nada que anotar, no aprobás: buscá más. Siempre hay una decisión implícita.

### 4. El test primero (~8 min)

Antes de ejecutar, escribí **al menos un test** que describa lo que la feature tiene que hacer. Va a fallar — todavía no hay código. Está bien.

**¿No tenés test runner?** Pedile al agente que te lo instale y configure. Eso es mecánico, delegalo tranquila/o.

**Lo que no delegás es el assert.** Esa línea la escribís vos. La idea: el test es **el contrato que el agente no puede falsear**. Si lo escribe él después de implementar, puede aflojar el assert hasta que pase. Si lo escribiste vos antes, tiene que cumplirlo.

### 5. Ejecutá el plan (~12 min)

Aprobado el plan, el agente recupera todas sus herramientas y arranca.

Andá siguiendo la checklist mientras avanza. Si ves que se va del plan, **frenalo** — eso también es revisar (es la "estrategia 1" de la teoría, revisar mientras escribe).

Si algo se rompe: **leé el código vos antes de pedirle que lo arregle.** Es la trampa más común — pedirle que arregle algo que no entendiste te deja exactamente donde estabas la semana pasada.

### 6. Revisá el diff (~8 min)

Antes de dar la feature por terminada:

```
/plannotator-review
```

Te abre los cambios del working tree en la UI de review. Podés anotar líneas concretas y mandarle el feedback directo al agente.

Si preferís otra superficie, valen igual: `git diff`, tu IDE, o `hunk` para ir hunk por hunk.

Buscá:

- **¿Coincide con el plan que aprobaste?** Esta es la pregunta que solo podés hacer porque el plan está escrito.
- ¿Hay código muerto, imports sin usar, comentarios narrativos de más?
- ¿Tu test pasa?
- ¿Hay algún smell de seguridad? (input sin validar, secrets expuestos, falta de auth)

Si encontrás algo, **no le tires un "arreglá esto" sin pensar**. Decidí si querés que lo arregle, lo arreglás vos, o si el cambio quedaba mejor sin esa parte.

Cuando estés conforme, commiteá. **Commiteá también el archivo del plan** — es parte del historial del proyecto.

## Resultado esperado

Al final del ejercicio deberías tener:

- La feature andando, con al menos un test que escribiste vos.
- Un archivo de plan commiteado, con las anotaciones que le hiciste.
- Un diff que leíste entero antes de aceptarlo.
- Una idea concreta de cuánto tarda esto comparado con la Sesión 1.

## Para la semana

Seguí agregando features a tu proyecto **con este flujo**: plan escrito, plan anotado, test primero, diff revisado.

Anotá dos cosas para la Sesión 3:

1. **Dónde el flujo te sobró.** Va a haber cambios donde planificar es puro trámite. Cuáles.
2. **Qué le tuviste que explicar al agente más de una vez.** Ese es exactamente el material de la próxima sesión.
