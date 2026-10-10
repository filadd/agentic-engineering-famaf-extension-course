# Sesión 2 — Ejercicio práctico: Planificar y revisar

## Objetivo

Agregar **una feature** a tu proyecto con un diseño que decidiste vos y que quedó escrito antes de que el agente toque una línea.

El objetivo no es que la feature sea grande ni perfecta. Es que **sientas la diferencia** entre tirarle un prompt al agente y aceptar lo que salga (Sesión 1) y trabajar con intención.

## Antes de empezar

- Trabajá sobre **el mismo proyecto** que venís usando desde la Sesión 1.
- Tené Pi andando sobre ese proyecto, con la extensión que instalamos en clase:

```
pi install npm:@plannotator/pi-extension
```

- Asegurate de tener todo commiteado antes de arrancar (`git status` limpio). El diff del final tiene que mostrar **solo** lo de hoy.

## Las reglas de hoy

La semana pasada la regla era *no abras los archivos*. Hoy se da vuelta:

1. **Nada se implementa sin un diseño escrito.** El diseño es un archivo, no una idea en la cabeza del agente.
2. **Anotá el diseño al menos una vez antes de aprobarlo.** Aunque te parezca bien.
3. **Los casos de test se deciden antes del código.**
4. **Leé el diff para entenderlo.** Si algo se rompe, leelo vos primero.

La regla 2 va a dar ganas de saltearla. Es la que más importa.

## Pasos

### 1. Elegí una feature

Algo chico que puedas terminar en la práctica *incluyendo* el diseño y la revisión.

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

### 4. Decidí los casos de test

Antes de que exista el código, pedile que proponga los casos:

1. **Qué varía**: las entradas y el estado que cambian el resultado.
2. **Qué valores importan**: para cada cosa que varía, los grupos que el código trata distinto (vacío / uno / muchos; válido / inválido).
3. **Qué combinaciones cubrir**: una fila por caso, eligiendo un grupo de cada cosa.

**Vos confirmás, recortás o agregás.** Marcá cada fila como test automático, verificación manual, o las dos.

**¿No tenés test runner?** Pedile al agente que te lo instale. Eso es mecánico, delegalo tranquila/o. Lo que no delegás es decidir los casos.

### 5. Documentá y anotá

Pedile que escriba el diseño, con la tabla de casos, en un archivo:

> *"Escribí el diseño que acordamos, con los casos de test, en `docs/[feature].md`."*

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

### 6. Implementá

> *"Implementá `docs/[feature].md`, empezando por los tests."*

Si ves que se va del diseño, **frenalo**.

Si algo se rompe: **leé el código vos antes de pedirle que lo arregle.** Pedirle que arregle algo que no entendiste te deja exactamente donde estabas la semana pasada.

### 7. Revisá y capturá

Leé el diff para entender qué se hizo:

```
/plannotator-review
```

(o `git diff`, o tu editor)

La pregunta principal: **¿coincide con el diseño?** Solo la podés hacer porque el diseño está escrito. Fijate también si los tests prueban los casos de la tabla.

Si le corregís algo, **anotá la corrección** en un archivo aparte. Si no la capturás, la próxima conversación arranca de cero y el agente vuelve a cometer el mismo error.

Cuando estés conforme, commiteá. **Commiteá también el documento de diseño**: es parte del historial del proyecto.

## Resultado esperado

Al final del ejercicio deberías tener:

- La feature andando, con tests que prueban casos que decidiste vos.
- Un documento de diseño commiteado, con las anotaciones que le hiciste.
- Un diff que leíste entero.
- Una lista, aunque sea corta, de lo que le tuviste que corregir al agente.

## Para la semana

Seguí agregando features a tu proyecto **con este flujo**: explorar, diseñar, documentar, implementar, revisar.

Anotá dos cosas para la Sesión 3:

1. **Dónde el flujo te sobró.** Va a haber cambios donde diseñar es puro trámite. Cuáles.
2. **Qué le tuviste que explicar al agente más de una vez.** Cada conversación nueva arranca de cero y te vas a cansar de repetir lo mismo. Ese es exactamente el material de la próxima sesión.
