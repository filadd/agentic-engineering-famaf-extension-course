# Sesión 2 — Ejercicio práctico: Planificar y revisar

## Objetivo

Agregar **una feature** a tu proyecto con un diseño que decidiste vos y que quedó escrito antes de que el agente toque una línea, y verificar que funciona.

El objetivo no es que la feature sea grande ni perfecta. Es que **sientas la diferencia** entre tirarle un prompt al agente y aceptar lo que salga (Sesión 1) y trabajar con intención.

## Antes de empezar

- Trabajá sobre **el mismo proyecto** que venís usando desde la Sesión 1.
- Tené Pi andando sobre ese proyecto, con la extensión que instalamos en clase:

```
pi install npm:@plannotator/pi-extension
```

- Instalá `agent-browser`, para que el agente pueda usar tu app en un navegador:

```
npm install -g agent-browser
agent-browser install
```

- Asegurate de tener todo commiteado antes de arrancar (`git status` limpio). El diff del final tiene que mostrar **solo** lo de hoy.

## Las reglas de hoy

La semana pasada la regla era *no abras los archivos*. Hoy se da vuelta:

1. **Diseñá antes de escribir código.** Las decisiones las tomás vos; el agente te las pregunta de a una.
2. **Discutí los casos de test con el agente.** Él propone, vos decidís, y cada caso dice cómo se verifica: con un test, con el agente usando la app, o las dos.
3. **Escribí el documento de diseño.** El diseño es un archivo, no una idea en la cabeza del agente. Anotalo al menos una vez antes de aprobarlo, aunque te parezca bien.
4. **Implementá**, desde el documento. Si algo se rompe, leé el código vos primero.
5. **Verificá.** Que el agente use lo que construyó, y después leé el diff.

Anotar el documento en la regla 3 va a dar ganas de saltearlo. Es lo que más importa.

## Pasos

### 1. Elegí una feature

Algo chico que puedas terminar en la práctica *incluyendo* el diseño, la verificación y la revisión.

Buenos ejemplos:
- Agregar un campo "completado el" a tus todos.
- Filtrar la lista por estado.
- Validar el input de un formulario.
- Agregar un endpoint nuevo.

Malos ejemplos: cualquier cosa que toque autenticación de cero, refactors grandes, o features que tocan más de 4-5 archivos. Si dudás, elegí lo más chico: el ejercicio es el flujo, no la feature.

### 2. Explorá

Antes de decidir nada, entendé la parte del proyecto que vas a tocar. Pedile al agente que te cuente, sin escribir nada:

> *"Contame cómo funciona [la parte que vas a tocar]. No escribas nada."*

Preguntá de a una cosa. Si tu proyecto es vibecodeado, es probable que sea la primera vez que ves qué hay adentro.

### 3. Diseñá

Pedile que te pregunte las decisiones que hay que tomar, de a una:

> *"Quiero agregar [la feature]. Preguntame las decisiones que hay que tomar, de a una."*

Las decisiones las tomás vos. El agente te trae los datos que necesitás para decidir.

El diseño puede ser tan liviano o tan profundo como quieras. Para algo chico alcanza con tres o cuatro decisiones. **Más diseño, mejores resultados.**

**Los casos de test son parte del diseño.** Antes de que exista el código, pedile que proponga los casos:

1. **Qué varía**: las entradas y el estado que cambian el resultado.
2. **Qué valores importan**: para cada cosa que varía, los grupos que el código trata distinto (vacío / uno / muchos; válido / inválido).
3. **Qué combinaciones cubrir**: una fila por caso, eligiendo un grupo de cada cosa.

**Vos confirmás, recortás o agregás.** Marcá cada fila como **test** (un test automático), **agente** (lo verifica el agente usando la app), o las dos.

**¿No tenés test runner?** Pedile al agente que te lo instale. Eso es mecánico, delegalo tranquila/o. Lo que no delegás es decidir los casos.

### 4. Documentá y anotá

Pedile primero un borrador, y leelo antes de que lo guarde:

> *"Armame un borrador del diseño que acordamos, con la tabla de casos y un diagrama. Todavía no lo guardes."*

Corregí lo que no coincide con lo que decidiste. Cuando te sirva, guardalo:

> *"Guardalo en `docs/[feature].md`."*

Abrilo con Plannotator:

```
/plannotator-annotate docs/[feature].md
```

**No apruebes todavía.** Leelo y anotá:

- ¿Qué está suponiendo que vos no dijiste?
- ¿Hay algo que dos personas implementarían distinto? Ahí hay un hueco.
- ¿Falta algo? ¿Sobra algo?

Mandáselo de vuelta con tus anotaciones. Iterá hasta que el documento **te sirva a vos**.

> **Opcional: plan mode.** Plannotator también trae un plan mode (`pi --plan`, o `Ctrl+Alt+P` en una sesión abierta). Mientras está activo, el agente solo puede leer, buscar y escribir el archivo del plan. No hace falta para este ejercicio; si querés, probalo en algún cambio de la semana y fijate qué te cambia.

> Si el primer documento te salió genial y no encontrás nada que anotar, buscá más. Siempre hay una decisión implícita.

### 5. Implementá

> *"Implementá `docs/[feature].md`, empezando por los tests."*

Si ves que se va del diseño, **frenalo**.

Si algo se rompe: **leé el código vos antes de pedirle que lo arregle.** Pedirle que arregle algo que no entendiste te deja exactamente donde estabas la semana pasada.

### 6. Verificá

Que pasen los tests no alcanza: pedile al agente que **use** lo que construyó, contra los casos de la tabla marcados como "agente".

Si tu feature tiene API:

> *"Verificá [la feature] con curl, contra los casos de `docs/[feature].md`. Mostrame cada pedido y su respuesta."*

Si se ve en la pantalla:

> *"Usá agent-browser para abrir la app y probar [la feature]. Sacá una captura de cada caso."*

**Mirá lo que hizo**: las respuestas, las capturas. Si no lo miraste, no verificaste nada. Si algo no se comporta como dice el documento, volvé al paso 5.

### 7. Revisá

Leé el diff para entender qué se hizo:

```
/plannotator-review
```

(o `git diff`, o tu editor)

La pregunta principal: **¿coincide con el diseño?** Solo la podés hacer porque el diseño está escrito. Fijate también si los tests prueban los casos de la tabla.

Cuando estés conforme, commiteá. **Commiteá también el documento de diseño**: es parte del historial del proyecto.

## Resultado esperado

Al final del ejercicio deberías tener:

- La feature andando, con tests que prueban casos que decidiste vos.
- Un documento de diseño commiteado, con las anotaciones que le hiciste.
- La feature verificada por el agente: las respuestas de la API o las capturas, que miraste.
- Un diff que leíste entero.

## Para la semana

Seguí agregando features a tu proyecto **con este flujo**: explorar, diseñar, documentar, implementar, verificar, revisar.

Anotá dos cosas para la Sesión 3:

1. **Dónde el flujo te sobró.** Va a haber cambios donde diseñar es puro trámite. Cuáles.
2. **Qué le tuviste que explicar al agente más de una vez.** Cada conversación nueva arranca de cero y te vas a cansar de repetir lo mismo. Ese es exactamente el material de la próxima sesión.
